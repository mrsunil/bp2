using FluentValidation;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Validations
{
    public class PhysicalTradeBulkEditCommandValidator : AbstractValidator<PhysicalTradeBulkEditCommand>
    {
        public PhysicalTradeBulkEditCommandValidator()
        {
            RuleForEach(command => command.PhysicalContractToUpdate).SetValidator(new PhysicalContractToUpdateValidator());
            RuleForEach(command => command.SectionToUpdate).SetValidator(new SectionToUpdateValidator());
        }
    }

    public class PhysicalContractToUpdateValidator : AbstractValidator<PhysicalContractToUpdate>
    {
        public PhysicalContractToUpdateValidator()
        {
            RuleFor(command => command.ContractDate).NotEmpty();
            RuleFor(command => command.PhysicalContractId).NotEmpty();
            RuleFor(command => command.UserId).NotEmpty();

        }
    }

    public class SectionToUpdateValidator : AbstractValidator<SectionToUpdate>
    {
        public SectionToUpdateValidator()
        {
            RuleFor(command => command.DepartmentId).NotNull().NotEmpty();
            RuleFor(command => command.BuyerCounterpartyId).NotNull().NotEmpty();
            RuleFor(command => command.SellerCounterpartyId).NotNull().NotEmpty();
            RuleFor(command => command.CounterpartyReference).MaximumLength(40);
            RuleFor(command => command.CommodityId).NotNull().NotEmpty();
            RuleFor(command => command.CropYearFrom).LessThan(command => command.CropYearTo)
                .When(command => command.CropYearFrom != null && command.CropYearTo != null);
            RuleFor(command => command.CropYearFrom).GreaterThanOrEqualTo(command => command.ContractDate.AddYears(-5).Year);
            RuleFor(command => command.CropYearTo).LessThanOrEqualTo(command => command.ContractDate.AddYears(5).Year)
                .When(command => command.CropYearTo != null);
            RuleFor(command => command.CropYearFrom).LessThanOrEqualTo(command => command.ContractDate.AddYears(5).Year)
                .When(command => command.CropYearTo == null);
            RuleFor(command => command.WeightUnitId).NotEmpty().NotNull();
            RuleFor(command => command.ContractTermId).NotEmpty().NotNull();
            RuleFor(command => command.PortTermId).NotEmpty().NotNull();
            RuleFor(command => command.CurrencyCode).NotEmpty().NotNull();
            RuleFor(command => command.PriceUnitId).NotEmpty().NotNull();
            RuleFor(command => command.ContractPrice).NotEmpty().GreaterThanOrEqualTo(0);
            RuleFor(command => command.PaymentTermsId).NotNull().NotEmpty();
            RuleFor(command => command.ContractValue).NotEmpty().GreaterThanOrEqualTo(0)
             .When(command => command.Quantity > 0);
            RuleFor(command => command.PeriodTypeId).NotEmpty().NotNull();
            RuleFor(command => command.DeliveryPeriodStart).NotEmpty().LessThanOrEqualTo(command => command.DeliveryPeriodEnd)
                .When(command => command.DeliveryPeriodStart != null && command.DeliveryPeriodEnd != null);
            RuleFor(command => command.DeliveryPeriodEnd).NotEmpty().GreaterThanOrEqualTo(command => command.DeliveryPeriodStart).
                When(command => command.DeliveryPeriodStart != null && command.DeliveryPeriodStart != null);
            RuleFor(command => command.Memorandum).MaximumLength(2000);
        }
    }
}
