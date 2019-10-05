using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.UserIdentity.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Repositories
{
    public class ProfileRepository : BaseRepository, IProfileRepository
    {
        public ProfileRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<int> CreateProfileAsync(Profile profile)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", profile.Name);
            queryParameters.Add("@Description", profile.Description);

            queryParameters.Add("@ProfileId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            queryParameters.Add("@ProfilePrivilege", ToArrayTVP(profile.ProfilePrivileges));

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateProfile, queryParameters, true);

            int profileId = queryParameters.Get<int>("@ProfileId");

            return profileId;
        }

        public async Task UpdateProfileAsync(Profile profile)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profile.Id);
            queryParameters.Add("@Name", profile.Name);
            queryParameters.Add("@Description", profile.Description);
            queryParameters.Add("@IsDisabled", profile.IsDisabled);

            queryParameters.Add("@ProfilePrivilege", ToArrayTVP(profile.ProfilePrivileges));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateProfile, queryParameters, true);
        }

        public async Task DeleteProfileAsync(int profileId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profileId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteProfile, queryParameters, true);
        }

        public async Task<bool> CheckProfileExistsAsync(int profileId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profileId);

            return await ExecuteScalarAsync<bool>(StoredProcedureNames.ProfileExists, queryParameters);
        }

        public async Task<bool> CheckProfileExistsAsync(string profileName, int? profileIdToExclude = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileName", profileName);
            queryParameters.Add("@ProfileIdToExclude", profileIdToExclude);

            return await ExecuteScalarAsync<bool>(StoredProcedureNames.ProfileExists, queryParameters);
        }

        public async Task<int> GetNumberOfUsersAsync(int profileId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profileId);

            return await ExecuteScalarAsync<int>(StoredProcedureNames.ProfileNumberOfUsers, queryParameters);
        }

        public async Task<string> GetProfileNameAsync(int profileId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profileId);

            return await ExecuteScalarAsync<string>(StoredProcedureNames.ProfileName, queryParameters);
        }

        private static DataTable ToArrayTVP(IEnumerable<ProfilePrivilege> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Authorization].[UDTT_ProfilePrivilege]");

            table.Columns.Add(new DataColumn("I_ProfilePrivilegeId", typeof(int)));

            var privilegeId = new DataColumn("PrivilegeId", typeof(int));
            table.Columns.Add(privilegeId);

            var permission = new DataColumn("Permission", typeof(short));
            table.Columns.Add(permission);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[privilegeId] = value.PrivilegeId;
                    row[permission] = value.Permission;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateProfile = "[Authorization].[usp_CreateProfile]";
            internal const string UpdateProfile = "[Authorization].[usp_UpdateProfile]";
            internal const string DeleteProfile = "[Authorization].[usp_DeleteProfile]";
            internal const string ProfileExists = "[Authorization].[usp_GetProfileExists]";
            internal const string ProfileNumberOfUsers = "[Authorization].[usp_GetProfileNumberOfUsers]";
            internal const string ProfileName = "[Authorization].[usp_GetProfileName]";
        }
    }
}
