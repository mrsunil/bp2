using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class InvoiceInformation
    {
        public long InvoiceId { get; set; }

        public int DataVersionId { get; set; }

        public string ExternalInvoice { get; set; }

        public int InvoiceDocumentTypeId { get; set; }

        public int InvoiceTypeId { get; set; }

        public long TransactionDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public long SectionId { get; set; }

        public string SectionCode { get; set; }
    }
}
