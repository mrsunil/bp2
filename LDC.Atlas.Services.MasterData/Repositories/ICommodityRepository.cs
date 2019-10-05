using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICommodityRepository
    {
        Task<IEnumerable<Commodity>> GetAllAsync(string companyId, CommoditySearchTerm commoditySearchTerm, int? offset, int? limit, bool includeDeactivated = false, string description = null);
    }
}
