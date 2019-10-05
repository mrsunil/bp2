using FluentValidation;
using LDC.Atlas.Services.Execution.Application.Commands;

namespace LDC.Atlas.Services.Execution.Application.Validations
{
    public class CreateCharterCommandValidator : AbstractValidator<CreateCharterCommand>
    {
        public CreateCharterCommandValidator()
        {
            RuleFor(command => command.Reference).NotEmpty().MaximumLength(15);
            RuleFor(command => command.Description).MaximumLength(60);
            RuleFor(command => command.VesselId).NotEmpty();
            RuleFor(command => command.TransportType).NotEmpty();
            RuleFor(command => command.WeightUnitId).NotEmpty();
            RuleFor(command => command.Currency).NotEmpty();
            RuleFor(command => command.Memo).MaximumLength(4000);
            RuleFor(command => command.BLRef).MaximumLength(20);
        }
    }

    public class UpdateCharterCommandValidator : AbstractValidator<UpdateCharterCommand>
    {
        public UpdateCharterCommandValidator()
        {
            RuleFor(command => command.Reference).NotEmpty().MaximumLength(15);
            RuleFor(command => command.Description).MaximumLength(60);
            RuleFor(command => command.VesselId).NotEmpty();
            RuleFor(command => command.TransportType).NotEmpty();
            RuleFor(command => command.WeightUnitId).NotEmpty();
            RuleFor(command => command.Currency).NotEmpty();
            RuleFor(command => command.Memo).MaximumLength(4000);
            RuleFor(command => command.BLRef).MaximumLength(20);
        }
    }

    public class SectionTrafficCommandValidator : AbstractValidator<UpdateSectionTrafficCommand>
    {
        public SectionTrafficCommandValidator()
        {
            RuleFor(command => command.BLReference).MaximumLength(255);
        }
    }
}
