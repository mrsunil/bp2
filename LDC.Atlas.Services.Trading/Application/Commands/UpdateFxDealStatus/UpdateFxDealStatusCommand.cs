using MediatR;

namespace LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDealStatus
{
    public class UpdateFxDealStatusCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger
    }
}
