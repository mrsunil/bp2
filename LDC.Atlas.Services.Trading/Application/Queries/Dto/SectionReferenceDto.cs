using Newtonsoft.Json;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class SectionReferenceDto
    {
        public long SectionId { get; set; }

        public string ContractLabel { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? InvoicingStatusId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string SectionNumberId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, DefaultValueHandling = DefaultValueHandling.Ignore)]
        public long SectionTypeId { get; set; }

        public ContractStatus Status { get; set; }

        public bool IsClosed { get; set; }

        public bool IsCancelled { get; set; }
    }
}
