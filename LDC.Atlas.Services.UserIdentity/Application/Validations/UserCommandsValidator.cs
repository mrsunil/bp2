using FluentValidation;
using LDC.Atlas.Services.UserIdentity.Application.Commands;
using System;

namespace LDC.Atlas.Services.UserIdentity.Application.Validations
{
    public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
    {
        public CreateUserCommandValidator()
        {
            RuleFor(command => command.UserPrincipalName).NotEmpty().Must(upn => upn.Contains("@", StringComparison.InvariantCultureIgnoreCase)).MaximumLength(200);
            //RuleFor(command => command.AzureObjectIdentifier).NotEmpty().MaximumLength(100);
            RuleFor(command => command.FavoriteLanguage).MaximumLength(20);
        }
    }

    public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
    {
        public UpdateUserCommandValidator()
        {
            RuleFor(command => command.UserId).NotEmpty();
            RuleFor(command => command.FavoriteLanguage).MaximumLength(20);
        }
    }
}
