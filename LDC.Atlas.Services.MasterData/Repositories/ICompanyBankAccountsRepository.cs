using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICompanyBankAccountsRepository
    {
        Task<IEnumerable<CompanyBankAccount>> GetAllAsync(string company, string currency);
    }
}
