using LDC.Atlas.Services.Trading.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface ICostMatrixRepository
    {
        Task<long> CreateCostMatrixAsync(CostMatrix costMatrix, string company);

        Task UpdateCostMatrixAsync(CostMatrix costMatrix, string company);

        Task DeleteCostMatrixAsync(long costMatrixId);

        Task DeleteCostMatrixLineAsync(long costMatrixId);
    }
}
