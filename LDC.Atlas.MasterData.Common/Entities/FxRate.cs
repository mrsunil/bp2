using System;

namespace LDC.Atlas.MasterData.Common.Entities
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
    }

    public class FxRate
    {
        public string CurrencyCode { get; set; }

        public string CurrencyRoeType { get; set; }

        public string CurrencyDescription { get; set; }

        public bool CurrencyIsDeactivated { get; set; }

        public DateTime? Date { get; set; }

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
    }

    public static class FxRateViewMode
    {
        public const string Spot = "Spot";
        public const string Daily = "Daily";
        public const string Monthly = "Monthly";
    }
}
