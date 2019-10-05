using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Services.Document.Application.Commands;

namespace LDC.Atlas.Services.Document.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<UploadDocumentCommand, UploadDocumentParameters>();
        }
    }
}
