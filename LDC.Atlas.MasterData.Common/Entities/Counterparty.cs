using Newtonsoft.Json;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Counterparty
    {
        [JsonProperty("counterpartyID")]
        public int CounterpartyID { get; set; }

        [JsonProperty("counterpartyCode")]
        public string CounterpartyCode { get; set; }

        public string DisplayName => CounterpartyCode;

        [JsonProperty("description")]
        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? ModifiedDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ModifiedBy { get; set; }
    }
}
