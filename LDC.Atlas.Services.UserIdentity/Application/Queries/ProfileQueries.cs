using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries
{
    public class ProfileQueries : BaseRepository, IProfileQueries
    {
        public ProfileQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<ProfileSummaryDto>> GetProfilesAsync(int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);

            var profiles = await ExecuteQueryAsync<ProfileSummaryDto>(StoredProcedureNames.GetProfiles, queryParameters);

            return profiles;
        }

        public async Task<ProfileDto> GetProfileByIdAsync(int profileId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profileId);

            ProfileDto profile;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetProfilesById, queryParameters))
            {
                profile = grid.Read<ProfileDto>().FirstOrDefault();
                if (profile != null)
                {
                    profile.Privileges = grid.Read<ProfilePrivilegeDto>();
                }
            }

            return profile;
        }

        public async Task<IEnumerable<CompanyProfileDto>> GetProfilesByCompanyIdAsync(string companyId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);
            var profiles = await ExecuteQueryAsync<CompanyProfileDto>(StoredProcedureNames.GetProfilesByCompanyId, queryParameters);
            return profiles;
        }

        public async Task<IEnumerable<PrivilegeDto>> GetPrivilegesAsync()
        {
            var privileges = await ExecuteQueryAsync<PrivilegeDto>(StoredProcedureNames.GetPrivileges);

            return privileges;
        }

        public async Task<IEnumerable<UserPermissionDto>> GetUserProfilesAsync(long userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);

            var profiles = await ExecuteQueryAsync<UserPermissionDto>(StoredProcedureNames.GetUserProfiles, queryParameters);

            return profiles;
        }

        private static class StoredProcedureNames
        {
            internal const string GetProfiles = "[Authorization].[usp_GetProfiles]";
            internal const string GetProfilesById = "[Authorization].[usp_GetProfileById]";
            internal const string GetPrivileges = "[Authorization].[usp_GetPrivileges]";
            internal const string GetUserProfiles = "[Authorization].[usp_GetUserCompanyProfiles]";
            internal const string GetProfilesByCompanyId = "[Authorization].[usp_GetProfilesByCompanyId]";
        }
    }
}
