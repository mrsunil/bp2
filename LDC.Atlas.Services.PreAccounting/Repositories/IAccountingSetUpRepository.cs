using LDC.Atlas.Services.PreAccounting.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Repositories
{
    public interface IAccountingSetUpRepository
    {
        Task UpdateAccountingSetUpAsync(AccountingSetup accountingSetup);
    }
}
