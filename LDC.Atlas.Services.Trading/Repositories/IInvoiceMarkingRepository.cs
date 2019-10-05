using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface IInvoiceMarkingRepository
    {
        Task<InvoiceMarkingDto> AddInvoiceMarkingAsync(IEnumerable<InvoiceMarkingDto> invoiceMarking, int? invoiceStatus, string company);

        Task UpdateInvoiceMarkingAsync(InvoiceMarkingDto invoiceMarking, int? invoiceStatus, string company);
    }
}
