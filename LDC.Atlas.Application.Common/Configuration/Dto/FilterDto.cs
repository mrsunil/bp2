using Newtonsoft.Json;

namespace LDC.Atlas.Application.Common.Configuration.Dto
{
    public class FilterDto
    {
        public int FieldId { get; set; }

        public int GridColumnId { get; set; }

        public string FieldName { get; set; }

        public string FieldFriendlyName { get; set; }

        public string Operator { get; set; }

        public string Value1 { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Value2 { get; set; }

        public bool IsActive { get; set; }
    }
}