using AutoMapper;

namespace LDC.Atlas.Services.Processor.Infrastructure.Mapping
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
