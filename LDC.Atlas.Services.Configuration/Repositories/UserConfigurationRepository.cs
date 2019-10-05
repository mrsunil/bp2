using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Configuration.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class UserConfigurationRepository : BaseRepository, IUserConfigurationRepository
    {
        public UserConfigurationRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
            SqlMapper.SetTypeMap(typeof(UserPreference), new ColumnAttributeTypeMapper<UserPreference>());
        }

        public async Task CreateUserPreferenceColumnAsync(UserPreference userPreference)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userPreference.UserId);
            queryParameters.Add("@CompanyId ", userPreference.Company);
            queryParameters.Add("@UIComponentCode ", userPreference.ComponentId);
            queryParameters.Add("@ColumnConfig", userPreference.ColumnConfig);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUserPreferenceColumns, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string CreateUserPreferenceColumns = "[Configuration].[usp_SaveUserPreferences]";
        }
    }
}
