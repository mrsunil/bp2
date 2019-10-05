using LDC.Atlas.Services.UserIdentity.Application.Commands;
using LDC.Atlas.Services.UserIdentity.Entities;

namespace LDC.Atlas.Services.UserIdentity.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<CreateUserCommand, User>();
            CreateMap<UpdateUserCommand, User>();
        }
    }
}
