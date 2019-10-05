using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CashSummaryDto
    {
        public long CashId { get; set; }

        public long TransactionDocumentId { get; set; }

        public int DataVersionId { get; set; }

        public int? CashTypeId { get; set; }

        public string NominalBankAccountCode { get; set; }

        public int? TraxStatus { get; set; }

        public string CounterPartyCode { get; set; }

        public string OwnerName { get; set; }

        public string CounterpartyDocumentReference { get; set; }

        public DateTime? ValueDate { get; set; }

        public decimal? Amount { get; set; }

        public long? CharterId { get; set; }

        public string CharterCode { get; set; }

        public long? DepartmentId { get; set; }

        public string Narrative { get; set; }

        public bool? ToTransmitToTreasury { get; set; }

        public string CompanyId { get; set; }

        public long? MatchingCashId { get; set; }

        public long? PaymentCashId { get; set; }

        public decimal? MatchingAmount { get; set; }

        public string DocumentReference { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode { get; set; }

        public string NominalAccountCode { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public int PostingStatus { get; set; }

        public string CostTypeCode { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public long CostDirectionId { get; set; }

        public string ErrorMessage { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
