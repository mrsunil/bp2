using AutoMapper;
using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Application.Queries.Dto;
using LDC.Atlas.Services.Configuration.Entities;

namespace LDC.Atlas.Services.Configuration.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            // FeatureBit
            this.CreateMap<FeatureBitDto, FeatureBitDefinition>()
                .ForMember(dest => dest.AllowedCompanies, src => src.MapFrom(feature => feature.AllowedCompanies.Split(",", System.StringSplitOptions.None)));

            // FilterSets
            CreateMap<CreateFilterSetCommand, FilterSet>();
            CreateMap<UpdateFilterSetCommand, FilterSet>();

            CreateMap<UpdateGridCommand, Grid>();

            // GridViews
            CreateMap<CreateGridViewCommand, GridView>();
            CreateMap<UpdateGridViewCommand, GridView>();
            CreateMap<DeleteGridViewCommand, GridView>();
        }
    }
}
