using MediatR;

namespace LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDeal
{
    public class DeleteFxDealCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public long FxDealId { get; set; }
    }
}
