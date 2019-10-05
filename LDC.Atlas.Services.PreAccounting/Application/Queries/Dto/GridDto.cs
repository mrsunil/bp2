using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class GridDto
    {
        public string GridCode { get; set; }

        public string Name { get; set; }

        public string CompanyId { get; set; }

        public IEnumerable<GridColumnDto> Columns { get; set; } = new List<GridColumnDto>();
    }

    public class GridColumnDto
    {
        public int FieldId { get; set; }

        public string FriendlyName { get; set; }

        public string FieldName { get; set; }

        public string GridType { get; set; }

        public string FilterType { get; set; }

        public string OptionSet { get; set; }

        public bool IsFilterable { get; set; }

        public bool IsSortable { get; set; }

        public string SortOrder { get; set; }

        public int SortOrderIndex { get; set; }

        public bool IsVisible { get; set; }

        public bool IsGroup { get; set; }
    }
}
