using LDC.Atlas.Execution.Common.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LDC.Atlas.Execution.Common.Queries.Dto;

namespace LDC.Atlas.Execution.Common.Repositories
{
    public interface ITransactionDataRepository
    {
        Task<TransactionCreationResponse> CreateTransactionDocument(int transactionDocumentTypeId, DateTime docDate, string currencyCode, bool authorizedForPosting, long? physicalDocumentId, string docRefrence, int yearNumber, int docYear, string company, bool toInterface);

        Task InsertReversalTransactionMapping(long transactionDocumentId, long reversalTransactionDocumentId, string company);

        Task UpdateDocumentTypeForDocumentReversal(long transactionDocumentId, string company);

        Task CreateFxDealSettlementMapping(long transactionDocumentId, long fxDealId, string company, int fxSettlementDocumentType);

        Task<int> GetInvoiceDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year);

        Task<AccountingSetupDto> GetAccountingSetup(string companyId);
    }
}