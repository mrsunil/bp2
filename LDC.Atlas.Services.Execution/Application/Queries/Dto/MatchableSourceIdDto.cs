using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class MatchableSourceIdDto
    {
        public long? SourceJournalLineId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceCashLineId { get; set; }
    }
}
