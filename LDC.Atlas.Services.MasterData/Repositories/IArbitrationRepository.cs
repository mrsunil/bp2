using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IArbitrationRepository
    {
        Task<IEnumerable<Arbitration>> GetAllAsync(string company, bool includeDeactivated = false, string arbitrationCode = null, string description = null);

        Task UpdateArbitration(ICollection<Arbitration> listArbitration);

        Task CreateArbitration(ICollection<Arbitration> listArbitration);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteArbitrations(IEnumerable<long> arbitrationIds);
    }
}
