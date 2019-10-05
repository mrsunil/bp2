using LDC.Atlas.Services.Trading.Entities;
using MediatR;
using System;
using System.Collections.Generic;

[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("LDC.Atlas.IntegrationTest")]
namespace LDC.Atlas.Services.Trading.Application.Commands
{
    public class CreatePhysicalFixedPricedContractCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        public string ContractReference { get; set; }

        internal string CreatedBy { get; set; } // internal to avoid the exposure in Swagger

        public DateTime ContractDate { get; set; }

        public ContractStatus Status { get; set; }

        public ContractType Type { get; set; }

        public DateTime? FirstApprovalTime { get; set; }

        public long? DepartmentId { get; set; }

        public long? TraderId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public long CommodityId { get; set; }

        public decimal Quantity { get; set; }

        public long? WeightUnitId { get; set; }

        public int? CropYear { get; set; }

        public int? CropYearTo { get; set; }

        public ToleranceType ToleranceType { get; set; }

        public decimal? ToleranceMin { get; set; }

        public decimal? ToleranceMax { get; set; }

        public decimal? TolerancePourcentage { get; set; }

        public string ContractTerms { get; set; }

        public string ContractTermsLocation { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfDestination { get; set; }

        public DateTime? DeliveryPeriodStartDate { get; set; }

        public DateTime? DeliveryPeriodEndDate { get; set; }

        public int? PeriodTypeId { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        public int PositionMonthIndex { get; set; }

        public string Arbitration { get; set; }

        public int? MarketSectorId { get; set; }

        public PricingMethod PricingMethod { get; set; }

        public string PaymentTerms { get; set; }

        public long PriceUnitId { get; set; }

        public decimal Price { get; set; }

        public DateTime? BlDate { get; set; }

        public decimal PremiumDiscount { get; set; }

        public string CurrencyCode { get; set; }

        public string CounterpartyReference { get; set; }

        public decimal? ContractedValue { get; set; }

        public string Memorandum { get; set; }

        public IEnumerable<Cost> Costs { get; set; }

        public DiscountType? DiscountPremiumType { get; set; }

        public DiscountBasis? DiscountPremiumBasis { get; set; }

        public string DiscountPremiumCurrency { get; set; }

        public decimal? DiscountPremiumValue { get; set; }

        public int NumberOfContracts { get; set; }

        public decimal OriginalQuantity { get; set; }

        public IEnumerable<SectionDeprecated> ChildSections { get; set; }

        public string OtherReference { get; set; }

        public DateTime? EstimatedMaturityDate { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public bool IsInterco { get; set; }

        public ContractType IntercoContractType { get; set; }

        public string IntercoCompanyId { get; set; } // internal to avoid the exposure in Swagger

        public string IntercoBuyerCode { get; set; }

        public string IntercoSellerCode { get; set; }

        public long? IntercoDepartmentId { get; set; }

        public long? IntercoTraderId { get; set; }

        public bool IsRemoveInterco { get; set; }

        public DateTime? ContractSentDate { get; set; }

        public DateTime? LastEmailReceivedDate { get; set; }

        public DateTime? ContractReturnedDate { get; set; }

        public IEnumerable<FieldsConfiguration> FieldsConfigurations { get; set; }
    }

    public class CreatePhysicalFuturesOptionsPricedCommand : CreatePhysicalFixedPricedContractCommand, IRequest
    {
        public string FixTypeCode { get; set; }

        public DateTime PromptMonthDate { get; set; }

        public int NumberOfLots { get; set; }
    }

    public class PhysicalTradeBulkEditCommand : IRequest
    {
        internal string CompanyId { get; set; }

        public IEnumerable<PhysicalContractToUpdate> PhysicalContractToUpdate { get; set; }

        public IEnumerable<SectionToUpdate> SectionToUpdate { get; set; }
    }

    public class UpdatePhysicalContractCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        public string ContractReference { get; set; }

        public DateTime ContractDate { get; set; }

        public ContractStatus Status { get; set; }

        public ContractType Type { get; set; }

        public DateTime? FirstApprovalTime { get; set; }

        public long? DepartmentId { get; set; }

        public long? TraderId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public long? CommodityId { get; set; }

        public decimal Quantity { get; set; }

        public long? WeightUnitId { get; set; }

        public int? CropYear { get; set; }

        public int? CropYearTo { get; set; }

        public string PackingCode { get; set; }

        public ToleranceType ToleranceType { get; set; }

        public decimal? ToleranceMin { get; set; }

        public decimal? ToleranceMax { get; set; }

        public decimal? TolerancePourcentage { get; set; }

        public string ContractTerms { get; set; }

        public string ContractTermsLocation { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfDestination { get; set; }

        public DateTime DeliveryPeriodStartDate { get; set; }

        public DateTime DeliveryPeriodEndDate { get; set; }

        public int? PeriodTypeId { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        public int PositionMonthIndex { get; set; }

        public string Arbitration { get; set; }

        public int? MarketSectorId { get; set; }

        public PricingMethod PricingMethod { get; set; }

        public ContractInvoiceType ContractInvoiceTypeId { get; set; }

        public string PaymentTerms { get; set; }

        public long? PriceUnitId { get; set; }

        public decimal? Price { get; set; }

        public DateTime? BlDate { get; set; }

        public decimal PremiumDiscount { get; set; }

        public string CurrencyCode { get; set; }

        public string CounterpartyReference { get; set; }

        public decimal? ContractedValue { get; set; }

        public int PacksNumber { get; set; }

        public string Memorandum { get; set; }

        public IEnumerable<Cost> Costs { get; set; }

        public DiscountType? DiscountPremiumType { get; set; }

        public DiscountBasis? DiscountPremiumBasis { get; set; }

        public string DiscountPremiumCurrency { get; set; }

        public decimal? DiscountPremiumValue { get; set; }

        internal long PhysicalContractId { get; set; } // internal to avoid the exposure in Swagger

        public decimal? ToleranceValue { get; set; }

        public long SectionId { get; set; }

        public string SectionNumber { get; set; }

        public bool IsBLDateChanged { get; set; }

        public string InvoiceReference { get; set; }

        public SectionReference AllocatedTo { get; set; }

        public decimal PreviousQuantity { get; set; }

        public DateTime? LastDocumentIssuedDate { get; set; }

        public InvoicingStatus? InvoicingStatusId { get; set; }

        public CurrentTradeOption CurrentTradeOptionId { get; set; }

        public AllocateTradeOption AllocateTradeOptionId { get; set; }

        public decimal OriginalQuantity { get; set; }

        public bool IsCommodityChanged { get; set; }

        public bool IsPortOfOriginChanged { get; set; }

        public bool IsPortOfDestinationChanged { get; set; }

        public bool IsSplitCreated { get; set; }

        public DateTime? EstimatedMaturityDate { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public bool IsInterco { get; set; }

        public ContractType IntercoContractType { get; set; }

        public string IntercoCompanyId { get; set; } // internal to avoid the exposure in Swagger

        public string IntercoBuyerCode { get; set; }

        public string IntercoSellerCode { get; set; }

        public long? IntercoDepartmentId { get; set; }

        public long? IntercoTraderId { get; set; }

        public bool IsRemoveInterco { get; set; }

        public DateTime? ContractSentDate { get; set; }

        public DateTime? LastEmailReceivedDate { get; set; }

        public DateTime? ContractReturnedDate { get; set; }

        public IEnumerable<SectionDeprecated> ChildSections { get; set; }

        public IEnumerable<FieldsConfiguration> FieldsConfigurations { get; set; }
    }

    public class UpdatePhysicalFuturesOptionsPricedCommand : UpdatePhysicalContractCommand, IRequest
    {
        public string FixTypeCode { get; set; }

        public DateTime PromptMonthDate { get; set; }

        public int NumberOfLots { get; set; }
    }

    public class CreateTrancheCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public decimal Quantity { get; set; }

        public decimal OriginalQuantity { get; set; }

        public IEnumerable<SectionDeprecated> ChildSections { get; set; }
    }

    public class CreateSplitCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public decimal Quantity { get; set; }

        public decimal OriginalQuantity { get; set; }

        public IEnumerable<SectionDeprecated> ChildSections { get; set; }
    }

    public class SplitDetailsCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string CompanyId { get; set; }// internal to avoid the exposure in Swagger

        public long[] SectionIds { get; set; }

        public decimal Quantity { get; set; }

        public long? DataVersionId { get; set; }

        public string[] ContractedValues { get; set; }
    }

    public class BulkSplitDetailsCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string CompanyId { get; set; }// internal to avoid the exposure in Swagger

        public long SectionId { get; set; }

        public decimal[] Quantity { get; set; }

        public long? DataVersionId { get; set; }

        public string[] ContractedValues { get; set; }
    }

    public class IntercoValidationCommand : IRequest<IntercoValidation>
    {
        public IntercoValidation IntercoValidation { get; set; }
    }
}
