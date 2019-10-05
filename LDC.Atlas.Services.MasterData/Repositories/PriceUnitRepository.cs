using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PriceUnitRepository : BaseRepository, IPriceUnitRepository
    {
        public PriceUnitRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(PriceUnit),
                       new ColumnAttributeTypeMapper<PriceUnit>());
        }

        public async Task<IEnumerable<PriceUnit>> GetAllAsync(string company, bool includeDeactivated = false, string priceCode = null, string description = null, IEnumerable<long> pricesUnitsIds = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@PriceCode", priceCode);
            queryParameters.Add("@Description", description);
            queryParameters.Add("@iPricesUnitsIds", ConvertToBigIntListUDTT(pricesUnitsIds ?? Enumerable.Empty<long>()));

            var priceUnits = await ExecuteQueryAsync<PriceUnit>(
                StoredProcedureNames.GetPriceUnits,
                queryParameters);

            return priceUnits;
        }

        public async Task UpdateAsync(IEnumerable<PriceUnit> priceUnits, string company, bool isGlobalUpdate)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iPriceUnits", ToPriceUnitUDTT(priceUnits));

            await ExecuteNonQueryAsync(isGlobalUpdate ? StoredProcedureNames.UpdatePriceUnit : StoredProcedureNames.UpdatePriceUnitCompany, queryParameters, true);
        }

        public async Task CreateAsync(string company, IEnumerable<PriceUnit> priceUnits)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iPriceUnits", ToPriceUnitUDTT(priceUnits));

            await ExecuteNonQueryAsync(StoredProcedureNames.CreatePriceUnits, queryParameters, true);
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteAsync(IEnumerable<long> pricesUnitsIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(pricesUnitsIds);

            queryParameters.Add("@PricesUnitsIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeletePriceUnits, queryParameters, true);
        }

        public async Task<IEnumerable<CompanyAssignment>> GetAssignmentsAsync(IEnumerable<long> priceUnitIds)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iPriceUnitIds", ConvertToBigIntListUDTT(priceUnitIds));

            var assignments = await ExecuteQueryAsync<CompanyAssignment>(
                StoredProcedureNames.GetPriceUnitAssignments,
                queryParameters);

            return assignments;
        }

        public async Task AssignAsync(string company, IEnumerable<long> masterDataList, IEnumerable<int> assignedCompanies, IEnumerable<int> deassignedCompanies)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iPriceUnitIds", ConvertToBigIntListUDTT(masterDataList));
            queryParameters.Add("@iAssignedCompanies", ConvertToIntListUDTT(assignedCompanies));
            queryParameters.Add("@iDeassignedCompanies", ConvertToIntListUDTT(deassignedCompanies));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePriceUnitAssignments, queryParameters, true);
        }

        public async Task<IEnumerable<CompanyActivation>> GetActivationsAsync(IEnumerable<long> priceUnitIds)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iPriceUnitIds", ConvertToBigIntListUDTT(priceUnitIds));

            var activations = await ExecuteQueryAsync<CompanyActivation>(
                StoredProcedureNames.GetPriceUnitActivations,
                queryParameters);

            return activations;
        }

        public async Task ActivateAsync(string company, IEnumerable<long> masterDataList, IEnumerable<int> activatedCompanies, IEnumerable<int> deactivatedCompanies)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCompanyId", company);
            queryParameters.Add("@iPriceUnitIds", ConvertToBigIntListUDTT(masterDataList));
            queryParameters.Add("@iActivatedCompanies", ConvertToIntListUDTT(activatedCompanies));
            queryParameters.Add("@iDeactivatedCompanies", ConvertToIntListUDTT(deactivatedCompanies));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePriceUnitActivations, queryParameters, true);
        }

        private static DataTable ToPriceUnitUDTT(IEnumerable<PriceUnit> priceUnits)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[MasterData].[UDTT_PriceUnit]");

            var priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            udtt.Columns.Add(priceUnitId);

            var priceCode = new DataColumn("PriceCode", typeof(string));
            udtt.Columns.Add(priceCode);

            var mdmId = new DataColumn("MDMId", typeof(string));
            udtt.Columns.Add(mdmId);

            var description = new DataColumn("Description", typeof(string));
            udtt.Columns.Add(description);

            var conversionFactor = new DataColumn("ConversionFactor", typeof(decimal));
            udtt.Columns.Add(conversionFactor);

            var weightUnitId = new DataColumn("WeightUnitId", typeof(long));
            udtt.Columns.Add(weightUnitId);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            udtt.Columns.Add(isDeactivated);

            if (priceUnits != null)
            {
                foreach (var value in priceUnits)
                {
                    var row = udtt.NewRow();
                    row[priceUnitId] = value.PriceUnitId;
                    row[priceCode] = value.PriceCode;
                    row[mdmId] = value.MdmId;
                    row[description] = value.Description;
                    row[conversionFactor] = value.ConversionFactor;
                    row[weightUnitId] = value.WeightUnitId ?? Convert.DBNull;
                    row[isDeactivated] = value.IsDeactivated;

                    udtt.Rows.Add(row);
                }
            }

            return udtt;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPriceUnits = "[MasterData].[usp_ListPriceUnits]";
            internal const string UpdatePriceUnit = "[MasterData].[usp_UpdatePriceUnit]";
            internal const string UpdatePriceUnitCompany = "[MasterData].[usp_UpdatePriceUnitCompany]";
            internal const string CreatePriceUnits = "[MasterData].[usp_CreatePriceUnits]";
            internal const string DeletePriceUnits = "[MasterData].[usp_DeletePricesUnits]";
            internal const string GetPriceUnitAssignments = "[MasterData].[usp_GetPriceUnitAssignments]";
            internal const string UpdatePriceUnitAssignments = "[MasterData].[usp_UpdatePriceUnitAssignments]";
            internal const string GetPriceUnitActivations = "[MasterData].[usp_GetPriceUnitActivations]";
            internal const string UpdatePriceUnitActivations = "[MasterData].[usp_UpdatePriceUnitActivations]";
        }
    }
}
