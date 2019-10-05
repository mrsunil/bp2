﻿using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class CostLine
    {
        public long CostId { get; set; }

        public long SectionId { get; set; }

        public string CostTypeCode { get; set; }

        public string Description { get; set; }

        public string SupplierCode { get; set; }

        public int CostDirectionId { get; set; }

        public string CurrencyCode { get; set; }

        public int RateTypeId { get; set; }

        public long? PriceUnitId { get; set; }

        [Column(Name = "Rate")]
        public decimal Rate { get; set; }

        [Column(Name = "InPL")]
        public bool InPNL { get; set; }

        [Column(Name = "NoAct")]
        public bool NoAction { get; set; }

        public short InvoiceStatus { get; set; }

        public string Narrative { get; set; }

        public long CostMatrixLineId { get; set; }

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

        public string CompanyId { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ContextInformation { get; set; }

        public bool IsDraft { get; internal set; }
    }
}
