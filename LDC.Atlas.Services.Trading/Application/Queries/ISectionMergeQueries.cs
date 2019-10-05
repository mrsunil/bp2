using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface ISectionMergeQueries
    {
        Task<MergeAllowedForContractsDto> GetContextualDataForContractMergeAsync(string company, long sectionId, int? dataVersionId = null);

        Task<IEnumerable<ContractFamilyForMergeDto>> GetContractFamilyForMergeAsync(string company, long sectionId, int? dataVersionId = null);

        Task<IEnumerable<TradeMergeMessageDto>> GetContextualDataForSelectedContractMergeAsync(string company, long[] sectionIds, int? dataVersionId = null, bool isCostNeeded = false);

        Task<MergeContextualDataForContracts> GetContextualDataForSelectedContractsAsync(string company, long[] sectionIds, int? dataVersionId = null, bool isCostNeeded = false);
    }
}
