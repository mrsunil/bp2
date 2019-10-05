using FluentValidation;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Entities;
using System.Globalization;
using System.Linq;

namespace LDC.Atlas.Services.Trading.Application.Validations
{
    public class UpdatePhysicalContractCommandValidator : AbstractValidator<UpdatePhysicalContractCommand>
    {
        public UpdatePhysicalContractCommandValidator()
        {
            RuleFor(command => command.Type).IsInEnum();
            RuleFor(command => command.TraderId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "TraderId").IsMandatory);
            RuleFor(command => command.ContractReference).MaximumLength(7).Matches("^[a-zA-Z0-9]*$");
            RuleFor(command => command.DepartmentId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "DepartmentId").IsMandatory);
            RuleFor(command => command.BuyerCode).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "BuyerId").IsMandatory);
            RuleFor(command => command.SellerCode).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "SellerId").IsMandatory);
            RuleFor(command => command.CounterpartyReference).MaximumLength(40).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CounterpartyRef").IsMandatory);
            RuleFor(command => command.CommodityId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CommodityId").IsMandatory);
            RuleFor(command => command.CropYear).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CropYear").IsMandatory);
            RuleFor(command => command.CropYear).LessThan(command => command.CropYearTo)
                .When(command => command.CropYear != null && command.CropYearTo != null);
            RuleFor(command => command.CropYear).GreaterThanOrEqualTo(command => command.ContractDate.AddYears(-5).Year);
            RuleFor(command => command.CropYearTo).LessThanOrEqualTo(command => command.ContractDate.AddYears(5).Year)
                .When(command => command.CropYearTo != null);
            RuleFor(command => command.CropYear).LessThanOrEqualTo(command => command.ContractDate.AddYears(5).Year)
                .When(command => command.CropYearTo == null);
            RuleFor(command => command.WeightUnitId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "WeightUnitId").IsMandatory);
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0).When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Quantity").IsMandatory);
            RuleFor(command => command.ContractedValue).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "OriginalQuantity").IsMandatory);
            RuleFor(command => command.ContractedValue).NotEmpty().GreaterThanOrEqualTo(0)
                .When(command => command.Quantity > 0);
            RuleFor(command => command.CurrencyCode).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CurrencyCode").IsMandatory);
            RuleFor(command => command.PriceUnitId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PricingMethodId").IsMandatory);
            RuleFor(command => command.Price).NotEmpty().GreaterThanOrEqualTo(0).When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Price").IsMandatory);
            RuleFor(command => command.PaymentTerms).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PaymentTermId").IsMandatory);

            RuleFor(command => command.DiscountPremiumValue).GreaterThanOrEqualTo(0);
            RuleFor(command => command.DiscountPremiumCurrency).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PremiumDiscountCurrency").IsMandatory && (command.DiscountPremiumBasis != null));
            RuleFor(command => command.DiscountPremiumValue).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PremiumDiscountValue").IsMandatory && (command.DiscountPremiumBasis != null));
            RuleFor(command => command.DiscountPremiumType).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Type").IsMandatory && (command.DiscountPremiumBasis != null));

            RuleFor(command => command.ContractTerms).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ContractTermId").IsMandatory);
            RuleFor(command => command.ContractTermsLocation).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ContractTermLocationId").IsMandatory);
            RuleFor(command => command.Arbitration).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ArbitrationId").IsMandatory);

            RuleFor(command => command.PeriodTypeId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PeriodTypeId").IsMandatory);
            RuleFor(command => command.DeliveryPeriodStartDate).NotEmpty().LessThanOrEqualTo(command => command.DeliveryPeriodEndDate)
                .When(command => command.DeliveryPeriodStartDate != null && command.DeliveryPeriodEndDate != null);
            RuleFor(command => command.DeliveryPeriodEndDate).NotEmpty();
            RuleFor(command => command.PositionMonthType).IsInEnum();

            RuleFor(command => command.PortOfDestination).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PortDestinationId").IsMandatory);
            RuleFor(command => command.PortOfOrigin).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PortOriginId").IsMandatory);
            RuleFor(command => command.Memorandum).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Memorandum").IsMandatory);
            RuleForEach(command => command.Costs).SetValidator(new CostValidator());

            // For Selected Option
            RuleFor(command => command.CurrentTradeOptionId).IsInEnum();
            RuleFor(command => command.AllocateTradeOptionId).IsInEnum().When(command => command.AllocatedTo != null);

            // Not Invoiced, Not Allocated => Purchase Contract
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo == null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null));
            RuleFor(command => command.CurrentTradeOptionId).Must(optionId => optionId == CurrentTradeOption.AdjustContract || optionId == CurrentTradeOption.NoAction).When(command => command.Quantity > command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo == null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null));
            RuleFor(command => command.CurrentTradeOptionId).NotEqual(CurrentTradeOption.CreateAllocatedResidualSplit).When(command => command.Quantity <= command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo == null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null));

            // Invoiced, Not Allocated => Purchase Contract
            RuleFor(command => command.Quantity).GreaterThan(0).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo == null && (command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.Quantity).LessThanOrEqualTo(command => command.PreviousQuantity).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo == null && (command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.CurrentTradeOptionId).Equal(CurrentTradeOption.CreateUnallocatedResidualSplit).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.Quantity <= command.PreviousQuantity && command.AllocatedTo == null && (command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.InvoicingStatusId == InvoicingStatus.Finalized));

            // Not Invoiced and Allocated to Uninvoice Sale Contract
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));
            RuleFor(command => command.CurrentTradeOptionId).Equal(CurrentTradeOption.AdjustContract).When(command => command.Quantity > command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));
            RuleFor(command => command.AllocateTradeOptionId).Equal(AllocateTradeOption.AdjustAllocation).When(command => command.Quantity > command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));
            RuleFor(command => command.AllocateTradeOptionId).Equal(AllocateTradeOption.LeaveStatus).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.CurrentTradeOptionId == CurrentTradeOption.CreateAllocatedResidualSplit && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));

            // No final invoice and allocted to invoiced sale contract
            RuleFor(command => command.Quantity).GreaterThan(0).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.Quantity).LessThanOrEqualTo(command => command.PreviousQuantity).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.CurrentTradeOptionId).Equal(CurrentTradeOption.CreateAllocatedResidualSplit).When(command => command.Quantity < command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.AllocateTradeOptionId).Equal(AllocateTradeOption.LeaveStatus).When(command => command.CurrentTradeOptionId == CurrentTradeOption.CreateAllocatedResidualSplit && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.InvoicingStatusId == null) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));

            // Final invoice and allocted to un-invoiced sale contract
            RuleFor(command => command.Quantity).GreaterThan(0).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));
            RuleFor(command => command.Quantity).LessThanOrEqualTo(command => command.PreviousQuantity).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));
            RuleFor(command => command.CurrentTradeOptionId).Equal(CurrentTradeOption.CreateAllocatedResidualSplit).When(command => command.Quantity < command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));
            RuleFor(command => command.AllocateTradeOptionId).Equal(AllocateTradeOption.LeaveStatus).When(command => command.CurrentTradeOptionId == CurrentTradeOption.CreateAllocatedResidualSplit && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Uninvoiced || command.AllocatedTo.InvoicingStatusId == null));

            // Final invoice and allocted to un-invoiced sale contract
            RuleFor(command => command.Quantity).GreaterThan(0).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.Quantity).LessThanOrEqualTo(command => command.PreviousQuantity).When(command => (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.CurrentTradeOptionId).Equal(CurrentTradeOption.CreateAllocatedResidualSplit).When(command => command.Quantity < command.PreviousQuantity && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
            RuleFor(command => command.AllocateTradeOptionId).Equal(AllocateTradeOption.LeaveStatus).When(command => command.CurrentTradeOptionId == CurrentTradeOption.CreateAllocatedResidualSplit && (command.Type == ContractType.Purchase || command.Type == ContractType.Sale) && command.AllocatedTo != null && (command.InvoicingStatusId == InvoicingStatus.Finalized || command.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired) && (command.AllocatedTo.InvoicingStatusId == InvoicingStatus.FinalInvoiceRequired || command.AllocatedTo.InvoicingStatusId == InvoicingStatus.Finalized));
        }
    }

    public class CreatePhysicalFixedPricedContractCommandValidator : AbstractValidator<CreatePhysicalFixedPricedContractCommand>
    {
        public CreatePhysicalFixedPricedContractCommandValidator()
        {
            RuleFor(command => command.Type).IsInEnum();
            RuleFor(command => command.TraderId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "TraderId").IsMandatory);
            RuleFor(command => command.ContractReference).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PhysicalContractCode").IsMandatory);
            RuleFor(command => command.ContractReference).MaximumLength(7).Matches("^[a-zA-Z0-9]*$");
            RuleFor(command => command.DepartmentId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "DepartmentId").IsMandatory);
            RuleFor(command => command.BuyerCode).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "BuyerId").IsMandatory);
            RuleFor(command => command.SellerCode).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "SellerId").IsMandatory);
            RuleFor(command => command.CounterpartyReference).MaximumLength(40).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CounterpartyRef").IsMandatory);
            RuleFor(command => command.CommodityId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CommodityId").IsMandatory);
            RuleFor(command => command.CropYear).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CropYear").IsMandatory);
            RuleFor(command => command.CropYear).LessThan(command => command.CropYearTo)
                 .When(command => command.CropYear != null && command.CropYearTo != null);
            RuleFor(command => command.CropYear).GreaterThanOrEqualTo(command => command.ContractDate.AddYears(-5).Year);
            RuleFor(command => command.CropYearTo).LessThanOrEqualTo(command => command.ContractDate.AddYears(5).Year)
                 .When(command => command.CropYearTo != null);
            RuleFor(command => command.CropYear).LessThanOrEqualTo(command => command.ContractDate.AddYears(5).Year)
                 .When(command => command.CropYearTo == null);
            RuleFor(command => command.WeightUnitId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "WeightUnitId").IsMandatory);
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0).When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Quantity").IsMandatory);
            RuleFor(command => command.ContractedValue).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "OriginalQuantity").IsMandatory);
            RuleFor(command => command.ContractedValue).NotEmpty().GreaterThanOrEqualTo(0)
                .When(command => command.Quantity > 0);
            RuleFor(command => command.CurrencyCode).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CurrencyCode").IsMandatory);
            RuleFor(command => command.PriceUnitId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PricingMethodId").IsMandatory);
            RuleFor(command => command.Price).NotEmpty().GreaterThanOrEqualTo(0).When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Price").IsMandatory);
            RuleFor(command => command.PaymentTerms).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PaymentTermId").IsMandatory);

            RuleFor(command => command.DiscountPremiumValue).GreaterThanOrEqualTo(0);
            RuleFor(command => command.DiscountPremiumCurrency).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PremiumDiscountCurrency").IsMandatory && (command.DiscountPremiumBasis != null));
            RuleFor(command => command.DiscountPremiumValue).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PremiumDiscountValue").IsMandatory && (command.DiscountPremiumBasis != null));
            RuleFor(command => command.DiscountPremiumType).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Type").IsMandatory && (command.DiscountPremiumBasis != null));

            RuleFor(command => command.ContractTerms).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ContractTermId").IsMandatory);
            RuleFor(command => command.ContractTermsLocation).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ContractTermLocationId").IsMandatory);
            RuleFor(command => command.Arbitration).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ArbitrationId").IsMandatory);
            RuleFor(command => command.PeriodTypeId).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PeriodTypeId").IsMandatory);
            RuleFor(command => command.DeliveryPeriodStartDate).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "DeliveryPeriodStart").IsMandatory);
            RuleFor(command => command.DeliveryPeriodStartDate).LessThanOrEqualTo(command => command.DeliveryPeriodEndDate)
             .When(command => command.DeliveryPeriodStartDate != null && command.DeliveryPeriodEndDate != null);
            RuleFor(command => command.DeliveryPeriodEndDate).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "DeliveryPeriodEnd").IsMandatory);
            RuleFor(command => command.PositionMonthType).IsInEnum();
            RuleFor(command => command.Memorandum).MaximumLength(2000);
            RuleForEach(command => command.Costs).SetValidator(new CostValidator());
            RuleFor(command => command.PortOfDestination).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PortDestinationId").IsMandatory);
            RuleFor(command => command.PortOfOrigin).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PortOriginId").IsMandatory);
            RuleFor(command => command.Memorandum).NotEmpty().When(command => command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "Memorandum").IsMandatory);
        }
    }

    public class CostValidator : AbstractValidator<Cost>
    {
        public CostValidator()
        {
            RuleFor(command => command.CostTypeCode).NotEmpty();
            RuleFor(command => command.CostDirectionId).NotEmpty();
            RuleFor(command => command.CurrencyCode).NotEmpty();
            RuleFor(command => command.RateTypeId).NotEmpty();
            RuleFor(command => command.Rate).GreaterThanOrEqualTo(0);
            RuleFor(command => command.Narrative).MaximumLength(100);
        }
    }

    public class CreateTrancheValidator : AbstractValidator<CreateTrancheCommand>
    {
        public CreateTrancheValidator()
        {
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0);
            RuleForEach(command => command.ChildSections).SetValidator(new TrancheSectionsValidator());
        }
    }

    public class TrancheSectionsValidator : AbstractValidator<SectionDeprecated>
    {
        public TrancheSectionsValidator()
        {
            RuleFor(command => command.Quantity).GreaterThan(0);
            RuleFor(command => command.SectionNumber.Substring(0, 1)).Matches("[A-Z]");
        }
    }

    public class CreateSplitValidator : AbstractValidator<CreateSplitCommand>
    {
        public CreateSplitValidator()
        {
            RuleFor(command => command.Quantity).GreaterThanOrEqualTo(0);
            RuleFor(command => command.OriginalQuantity).GreaterThanOrEqualTo(0);
            RuleForEach(command => command.ChildSections).SetValidator(new SplitSectionsValidator());
        }
    }

    public class SplitSectionsValidator : AbstractValidator<SectionDeprecated>
    {
        public SplitSectionsValidator()
        {
            RuleFor(command => command.Quantity).GreaterThan(0).When(command => command.SectionId == 0);
            RuleFor(command => command.OriginalQuantity).GreaterThan(0).When(command => command.SectionId == 0);
            RuleFor(command => command.ContractedValue).GreaterThan(0).When(command => command.SectionId == 0);
            RuleFor(command => int.Parse(command.SectionNumber.Substring(1, 3), CultureInfo.InvariantCulture)).LessThanOrEqualTo(999);
            RuleFor(command => command.DeliveryPeriodEndDate).GreaterThan(command => command.DeliveryPeriodStartDate);
        }
    }

    public class SplitDetailsCommandvalidator : AbstractValidator<SplitDetailsCommand>
    {
        public SplitDetailsCommandvalidator()
        {
            RuleFor(command => command.Quantity).GreaterThan(0);
        }
    }

    public class BulkSplitDetailsCommandvalidator : AbstractValidator<BulkSplitDetailsCommand>
    {
        public BulkSplitDetailsCommandvalidator()
        {
            RuleFor(command => command.SectionId).GreaterThan(0);
        }
    }

    public class UnapproveSectionCommandValidator : AbstractValidator<UnapproveSectionCommand>
    {
        public UnapproveSectionCommandValidator()
        {
            RuleFor(command => command.SectionId).NotEmpty();
        }
    }

    public class ApproveSectionCommandValidator : AbstractValidator<ApproveSectionCommand>
    {
        public ApproveSectionCommandValidator()
        {
            RuleFor(command => command.SectionId).NotEmpty();
        }
    }
}
