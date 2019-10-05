using FluentValidation;
using static LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.PricesUnitsBaseCommands;

namespace LDC.Atlas.Services.MasterData.Application.Command.UpdatePricesUnits
{
    public class GlobalPriceUnitDtoValidator : AbstractValidator<GlobalPriceUnitDto>
    {
        public GlobalPriceUnitDtoValidator()
        {
            RuleFor(command => command.PriceUnitId).NotEmpty().GreaterThan(0);
            RuleFor(command => command.PriceCode).NotEmpty().MaximumLength(6);
            RuleFor(command => command.Description).NotEmpty().MaximumLength(50);
            RuleFor(command => command.MdmId).MaximumLength(5).When(command => !string.IsNullOrEmpty(command.MdmId));
            RuleFor(command => command.ConversionFactor).GreaterThanOrEqualTo(0);
        }
    }

    public class LocalPriceUnitDtoValidator : AbstractValidator<LocalPriceUnitDto>
    {
        public LocalPriceUnitDtoValidator()
        {
            RuleFor(command => command.PriceUnitId).NotEmpty().GreaterThanOrEqualTo(0);
        }
    }

    public class UpdatePriceUnitsCommandValidator : AbstractValidator<UpdatePricesUnitsCommand>
    {
        public UpdatePriceUnitsCommandValidator()
        {
            RuleForEach(command => command.MasterDataList).SetValidator(new GlobalPriceUnitDtoValidator());
        }
    }

    public class UpdatePriceUnitsLocalCommandValidator : AbstractValidator<UpdatePricesUnitsLocalCommand>
    {
        public UpdatePriceUnitsLocalCommandValidator()
        {
            RuleForEach(command => command.MasterDataList).SetValidator(new LocalPriceUnitDtoValidator());
        }
    }
}
