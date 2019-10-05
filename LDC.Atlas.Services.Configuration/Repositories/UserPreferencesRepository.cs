using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class UserPreferencesRepository : BaseRepository, IUserPreferencesRepository
    {
        public UserPreferencesRepository(IDapperContext dapperContext)
    : base(dapperContext)
        {
        }
        public async Task CreateUserPreferencesSetup(UserPreferencesSetup userPreferencesSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FavouriteLanguageId", userPreferencesSetup.FavouriteLanguageId == 0 ? null : userPreferencesSetup.FavouriteLanguageId);
            queryParameters.Add("@DateFormatId", userPreferencesSetup.DateFormatId == 0 ? null : userPreferencesSetup.DateFormatId);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUserPreference, queryParameters,true);
        }

        public async Task UpdateUserPreferencesSetup(UserPreferencesSetup userPreferencesSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FavouriteLanguageId", userPreferencesSetup.FavouriteLanguageId);
            queryParameters.Add("@DateFormatId",  userPreferencesSetup.DateFormatId);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateUserPreference, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string CreateUserPreference = "[Authorization].[usp_CreateUserPreference]";

            internal const string UpdateUserPreference = "[Authorization].[usp_UpdateUserPreference]";

        }
    }
}
