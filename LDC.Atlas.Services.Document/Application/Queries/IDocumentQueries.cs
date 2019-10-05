using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Document.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Application.Queries
{
    public interface IDocumentQueries
    {
        Task<ContractAdviceInfoDto> GetContractAdviceInfoAsync(long sectionId, string company);

        Task<IEnumerable<PhysicalDocumentSearchResultDto>> SearchPhysicalDocumentsAsync(string company, EntitySearchRequest searchRequest);
        Task<IEnumerable<PhysicalDocumentSearchResultDto>> GetPhysicalDocumentsAsync(string company, EntitySearchRequest searchRequest);
       
    }
}
