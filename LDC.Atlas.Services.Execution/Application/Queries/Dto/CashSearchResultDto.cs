using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CashSearchResultDto : PaginatedItem
    {
        public long CashId { get; set; }

        public long TransactionDocumentId { get; set; }

        public int DataVersionId { get; set; }

        public int? CashTypeId { get; set; }

        //public string NominalBankAccountCode { get; set; }

        //public string BankAccountCode { get; set; }

        public int? TraxStatus { get; set; }

        //public int? InterfaceStatus { get; set; }

        public string OwnerName { get; set; }

        public string CounterpartyDocumentReference { get; set; }

        //public long? CounterPartyId { get; set; }

        public string CounterPartyCode { get; set; }

        //public long? PaymentCounterPartyId { get; set; }

        //public string PaymentCounterPartyCode { get; set; }

        public DateTime? ValueDate { get; set; }

        public decimal? Amount { get; set; }

        //public long? CharterId { get; set; }

        //public long? NominalAccountId { get; set; }

        public long? DepartmentId { get; set; }

        //public long? CostTypeId { get; set; }

        public string Narrative { get; set; }

        public bool? ToTransmitToTreasury { get; set; }

        public string CompanyId { get; set; }

        //public bool? UrgentPayment { get; set; }

        //public long? MatchingCounterpartyId { get; set; }

        public long? MatchingCashId { get; set; }

        //public string MatchingCurrency { get; set; }

        public decimal? MatchingAmount { get; set; }

        //public decimal? MatchingRate { get; set; }

        //public string MatchingRateType { get; set; }

        // public int? CashDocumentTypeId { get; set; }

        public string DocumentReference { get; set; }

        //public string TransactionDocumentType { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode { get; set; }

        public string NominalAccountCode { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string PostingStatus { get; set; }

        public string CostTypeCode { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public long CostDirectionId { get; set; }

        //public long? MatchFlagId { get; set; }

        //public int MatchingStatusId { get; set; }

        //public int Status { get; set; }

        public string ErrorMessage { get; set; }

        //public string MatchedDocumentReference { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        //public long? CounterPartyTransferId { get; set; }

        //public string InterfaceErrorMessage { get; set; }

        //public string PostingErrorMessage{ get; set; }

        public long? PaymentCashId { get; set; }

        //public int YearNumber { get; set; }

        //public int Year { get; set; }

        public string Department { get; set; }

        public string DocumentType { get; set; }

        public string CounterpartyCode { get; set; }

        public string CashDocumentType { get; set; }
    }
}
