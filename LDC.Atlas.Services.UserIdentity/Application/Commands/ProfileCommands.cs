using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Application.Commands
{
    public class CreateProfileCommand : IRequest<ProfileReference>
    {
        private readonly List<CreateProfilePrivilegeDto> _privileges;

        public CreateProfileCommand()
        {
            _privileges = new List<CreateProfilePrivilegeDto>();
        }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<CreateProfilePrivilegeDto> Privileges => _privileges;
    }

    public class UpdateProfileCommand : IRequest
    {
        private readonly List<UpdateProfilePrivilegeDto> _privileges;

        public UpdateProfileCommand()
        {
            _privileges = new List<UpdateProfilePrivilegeDto>();
        }

        internal int ProfileId { get; set; } // internal to avoid the exposure in Swagger

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<UpdateProfilePrivilegeDto> Privileges => _privileges;
    }

    public class DeleteProfileCommand : IRequest
    {
        internal int ProfileId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class CreateProfilePrivilegeDto
    {
        public int PrivilegeId { get; set; }

        public int Permission { get; set; }
    }

    public class UpdateProfilePrivilegeDto
    {
        public int PrivilegeId { get; set; }

        public int Permission { get; set; }
    }

    public class ProfileReference
    {
        public int ProfileId { get; set; }

        public string Name { get; set; }
    }
}
