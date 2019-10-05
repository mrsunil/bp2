using FluentValidation;
using LDC.Atlas.Services.Configuration.Application.Commands;

namespace LDC.Atlas.Services.Configuration.Application.Validations
{
    public class CreateGridViewCommandValidators : AbstractValidator<CreateGridViewCommand>
    {
        public CreateGridViewCommandValidators()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(255);
        }
    }

    public class UpdateGridViewCommandValidators : AbstractValidator<UpdateGridViewCommand>
    {
        public UpdateGridViewCommandValidators()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(255);
        }
    }
}
