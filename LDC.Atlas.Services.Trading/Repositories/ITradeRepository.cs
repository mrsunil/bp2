using LDC.Atlas.Services.Trading.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface ITradeRepository
    {
        Task<SectionReference> CreatePhysicalContractAsync(Section physicalFixedPricedContract);

        Task<IEnumerable<SectionReference>> CreatePhysicalContractAsImageAsync(Section physicalFixedPricedContract);

        Task UpdatePhysicalContractAsync(Section physicalFixedPricedContract, string company);

        Task<IEnumerable<SectionReference>> CreateTrancheSplitAsync(SectionDeprecated sectionTrancheContract, string company,bool isTradeImage = false);

        Task<SplitDetails> GetSectionNumberForSplit(string company, long sectionId);

        Task UpdateReferenceAndInternalMemoAsync(ReferenceInternalMemo referenceInternalMemo);

        Task DeleteReferenceAndInternalMemoAsync(long sectionId);

        Task<IEnumerable<IntercoData>> ValidateIntercoValidation(IntercoValidation intercoValidation);

        Task PhysicalTradeBulkEditAsync(PhysicalTradeBulkEdit physicalTradeBulkEdit);
    }
}