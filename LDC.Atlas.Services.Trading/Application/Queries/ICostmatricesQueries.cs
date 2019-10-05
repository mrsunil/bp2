using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface ICostMatricesQueries
    {
        Task<IEnumerable<CostMatriceDto>> GetCostMatrixListAsync(string company);

        Task<CostMatriceDto> GetCostMatrixByIdAsync(long costmatrixId);

        Task<bool> CheckCostMatrixNameExistsAsync(string company, string name);
    }
}
