using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface ICharterQueries
    {
        Task<IEnumerable<CharterSummaryDto>> GetChartersAsync(string[] company, string charterReference, int? offset, int? limit);

        Task<IEnumerable<CharterSummaryDto>> SearchChartersAsync(string company, EntitySearchRequest searchRequest);

        Task<CharterDto> GetCharterByIdAsync(long charterId, string company);

        Task<CharterDto> GetCharterBySectionIdAsync(long sectionId, string company);

        Task<IEnumerable<SectionAssignedToCharterDto>> GetSectionsAssignedToCharterAsync(long charterId, string company);

        Task<IEnumerable<CharterManagerDto>> GetCharterManagersAsync(string company);

        Task<IEnumerable<CharterManagerDto>> FindCharterManagersByNameAsync(string company, string name);

        Task<bool> CheckCharterReferenceExistsAsync(string charterReference, string company);

        Task<IEnumerable<SectionAssignedToCharterDto>> GetContractsToBeAssignedToCharterAsync(string contractLabel, string company);

        Task<IEnumerable<CharterBulkClosureDto>> GetAssignedSectionDetailsForBulkClosure(string company, long[] charterIds);

        Task<IEnumerable<SectionAssignedToCharterDto>> SearchCharterAssignmentsAsync(string company, EntitySearchRequest searchRequest, GridDto grid);
    }
}
