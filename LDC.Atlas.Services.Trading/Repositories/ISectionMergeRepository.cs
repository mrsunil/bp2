using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface ISectionMergeRepository
    {
        /// <summary>
        /// For Creating the merge of selected sections
        /// </summary>
        /// <param name="mergeContracts">list of contracts to be merged</param>
        /// <param name="costDetailsForMerge">list of costs to be updated after merge<</param>
        /// <param name="company">company code</param>
        /// <param name="dataVersionId">data version Id</param>
        /// <returns>the list of section ids modified</returns>
        Task<IEnumerable<long>> MergeSectionAsync(IEnumerable<MergeContracts> mergeContracts, IEnumerable<CostDto> costDetailsForMerge, string company, int? dataVersionId = null);
    }
}
