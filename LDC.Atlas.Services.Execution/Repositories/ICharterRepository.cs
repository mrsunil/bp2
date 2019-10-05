using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface ICharterRepository
    {
        Task<long> AddCharterAsync(Charter charter, string company);

        Task UpdateCharterAsync(Charter charter, string company);

        Task AssignSectionsToCharterAsync(long? charterId, IEnumerable<long> sectionId, string company);

        Task RemoveSectionsFromCharterAsync(long? charterId, IEnumerable<long> sectionId, string company);

        Task<bool> CheckCharterExistsAsync(string company, string charterRef);

        Task DeleteCharterAsync(string company, long charterID);

        Task<Charter> GetSectionsAssignedToCharter(long charterId, string company);

        Task UpdateSectionTrafficAsync(Charter charter, string company, bool isDeassignSectionRequest);

        Task UpdateSectionTrafficDetailsAsync(SectionTraffic sectionTraffic, string company, long? dataVersionId);

        Task UpdateVesselInformationAsync(IEnumerable<SectionTraffic> sectionsTraffic, string company);

        /// <summary>
        /// Update the charter status as open/close
        /// </summary>
        /// <param name="company">The company identifier</param>
        /// <param name="charterIds">List of charter id to update status</param>
        /// <param name="charterStatus">Charter status to update for charters</param>
        /// <param name="dataVersionId">DataversionId identifier</param>
        Task UpdateCharterStatusAsync(string company, long[] charterIds, int charterStatusId, int? dataVersionId);
    }
}
