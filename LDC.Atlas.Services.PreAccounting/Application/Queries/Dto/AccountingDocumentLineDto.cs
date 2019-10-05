using LDC.Atlas.Application.Core.Entities;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class AccountingDocumentLineDto : PaginatedItem
    {
        public decimal Amount { get; set; }

        public long AccountingDocumentId { get; set; }

        public long AccountingDocumentLineId { get; set; }

        public string AccountReference { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string AccountLineType { get; set; }

        public int? CostTypeId { get; set; }

        public decimal? StatutoryCurrency { get; set; }

        public decimal? FunctionalCurrency { get; set; }

        public string Narrative { get; set; }

        public int DepartmentId { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string ExtDocReference { get; set; }

        public string ClientReference { get; set; }

        public long? CommodityId { get; set; }

        public decimal? Quantity { get; set; }

        public long? CharterId { get; set; }

        public string CostCenter { get; set; }

        public int? PaymentTermId { get; set; }

        public int? VATId { get; set; }

        public int? AccrualNumber { get; set; }

        public string AccountingCategory { get; set; }

        public string SectionReference { get; set; }

        public int? ClientAccountId{ get; set; }

        public int AccountLineTypeId { get; set; }

        public int? PostingLineNumber { get; set; }
        
        public int AccountingCategoryId { get; set; }

        public int? JournalLineId { get; set; }

        public int? ProvinceId { get; set; }

        public string SettlementCurrency { get; set; }

        public string DealNumber { get; set; }
    }
}
