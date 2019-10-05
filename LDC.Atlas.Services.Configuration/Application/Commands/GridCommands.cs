using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class UpdateGridCommand : IRequest
    {
        public long GridId { get; set; }

        public string GridCode { get; set; }

        public string Name { get; set; }

        public string CompanyId { get; set; }

        public IEnumerable<GridColumn> Columns { get; set; }
    }

    public class GridColumn
    {
        public string HeaderName { get; set; }

        public long GridColumnId { get; set; }

        public string FriendlyName { get; set; }

        public string Field { get; set; }

        public string FieldName { get; set; }

        public string GridType { get; set; }

        public string FilterType { get; set; }

        public string OptionSet { get; set; }

        public bool IsFilterable { get; set; }

        public bool IsSortable { get; set; }

        public string SortOrder { get; set; }

        public int? SortOrderIndex { get; set; }

        public bool IsVisible { get; set; }

        public string GroupName { get; set; }

        public bool IsResult { get; set; }
    }
}
