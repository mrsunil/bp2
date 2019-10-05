using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class FxRateRepository : BaseRepository, IFxRateRepository
    {
        public FxRateRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<FxRateRecord>> GetAllAsync( IEnumerable<DateTime?> fxRateDate, string viewMode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Date", GetMarketDateUDTT(fxRateDate));
            queryParameters.Add("@Viewtype", viewMode);

            var fxRateRecords = await ExecuteQueryAsync<FxRateRecord>(
                StoredProcedureNames.GetFxRates,
                queryParameters);

            return fxRateRecords;
        }

        public async Task ImportAsync(List<FxRateRecord> fxRates)
        {
            int creationModeId = GetCreationMode(fxRates);
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FxRates", ToDataTable(fxRates));
            if (creationModeId == 0)
            {
                queryParameters.Add("@CreationModeId", null);
            }
            else
            {
                queryParameters.Add("@CreationModeId", creationModeId);
            }

            await ExecuteNonQueryAsync(StoredProcedureNames.ImportFxRates, queryParameters, true);
        }

        public async Task<Guid> InsertIntoStageFxRate(List<FxRateRecord> fxRatesForStage)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ImportId", dbType: DbType.Guid, direction: ParameterDirection.Output);

            queryParameters.Add("@FxRates", ToDataTable(fxRatesForStage));

            await ExecuteQueryAsync<int>(StoredProcedureNames.ImportFXRatesIntoStage, queryParameters, true);

            var importId = queryParameters.Get<Guid>("@ImportId");

            return importId;
        }

        public async Task ImportFxRateFromStage(Guid importId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ImportId", importId);
            var result = await ExecuteQueryAsync<object>(StoredProcedureNames.ImportFXRatesFromStage, queryParameters, true);
        }

        public async Task DeleteFxRateFromStage(Guid importId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ImportId", importId);
            queryParameters.Add("@OnlyTableFlushFlag", true);
            var result = await ExecuteQueryAsync<object>(StoredProcedureNames.ImportFXRatesFromStage, queryParameters, true);
        }

        private static DataTable ToDataTable(List<FxRateRecord> fxRates)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_FxRates]");

            var currencyCodeFrom = new DataColumn("[CurrencyCodeFrom]", typeof(string));
            table.Columns.Add(currencyCodeFrom);

            var currencyCodeTo = new DataColumn("[CurrencyCodeTo]", typeof(string));
            table.Columns.Add(currencyCodeTo);

            var date = new DataColumn("[Date]", typeof(DateTime));
            table.Columns.Add(date);

            var rate = new DataColumn("[Rate]", typeof(decimal));
            table.Columns.Add(rate);

            var fwdMonth1 = new DataColumn("[FwdMonth1]", typeof(decimal));
            table.Columns.Add(fwdMonth1);

            var fwdMonth2 = new DataColumn("[FwdMonth2]", typeof(decimal));
            table.Columns.Add(fwdMonth2);

            var fwdMonth3 = new DataColumn("[FwdMonth3]", typeof(decimal));
            table.Columns.Add(fwdMonth3);

            var fwdMonth6 = new DataColumn("[FwdMonth6]", typeof(decimal));
            table.Columns.Add(fwdMonth6);

            var fwdYear1 = new DataColumn("[FwdYear1]", typeof(decimal));
            table.Columns.Add(fwdYear1);

            var fwdYear2 = new DataColumn("[FwdYear2]", typeof(decimal));
            table.Columns.Add(fwdYear2);

            foreach (var value in fxRates)
            {
                var row = table.NewRow();
                row[currencyCodeFrom] = value.CurrencyCodeFrom;
                row[currencyCodeTo] = value.CurrencyCodeTo;
                row[date] = value.ValidDateFrom;
                row[rate] = value.Rate ?? (object)DBNull.Value;
                row[fwdMonth1] = value.FwdMonth1 ?? (object)DBNull.Value;
                row[fwdMonth2] = value.FwdMonth2 ?? (object)DBNull.Value;
                row[fwdMonth3] = value.FwdMonth3 ?? (object)DBNull.Value;
                row[fwdMonth6] = value.FwdMonth6 ?? (object)DBNull.Value;
                row[fwdYear1] = value.FwdYear1 ?? (object)DBNull.Value;
                row[fwdYear2] = value.FwdYear2 ?? (object)DBNull.Value;

                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<FxRate> GetFxRateAsync(DateTime fxRateDate, string currencyCode)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Date", fxRateDate);
            queryParameters.Add("@Currencycode", currencyCode);

            var fxRate = await ExecuteQueryFirstOrDefaultAsync<FxRate>(
                StoredProcedureNames.GetFxRate, queryParameters);

            return fxRate;
        }

        private static int GetCreationMode(List<FxRateRecord> fxRates)
        {
            FxRateRecord updatedFxRate
                = fxRates.Find((fxRate) => fxRate.CreationModeId == (int)CreationMode.Manual);
            return updatedFxRate != null ? updatedFxRate.CreationModeId : 0;

        }


        private static DataTable GetMarketDateUDTT(IEnumerable<DateTime?> fxRateDates)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[MasterData].[UDTT_FXDates]");

            DataColumn date = new DataColumn("Date", typeof(DateTime));
            udtt.Columns.Add(date);

            foreach (var fxRateDate in fxRateDates)
            {
                if (fxRateDate != null)
                {
                    var row = udtt.NewRow();
                    row[date] = fxRateDate;
                    udtt.Rows.Add(row);
                }
            }

            return udtt;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetFxRates = "[MasterData].[usp_ListFxRates]";
            internal const string ImportFxRates = "[MasterData].[usp_ImportFxRates]";
            internal const string GetFxRate = "[MasterData].[usp_GetFxRate]";
            internal const string ImportFXRatesIntoStage = "[MasterData].[usp_ImportFXRatesIntoStage]";
            internal const string ImportFXRatesFromStage = "[MasterData].[usp_ImportFXRatesFromStage]";
        }
    }
}
