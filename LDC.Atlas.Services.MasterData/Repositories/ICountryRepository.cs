using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICountryRepository
    {
        Task<IEnumerable<Country>> GetAllAsync(bool includeDeactivated = false, string countryCode = null, string description = null);

        Task UpdateCountry(ICollection<Country> listCountry);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteCountries(IEnumerable<long> countryIds);
    }
}
