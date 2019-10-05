using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
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

        public string PriceCode { get; set; }

        public string WeightCode { get; set; }

        public bool IsCounterpartyGroupAccount { get; set; }

        public long DefaultBrokerId { get; set; }

        public int DefaultNominalAccountDealId { get; set; }

        public int DefaultNominalAccountSettlementId { get; set; }

        public long DefaultBranchId { get; set; }

        public long DefaultProvinceId { get; set; }

        public bool IsProvinceEnable { get; set; }

        public bool IsFrozen { get; set; }
        public long DefaultDepartmentId { get; set; }
    }
}