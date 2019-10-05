using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class FxSettlementLineDto
    {
        public long FxSettlementLineId { get; set; }

        public long FxSettlementId { get; set; }

        public int AccrualNumber { get; set; }

        public long? SectionId { get; set; }

        public long? CostId { get; set; }

        public decimal? Amount { get; set; }

        public decimal? Quantity { get; set; }

        public string CostTypeCode { get; set; }

        public long? DepartmentId { get; set; }

        public string ContractSectionCode { get; set; }

        public long? CommodityId { get; set; }

        public string CommodityName { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string NominalAccount { get; set; }

        public AccountLineType AccountLineType { get; set; }

        public DateTime? BLDate { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
