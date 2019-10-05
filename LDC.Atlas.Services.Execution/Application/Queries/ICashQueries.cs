using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface ICashQueries
    {
        Task<IEnumerable<CashSummaryDto>> GetCashListAsync(string company, int costDirectionId, int? offset, int? limit);

        Task<CashDto> GetCashByIdAsync(string company, long cashId);

        Task<CashSetupDto> GetCashSetupInfoAsync(string company);

        Task<IEnumerable<CashMatchingDto>> ListMatchableDocumentsForCashByPickingAsync(string company, long counterpartyId, string departmentId, string currencyCode, bool isEdit, long? matchFlag, int? offset, int? limit, string documentReference);

        Task<IEnumerable<DocumentReferenceSearchDto>> ListMatchableDocumentReferencesAsync(string company);

        Task<IEnumerable<CashMatchingDto>> GetDocumentDetailsByDocumentReference(string company, string documentReference, int? offset, int? limit);

        Task<CashMatchingDto> GetFxRateForCash(string currencyCodeFrom, string currencyCodeTo);

        Task<IEnumerable<CashDto>> SearchCashPaymentListAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<CashDto>> SearchCashReceiptListAsync(string company, EntitySearchRequest searchRequest);
    }
}
