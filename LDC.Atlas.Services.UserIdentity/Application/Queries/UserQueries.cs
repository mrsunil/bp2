using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using LDC.Atlas.Services.UserIdentity.Application.Queries.Extensions;
using LDC.Atlas.Services.UserIdentity.Services.Graph;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries
{
    public class UserQueries : BaseRepository, IUserQueries
    {
        private readonly IGraphClient _graphClient;

        public UserQueries(IGraphClient graphClient, IDapperContext dapperContext)
            : base(dapperContext)
        {
            _graphClient = graphClient;
        }

        public async Task<IEnumerable<DirectoryUser>> GetDirectoryUsersAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                throw new ArgumentNullException(nameof(searchTerm));
            }

            if (searchTerm.Length < 3)
            {
                throw new ValidationException("The searchTerm must be at least 3 characters long.");
            }

            List<DirectoryUser> directoryUsers = new List<DirectoryUser>();

            IGraphServiceUsersCollectionPage users = await _graphClient.SearchUsersAsync(searchTerm);

            if (users?.Count > 0)
            {
                foreach (User user in users)
                {
                    var directoryUser = user.MapToDirectoryUser();

                    directoryUsers.Add(directoryUser);
                }
            }

            return directoryUsers;
        }

        public async Task<DirectoryUser> GetDirectoryUserByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            var user = await _graphClient.GetUserByIdAsync(userId);

            var directoryUser = user.MapToDirectoryUser();

            // Seach user manager in AD
            try
            {
                var manager = (await _graphClient.GetUserManagerByIdAsync(user.UserPrincipalName)) as User;

                if (manager != null)
                {
                    directoryUser.ManagerSamAccountName = manager.OnPremisesSamAccountName;

                    // Generate a SamAccountName if not provided by AD
                    if (string.IsNullOrWhiteSpace(directoryUser.ManagerSamAccountName))
                    {
                        var name = manager.Mail ?? manager.UserPrincipalName;
                        directoryUser.ManagerSamAccountName = name.Split('@').First();
                    }
                }
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception)
            {
                // No action needed
            }
#pragma warning restore CA1031 // Do not catch general exception types

            return directoryUser;
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync(string name = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", name);

            var users = await ExecuteQueryAsync<UserDto>(StoredProcedureNames.GetUsers, queryParameters);
            return users;
        }

        public async Task<UserDto> GetUserByIdAsync(long userId, bool includeDeletedUsers = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@IncludeDeletedUsers", includeDeletedUsers);

            UserDto user;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetUserById, queryParameters))
            {
                user = FillUser(grid);
            }

            return user;
        }

        public async Task<UserDto> GetUserByActiveDirectoryIdAsync(string userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ActiveDirectoryId", userId);

            UserDto user;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetUserById, queryParameters))
            {
                user = FillUser(grid);
            }

            return user;
        }

        public async Task<IEnumerable<UserPrivilegeDto>> GetPrivilegesForUserAsync(long userId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@CompanyId", company);

            var privileges = await ExecuteQueryAsync<UserPrivilegeDto>(StoredProcedureNames.GetCompanyPrivilegesByUserId, queryParameters);
            return privileges;
        }

        public async Task<IEnumerable<UserAccountDto>> GetUsersByProfilesAsync(int[] profileIds, string company, int? offset, int? limit)
        {
            var ids = ConvertToBigIntListUDTT(profileIds);
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@ProfileId", ids);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);
            var privileges = await ExecuteQueryAsync<UserAccountDto>(StoredProcedureNames.GetUserByProfileId, queryParameters);
            return privileges;
        }

        private static UserDto FillUser(SqlMapper.GridReader grid)
        {
            UserDto user = grid.Read<UserDto>().FirstOrDefault();
            if (user != null)
            {
                user.Permissions = grid.Read<UserPermissionDto>();

                var departments = grid.Read<DepartmentDto>().ToList();

                foreach (var userPermissionDto in user.Permissions)
                {
                    userPermissionDto.Departments = departments.Where(d => d.CompanyId == userPermissionDto.CompanyId);
                }
            }

            return user;
        }

        private static DataTable ConvertToBigIntListUDTT(int[] identifiers)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_BigIntList]");

            DataColumn idColumn = new DataColumn("Id", typeof(long));
            udtt.Columns.Add(idColumn);

            foreach (var id in identifiers)
            {
                var row = udtt.NewRow();
                row[idColumn] = id;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string GetUsers = "[Authorization].[usp_GetUsers]";
            internal const string GetUserById = "[Authorization].[usp_GetUserById]";
            internal const string GetCompanyPrivilegesByUserId = "[Authorization].[usp_GetCompanyPrivilegesbyUserid]";
            internal const string GetUserByProfileId = "[Authorization].[usp_GetUsersbyProfileId]";
        }
    }
}
