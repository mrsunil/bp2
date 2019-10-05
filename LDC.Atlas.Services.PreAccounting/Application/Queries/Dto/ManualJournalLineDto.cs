namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class ManualJournalLineDto
    {
        public long JournalLineId { get; set; }

        public long JournalDocumentId { get; set; }

        public long AccountReferenceId { get; set; }

        public string AccountReference { get; set; }

        public string ClientAccountCode { get; set; }

        public string AssociatedAccountCode { get; set; }

        public int AccountLineTypeId { get; set; }

        public long CostTypeId { get; set; }

        public string CostTypeCode { get; set; }

        public decimal Amount { get; set; }

        public string Narrative { get; set; }

        public long DepartmentId { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public long PhysicalContractId { get; set; }

        public string ContractSectionCode { get; set; }

        public long? CommodityId { get; set; }

        public decimal Quantity { get; set; }

        public string CostCenter { get; set; }

        public int? AccrualNumber { get; set; }

        public long? CharterId { get; set; }

        public string CompanyId { get; set; }

        public long? SectionId { get; set; }

        public string ExternalDocumentReference { get; set; }
    }
}
