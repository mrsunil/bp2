using FluentValidation;

namespace LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDealSections
{
    public class UpdateFxDealSectionsValidator : AbstractValidator<UpdateFxDealSectionsCommand>
    {
        public UpdateFxDealSectionsValidator()
        {
            RuleFor(command => command.CompanyId).NotEmpty();
            RuleFor(command => command.FxDealId).NotEmpty();

            RuleFor(command => command.Sections).NotEmpty();
        }
    }
}
