using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Repositories
{
    public interface IAccountingDocumentRepository
    {
        Task<IEnumerable<AccountingDocumentCreationStatus>> CreateAccountingDocument(string company, IEnumerable<AccountingDocument> accountingDocuments);

        /// <summary>
        /// Create Accouting Documents For Reversal
        /// </summary>
        /// <param name="transactionDocumentId">TransactionDocumentId of the reversal</param>
        /// <param name="reversedTransactionDocumentId">TransactionDocumentId of the reversed (original) Document</param>
        /// <param name="company">The company code </param>
        /// <param name="postOpClosedPolicy">True if the user that created the reversal has the PostOpClosed privilege</param>
        /// <returns> The list of new accouting document id created</returns>
        Task<IEnumerable<long>> CreateAccountingDocumentForReversal(long transactionDocumentId, long reversedTransactionDocumentId,   string company, bool postOpClosedPolicy);

        Task UpdateAccountingDocumentsStatus(string company, List<AccountingDocumentStatus> accountingDocuments, int statusId);

        Task<SectionPostingStatus> UpdateAccountingDocument(AccountingDocument accountingDocuments, string company);

        Task UpdateAccountingDocumentStatutoryAndFunctionalCurrencyAmounts(string company, AccountingDocument accountingDocument);

        Task<long> CreateRevaluation(Revaluation revaluation, bool authorizedForPosting);

        Task UpdatePrematchForMatchFlag(string company, long? matchFlagId, bool isPrematch);

        Task<IEnumerable<AccountingDocument>> GetAccountingDocumentsByAccountingIdsAsync(IEnumerable<long> accountingIds, string company);

        Task UpdateAccountingDocumentInterfaceStatus(string company, long transactionDocumentId);

        Task<long> UpdateAccountingDocumentForTraxResponse(long docId, string company);

        Task CreateAccountingDocumentFxSettlement(long accountingDocumentId, string company, string currencyDescription, string fxDealReference);
    }
}
