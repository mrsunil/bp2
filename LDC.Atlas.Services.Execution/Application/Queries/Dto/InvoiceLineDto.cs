using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceLineDto
    {
        public long InvoiceLineId { get; set; }

        public string PrincipalCommodity { get; set; }

        public decimal Quantity { get; set; }

        public decimal Price { get; set; }

        public long WeightUnitId { get; set; }

        public string WeightCode { get; set; }

        public long? SectionId { get; set; }

        public long? CostId { get; set; }

        public int LineNumber { get; set; }

        public long VATId { get; set; }

        public string VATCode { get; set; }

        public decimal LineAmount { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal VATAmount { get; set; }

        public decimal VATAmountInFunctionalCurrency { get; set; }

        public decimal VATAmountInStatutoryCurrency { get; set; }

        public decimal InvoicePercent { get; set; }

        public string ContractReference { get; set; }

        public decimal ContractQuantity { get; set; }

        public int ContractType { get; set; }

        public string CostDirection { get; set; }

        public string CostTypeCode { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string BusinessSectorCode { get; set; }
    }
}
