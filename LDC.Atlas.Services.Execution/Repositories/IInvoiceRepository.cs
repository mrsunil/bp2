using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface IInvoiceRepository
    {
        Task<InvoiceMarking> AddInvoiceMarkingAsync(IEnumerable<InvoiceMarking> invoiceMarking, int? invoiceStatus, string company);

        Task UpdateInvoiceMarkingAsync(InvoiceMarking invoiceMarking, int? invoiceStatus, string company);

        Task UpdateInvoiceMarkingPostingStatusAsync(long transactionDocumentId, int postingStatusId, string company);

        Task DeleteInvoiceMarkingAsync(string company, long invoiceMarkingId);

        Task CreateInvoiceAsync(InvoiceRecord invoice, IEnumerable<InvoiceLineRecord> newInvoiceLines);

        Task<InvoiceRecord> CreateReversalInvoiceAsync(InvoiceRecord invoice);

        Task UpdateInvoicePhysicalDocument(long invoiceId, long physicalDocumentId);

        Task<int> GetInvoiceDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year);

        Task<TransactionCreationResponse> CreateTransactionDocument(int transactionDocumentTypeId, DateTime docDate, string currencyCode, bool authorizedForPosting, long? physicalDocumentId, string docRefrence, int yearNumber, int docYear, string company, bool toInterface);

        Task InsertReversalTransactionMapping(long transactionDocumentId, long reversalTransactionDocumentId, string company);

        Task AddUpdateMatchFlagForDocumentReversal(long transactionDocumentId, string company);

        Task<IEnumerable<CostLine>> AddCostsToTrade(IEnumerable<CostLine> costLines, string company);

        Task<InvoiceRecord> GetInvoiceByIdAsync(long id);

        /// <summary>
        /// Update the flag IsReversed in the "reversed" transaction document
        /// </summary>
        /// <param name="transactionDocumentId">transactionDocumentId of the REVERSED document (not the Reversal)</param>
        /// <param name="company">the company code</param>
        Task UpdateDocumentTypeForDocumentReversal(long transactionDocumentId, string company);

        Task<InvoiceRecord> CreateDraftReversalInvoice(InvoiceRecord invoice);

        Task UpdateInvoicingStatusAsync(long sectionId, int invoiceStatus, string company, long? dataVersionId);

        Task<IEnumerable<InvoiceMarkingPercentLines>> UpdateInvoiceMarkingPercentLines(IEnumerable<InvoiceMarkingPercentLines> invoiceMarkingPercentLines, string company, long? dataVersionId);
    }
}
