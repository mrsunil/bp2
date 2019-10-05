using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IShippingStatusRepository
    {
        Task<IEnumerable<ShippingStatus>> GetAllAsync(string company, bool includeDeactivated = false, string shippingStatusCode = null, string description = null);

        Task UpdateShippingStatu(ICollection<ShippingStatus> listShippingStatus);
    }
}
