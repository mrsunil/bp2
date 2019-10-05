using FluentValidation;

namespace LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDeal
{
    public class DeleteFxDealValidator : AbstractValidator<DeleteFxDealCommand>
    {
        public DeleteFxDealValidator()
        {
            RuleFor(command => command.Company).NotEmpty();
            RuleFor(command => command.FxDealId).NotEmpty();
        }
    }
}
