using System.Collections.Generic;

namespace LDC.Atlas.DataAccess.Dynamic
{
    public class DynamicQueryDefinition
    {
        public const int MaxPageSize = int.MaxValue;

        private IEnumerable<SortColumn> _sortColumns = new List<SortColumn>();

        public QueryClause Clauses { get; set; }

        public IEnumerable<SortColumn> SortColumns
        {
            get => _sortColumns ?? (_sortColumns = new List<SortColumn>());
            set => _sortColumns = value;
        }

        public int? Offset { get; set; } = 0;

        public int? Limit { get; set; } = MaxPageSize;
    }
}