using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class FilterSet
    {
        public int FilterSetId { get; set; }

        public string Name { get; set; }

        public bool IsDefault { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public string CompanyId { get; set; }

        public string GridCode { get; set; }

        public IEnumerable<Filter> Filters { get; set; }
    }

    public class Filter
    {
        public int GridColumnId { get; set; }

        public string FieldName { get; set; }

        public string Operator { get; set; }

        public string Value1 { get; set; }

        public string Value2 { get; set; }

        public bool IsActive { get; set; }
    }
}