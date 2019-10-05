using Newtonsoft.Json;

namespace LDC.Atlas.Infrastructure.Models
{
    public class ServiceEndpoints
    {
        [JsonProperty(PropertyName = "trading")]
        public string TradeUrl { get; set; }

        [JsonProperty(PropertyName = "masterData")]
        public string MasterDataUrl { get; set; }

        [JsonProperty(PropertyName = "execution")]
        public string ExecutionUrl { get; set; }

        [JsonProperty(PropertyName = "controlling")]
        public string ControllingUrl { get; set; }

        [JsonProperty(PropertyName = "userIdentity")]
        public string UserIdentityUrl { get; set; }

        [JsonProperty(PropertyName = "preAccounting")]
        public string PreAccountingUrl { get; set; }

        [JsonProperty(PropertyName = "document")]
        public string DocumentUrl { get; set; }

        [JsonProperty(PropertyName = "configuration")]
        public string ConfigurationUrl { get; set; }

        [JsonProperty(PropertyName = "freeze")]
        public string FreezeUrl { get; set; }

        [JsonProperty(PropertyName = "reporting")]
        public string ReportingUrl { get; set; }

        [JsonProperty(PropertyName = "reportServer")]
        public string ReportServerUrl { get; set; }

        [JsonProperty(PropertyName = "lock")]
        public string LockUrl { get; set; }

        [JsonProperty(PropertyName = "accountingInterface")]
        public string AccountingInterfaceUrl { get; set; }

    }
}
