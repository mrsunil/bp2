using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.PreAccounting.Application.Commands;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries
{
    public interface IAccountingDocumentQueries
    {
        Task<InvoiceInformationDto> GetInvoiceInformationForAccountingDocument(long documentId, string company);

        Task<IEnumerable<SectionsInformationDto>> GetSectionsInformationForAccountingDocument(string company, long invoiceId);

        Task<AccountingSetupDto> GetAccountingSetup(int documentType, string companyId);

        Task<IEnumerable<AccountingSearchResultDto>> SearchAccountingEntriesAsync(string company, AdditionalEntitySearchRequest<bool> searchRequest);

        Task<IEnumerable<PostingSummaryDto>> GetPostingManagementAsync(string company);

        Task<IEnumerable<PostingSummaryDto>> GetPostingManagementAccountingDocAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<AccountingDocumentDto>> GetAccountingDocumentsByAccountingIdsAsync(IEnumerable<long> accountingIds, string company);

        Task<IEnumerable<AccountingDocumentLineDto>> GetAccoutingDocumentDataListAsync(string company, EntitySearchRequest searchRequest);

        Task<AccountingDocumentDto> GetAccountingDocumentByDocRefIdsAsync(long docRefId, string company);

        Task<IEnumerable<ReversalAccountingDocumentDto>> GetAccountingLinesAsync(IEnumerable<long> docIds, string company);

        Task<IEnumerable<AccountingSearchResultDto>> GetAccountingLinesByAccountIdAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<TransactionDetailDto>> GetTransactionDetailAsync(IEnumerable<long> docIds, string company);

        Task<IEnumerable<ReversalAccountingDocumentDto>> GetAllAccountingIdsAsync(long accountingId, string company);

        Task<AccountingDocumentPostingInformation> GetAccountingDocumentInAuthorizeStateForPostingAsync(long accountinDocumentId, string company);

        Task<CashInformationDto> GetCashInformationForAccountingDocument(long documentId, string company);

        Task<TransactionDocumentDto> GetTransactionDocumentTypeByDocId(long documentId, string company);

        Task<bool> GetPostingProcessActiveStatusAsync(string company);

        Task<ManualJournalDocumentDto> GetManualJournalbyTransactionDocumentId(long documentId, string company);

        Task<FxSettlementDocumentDto> GetFxSettlementbyTransactionDocumentId(long documentId, string company);

        Task<IEnumerable<TransactionDocumentSearchResultDto>> SearchTransactionDocumentEntriesAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<DocumentMatchingDto>> GetDocumentToMatchAsync(string company, long counterpartyId, string departmentId, string currencyCode, bool bitEdit, long? matchFlag, int? offset, int? limit);

        Task<IEnumerable<DocumentReferenceSearchResultDto>> SearchDocumentReferenceEntriesAsync(string company, EntitySearchRequest searchRequest, bool isReversalDocument);

        Task<IEnumerable<AccountingDocument>> GetAccountingDocumentsbyTransactionDocumentId(long documentId, string company);

        Task<long?> GetTransactionDocumentIdByReversalId(long documentId, string company);

        Task<RevaluationInformationDto> GetRevalInformationForAccountingDocument(long documentId, string companyId);

        Task<CounterpartyInformationDto> GetCounterPartyInformationForAccountingDocument(long documentId, string company);

        Task<MonthEndTADocumentDto> GetMonthEndTAbyTransactionDocumentId(string company, long documentId);

        Task<InformationForCreatingCashByPickingRevalDto> GetInfoForCreatingCashByPickingReval(string companyId, long? transactionDocumentId, bool isDifferentClient);

        Task DeleteMatchFlag(long matchFlagId, string company);

        Task<TransactionDocumentDto> GetJLDocumentTypeByTransactionDocumentId(long documentId, string company);

        Task<CashForCounterpartyDto> GetCashTypeIdForCounterParty(long documentId);

        Task<IEnumerable<TransactionReportSearchDto>> SearchClientReportAsync(string company, AdditionalEntitySearchRequest<TransactionReportCommand> searchRequest);

        Task<IEnumerable<TransactionReportSearchDto>> SearchNominalReportAsync(string company, AdditionalEntitySearchRequest<TransactionReportCommand> searchRequest);

        Task<YearEndProcessExistance> CheckYearEndProcessExistence(string company, int year);

        Task<DefaultAccountingSetupDto> GetDefaultAccountingSetup(string company);

        Task<IEnumerable<AccountingDocument>> GetAccountingDocumentInHeldAndMappingErrorState(string company);

        Task<MappingErrorMessages> GetMapppingErrorAsync(IEnumerable<AccountingDocumentLine> accountingId, string company, long transactionDocumentTypeId);

        Task<CashInformationDto> GetCashInformationForRevaluation(long? transactionDocumentId, string company);

        Task<BusinessSectorDto> GetAccountNumberbyBusinessSectorId(string company, string sectorCode);

        Task<IEnumerable<SectionSearchResult>> SearchSectionsAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<FxDealSearchResult>> SearchFxDealsAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<ProcessMessageDto>> GetErrorMessages(string company, IEnumerable<int> statusList, IEnumerable<string> processNameList, System.DateTime? dateBegin, System.DateTime? dateEnd, string userName);

        Task UpdateProcessStatus(long messageId);

        Task<IEnumerable<ItemConfigurationPropertiesDto>> GetPreAccountingFieldsConfiguration(string company);
    }
}
