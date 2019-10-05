using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface IManualDocumentMatchingQueries
    {
        Task<IEnumerable<DocumentMatchingDto>> GetDocumentToMatchAsync(string company, long counterpartyId, string departmentId, string currencyCode, bool bitEdit, long? matchFlag, int? offset, int? limit);

        Task<IEnumerable<DocumentMatchingDto>> GetDocumentReferenceAsync(string company, int matchType);

        Task<IEnumerable<DocumentMatchingDto>> GetDocumentByDocumentReference(string company, string documentReference, int? offset, int? limit);

        Task<IEnumerable<MatchedDocumentInfo_ForUnmatchDto>> GetDocumentToUnMatchAsync(string company, long counterpartyId, string departmentId, string currencyCode,
            string documentReference, string matchFlagCode, int? offset, int? limit);

        Task<IEnumerable<DocumentMatchingDto>> GetMatchFlagAsync(string company);

        Task<IEnumerable<DocumentMatchingDto>> GetDocumentByMatchFlag(string company, string matchFlagCode, int? offset, int? limit);

        Task<IEnumerable<DocumentMatchingDto>> GetDocumentToUnmatchByDocumentReference(string company, string documentReference, int? offset, int? limit);

        Task<IEnumerable<MatchableDocumentSummaryInformationDto>> GetMatchableDocumentsSummaryInformation(string companyCode, IEnumerable<MatchableSourceIdDto> documentsToMatch);
    }
}
