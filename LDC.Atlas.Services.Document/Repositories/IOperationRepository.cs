using LDC.Atlas.Services.Document.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Repositories
{
    public interface IOperationRepository
    {
        Task<IEnumerable<OperationDto>> GetOperationsAsync(int? pagingOptionsOffset, int? pagingOptionsLimit);

        Task<OperationDto> GetOperationByIdAsync(long operationId);
    }
}
