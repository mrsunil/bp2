using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface IUserPreferencesRepository
    {
        Task CreateUserPreferencesSetup(UserPreferencesSetup userPreferenceSetup);

        Task UpdateUserPreferencesSetup(UserPreferencesSetup userPreferenceSetup);
    }
}
