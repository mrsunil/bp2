using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface ITagFieldsQueries
    {
        Task<IEnumerable<TagParameterDto>> GetAllTagParametersAsync(string company);
    }
}