using LDC.Atlas.Services.Document.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Repositories
{
    public interface IDocumentTypeRepository
    {
        Task<IEnumerable<PhysicalDocumentTypeDto>> GetGeneratedDocumentTypesAsync();
    }
}
