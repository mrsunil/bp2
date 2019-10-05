using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class CashRevaluationJL
    {
        public int PostingStatusId { get; set; }

        public long AccountingId { get; set; }

        public long CashTypeId { get; set; }

        public int CompanyId { get; set; }

        public long TransactionDocumentId { get; set; }

        public int DataversionId { get; set; }

        public string MatchFlagCode { get; set; }

        public DateTime DocumentDate { get; set; }

        public decimal Amount { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public long DepartmentId { get; set; }

        public string CurrencyCode { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public long MatchFlagId { get; set; }

        public bool CreateADepartmentReval { get; set; }

        public bool CreateACurrencyReval { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public IEnumerable<CashDocumentMatching> CashDocumentMatchings { get; set; }
    }

    public class CashDocumentMatching
    {
        public long DepartmentId { get; set; }

        public decimal Amount { get; set; }

        public decimal FunctionalCcyAmount { get; set; }

        public decimal StatutoryCcyAmount { get; set; }
    }

    public class RevalGenerationDto
    {
        public bool CreateCurrencyReval { get; set; }

        public bool CreateDepartmentReval { get; set; }

        public IEnumerable<CashRevaluationJL> CashRevaluation { get; set; }
    }
}
