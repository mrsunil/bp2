using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Queries
{
    public interface IGlobalParametersQueries
    {
        
        Task<IEnumerable<UserPreferenceDto>> GetUserPreference(int userId);

    }
}
