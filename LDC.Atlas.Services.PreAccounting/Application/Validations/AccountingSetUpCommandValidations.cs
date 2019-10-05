using FluentValidation;
using LDC.Atlas.Services.PreAccounting.Application.Commands;

namespace LDC.Atlas.Services.PreAccounting.Application.Validations
{
    public class AccountingSetUpCommandValidations : AbstractValidator<UpdateAccountingSetUpCommand>
    {
        public AccountingSetUpCommandValidations()
        {
            RuleFor(command => command.LastMonthClosed).NotEmpty();
            RuleFor(command => command.LastMonthClosedForOperation).NotEmpty().GreaterThanOrEqualTo(command => command.LastMonthClosed);
        }
    }
}
