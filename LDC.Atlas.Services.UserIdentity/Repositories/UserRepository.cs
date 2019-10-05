using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.UserIdentity.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(typeof(User), new ColumnAttributeTypeMapper<User>());
        }

        public async Task<long> CreateUserAsync(User user)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", user.UserId);
            queryParameters.Add("@DisplayName", user.DisplayName);
            queryParameters.Add("@FirstName", user.FirstName);
            queryParameters.Add("@LastName", user.LastName);
            queryParameters.Add("@Location", user.Location);
            queryParameters.Add("@Email", user.Email);
            queryParameters.Add("@Language", user.FavoriteLanguage);
            queryParameters.Add("@PhoneNumber", user.PhoneNumber);
            queryParameters.Add("@UserPrincipalName", user.UserPrincipalName);
            queryParameters.Add("@SamAccountName", user.SamAccountName);
            queryParameters.Add("@AzureObjectIdentifier", user.AzureObjectIdentifier);
            queryParameters.Add("@ManagerSamAccountName", user.ManagerSamAccountName);
            queryParameters.Add("@CompanyRole", user.CompanyRole);

            queryParameters.Add("@Permissions", ToArrayTVP(user.Permissions));
            queryParameters.Add("@Departments", ToArrayTVP(user.Permissions.SelectMany(p => p.Departments)));
            queryParameters.Add("@CompanyRole", user.CompanyRole);

            queryParameters.Add("@UserId", dbType: DbType.Int64, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUser, queryParameters, true);

            long userId = queryParameters.Get<long>("@UserId");

            return userId;
        }

        public async Task UpdateUserAsync(User user)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", user.UserId);

            queryParameters.Add("@DisplayName", user.DisplayName);
            queryParameters.Add("@Location", user.Location);
            queryParameters.Add("@Email", user.Email);
            queryParameters.Add("@Language", user.FavoriteLanguage);
            queryParameters.Add("@PhoneNumber", user.PhoneNumber);
            queryParameters.Add("@IsDisabled", user.IsDisabled);

            queryParameters.Add("@Permissions", ToArrayTVP(user.Permissions));
            queryParameters.Add("@Departments", ToArrayTVP(user.Permissions.SelectMany(p => p.Departments)));
            queryParameters.Add("@CompanyRole", user.CompanyRole);
            queryParameters.Add("@ManagerSamAccountName", user.ManagerSamAccountName);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateUsers, queryParameters, true);
        }

        public async Task DeleteUserAsync(long userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteUser, queryParameters, true);
        }

        public async Task DeleteUserAssignmentsAsync(long userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteUserAssignment, queryParameters, true);
        }

        public async Task<bool> CheckUserExistsAsync(long userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@userId", userId);

            return await ExecuteScalarAsync<bool>(StoredProcedureNames.UserExists, queryParameters);
        }

        public async Task<bool> CheckUserExistsAsync(string userPrincipalName)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserPrincipalName", userPrincipalName);

            return await ExecuteScalarAsync<bool>(StoredProcedureNames.UserExists, queryParameters);
        }

        public async Task UpdateUserLastConnectionDate(long userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateLastConnectionDate, queryParameters, true);
        }

        public async Task UpdateUserIAGAsync(IEnumerable<UserIAG> userIAG)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserIAG", ToArrayTVPForUserIAG(userIAG));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateUserIAG, queryParameters, true);
        }

        private static DataTable ToArrayTVP(IEnumerable<UserPermission> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Authorization].[UDTT_UserCompanyProfile]");

            var companyId = new DataColumn("[CompanyId]", typeof(string));
            table.Columns.Add(companyId);

            var profileId = new DataColumn("[ProfileId]", typeof(int));
            table.Columns.Add(profileId);

            var allDepartments = new DataColumn("[AllDepartments]", typeof(bool));
            table.Columns.Add(allDepartments);

            var isTrader = new DataColumn("[IsTrader]", typeof(bool));
            table.Columns.Add(isTrader);

            var isCharterManager = new DataColumn("[IsCharterManager]", typeof(bool));
            table.Columns.Add(isCharterManager);
            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[companyId] = value.CompanyId;
                    row[profileId] = value.ProfileId;
                    row[isTrader] = value.IsTrader;
                    row[isCharterManager] = value.IsCharterManager;
                    row[allDepartments] = value.AllDepartments;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static DataTable ToArrayTVP(IEnumerable<Department> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Authorization].[UDTT_CompanyDepartmentId]");

            var companyId = new DataColumn("[CompanyId]", typeof(string));
            table.Columns.Add(companyId);

            var departmentId = new DataColumn("[DepartmentId]", typeof(int));
            table.Columns.Add(departmentId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[companyId] = value.CompanyId;
                    row[departmentId] = value.DepartmentId;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static DataTable ToArrayTVPForUserIAG(IEnumerable<UserIAG> userIAG)
        {
            var table = new DataTable();
            table.SetTypeName("[Authorization].[UDTT_UserIAG]");

            var userId = new DataColumn("[UserId]", typeof(string));
            table.Columns.Add(userId);

            var managerSamAccountName = new DataColumn("[ManagerSamAccountName]", typeof(string));
            table.Columns.Add(managerSamAccountName);

            var companyRole = new DataColumn("[CompanyRole]", typeof(string));
            table.Columns.Add(companyRole);

            var differentADManager = new DataColumn("[DifferentADManager]", typeof(bool));
            table.Columns.Add(differentADManager);

            var differentADCompanyRole = new DataColumn("[DifferentADCompanyRole]", typeof(bool));
            table.Columns.Add(differentADCompanyRole);

            var isDisabled = new DataColumn("[ADStatusIsDisabled]", typeof(bool));
            table.Columns.Add(isDisabled);

            if (userIAG != null)
            {
                foreach (var user in userIAG)
                {
                    var row = table.NewRow();
                    row[userId] = user.UserId;
                    row[managerSamAccountName] = (object)DBNull.Value;
                    row[companyRole] = (object)DBNull.Value;
                    row[differentADManager] = user.DifferentADManager;
                    row[differentADCompanyRole] = user.DifferentADCompanyRole;
                    row[isDisabled] = user.IsDisabled;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateUsers = "[Authorization].[usp_UpdateUser]";
            internal const string CreateUser = "[Authorization].[usp_CreateUser]";
            internal const string DeleteUser = "[Authorization].[usp_DeleteUser]";
            internal const string UserExists = "[Authorization].[usp_GetUserExists]";
            internal const string DeleteUserAssignment = "[Authorization].[usp_DeleteUserAssignments]";
            internal const string UpdateLastConnectionDate = "[Authorization].[usp_SetUserLastConnectionDateTime]";
            internal const string UpdateUserIAG = "[Authorization].[usp_CreateUserIAG]";
        }
    }
}
