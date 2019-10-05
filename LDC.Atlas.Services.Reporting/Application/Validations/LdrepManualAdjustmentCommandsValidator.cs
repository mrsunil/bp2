using FluentValidation;
using LDC.Atlas.Services.Reporting.Application.Commands;
using LDC.Atlas.Services.Reporting.Entities;
using System;

namespace LDC.Atlas.Services.Reporting.Application.Validations
{
    public class CreateUpdateLdrepManualAdjustmentCommandsValidator : AbstractValidator<CreateUpdateLdrepManualAdjustmentCommand>
    {
        public CreateUpdateLdrepManualAdjustmentCommandsValidator()
        {
            RuleForEach(command => command.LdrepManualAdjustmentRecords).SetValidator(new LdrepManualAdjustmenValidator());
        }
    }

    public class DeleteLdrepManualAdjustmentCommandsValidator : AbstractValidator<LdrepManualAdjustmentRecords>
    {
        public DeleteLdrepManualAdjustmentCommandsValidator()
        {
            RuleFor(command => Convert.ToDecimal(command.FunctionalCCYAdjustment)).NotEqual(0);
            RuleFor(command => Convert.ToDecimal(command.StatutoryCCYAdjustment)).NotEqual(0);
        }
    }

    public class LdrepManualAdjustmenValidator : AbstractValidator<LdrepManualAdjustmentRecords>
    {
        public LdrepManualAdjustmenValidator()
        {
            RuleFor(command => command.DateFrom).NotEmpty();
            RuleFor(command => command.DateTo).GreaterThan(command => command.DateFrom).When(command => command.DateTo != null);
            RuleFor(command => command.DepartmentId).NotEmpty();
            RuleFor(command => command.PNLTypeId).NotEmpty();
            RuleFor(command => command.Narrative).MaximumLength(50);
            RuleFor(command => command.Narrative).NotEmpty();
            RuleFor(command => command.CropYear).MaximumLength(9).When(command => command.CropYear != null && command.SectionId != null);
        }
    }
}
