using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class TransactionDocumentSearchResultDto : PaginatedItem
    {
        public int DataVersionId { get; set; }

        public long AccountingId { get; set; }

        public string DocRef { get; set; }

        public string AccRef { get; set; }

        public string Currency { get; set; }

        public DateTime AccPeriod { get; set; }

        public decimal Amount { get; set; }

        public string ContractNumber { get; set; }

        public string Department { get; set; }

        public DateTime DocDate { get; set; }

        public string Status { get; set; }

        public string AssociatedAcc { get; set; }

        public DateTime AuthorizedOn { get; set; }

        public string AuthorizedAt { get; set; }

        public string AuthorizedBy { get; set; }
    }
}
