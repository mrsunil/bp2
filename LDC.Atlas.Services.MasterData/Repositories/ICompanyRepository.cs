using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICompanyRepository
    {
        Task<IEnumerable<Company>> GetAllAsync(long? counterpartyId);

        Task<Company> GetCompanyByIdAsync(string companyId);

        Task<IEnumerable<Company>> GetAllByCounterpartyIdAsync(string companyId, long counterpartyId);

        Task<bool> CheckCompanyNameExistsAsync(string companyName);
    }
}
