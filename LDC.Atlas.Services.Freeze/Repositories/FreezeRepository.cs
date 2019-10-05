using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Freeze.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Repositories
{
    public class FreezeRepository : BaseRepository, IFreezeRepository
    {
        public FreezeRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<DataVersion> GetFreezeAsync(int dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var freeze = await ExecuteQueryFirstOrDefaultAsync<DataVersion>(StoredProcedureNames.GetFreezeById, queryParameters);

            return freeze;
        }

        public async Task<DataVersion> GetFreezeAsync(string companyId, DateTime freezeDate, DataVersionType dataVersionTypeId)
        {
            var queryParameters = new DynamicParameters();
            string[] selectedCompanies = new string[] { companyId };
            queryParameters.Add("@CompanyId", ToSelectedCompanyTVP(selectedCompanies));
            queryParameters.Add("@FreezeDate", freezeDate);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);

            var freeze = await ExecuteQueryFirstOrDefaultAsync<DataVersion>(StoredProcedureNames.GetFreeze, queryParameters);

            return freeze;
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

        public async Task<int> CreateFreezeAsync(string companyId, DateTime freezeDate, DataVersionType dataVersionTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);
            queryParameters.Add("@FreezeDate", freezeDate);

            queryParameters.Add("@NewDataVersionId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateFreeze, queryParameters, true);

            var dataVersionId = queryParameters.Get<int>("@NewDataVersionId");

            return dataVersionId;
        }

        public async Task DeleteFreezeAsync(int dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteFreeze, queryParameters, true);
        }

        public async Task RecalculateFreezeAsync(int dataVersionId, long userId, bool recalculateAccEntries)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@RecalculateAccEntries", recalculateAccEntries);

            await ExecuteNonQueryAsync(StoredProcedureNames.RecalculateFreeze, queryParameters, true);
        }

        public async Task PurgeFreezesAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.PurgeFreeze, queryParameters, false);
        }

        public async Task<IEnumerable<MonthEnd>> IsMonthEndFreeze(int dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            var monthEnd = await ExecuteQueryAsync<MonthEnd>(StoredProcedureNames.IsMonthEndFreeze, queryParameters, false);

            if (monthEnd.Any())
            {
                foreach (var data in monthEnd)
                {
                    var isMonthEndFreeze = data.IsMonthEnd;
                    var sReveresed = data.IsReversed;
                }
            }

            return monthEnd.ToList();
        }

        public async Task<bool> GetDuplicatedFreezeAsync(string company, DateTime freezeDate, DataVersionType dataVersionTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DataVersionTypeId", dataVersionTypeId);
            queryParameters.Add("@FreezeDate", freezeDate);
            queryParameters.Add("@IsLocked", dbType: DbType.Boolean, direction: ParameterDirection.Output);

            await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.IsFreezeDuplicated, queryParameters);

            var isFreezeDuplicated = queryParameters.Get<bool>("@IsLocked");

            return isFreezeDuplicated;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateFreeze = "[Freeze].[usp_CreateFreeze]";
            internal const string DeleteFreeze = "[Freeze].[usp_DeleteFreeze]";
            internal const string GetFreezeById = "[Freeze].[usp_GetFreezeById]";
            internal const string GetFreeze = "[Freeze].[usp_GetFreeze]";
            internal const string PurgeFreeze = "[Freeze].[usp_PurgeFreeze]";
            internal const string RecalculateFreeze = "[Controlling].[usp_RecalculateAmounts]";
            internal const string IsMonthEndFreeze = "[Freeze].[usp_CheckMonthEndFreeze]";
            internal const string IsFreezeDuplicated = "[Freeze].[usp_IsLocked]";
        }
    }
}
