using FluentValidation;
using LDC.Atlas.Services.Configuration.Application.Commands;
using System.Linq;

namespace LDC.Atlas.Services.Configuration.Application.Validators
{
    public class CreateFunctionalObjectCommandValidator : AbstractValidator<CreateFunctionalObjectCommand>
    {
        public CreateFunctionalObjectCommandValidator()
        {
            RuleFor(command => command.Name).NotEmpty().MaximumLength(255);
            RuleFor(command => command.Keys).NotNull()
                .Custom((keys, context) =>
                {
                    int count = 0;
                    keys.ToList().ForEach((key) => count += key.FieldIds.Count());

                    if (count > 10)
                    {
                        context.AddFailure("Only 10 fields or fewer can be defined for a functional object.");
                    }
                });

            RuleForEach(command => command.Keys).SetValidator(new FunctionalObjectKeysValidator());
        }
    }

    public class FunctionalObjectKeysValidator : AbstractValidator<FunctionalObjectTableFieldsDto>
    {
        public FunctionalObjectKeysValidator()
        {
            RuleFor(command => command.TableId).NotEmpty();
        }
    }
}
