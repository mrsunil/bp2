using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Queries
{
    public class GlobalParametersQueries : BaseRepository, IGlobalParametersQueries
    {
        public GlobalParametersQueries(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }
        public async Task<IEnumerable<UserPreferenceDto>> GetUserPreference(int userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            var userPreferenceDetails = await ExecuteQueryAsync<UserPreferenceDto>(StoredProcedureNames.GetUserPreference, queryParameters,false);
            return userPreferenceDetails.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string GetUserPreference = "[Authorization].[usp_GetUserPreference]";
        }
    }
}
