using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class ContractToBeInvoicedSearchResultDto
    {
        [Column(Name = "PhysicalContractId")]
        public long ContractID { get; set; }

        [Column(Name = "SectionId")]
        public long SectionID { get; set; }

        public string ContractLabel { get; set; }

        [Column(Name = "Counterparty")]
        public string SellerCode { get; set; }

        public long CommodityId { get; set; }

        [Column(Name = "ContractTermCode")]
        public string ContractTerms { get; set; }

        [Column(Name = "Charter")]
        public string CharterReference { get; set; }

        public string Price { get; set; }

        [Column(Name = "AllocatedTo")]
        public string AllocatedContract { get; set; }

        public decimal Quantity { get; set; }

        public decimal QuantityToInvoice { get; set; }

        public long WeightUnitId { get; set; }

        [Column(Name = "CurrencyCode")]
        public string Currency { get; set; }

        [Column(Name = "PaymentTermCode")]
        public string PaymentTerms { get; set; }

        public long PriceUnitId { get; set; }

        [Column(Name = "PricingMethodId")]
        public PricingMethod PricingMethod { get; set; }
    }
}
