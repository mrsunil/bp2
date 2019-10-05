using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    /// <summary>
    /// AccountingDocumentLine Entity
    /// </summary>
    public class AccountingDocumentLine
    {
        public long AccountingDocumentId { get; set; }

        public long? AccountingDocumentLineId { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string PaymentTermCode { get; set; }

        public long? PaymentTermId { get; set; }

        public string PhysicalContractCode { get; set; }

        public string ContractSectionCode { get; set; }

        public long PostingLineId { get; set; }

        public decimal? Quantity { get; set; }

        public decimal? VATTurnover { get; set; }

        public string AccountReference { get; set; }

        public long? CommodityId { get; set; }

        public string VATCode { get; set; }

        public string ClientReference { get; set; }

        public string Narrative { get; set; }

        public int AccountLineTypeId { get; set; }

        public long? CharterId { get; set; }

        public string CostTypeCode { get; set; }

        public long? CostTypeId { get; set; }

        public decimal Amount { get; set; }

        public long? DepartmentId { get; set; }

        public string CompanyId { get; set; }

        public int AccountingCategoryId { get; set; }

        public long? SectionId { get; set; }

        public long? SourceFxDealId { get; set; }

        public decimal? FunctionalCurrency { get; set; }

        public decimal? StatutoryCurrency { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string CostCenter { get; set; }

        public int? AccrualNumber { get; set; }

        public long? AccountReferenceId { get; set; }

        public long? ClientAccountId { get; set; }

        public long? AssociatedAccountId { get; set; }
        
        public long? VatId { get; set; }

        public string ClientAccount { get; set; }

        public string ClientAccountCode { get; set; }

        public long? JournalLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the line of the journal entry in Preaccounting.ManualJournalLine this accounting line
        /// is linked to.
        /// This field is exclusive with SourceInvoiceId and SourceCashLineId
        /// </summary>
        public long? SourceJournalLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the invoice record this accounting line is referring
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with SourceJournalLineId and SourceCashLineId
        /// </summary>
        public long? SourceInvoiceId { get; set; }

        /// <summary>
        /// Gets or sets iD of the invoice LINE record this accounting line is referring
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with SourceJournalLineId and SourceCashLineId
        /// </summary>
        public long? SourceInvoiceLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the cost LINE record this accounting line is referring
        /// </summary>
        public long? SourceCostLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the cash record line this accounting line is linked with.
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with SourceJournalLineId and SourceInvoiceId
        /// </summary>
        public long? SourceCashLineId { get; set; }

        public long? TransactionDocumentId { get; set; }

        /// <summary>
        /// Information used at the creation of the accounting document,
        /// to link a line with its document header (we can create several
        /// accounting document in just one call)
        /// </summary>
        public int? GroupId { get; set; }

        public string DealNumber { get; set; }

        public string SettlementCurrency { get; set; }

        public int? ProvinceId { get; set; }

        /// <summary>
        /// Gets or sets iD of the month end TA record this accounting line is referring
        /// </summary>
        public long? SourceTALineId { get; set; }

        public IEnumerable<ItemConfigurationPropertiesDto> FieldsConfigurations { get; set; }
    }
}
