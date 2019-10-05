using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Reporting.Entities
{
    public class ReportPredicate
    {
        public int PredicateId { get; set; }

        public string CompanyId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public IEnumerable<ReportCriteria> Criterias { get; set; }
    }
}
