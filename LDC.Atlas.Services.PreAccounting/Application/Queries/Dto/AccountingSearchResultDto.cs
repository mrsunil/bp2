using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class AccountingSearchResultDto : PaginatedItem
    {
        public int DataVersionId { get; set; }

        public string DocumentReference { get; set; }

        public string SecondaryReference { get; set; }

        public string ClientReference { get; set; }

        public string CostType { get; set; }

        public int? DmsId { get; set; }

        public string Department { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string PaymentTerm { get; set; }

        public string PhysicalContractCode { get; set; }

        public string ContractSectionCode { get; set; }

        public DateTime? ValueDate { get; set; }

        public decimal? Weight { get; set; }

        public string Province { get; set; }

        public string Payee { get; set; }

        public decimal? ROE { get; set; }

        public string RoeType { get; set; }

        public string Commodity { get; set; }

        public string Narrative { get; set; }

        public string AccountLineType { get; set; }

        public string Charter { get; set; }

        public DateTime? DocumentDate { get; set; }

        public int? PostingLineId { get; set; }

        public int? AccountingDocumentId { get; set; }

        public string NomAccount { get; set; }

        public string MatchFlag { get; set; }

        public decimal? Amount { get; set; }

        public string CurrencyCode { get; set; }

        public string AccountingPeriod { get; set; }

        public DateTime? PostedDate { get; set; }

        public decimal? FunctionalCurrency { get; set; }

        public decimal? StatutoryCurrency { get; set; }

        public string SecurePayment { get; set; }

        public decimal? VatTurnover { get; set; }

        public string AccountCategory { get; set; }

        public string PreMatch { get; set; }

        public string InterfaceStatus { get; set; }

        public string OriginalReferenceId { get; set; }

        public int? AccuralNumber { get; set; }

        public string BackOfficeDocId { get; set; }

        public DateTime? GlDate { get; set; }

        public DateTime? BackOfficePostingDate { get; set; }

        public string DocumentType { get; set; }

        public string PostedTime { get; set; }

        public string SetupUser { get; set; }

        public DateTime? SetupDate { get; set; }

        public string SetupTime { get; set; }

        public DateTime? OriginalValueDate { get; set; }

        public string VatCode { get; set; }

        public DateTime? MatchDate { get; set; }

        public string MatchTime { get; set; }

        public string InhouseExternal { get; set; }

        public string ContractCommodityDescription { get; set; }

        public string ContractCommodityType { get; set; }

        public string ContractIncoTerms { get; set; }

        public DateTime? ContractBLDate { get; set; }

        public string ClientGroupAccount { get; set; }

        public int? ContractGroupNumber { get; set; }

        public string ContractPortOrigin { get; set; }

        public string ContractPortDestination { get; set; }

        public string ContractIntercomPort { get; set; }

        public string ContractShippingPeriod { get; set; }

        public string ContractTrader { get; set; }

        public string ContractVessel { get; set; }

        public string ContractVesselImo { get; set; }

        public DateTime? AccountingDate { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }

        public string PaymentTraxId { get; set; }

        public string CostCenter { get; set; }

        public string ClientAccount { get; set; }

        public long SectionId { get; set; }

        public long InvoiceId { get; set; }

        public long InvoiceTypeId { get; set; }

        public long CashId { get; set; }

        public long CostDirectionId { get; set; }

        public long OriginalInvoiceTypeId { get; set; }

        public string BusinessSector { get; set; }

        public long OriginalInvoiceId { get; set; }

        public long TransactionDocumentId { get; set; }

        public string BranchCode { get; set; }
    }
}
