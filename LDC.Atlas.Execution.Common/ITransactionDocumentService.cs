using System;
using System.Threading.Tasks;
using LDC.Atlas.Execution.Common.Entities;

namespace LDC.Atlas.Execution.Common
{
    public interface ITransactionDocumentService
    {
        Task<TransactionCreationResponse> CreateTransactionDocument(TransactionDocument transactionDocument);

        Task CreateFxDealSettlementMapping(long transactionDocumentId, long fxDealId, string company, int fxSettlementDocumentType);

        Task EnqueueMessage(string contextInfo, string company);

    }
}
