using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PeriodTypeRepository : BaseRepository, IPeriodTypeRepository
    {
        public PeriodTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(PeriodType),
                       new ColumnAttributeTypeMapper<PeriodType>());
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeletePeriodTypes(IEnumerable<int> periodTypeIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToIntListUDTT(periodTypeIds);

            queryParameters.Add("@PeriodTypeIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeletePeriodTypes, queryParameters, true);

        }

        public async Task<IEnumerable<PeriodType>> GetAllAsync(string company, bool includeDeactivated = false, string periodTypeCode = null, string periodTypeDescription = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@PeriodTypeCode", periodTypeCode);
            queryParameters.Add("@Description", periodTypeDescription);

            var periodTypes = await ExecuteQueryAsync<PeriodType>(
                StoredProcedureNames.GetPeriodTypes,
                queryParameters);

            return periodTypes;
        }

        public async Task UpdateperiodType(ICollection<PeriodType> listPeriodType)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iPeriodType", ToPeriodTypeTvp(listPeriodType));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePeriodTypes, queryParameters, true);
        }

        private DataTable ToPeriodTypeTvp(ICollection<PeriodType> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_PeriodType]");

            var periodTypeId = new DataColumn("PeriodTypeId", typeof(long));
            table.Columns.Add(periodTypeId);

            var periodTypeCode = new DataColumn("PeriodTypeCode", typeof(string));
            table.Columns.Add(periodTypeCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

           if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[periodTypeId] = value.PeriodTypeId;
                    row[periodTypeCode] = value.PeriodTypeCode;
                    row[description] = value.Description;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPeriodTypes = "[Masterdata].[usp_ListPeriodTypes]";
            internal const string UpdatePeriodTypes = "[Masterdata].[usp_UpdatePeriodType]";
            internal const string DeletePeriodTypes = "[Masterdata].[usp_DeletePeriodTypes]";
        }
    }
}
