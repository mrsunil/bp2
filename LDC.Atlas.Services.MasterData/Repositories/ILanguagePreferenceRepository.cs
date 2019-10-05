using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ILanguagePreferenceRepository
    {
        Task<IEnumerable<Language>> GetAllAsync();
    }
}
