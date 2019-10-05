using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class FxRateRecord
    {
        public long FXRateId { get; set; }

        public string CurrencyCodeFrom { get; set; }

        public string CurrencyCodeTo { get; set; }

        public DateTime ValidDateFrom { get; set; }

        public DateTime? ValidDateTo { get; set; }

        public decimal? Rate { get; set; }

        public decimal? FwdMonth1 { get; set; }

        public decimal? FwdMonth2 { get; set; }

        public decimal? FwdMonth3 { get; set; }

        public decimal? FwdMonth6 { get; set; }

        public decimal? FwdYear1 { get; set; }

        public decimal? FwdYear2 { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int CreationModeId { get; set; }
    }

    public class FxRate
    {
        public string CurrencyCode { get; set; }

        public string CurrencyRoeType { get; set; }

        public string CurrencyDescription { get; set; }

        public bool CurrencyIsDeactivated { get; set; }

        [JsonConverter(typeof(IsoDateConverter))]
        public DateTime? Date { get; set; }

        public decimal? Rate { get; set; }

        public decimal? FwdMonth1 { get; set; }

        public decimal? FwdMonth2 { get; set; }

        public decimal? FwdMonth3 { get; set; }

        public decimal? FwdMonth6 { get; set; }

        public decimal? FwdYear1 { get; set; }

        public decimal? FwdYear2 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? CreatedDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string CreatedBy { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? ModifiedDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ModifiedBy { get; set; }

        public string CreationMode { get; set; }
    }

    public class FxRateToImport
    {
        public string CurrencyCode { get; set; }

        [JsonConverter(typeof(IsoDateConverter))]
        public DateTime Date { get; set; }

        public decimal? Rate { get; set; }

        public decimal? FwdMonth1 { get; set; }

        public decimal? FwdMonth2 { get; set; }

        public decimal? FwdMonth3 { get; set; }

        public decimal? FwdMonth6 { get; set; }

        public decimal? FwdYear1 { get; set; }

        public decimal? FwdYear2 { get; set; }

        public int CreationModeId { get; set; }
    }

    public class FxRateCsvLine
    {
        public int LineNumber { get; set; }

        public string CurrencyCode { get; set; }

        public string Date { get; set; }

        public string Rate { get; set; }

        public string RoeType { get; set; }

        public string FwdMonth1 { get; set; }

        public string FwdMonth2 { get; set; }

        public string FwdMonth3 { get; set; }

        public string FwdMonth6 { get; set; }

        public string FwdYear1 { get; set; }

        public string FwdYear2 { get; set; }

        public static FxRateCsvLine ParseFromCsv(string csvLine, int lineNumber)
        {
            string[] values = csvLine.Split(',');
            FxRateCsvLine fxRatesToImport = new FxRateCsvLine
            {
                LineNumber = lineNumber + 1,
                Date = values[0],
                CurrencyCode = values[1],
                RoeType = values[2],
                Rate = values[3],
                FwdMonth1 = values[4],
                FwdMonth2 = values[5],
                FwdMonth3 = values[6],
                FwdMonth6 = values[7],
                FwdYear1 = values[8],
                FwdYear2 = values[9]
            };
            return fxRatesToImport;
        }
    }

    public class ValidatedFxRateManualImport
    {
        public Guid ImportId { get; set; }

        public List<ManualImportReportData> BlockerData { get; set; }

        public List<ManualImportReportData> WarningData { get; set; }

        public ManualImportReportData GoodData { get; set; }
    }

    public class ManualImportReportData
    {
        public string ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public Dictionary<int, string> LineNumberWithCurrency { get; set; }
    }

    public static class FxRateViewMode
    {
        public const string Spot = "Spot";
        public const string Daily = "Daily";
        public const string Monthly = "Monthly";
    }
}
