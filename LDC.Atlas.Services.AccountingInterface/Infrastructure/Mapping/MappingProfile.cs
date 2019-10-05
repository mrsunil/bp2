using AutoMapper;

namespace LDC.Atlas.Services.AccountingInterface.Infrastructure.Mapping
{
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
