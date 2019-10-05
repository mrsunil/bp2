using FluentValidation;
using System.Linq;

namespace LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands
{
    public class AssignPriceUnitCommandValidator : AbstractValidator<AssignPriceUnitCommand>
    {
        public AssignPriceUnitCommandValidator()
        {
            RuleFor(command => command.MasterDataList).NotEmpty();
            RuleFor(command => command.AssignedCompanies).NotEmpty().When(command => command.DeassignedCompanies != null && !command.DeassignedCompanies.Any())
                .WithMessage("Both Assigned and Deassigned lists cannot be empty");
            RuleFor(command => command.DeassignedCompanies).NotEmpty().When(command => command.AssignedCompanies != null && !command.AssignedCompanies.Any())
                .WithMessage("Both Assigned and Deassigned lists cannot be empty");

            RuleFor(command => command.AssignedCompanies)
                .Must((command, assignedCompanies) => !assignedCompanies.Intersect(command.DeassignedCompanies).Any())
                .When(command => command.AssignedCompanies != null && command.DeassignedCompanies != null)
                .WithMessage("A company cannot be in both Assigned and Deassigned lists at the same time");
        }
    }
}
