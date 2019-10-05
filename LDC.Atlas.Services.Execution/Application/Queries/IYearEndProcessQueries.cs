using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface IYearEndProcessQueries
    {
        Task<IEnumerable<YearEndProcessDto>> GetYearEndProcessAsync(string company, int year);
    }
}
