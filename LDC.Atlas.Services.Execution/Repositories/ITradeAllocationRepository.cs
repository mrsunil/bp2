using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public interface ITradeAllocationRepository
    {
        Task<SectionToAllocate> GetSectionToAllocateByIdAsync(long sectionId, string company);

        Task<int> DeallocateAsync(long sectionId, bool reInstateTrafficDetails, string company, long? dataVersionId);

        Task<int> BulkDeallocateAsync(BulkDeallocateSectionCommand request);

        Task<long> AllocateAsync(AllocationOperation allocationOperation);

        Task<long> AllocateSectionListAsync(IEnumerable<AllocationOperation> sections, string company, long? dataVersionId);

        Task<long> AllocateImageSectionListAsync(IEnumerable<AllocationOperation> sections, string company, long? dataVersionId);
    }
}
