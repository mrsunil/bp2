using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface IInvoiceMarkingQueries
    {
        Task<IEnumerable<InvoiceMarkingDto>> GetCostInvoiceMarkingsAsync(long costId, string company);

        Task<IEnumerable<InvoiceMarkingDto>> GetSectionInvoiceMarkingsAsync(long sectionId, string company, long? dataVersionId);
    }
}
