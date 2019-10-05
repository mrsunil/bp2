using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface IInvoiceMarkingQueries
    {
        Task<IEnumerable<InvoiceMarkingDto>> GetContractInvoiceMarkingsAsync(long sectionId, string company);

        Task<IEnumerable<InvoiceMarkingDto>> GetCostInvoiceMarkingsAsync(long costId, string company);
    }
}
