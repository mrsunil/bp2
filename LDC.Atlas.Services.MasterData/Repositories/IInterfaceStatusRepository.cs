using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IInterfaceStatusRepository
    {
        Task<IEnumerable<InterfaceStatus>> GetAllAsync();
    }
}
