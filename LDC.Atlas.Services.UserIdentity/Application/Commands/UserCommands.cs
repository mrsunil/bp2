using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Application.Commands
{
    public class CreateUserCommand : IRequest<UserReference>
    {
        public string FavoriteLanguage { get; set; }

        public string UserPrincipalName { get; set; }
        
        public IEnumerable<WriteUserPermissionDto> Permissions { get; set; }
    }

    public class WriteUserPermissionDto
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public bool IsTrader { get; set; }

        public bool IsCharterManager { get; set; }

        public bool AllDepartments { get; set; }

        public IEnumerable<WriteDepartmentDto> Departments { get; set; }
    }

    public class WriteDepartmentDto
    {
        public int DepartmentId { get; set; }

        public string CompanyId { get; set; }
    }

    public class UpdateUserCommand : IRequest
    {
        internal long UserId { get; set; } // internal to avoid the exposure in Swagger

        public string FavoriteLanguage { get; set; }

        public bool IsDisabled { get; set; }

        public string CompanyRole { get; set; }

        public string ManagerSamAccountName { get; set; }

        public IEnumerable<WriteUserPermissionDto> Permissions { get; set; }
    }

    public class DeleteUserCommand : IRequest
    {
        internal long UserId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class UpdateUserLastConnectionDateCommand : IRequest
    {
        internal long UserId { get; set; }
    }

    public class UserReference
    {
        public long UserId { get; set; }
    }

    public class InsertUpdateActiveDirectoryUserCommand : IRequest
    {
    }
}
