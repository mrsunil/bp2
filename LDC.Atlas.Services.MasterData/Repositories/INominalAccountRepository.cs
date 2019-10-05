using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface INominalAccountRepository
    {
        Task<IEnumerable<NominalAccount>> GetAllAsync(string company, bool includeDeactivated = false, string nominalAccountNumber = null, string detailedDescription = null);

        Task UpdateNominalAccount(ICollection<NominalAccount> listNominalAccount);
    }
}