using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface ICashRepository
    {
        Task CreateCashAsync(Cash cash);

        Task<CashDocumentReference> GetDocumentReferenceValues(string companyId, int year, long transactionDocumentTypeId);

        Task<CashDocumentReference> GetCashDocumentLabelValue(long cashTypeId);

        Task<CashDocumentReference> GetAdditionalCashYearNumber(string companyId, int year);

        Task UpdateCashAsync(Cash cash);

        Task DeleteAccountingDocument(long transactionDocumentId, string companyId);

        Task<long?> CreateUpdateDocumentMatchingsForCashByPickingCreation(MatchFlag matchFlag, bool isEdit);

        Task DeleteCashAsync(string company, long? cashId, long? transactionDocumentId = null, bool physicalDelete = false);

        Task<Cash> CreateDocumentMatchingDifferentClient(Cash cash, IEnumerable<ManualJournalLine> manualJournalLines);

        Task UpdateCashPhysicalDocument(long cashId, long physicalDocumentId);

        Task<Cash> GetCashByIdAsync(string company, long cashId);

        Task<string> GetJournalDocumentReference(string company, int year);

        Task<CashReferences> GetLinkedRecordsForCashUpdate(long cashId, string companyCode);

        Task UpdateCashCounterpartyTransferId(string companyCode, long cashId, long? counterPartyTransferTransactionDocumentId);

        Task ReplaceTransactionDocumentIdsInLogs(string companyCode, IEnumerable<OldNewId> oldNewIds);
    }
 }
