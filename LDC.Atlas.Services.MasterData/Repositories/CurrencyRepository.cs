using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CurrencyRepository : BaseRepository, ICurrencyRepository
    {
        public CurrencyRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Currency),
                       new ColumnAttributeTypeMapper<Currency>());
        }

        public async Task<IEnumerable<Currency>> GetAllAsync(bool includeDeactivated = false, string currencyCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add("@Description", description);

            var currencies = await ExecuteQueryAsync<Currency>(
                StoredProcedureNames.GetCurrencies,
                queryParameters);

            return currencies;
        }
        public async Task UpdateCurrency(ICollection<Currency> listCurrency)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCurrency", ToCurrencyTvp(listCurrency));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCurrency, queryParameters, true);
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteCurrencies(IEnumerable<string> currencyCodes)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToVarcharListUDTT(currencyCodes);

            queryParameters.Add("@CurrencyCodes", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeleteCurrencies, queryParameters, true);
        }

        private DataTable ToCurrencyTvp(ICollection<Currency> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Currency]");

            var currencyCode = new DataColumn("CurrencyCode", typeof(string));
            table.Columns.Add(currencyCode);

            var mDMId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mDMId);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var roeType = new DataColumn("RoeType", typeof(string));
            table.Columns.Add(roeType);

            var majorUnits = new DataColumn("MajorUnits", typeof(string));
            table.Columns.Add(majorUnits);

            var minorUnits = new DataColumn("MinorUnits", typeof(string));
            table.Columns.Add(minorUnits);

            var interfaceCode = new DataColumn("InterfaceCode", typeof(string));
            table.Columns.Add(interfaceCode);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            var pips = new DataColumn("Pips", typeof(int));
            table.Columns.Add(pips);

            var decimalPlaces = new DataColumn("DecimalPlaces", typeof(int));
            table.Columns.Add(decimalPlaces);

            var rOEDecPlaces = new DataColumn("ROEDecPlaces", typeof(int));
            table.Columns.Add(rOEDecPlaces);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[currencyCode] = value.CurrencyCode;
                    row[decimalPlaces] = value.DecimalPlaces;
                    row[description] = value.Description;
                    row[interfaceCode] = value.InterfaceCode;
                    row[isDeactivated] = value.IsDeactivated;
                    row[majorUnits] = value.MajorUnits;
                    row[mDMId] = value.MdmId;
                    row[minorUnits] = value.MinorUnits;
                    row[pips] = value.Pips;
                    row[rOEDecPlaces] = value.ROEDecPlaces;
                    row[roeType] = value.RoeType;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCurrencies = "[Masterdata].[usp_ListCurrencies]";
            internal const string UpdateCurrency = "[Masterdata].[usp_UpdateCurrency]";
            internal const string DeleteCurrencies = "[Masterdata].[usp_DeleteCurrencies]";
        }
    }
}
