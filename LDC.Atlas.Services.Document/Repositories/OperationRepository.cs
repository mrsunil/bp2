using LDC.Atlas.Services.Document.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Repositories
{
    public class OperationRepository : IOperationRepository
    {
        public async Task<IEnumerable<OperationDto>> GetOperationsAsync(int? pagingOptionsOffset, int? pagingOptionsLimit)
        {
            return new List<OperationDto>();
        }

        public async Task<OperationDto> GetOperationByIdAsync(long operationId)
        {
            var operation = new OperationDto
            {
                CreatedBy = "ATLAS",
                CreatedDateTime = DateTime.UtcNow,
                OperationId = operationId,
                ResourceLocation = "https://avanade.sharepoint.com/:f:/r/sites/LDCAtlasV2/Shared%20Documents/Test?csf=1&e=NcQU4N",
                Status = "succeeded"
            };

            return operation;
        }
    }
}
