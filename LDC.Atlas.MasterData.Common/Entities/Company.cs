using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Company
    {
        public int Id { get; set; }

        public string CompanyId { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public string CostTypeCode { get; set; }

        public long? CounterpartyId { get; set; }

        [JsonConverter(typeof(IsoDateConverter))]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? ActiveDate { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string TimeZoneName { get; set; }

        public string WeightCode { get; set; }

        public string PriceCode { get; set; }

        public bool IsCounterpartyGroupAccount { get; set; }

        public long SettlementGainNominalId { get; set; }

        public long SettlementLossNominalId { get; set; }

        public long DefaultBranchId { get; set; }

        public long DefaultProvinceId { get; set; }

        public bool IsProvinceEnable { get; set; }
    }
}
