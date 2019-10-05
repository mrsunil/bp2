using LDC.Atlas.Services.PreAccounting.Entities;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class MonthEndTALineDto
    {
        public long TemporaryAdjustmentLineId { get; set; }

        public long TemporaryAdjustmentId { get; set; }

        public int AccrualNumber { get; set; }

        public long? SectionId { get; set; }

        public long? CostId { get; set; }

        public decimal? Amount { get; set; }

        public decimal? Quantity { get; set; }

        public string CostTypeCode { get; set; }

        public long? DepartmentId { get; set; }

        public string ContractSectionCode { get; set; }

        public long? CommodityId { get; set; }

        public long? CharterId { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string NominalAccount { get; set; }

        public AccountingDocumentLineType NominalOrClientLeg { get; set; }

        public DateTime? BLDate { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string BusinessSectorCode { get; set; }

        public string BusinessSectorCostTypeCode { get; set; }

        public long BusinessSectorCostTypeId { get; set; }

        public string BusinessSectorNominalAccountCode { get; set; }

        public ReportType ReportTypeId { get; set; }

        public long? FxDealId { get; set; }

        public string Reference { get; set; }

        public string CurrencyCouple { get; set; }

        public string InvoiceDocumentReference { get; set; }
    }
}
