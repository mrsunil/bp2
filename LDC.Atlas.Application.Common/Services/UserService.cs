using Dapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Services
{
    public class UserService : BaseRepository, IUserService
    {
        public UserService(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        public async Task<User> GetUserByIdAsync(long userId, bool includeDeletedUsers = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@IncludeDeletedUsers", includeDeletedUsers);

            User user;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetUserById, queryParameters))
            {
                user = FillUser(grid);
            }

            return user;
        }

        public async Task<User> GetUserByActiveDirectoryIdAsync(string userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ActiveDirectoryId", userId);

            User user;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetUserById, queryParameters))
            {
                user = FillUser(grid);
            }

            return user;
        }

        public async Task<IEnumerable<UserPrivilege>> GetPrivilegesForUserAsync(long userId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@CompanyId", company);

            var privileges = await ExecuteQueryAsync<UserPrivilege>(StoredProcedureNames.GetCompanyPrivilegesByUserId, queryParameters);
            return privileges;
        }

        private static User FillUser(SqlMapper.GridReader grid)
        {
            User user = grid.Read<User>().FirstOrDefault();
            if (user != null)
            {
                var userPermissions = grid.Read<UserPermission>().ToList();

                userPermissions.ForEach(user.Permissions.Add);

                var departments = grid.Read<Department>().ToList();

                foreach (var userPermissionDto in user.Permissions)
                {
                    departments.Where(d => d.CompanyId == userPermissionDto.CompanyId).ToList().ForEach(userPermissionDto.Departments.Add);
                }
            }

            return user;
        }

        private static class StoredProcedureNames
        {
            internal const string GetUserById = "[Authorization].[usp_GetUserById]";
            internal const string GetCompanyPrivilegesByUserId = "[Authorization].[usp_GetCompanyPrivilegesbyUserid]";
        }
    }
}
