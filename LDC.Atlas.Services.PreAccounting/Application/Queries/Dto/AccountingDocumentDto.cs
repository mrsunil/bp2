using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class AccountingDocumentDto : PaginatedItem
    {
        public long AccountingId { get; set; }

        public string DocumentReference { get; set; }

        public DateTime DocumentDate { get; set; }

        public PostingStatus StatusId { get; set; }

        public string ErrorMessage { get; set; }

        public DateTime? ValueDate { get; set; }

        public DateTime? OriginalValueDate { get; set; }

        public DateTime? GLDate { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public string CurrencyCode { get; set; }

        public DocumentType TransactionDocumentTypeId { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public long? ProvinceId { get; set; }

        public long? OriginalReferenceId { get; set; }

        public decimal? Roe { get; set; }

        public string RoeType { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime AccountingDate { get; set; }

        public bool ToInterface { get; set; }

        public int? DmsId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int TATypeId { get; set; }

        public IEnumerable<AccountingDocumentLineDto> AccountingDocumentLines { get; set; }
    }
}
