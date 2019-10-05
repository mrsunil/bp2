using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICommodityTypeRepository
    {
        Task<IEnumerable<CommodityType>> GetAllAsync(bool includeDeactivated = false, string code = null, string description = null);

        Task UpdateCommodityType(ICollection<CommodityType> listCommodity);

        Task CreateCommodityType(ICollection<CommodityType> listCommodity);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteCommodityType(IEnumerable<long> commodityTypeIds);
    }
}
