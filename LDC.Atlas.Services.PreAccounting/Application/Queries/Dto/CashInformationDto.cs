using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class CashInformationDto
    {
        public long CashId { get; set; }

        public string CounterpartyCode { get; set; }

        /// <summary>
        /// Gets or sets code of the counterparty associated to the payment. Filled in only for cash by picking for different customer.
        /// </summary>
        public string PaymentCounterpartyCode { get; set; }

        public decimal Amount { get; set; }

        public long DepartmentId { get; set; }

        public long? CharterId { get; set; }

        public string CounterpartyDocumentReference { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime ValueDate { get; set; }

        public int CashTypeId { get; set; }

        public string Narrative { get; set; }

        public string Currency { get; set; }

        public string Payee { get; set; }

        public string BankAccount { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string CostTypeCode { get; set; }

        public string MatchingCCY { get; set; }

        public long? MatchingCashId { get; set; }

        public string CashDocRef { get; set; }

        public decimal MatchingAmount { get; set; }

        public decimal MatchingRate { get; set; }

        public string MatchingRateType { get; set; }

        public long? PaymentTransactionDocumentId { get; set; }

        public IEnumerable<AdditionalCostsDto> AdditionalCosts { get; set; }

        public IEnumerable<SecondaryReferenceDto> SecondaryReferencesForCashByPicking { get; set; }

        public IEnumerable<DocumentMatchingDto> DocumentMatchingsForCashByPicking { get; set; }

        public string NominalAccount { get; set; }

        public IEnumerable<CashLineDto> CashLines { get; set; }
    }
}
