using AutoMapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Services.Reporting.Application.Commands;

namespace LDC.Atlas.Services.Reporting.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<ReportCriteriasRequest, DynamicQueryDefinition>();
            CreateMap<GridColumnDto, ColumnConfiguration>();
        }
    }
}
