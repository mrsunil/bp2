using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface ITradeAllocationQueries
    {
        Task<IEnumerable<SectionToAllocate>> FindContractToAllocateByContractReferenceAsync(long originalsectionId, string contractLabelKeyword, int pricingMethod, string company);

        Task<SectionTrafficDto> GetSectionTrafficBySectionIdAsync(long sectionId, string company, long? dataVersionId);

        Task<AllocationInfoDto> GetAllocationInfoAsync(long sectionId, string company, long? dataVersionId);

        Task<IEnumerable<AllocationMessageDto>> GetAllocationMessages(long sectionId, long allocatedSectionId, string companyId);

        Task<IEnumerable<AllocationSummaryDto>> GetPossibleAllocationByCharterAsync(long charterId, string company);

        Task<IEnumerable<AllocationSummaryDto>> GetPossibleDeallocationByCharterAsync(long charterId, string company);
    }
}
