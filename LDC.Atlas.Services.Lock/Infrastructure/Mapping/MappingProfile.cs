using AutoMapper;
using LDC.Atlas.Services.Lock.Application.Commands;
using LDC.Atlas.Services.Lock.Entities;

namespace LDC.Atlas.Services.Lock.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;
        }
    }
}
