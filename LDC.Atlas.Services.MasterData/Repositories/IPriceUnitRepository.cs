using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IPriceUnitRepository
    {
        Task<IEnumerable<PriceUnit>> GetAllAsync(string company, bool includeDeactivated = false, string priceCode = null, string description = null, IEnumerable<long> pricesUnitsIds = null);

        Task CreateAsync(string company, IEnumerable<PriceUnit> priceUnits);

        Task UpdateAsync(IEnumerable<PriceUnit> priceUnits, string company, bool isGlobalUpdate);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteAsync(IEnumerable<long> pricesUnitsIds);

        Task<IEnumerable<CompanyAssignment>> GetAssignmentsAsync(IEnumerable<long> priceUnitIds);

        Task AssignAsync(string company, IEnumerable<long> masterDataList, IEnumerable<int> assignedCompanies, IEnumerable<int> deassignedCompanies);

        Task<IEnumerable<CompanyActivation>> GetActivationsAsync(IEnumerable<long> priceUnitIds);

        Task ActivateAsync(string company, IEnumerable<long> masterDataList, IEnumerable<int> activatedCompanies, IEnumerable<int> deactivatedCompanies);
    }
}
