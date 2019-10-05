using LDC.Atlas.Services.Document.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Application.Queries
{
    public interface ITemplateParametersQueries
    {
        Task<IEnumerable<TemplateParameterDto>> GetAllTemplateParametersAsync(string company);
    }
}
