using FluentValidation;
using LDC.Atlas.Services.UserIdentity.Application.Commands;

namespace LDC.Atlas.Services.UserIdentity.Application.Validations
{
    public class CreateProfileCommandValidator : AbstractValidator<CreateProfileCommand>
    {
        public CreateProfileCommandValidator()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(50);
            RuleFor(command => command.Description).MaximumLength(500);
        }
    }

    public class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
    {
        public UpdateProfileCommandValidator()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(50);
            RuleFor(command => command.Description).MaximumLength(500);
        }
    }
}
