using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IContractTermsRepository
    {
        Task<IEnumerable<ContractTerm>> GetAllAsync(string company, bool includeDeactivated = false, string contractTermCode = null, string description = null);

        Task UpdateContractTerm(ICollection<ContractTerm> listContractTerm);
    }
}
