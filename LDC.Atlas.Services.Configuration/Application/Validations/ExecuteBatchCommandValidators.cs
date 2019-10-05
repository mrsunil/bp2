using FluentValidation;
using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Entities;

namespace LDC.Atlas.Services.Configuration.Application.Validators
{
    public class ExecuteBatchCommandValidators : AbstractValidator<ExecuteBatchCommand>
    {
        public ExecuteBatchCommandValidators()
        {
            RuleFor(command => command.ActionId).GreaterThan(0);
            RuleFor(command => command.GroupId).GreaterThan(0);
            RuleFor(command => (BatchAction)command.ActionId).IsInEnum();
        }
    }
}
