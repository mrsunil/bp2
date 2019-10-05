using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Repositories
{
    public interface IInvoicingRepository
    {
        Task<long> CreateDocumentMatchingAsync(DocumentMatching documentMatching);

        Task DeleteManualJLOrRevaluationAsync(long transactionDocumentId, string companyCode);

        Task<DocumentsRateUpdateInformation> UpdateTransactionDocumentRates(
          string companyCode,
          long transactionDocumentId,
          DateTime postingDate);

        Task UpdateStatutoryAndCurrencyAmounts(
            string companyCode,
            StatutoryAndCurrencyAmountsUpdateInfo StatutoryAndCurrencyAmountsUpdateInfo);
    }
}