using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class UpdateInvoiceMarkingCommand : IRequest
    {
        public IEnumerable<InvoiceMarking> Invoices { get; set; }

        public int? InvoiceStatusId { get; set; }

        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        public long? SectionId { get; set; }

        public bool SplitAction { get; set; }
    }

    public class UpdateInvoiceMarkingPostingStatusCommand : IRequest
    {
        public long TransactionDocumentId { get; set; }

        public int PostingStatusId { get; set; }

        internal string Company { get; set; } // internal to avoid the exposure in Swagger
    }

    public class DeleteInvoiceMarkingCommand : IRequest
    {
        internal long InvoiceMarkingId { get; set; }

        internal string Company { get; set; }
    }

    /// <summary>
    /// Update only invoice percent  in cost invoice marking dialog.
    /// </summary>
    public class UpdateInvoiceMarkingPercentLinesCommand : IRequest
    {
        public IEnumerable<InvoiceMarkingPercentLines> InvoiceMarkingPercentLines { get; set; }

        internal string Company { get; set; }

        public long? DataVersionId { get; set; }
    }
}
