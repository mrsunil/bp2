using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IPeriodTypeRepository
    {
        Task<IEnumerable<PeriodType>> GetAllAsync(string company, bool includeDeactivated = false, string periodTypeCode = null, string periodTypeDescription = null);

        Task UpdateperiodType(ICollection<PeriodType> listPeriodType);

        Task<IEnumerable<MasterDataDeleteResult>> DeletePeriodTypes(IEnumerable<int> periodTypeIds);
    }
}
