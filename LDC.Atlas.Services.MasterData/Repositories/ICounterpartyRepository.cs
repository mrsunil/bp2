using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICounterpartyRepository
    {
        Task<IEnumerable<Counterparty>> GetAllAsync(string company, string counterpartyCode, int? offset, int? limit, string description = null);

        Task<IEnumerable<Counterparty>> GetByPricingMethodAndDealTypeAsync(string company, PricingMethod pricingMethod, DealType dealType);

        Task<IEnumerable<int>> AddUpdateCounterpartyAsync(IEnumerable<Counterparty> counterparties, string company);

        Task<IEnumerable<int>> BulkUpdateCounterpartyAsync(IEnumerable<Counterparty> counterparties, string company);

        Task DeleteCounterpartyDetailsAsync(IEnumerable<Counterparty> counterparties, string company);

    }
}
