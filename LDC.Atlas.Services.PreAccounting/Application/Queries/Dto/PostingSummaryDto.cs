using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class PostingSummaryDto : PaginatedItem
    {
        public long AccountingId { get; set; }

        public string DocumentReference { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Amount { get; set; }

        public decimal Total { get; set; }

        public int DepartmentId { get; set; }

        public DateTime DocumentDate { get; set; }

        public int StatusId { get; set; }

        public string AssociatedAcc { get; set; }

        public string ErrorMessage { get; set; }

        public DateTime AuthorizedDate { get; set; }

        [JsonConverter(typeof(LocalIsoDateConverter))]
        public DateTime LocalAuthorizedDate { get; set; }

        public string AuthorizedBy { get; set; }

        public int InvoiceId { get; set; }

        public int CashId { get; set; }

        public int CostDirectionId { get; set; }

        public int InvoiceTypeId { get; set; }

        public int DataVersionId { get; set; }

        public string Province { get; set; }

        public string BranchCode { get; set; }
    }
}
