using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ITransportTypeRepository
    {
        Task<IEnumerable<TransportType>> GetAllAsync(string companyId, bool includeDeactivated = false, string transportTypeCode = null, string transportTypeDescription = null);
    }
}