using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.DataAccess;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class UserConfigurationService : BaseRepository, IUserConfigurationService
    {
        public UserConfigurationService(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<UserConfigurationDto> GetUserPreferenceColumns(long userId, string company, string componentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UIComponentCode", componentId);

            UserConfigurationDto userConfiguration;
            using (var result = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetUserPreferenceColumns, queryParameters))
            {
                userConfiguration = result.Read<UserConfigurationDto>().FirstOrDefault();
            }

            return userConfiguration;
        }

        private static class StoredProcedureNames
        {
            internal const string GetUserPreferenceColumns = "[Configuration].[usp_GetUserCompanyPreferences]";
        }
    }
}
