using FluentValidation;
using LDC.Atlas.Services.Execution.Application.Commands;

namespace LDC.Atlas.Services.Execution.Application.Validations
{
    public class AllocateSectionCommandValidator : AbstractValidator<AllocateSectionCommand>
    {
        public AllocateSectionCommandValidator()
        {
            RuleFor(command => command.SectionId).NotEmpty();
            RuleFor(command => command.AllocatedSectionId).NotEmpty();
            RuleFor(command => command.Quantity).NotEmpty().GreaterThanOrEqualTo(0);
            RuleFor(command => command.ShippingType).IsInEnum();
        }
    }
}
