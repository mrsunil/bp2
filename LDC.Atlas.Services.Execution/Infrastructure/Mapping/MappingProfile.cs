using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Entities;

namespace LDC.Atlas.Services.Execution.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<AllocateSectionCommand, AllocationOperation>();
            CreateMap<CreateCashCommand, Cash>();
            CreateMap<UpdateCashCommand, Cash>();
            CreateMap<CreateManualDocumentMatchingCommand, ManualDocumentMatchingRecord>();
            CreateMap<UnmatchManualDocumentMatchingCommand, ManualDocumentMatchingRecord>();
            CreateMap<CreateInvoiceCommand, InvoiceRecord>();
            CreateMap<UpdateDocumentMatchingCommand, ManualDocumentMatchingRecord>();
        }
    }
}
