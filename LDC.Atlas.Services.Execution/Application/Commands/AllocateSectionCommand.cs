using LDC.Atlas.Services.Execution.Entities;
using MediatR;

[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("LDC.Atlas.IntegrationTest")]
namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class AllocateSectionCommand : IRequest<long>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        public long SectionId { get; set; }

        public long AllocatedSectionId { get; set; }

        public decimal Quantity { get; set; }

        public ShippingType ShippingType { get; set; }

        public AllocationType AllocationSourceType { get; set; }

        public AllocationType AllocationTargetType { get; set; }
        public int ContractInvoiceTypeId { get; set; }
    }
}
