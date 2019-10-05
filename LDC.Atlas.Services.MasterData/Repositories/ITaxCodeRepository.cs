using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ITaxCodeRepository
    {
        Task<IEnumerable<TaxCodeEntity>> GetAllAsync(string company, bool includeDeactivated = false, string taxCode = null, string description = null);

        Task UpdateTaxCodes(ICollection<TaxCodeEntity> listTaxCodes);
    }
}
