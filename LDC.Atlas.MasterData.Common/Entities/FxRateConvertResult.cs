namespace LDC.Atlas.MasterData.Common.Entities
{
    public enum RateTypeEnum
    {
        M,
        D
    }

    public class FxRateConvertResult
    {
        public decimal Value { get; set; }

        public decimal? ConvertedValue { get; set; }

        public decimal? Rate { get; set; }

        public RateTypeEnum RateType { get; set; }
    }
}
