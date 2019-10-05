using FluentValidation;

namespace LDC.Atlas.Services.Trading.Application.Commands.SettleFxDeal
{
    public class SettleFxDealValidator : AbstractValidator<FxDealDocumentCreationCommand>
    {
        public SettleFxDealValidator()
        {
            RuleFor(command => command.FxDealIds).NotEmpty();
        }
    }
}
