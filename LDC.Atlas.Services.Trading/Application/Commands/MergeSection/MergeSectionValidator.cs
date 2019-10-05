using FluentValidation;
using LDC.Atlas.Services.Trading.Entities;

namespace LDC.Atlas.Services.Trading.Application.Commands.MergeSection
{
    public class MergeSectionValidatorCollection : AbstractValidator<MergeSectionCommand>
    {
        public MergeSectionValidatorCollection()
        {
            RuleFor(command => command.Company).NotEmpty().NotNull();
            RuleForEach(command => command.MergeContracts).SetValidator(new MergeContractsValidatorCollection());
        }
    }

    public class MergeContractsValidatorCollection : AbstractValidator<MergeContracts>
    {
        public MergeContractsValidatorCollection()
        {
            RuleFor(command => command.MergeToSectionId).NotEmpty().GreaterThan(0);
            RuleForEach(command => command.MergeFromSectionIds).NotEmpty().GreaterThan(0);
            RuleFor(command => command.MergeOption).NotEmpty().IsInEnum();
        }
    }
}
