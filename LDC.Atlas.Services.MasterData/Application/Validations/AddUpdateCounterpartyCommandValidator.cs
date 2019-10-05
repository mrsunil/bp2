using FluentValidation;
using LDC.Atlas.Services.MasterData.Application.Command;

namespace LDC.Atlas.Services.MasterData.Application.Validations
{
    public class AddUpdateCounterpartyCommandValidator : AbstractValidator<AddUpdateCounterpartyCommand>
    {
        public AddUpdateCounterpartyCommandValidator()
        {
            RuleFor(command => command.CounterpartyCode).NotEmpty().MaximumLength(10);
            RuleFor(command => command.Description).NotEmpty().MaximumLength(200);
            RuleFor(command => command.CounterpartyTradeStatusId).NotNull();
            RuleFor(command => command.Description).MaximumLength(60);
        }
    }
}
