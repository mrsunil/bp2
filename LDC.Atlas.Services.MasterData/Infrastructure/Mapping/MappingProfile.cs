using LDC.Atlas.Services.MasterData.Entities;
using static LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.PricesUnitsBaseCommands;

namespace LDC.Atlas.Services.MasterData.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<GlobalPriceUnitDto, PriceUnit>();
            CreateMap<LocalPriceUnitDto, PriceUnit>();
        }
    }
}
