using LDC.Atlas.Services.PreAccounting.Application.Commands;
using LDC.Atlas.Services.PreAccounting.Entities;

namespace LDC.Atlas.Services.PreAccounting.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<CreateAccountingDocumentCommand, SectionPostingStatus>();
            CreateMap<SectionPostingStatus, CashRevaluationJL>();
        }
    }
}
