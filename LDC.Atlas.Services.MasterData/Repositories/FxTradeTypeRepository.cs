using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Dapper;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class FxTradeTypeRepository : BaseRepository, IFxTradeTypeRepository
    {
        public FxTradeTypeRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
        }

        public async Task<IEnumerable<FxTradeType>> GetAllAsync(string company, bool includeDeactivated = false, string arbitrationCode = null, string description = null,string code = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@Code", code);
            var fxTradeTypes = await ExecuteQueryAsync<FxTradeType>(
                StoredProcedureNames.GetFxTradeTypes, queryParameters,false);


            return fxTradeTypes;
        }

        public async Task UpdateFxTradeType(ICollection<FxTradeType> listFxTradeType, bool isGlobal,string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FxTradeType", ToFxTradeTypeTvp(listFxTradeType));
            queryParameters.Add("@iCompanyId", company);
            await ExecuteNonQueryAsync(isGlobal? StoredProcedureNames.UpdateFxTradeType: StoredProcedureNames.UpdateFxTradeTypeForCompany, queryParameters, true);
        }

        private DataTable ToFxTradeTypeTvp(ICollection<FxTradeType> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_FxTradeType]");

            var fxTradeTypeId = new DataColumn("FxTradeTypeId", typeof(long));
            table.Columns.Add(fxTradeTypeId);

            var mDMId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mDMId);

            var code = new DataColumn("Code", typeof(string));
            table.Columns.Add(code);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var isNdf = new DataColumn("IsNdf", typeof(bool));
            table.Columns.Add(isNdf);

            var noOfDays = new DataColumn("NoOfDays", typeof(long));
            table.Columns.Add(noOfDays);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[fxTradeTypeId] = value.FxTradeTypeId;
                    row[mDMId] = value.MDMId;
                    row[code] = value.Code;
                    row[description] = value.Description;
                    row[isNdf] = value.IsNdf;
                    row[noOfDays] = value.NoOfDays;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task CreateFxTradeType(ICollection<FxTradeType> listFxTradeType)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FxTradeType", ToFxTradeTypeTvp(listFxTradeType));

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateFxTradeType, queryParameters, true);
        }

        internal static class StoredProcedureNames
        {
            internal const string GetFxTradeTypes = "[Masterdata].[usp_ListFxTradeTypes]";
            internal const string UpdateFxTradeType = "[Masterdata].[usp_UpdateFxTradeType]";
            internal const string CreateFxTradeType = "[Masterdata].[usp_CreateFxTradeType]";
            internal const string UpdateFxTradeTypeForCompany = "[Masterdata].[usp_UpdateFxTradeTypeCompany]";
        }
    }
}
