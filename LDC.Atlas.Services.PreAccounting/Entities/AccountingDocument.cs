using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class AccountingDocument
    {
        public long AccountingId { get; set; }

        public long TransactionDocumentId { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime? ValueDate { get; set; }

        public DateTime? AcknowledgementDate { get; set; }

        public long? ProvinceId { get; set; }

        public long? OriginalReferenceId { get; set; }

        public decimal? Roe { get; set; }

        public string RoeType { get; set; }

        public DateTime? GLDate { get; set; }

        public string DocumentType { get; set; }

        public DateTime OriginalValueDate { get; set; }

        public DateTime AccountingDate { get; set; }

        public PostingStatus? StatusId { get; set; }

        public string ErrorMessage { get; set; }

        public string CreatedBy { get; set; }

        public int? DmsId { get; set; }

        public long UserCreator { get; set; }

        public IEnumerable<AccountingDocumentLine> AccountingDocumentLines { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public bool ToInterface { get; set; }

        public string DocumentReference { get; set; }

        public int? AccrualNumber { get; set; }

        public DateTime? DocumentDateForReversal { get; set; }

        public AccountingDocument ShallowCopy()
        {
            return (AccountingDocument)this.MemberwiseClone();
        }
    }
}
