using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LDC.Atlas.Services.MasterData.Entities;


namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IFxTradeTypeRepository
    {
        Task<IEnumerable<FxTradeType>> GetAllAsync(string company, bool includeDeactivated = false, string arbitrationCode = null, string description = null, string code = null);

        Task UpdateFxTradeType(ICollection<FxTradeType> listArbitration,bool isGlobal, string company);

        Task CreateFxTradeType(ICollection<FxTradeType> listFxTradeType);
    }
}
