using System;
using System.Collections.Generic;
using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeCostGenerateMonthEndDto
    {
        public string CurrencyCode { get; set; }

        public string DepartmentCode { get; set; }

        public string CharterCode { get; set; }

        public string AssociatedClient { get; set; }

        public decimal FullValue { get; set; }

        public string CostType { get; set; }

        public decimal InvoicedAmount { get; set; }

        public DateTime? BLDate { get; set; }

        public decimal PercentageActualized { get; set; }

        public decimal Quantity { get; set; }

        public string ContractNumber { get; set; }

        public decimal AccrualNumber { get; set; }

        public string AccountNumber { get; set; }

        public string Description { get; set; }

        public long SectionId { get; set; }

        public long CostId { get; set; }

        public int? AccountLineTypeId { get; set; }

        public string PostingCostType { get; set; }

        public string DocumentReference { get; set; }

        public DateTime? DocumentDate { get; set; }

        [Column(Name = "InhouseExternal")]
        public string InhouseOrExternal {get; set; }

        public int? IsOriginal { get; set; }

        public string BusinessSectorCode { get; set; }

        public List<TradeMonthEndMappingErrorDto> TradeCostMonthEndMappingErrors { get; set; }
    }
}
