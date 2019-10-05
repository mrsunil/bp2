using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class TransactionReportSearchDto : PaginatedItem
    {
        public string ClientAccount { get; set; }

        public string AccountTitle { get; set; }

        public string DocumentReference { get; set; }

        public int? PostingLineId { get; set; }

        public string NominalAccount { get; set; }

        public string MatchFlag { get; set; }

        public string ClientReference { get; set; }

        public string CostType { get; set; }

        public string CostCenter { get; set; }

        public string DmsId { get; set; }

        public decimal? TransactionalCurrency { get; set; }

        public string Department { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string PaymentTerms { get; set; }

        public string ContractRef { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string Currency { get; set; }

        public string Period { get; set; }

        public DateTime? DocumentDate { get; set; }

        public DateTime? ValueDate { get; set; }

        public DateTime? PostedDate { get; set; }

        public decimal? FunctionalCurrency { get; set; }

        public decimal? StatutoryCcyAmount { get; set; }

        public string SecurePayment { get; set; }

        public decimal? VatTurnover { get; set; }

        public string AccountCategory { get; set; }

        public string Province { get; set; }

        public string PreMatchDocRef { get; set; }

        public string InterfaceStatus { get; set; }

        public string OriginalReferenceId { get; set; }

        public string Payee { get; set; }

        public decimal? ROE { get; set; }

        public string ROEType { get; set; }

        public string Commodity { get; set; }

        public int? AccuralNumber { get; set; }

        public string BackOfficeDocId { get; set; }

        public DateTime? GLDate { get; set; }

        public DateTime? BackOfficePostingDate { get; set; }

        public string DocumentType { get; set; }

        public string PaymentTraxId { get; set; }

        public string PostedTime { get; set; }

        public string SetupUser { get; set; }

        public DateTime? SetupDate { get; set; }

        public string SetupTime { get; set; }

        public DateTime? OriginalValueDate { get; set; }

        public string VATCode { get; set; }

        public DateTime? PaymentMatchDate { get; set; }

        public string MatchTime { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }

        public string Narrative { get; set; }

        public string InhouseExternal { get; set; }

        public string AccountLineType { get; set; }

        public string AccountType { get; set; }

        public string Charter { get; set; }

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

        public string Weight { get; set; }

        public int? MDMId { get; set; }

        public string CounterpartyCode { get; set; }

        public string CounterpartyType { get; set; }

        public string Name { get; set; }

        public string TradeStatus { get; set; }

        public string Status { get; set; }

        public int? HeadOfFamily { get; set; }

        public string CountryCode { get; set; }

        public string ClientProvince { get; set; }

        public string C2CCode { get; set; }

        public string VATRegistrationNumber { get; set; }

        public string FiscalRegistrationNumber { get; set; }

        public string MDMCategoryCode { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string City { get; set; }

        public string ZIPCode { get; set; }

        public DateTime? AccountingPeriod { get; set; }

        public int? TechnicalID { get; set; }

        public int? NominalMDMID { get; set; }

        public string AccountNumber { get; set; }

        public string MainAccountTitle { get; set; }

        public string DetailAccountTitle { get; set; }

        public string AccType { get; set; }

        public string BankAcc { get; set; }

        public string CustVendor { get; set; }

        public string AlternativeAccount { get; set; }

        public string AlternativeDescription { get; set; }

        public string OtherAlternativeAccount { get; set; }

        public string REVALXRequired { get; set; }

        public string IncInCCYEXP { get; set; }

        public string InterfaceBankCode { get; set; }

        public DateTime? Datelastposted { get; set; }

        public string Inactive { get; set; }

        public long AccountingDocumentLineId { get; set; }

        public string ToPayToReceive { get; set; }

        public decimal OriginalAmount { get; set; }

        public string BranchCode { get; set; }
    }
}
