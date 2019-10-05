using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICurrencyRepository
    {
        Task<IEnumerable<Currency>> GetAllAsync(bool includeDeactivated = false, string currencyCode = null, string description = null);

        Task UpdateCurrency(ICollection<Currency> listCurrency);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteCurrencies(IEnumerable<string> currencyCodes);
    }
}
