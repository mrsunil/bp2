using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDealSections
{
    public class DeleteFxDealSectionsCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public long FxDealId { get; set; }

        public List<long> SectionIds { get; set; }
    }
}
