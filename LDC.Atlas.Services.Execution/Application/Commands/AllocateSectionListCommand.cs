using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class AllocateSectionListCommand : IRequest<long>
    {
        internal string Company { get; set; }

        public long? DataVersionId { get; set; }

        public ShippingType ShippingType { get; set; }

        public IEnumerable<AllocateSectionCommand> AllocateSections { get; set; }

        public bool? IsImageAllocation { get; set; }
    }
}
