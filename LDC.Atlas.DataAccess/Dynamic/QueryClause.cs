using System.Collections.Generic;

namespace LDC.Atlas.DataAccess.Dynamic
{
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