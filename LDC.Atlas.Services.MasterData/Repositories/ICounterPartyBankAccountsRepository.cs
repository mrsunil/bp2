using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICounterPartyBankAccountsRepository
    {
        Task<IEnumerable<CounterPartyBankAccount>> GetAllAsync(string company, int counterParty, string currency);
    }
}
