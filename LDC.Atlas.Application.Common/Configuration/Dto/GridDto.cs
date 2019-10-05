using System;
using System.Collections.Generic;

namespace LDC.Atlas.Application.Common.Configuration.Dto
{
    public class GridDto
    {
        public int DataVersionId { get; set; }

        public long? GridId { get; set; }

        public string GridCode { get; set; }

        public string Name { get; set; }

        public string CompanyId { get; set; }

        public bool HasMultipleViewsPerUser { get; set; }

        public string ModuleName { get; set; }

        public int ConfigurationTypeId { get; set; }

        public int? MaxNumberOfRecords { get; set; }

        public int? NumberOfItemsPerPage { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public IEnumerable<GridColumnDto> Columns { get; set; } = new List<GridColumnDto>();
    }

    public class GridColumnDto
    {
        public int FieldId { get; set; }

        public string FriendlyName { get; set; }

        public int GridColumnId { get; set; }

        public string FieldName { get; set; }

        public string GridType { get; set; }

        public string FilterType { get; set; }

        public string GroupName { get; set; }

        public string OptionSet { get; set; }

        public bool IsFilterable { get; set; }

        public bool IsSortable { get; set; }

        public string SortOrder { get; set; }

        public int? SortOrderIndex { get; set; }

        public bool IsEditable { get; set; }

        public bool IsVisible { get; set; }

        public bool IsGroup { get; set; }

        public int? Size { get; set; }

        public bool IsResult { get; set; }
    }
}
