using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class ManualJournalDocumentDto
    {
        public long JournalId { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime? ValueDate { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public string DocumentReference { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode​ { get; set; }

        public bool AuthorizedForPosting​ { get; set; }

        public int? JLTypeId { get; set; }

        public int? TATypeId { get; set; }

        public IEnumerable<ManualJournalLineDto> ManualJournalLines { get; set; }
    }
}
