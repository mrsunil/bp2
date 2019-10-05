using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Dapper;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TaxTypesRepository: BaseRepository, ITaxTypeRepository
    {
        public TaxTypesRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var postingStatus = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetRateTypes);

            return postingStatus;
        }

        public async Task UpdateTaxTypes(ICollection<EnumEntity> listTaxTypes)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ListTaxTypes", ToTaxTypesTvp(listTaxTypes));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTaxTypes, queryParameters, true);
        }

        private DataTable ToTaxTypesTvp(ICollection<EnumEntity> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_CommodityType]");

            var ldcRegionId = new DataColumn("LdcRegionId", typeof(long));
            table.Columns.Add(ldcRegionId);

            var ldcRegionCode = new DataColumn("LdcRegionCode", typeof(string));
            table.Columns.Add(ldcRegionCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    //row[ldcRegionId] = value.LdcRegionId;
                    //row[ldcRegionCode] = value.LdcRegionCode;
                    //row[description] = value.Description;
                    //row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetRateTypes = "[Masterdata].[usp_ListTaxType]";
            internal const string UpdateTaxTypes = "[Masterdata].[usp_UpdateTaxTypes]";
        }

    }
}
