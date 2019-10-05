using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IVatRepository
    {
        Task<IEnumerable<Vat>> GetAllAsync(string company, bool includeDeactivated = false, string vatCode = null, string vatDescription = null);

        Task<Vat> GetVatAsync(string vatCode, string companyId);
    }
}
