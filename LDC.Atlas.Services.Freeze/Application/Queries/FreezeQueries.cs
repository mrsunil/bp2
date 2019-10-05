using Dapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Freeze.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Application.Queries
{
    public class FreezeQueries : BaseRepository, IFreezeQueries
    {
        public FreezeQueries(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<FreezeDto> GetFreezeAsync(string companyId, int dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var freeze = await ExecuteQueryFirstOrDefaultAsync<FreezeDto>(StoredProcedureNames.GetFreezeById, queryParameters);

            if (freeze != null && freeze.CompanyId != companyId)
            {
                throw new AtlasSecurityException($"The freeze you try to access is not associated with the {companyId} company.");
            }

            return freeze;
        }

        public async Task<FreezeDto> GetFreezeAsync(string companyId, DateTime freezeDate, DataVersionTypeDto dataVersionTypeId)
        {
            var queryParameters = new DynamicParameters();
            string[] selectedCompanies = new string[] { companyId };
            queryParameters.Add("@CompanyId", ToSelectedCompanyTVP(selectedCompanies));
            queryParameters.Add("@FreezeDate", freezeDate);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);

            var freeze = await ExecuteQueryFirstOrDefaultAsync<FreezeDto>(StoredProcedureNames.GetFreeze, queryParameters);

            return freeze;
        }

        public async Task<IEnumerable<FreezeDto>> GetFreezeForSelectedCompanyAsync(string companyId, DateTime freezeDate, DataVersionTypeDto dataVersionTypeId)
        {
            var queryParameters = new DynamicParameters();
            string[] selectedCompanies = new string[] { companyId };
            queryParameters.Add("@CompanyId", ToSelectedCompanyTVP(selectedCompanies));
            queryParameters.Add("@FreezeDate", freezeDate);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);

            var freeze = await ExecuteQueryAsync<FreezeDto>(StoredProcedureNames.GetFreeze, queryParameters);

            return freeze.ToList();
        }

        private static DataTable ToSelectedCompanyTVP(string[] selectedCompanies)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_VarcharList]");
            var name = new DataColumn("[Name]", typeof(string));
            table.Columns.Add(name);
            foreach (string company in selectedCompanies)
            {
                var row = table.NewRow();
                row[name] = company;
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<IEnumerable<FreezeDto>> GetFreezesAsync(string companyId, DateTime? dateFrom, DateTime? dateTo, DataVersionTypeDto? dataVersionTypeId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@DateFrom", dateFrom);
            queryParameters.Add("@DateTo", dateTo);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);

            var freezes = await ExecuteQueryAsync<FreezeDto>(StoredProcedureNames.GetFreezes, queryParameters);

            return freezes;
        }

        public async Task<FreezeSearchForCompanyDto> CheckFreezeForSelectedDatabase(string companyId, string[] companyList, DataVersionTypeDto? dataVersionTypeId, DateTime? freezeDate, DataVersionTypeDto? comparisonDataVersionTypeId, DateTime? comparisonDbDate)
        {
            FreezeSearchForCompanyDto freezes = new FreezeSearchForCompanyDto();
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", CompaniesToBeSearched(companyList));
            queryParameters.Add("@DatabaseFreezeDate", freezeDate);
            queryParameters.Add("@ComparisonFreezeDate", comparisonDbDate);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);
            queryParameters.Add("@ComparisonDataVersionTypeId", comparisonDataVersionTypeId);
            if (freezeDate != null)
            {
                using (
               var grid = await ExecuteQueryMultipleAsync(
                   StoredProcedureNames.CheckFreezes,
                   queryParameters))
                {
                    var freezeCheckData = (await grid.ReadAsync<FreezeSearchForCompanyDto>()).ToList();
                    if (!grid.IsConsumed)
                    {
                        freezeCheckData.AddRange((await grid.ReadAsync<FreezeSearchForCompanyDto>()).ToList());
                    }

                    freezes = GenerateComparisonFreezeDBExistsData(comparisonDbDate, freezes, freezeCheckData.ToList());
                    freezes = GenerateFreezeDBExistsData(freezeDate, freezes, freezeCheckData.ToList());
                }
            }
            else
            {
                using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.CheckFreezes, queryParameters))
                {
                    var freezeCheckData = (await grid.ReadAsync<FreezeSearchForCompanyDto>()).ToList();
                    freezes = GenerateComparisonFreezeDBExistsData(null, freezes, freezeCheckData.ToList());
                }
            }

            return freezes;
        }

        private FreezeSearchForCompanyDto GenerateComparisonFreezeDBExistsData(DateTime? comparisonDbDate, FreezeSearchForCompanyDto freezes, List<FreezeSearchForCompanyDto> freezeCheckData)
        {
            freezeCheckData.ToList().ForEach(data =>
            {
                if (data.ComparisonFreezeExists == false ||
                (data.ComparisonFreezeDate == comparisonDbDate && data.ComparisonFreezeExists == false))
                {
                    freezes.ComparisonFreezeExists = data.ComparisonFreezeExists;
                    freezes.ComparisonFreezeDate = data.ComparisonFreezeDate;
                    freezes.ComparisonMissingCompany = string.IsNullOrEmpty(freezes.ComparisonMissingCompany) ?
                        data.ComparisonMissingCompany :
                        freezes.ComparisonMissingCompany + "," + data.ComparisonMissingCompany;
                }
            });
            return freezes;
        }

        private FreezeSearchForCompanyDto GenerateFreezeDBExistsData(DateTime? freezeDate, FreezeSearchForCompanyDto freezes, List<FreezeSearchForCompanyDto> freezeCheckData)
        {
            freezeCheckData.ToList().ForEach(data =>
            {
                if (data.DatabaseFreezeExists == false ||
                (data.DatabaseFreezeDate == freezeDate && data.DatabaseFreezeExists == false))
                {
                    freezes.DatabaseFreezeExists = data.DatabaseFreezeExists;
                    freezes.DatabaseFreezeDate = data.DatabaseFreezeDate;
                    freezes.MissingCompany = string.IsNullOrEmpty(freezes.MissingCompany) ?
                        data.MissingCompany : freezes.MissingCompany + "," + data.MissingCompany;
                }
            });
            return freezes;
        }

        private static DataTable CompaniesToBeSearched(string[] companyList)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_VarcharList]");

            DataColumn name = new DataColumn("Name", typeof(string));
            table.Columns.Add(name);

            foreach (var item in companyList)
            {
                var row = table.NewRow();
                row[name] = item;
                table.Rows.Add(row);
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string GetFreezeById = "[Freeze].[usp_GetFreezeById]";
            internal const string GetFreeze = "[Freeze].[usp_GetFreeze]";
            internal const string GetFreezes = "[Freeze].[usp_ListFreeze]";
            internal const string CheckFreezes = "[Report].[usp_CheckFreeze]";
        }
    }
}
