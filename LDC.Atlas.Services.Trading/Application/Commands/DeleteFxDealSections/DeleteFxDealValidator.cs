using FluentValidation;

namespace LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDealSections
{
    public class DeleteFxDealSectionsValidator : AbstractValidator<DeleteFxDealSectionsCommand>
    {
        public DeleteFxDealSectionsValidator()
        {
            RuleFor(command => command.CompanyId).NotEmpty();
            RuleFor(command => command.FxDealId).NotEmpty();
            RuleFor(command => command.SectionIds).NotEmpty();
        }
    }
}
