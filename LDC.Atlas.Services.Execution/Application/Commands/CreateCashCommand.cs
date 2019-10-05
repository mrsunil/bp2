using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class CreateCashCommand : IRequest<Cash>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public long CashId { get; set; }

        public long CostDirectionId { get; set; }

        public long CashTypeId { get; set; }

        public string DocumentReference { get; set; }

        public long DocumentId { get; set; }

        public string CounterPartyCode { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime ValueDate { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Amount { get; set; }

        public long? CharterId { get; set; }

        public string NominalAccountCode { get; set; }

        public long DepartmentId { get; set; }

        public long Status { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string Consignee { get; set; }

        public string TransactionDocumentType { get; set; }

        public long TransactionDocumentId { get; set; }

        public long? NominalBankAccountCode { get; set; }

        public string OwnerName { get; set; }

        public string CounterPartyDocumentReference { get; set; }

        public string Narrative { get; set; }

        public bool ToTransmitToTreasury { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public ICollection<CashAdditionalCost> AdditionalCostDetails { get; set; }

        public string CostTypeCode { get; set; }

        public int YearNumber { get; set; }

        public int Year { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public long ChildCashTypeId { get; set; }

        public string BankAccountCode { get; set; }

        public bool UrgentPayment { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public string DifferentCounterpartyCode { get; set; }

        public long? MatchingCashId { get; set; }

        public string MatchingCurrency { get; set; }

        public decimal MatchingAmount { get; set; }

        public decimal MatchingRate { get; set; }

        public string MatchingRateType { get; set; }

        public int MatchingStatusId { get; set; }

        public long? MatchFlagId { get; set; }

        public bool IsPrematch { get; set; }

        public decimal AmountToBePaid { get; set; }

        public string MatchedDocumentReference { get; set; }

        public int MatchedYeanNumber { get; set; }

        public string PaymentCounterpartyCode { get; set; }

        public string Template { get; set; }

        public bool IsDraft { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public decimal? FunctionalToStatutoryCurrenyRate { get; set; }

        public string FunctionalToStatutoryCurrencyRoeType { get; set; }

        public string CashCurrencyCode { get; set; }

        public string CashCurrencyRoeType { get; set; }

        public decimal? CashCurrencyRate { get; set; }

        public long? MatchingCounterpartyId { get; set; }

        public long? PaymentCounterpartyId { get; set; }

        public long? CounterPartyTransferId { get; set; }
    }

    public class UpdateCashCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public long CashId { get; set; }

        public long CostDirectionId { get; set; }

        public long CashTypeId { get; set; }

        public string DocumentReference { get; set; }

        public long DocumentId { get; set; }

        public string CounterPartyCode { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime ValueDate { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Amount { get; set; }

        public long? CharterId { get; set; }

        public string NominalAccountCode { get; set; }

        public long DepartmentId { get; set; }

        public long Status { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string Consignee { get; set; }

        public string TransactionDocumentType { get; set; }

        public long TransactionDocumentId { get; set; }

        public long? NominalBankAccountCode { get; set; }

        public string OwnerName { get; set; }

        public string CounterPartyDocumentReference { get; set; }

        public string Narrative { get; set; }

        public bool ToTransmitToTreasury { get; set; }

        public long PhysicalDocumentId { get; set; }

        public string CostTypeCode { get; set; }

        public int YearNumber { get; set; }

        public int Year { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public IEnumerable<CashAdditionalCost> AdditionalCostDetails { get; set; }

        public long ChildCashTypeId { get; set; }

        public string BankAccountCode { get; set; }

        public bool UrgentPayment { get; set; }

        public ICollection<CashMatching> CashMatchingDetails { get; set; }

        public string DifferentCounterpartyCode { get; set; }

        public long? MatchingCashId { get; set; }

        public string MatchingCurrency { get; set; }

        public decimal MatchingAmount { get; set; }

        public decimal MatchingRate { get; set; }

        public string MatchingRateType { get; set; }

        public int MatchingStatusId { get; set; }

        public long? MatchFlagId { get; set; }

        public bool IsPrematch { get; set; }

        public decimal AmountToBePaid { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public string MatchedDocumentReference { get; set; }

        public int MatchedYeanNumber { get; set; }

        public string PaymentCounterpartyCode { get; set; }

        public string Template { get; set; }

        public bool IsDraft { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public decimal? FunctionalToStatutoryCurrenyRate { get; set; }

        public string FunctionalToStatutoryCurrencyRoeType { get; set; }

        public string CashCurrencyCode { get; set; }

        public string CashCurrencyRoeType { get; set; }

        public decimal? CashCurrencyRate { get; set; }

        public long? MatchingCounterpartyId { get; set; }

        public long? PaymentCounterpartyId { get; set; }

        public long? CounterPartyTransferId { get; set; }
    }

    public class DeleteCashCommand : IRequest
    {
        public string Company { get; set; }

        public long CashId { get; set; }
    }

    public class UpdateCashDocumentCommand : IRequest<PhysicalDocumentReferenceDto>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long CashId { get; set; } // internal to avoid the exposure in Swagger

        public long DraftDocumentId { get; set; }

        public int PhysicalDocumentId { get; set; }

        public string DocumentTemplatePath { get; set; }
    }
}
