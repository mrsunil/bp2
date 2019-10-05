using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Infrastructure.ViewModel
{
    public class EntitySearchRequest
    {
        public const int MaxPageSize = int.MaxValue;

        public QueryClause Clauses { get; set; }

        public IEnumerable<SortColumn> SortColumns { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Offset must be equal or greater than 0.")]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? Offset { get; set; } = 0;

        [Range(1, MaxPageSize, ErrorMessage = "Limit must be greater than 0 and less than 100.")]
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? Limit { get; set; } = MaxPageSize;

        public int? DataVersionId { get; set; }

        public int? GridViewId { get; set; }
    }

    public class FilterColumn
    {
        [Required]
        public int FieldId { get; set; }

        [Required]
        public string Operator { get; set; }

        public string Value1 { get; set; }

        public string Value2 { get; set; }
    }

    public class SortColumn
    {
        [Required]
        public int FieldId { get; set; }

        [Required]
        public string SortOrder { get; set; }
    }

    public class QueryClause
    {
        public IEnumerable<QueryClause> Clauses { get; set; }

        public string LogicalOperator { get; set; }

        public int? FieldId { get; set; }

        public string Operator { get; set; }

        public string Value1 { get; set; }

        public string Value2 { get; set; }

        public string GroupName { get; set; }
    }
}
