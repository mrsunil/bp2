using LDC.Atlas.Document.Common.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Repositories
{
    public interface IDocumentTypeRepository
    {
        Task<IEnumerable<PhysicalDocumentTypeDto>> GetGeneratedDocumentTypesAsync();
    }
}
