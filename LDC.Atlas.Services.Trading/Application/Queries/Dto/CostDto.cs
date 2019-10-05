using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Entities;
using System;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class CostDto
    {
        public long CostId { get; set; }

        public string RowStatus { get; set; }

        public long SectionId { get; set; }

        public string CostTypeCode { get; set; }

        public string SupplierCode { get; set; }

        public string CurrencyCode { get; set; }

        public int RateTypeId { get; set; }

        public decimal Rate { get; set; }

        public string Narrative { get; set; }

        public bool InPL { get; set; }

        public bool NoAction { get; set; }

        public long? PriceUnitId { get; set; }

        public int CostDirectionId { get; set; }

        [Column(Name = "OrigEstPMT")]
        public decimal? OriginalEstimatedPMTValue { get; set; }

        [Column(Name = "OrigEstRateTypeId")]
        public int? OriginalEstRateTypeId { get; set; }

        [Column(Name = "OrigEstPriceUnitId")]
        public long? OriginalEstPriceUnitId { get; set; }

        [Column(Name = "OrigEstCurrencyCode")]
        public string OriginalEstCurrencyCode { get; set; }

        [Column(Name = "OrigEstRate")]
        public decimal? OriginalEstRate { get; set; }

        public short InvoiceStatus { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string DocumentReference { get; set; }

        public DateTime? DocumentDate { get; set; }

        public decimal InvoicePercent { get; set; }

        public string CostMatrixName { get; set; }

        public long? CostTypeId { get; set; }

        public long? SupplierId { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsNewCost { get; set; }

        public InvoicingStatus InvoicingStatusId { get; set; }
    }
}
