using FluentValidation;
using System.Linq;

namespace LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands
{
    public class ActivatePriceUnitCommandValidator : AbstractValidator<ActivatePriceUnitCommand>
    {
        public ActivatePriceUnitCommandValidator()
        {
            RuleFor(command => command.MasterDataList).NotEmpty();
            RuleFor(command => command.ActivatedCompanies).NotEmpty().When(command => command.DeactivatedCompanies != null && !command.DeactivatedCompanies.Any())
                .WithMessage("Both Activated and Deactivated lists cannot be empty");
            RuleFor(command => command.DeactivatedCompanies).NotEmpty().When(command => command.ActivatedCompanies != null && !command.ActivatedCompanies.Any())
                .WithMessage("Both Activated and Deactivated lists cannot be empty");

            RuleFor(command => command.ActivatedCompanies)
                .Must((command, assignedCompanies) => !assignedCompanies.Intersect(command.DeactivatedCompanies).Any())
                .When(command => command.ActivatedCompanies != null && command.DeactivatedCompanies != null)
                .WithMessage("A company cannot be in both Activated and Deactivated lists at the same time");
        }
    }
}
