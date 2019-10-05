using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDealSections
{
    public class UpdateFxDealSectionsCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal long FxDealId { get; set; }

        public List<FxDealSection> Sections { get; set; }
    }

    public class FxDealSection
    {
        public long SectionId { get; set; }

        public decimal CoverApplied { get; set; }
    }
}
