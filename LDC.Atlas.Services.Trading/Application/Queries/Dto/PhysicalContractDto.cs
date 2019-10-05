using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class PhysicalContractDtoDeprecated : SectionDto
    {
        public long PhysicalContractId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int CreatedByUserId { get; set; }

        public int ModifiedByUserId { get; set; }
    }

    public class PhysicalContractDto
    {
        public long PhysicalContractId { get; set; }

        public int PhysicalContractNumberId { get; set; }

        public int Type { get; set; }

        public DateTime ContractDate { get; set; }

        public decimal ContractQuantity { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int DataVersionId { get; set; }

        public long? TraderId { get; set; }

        public IEnumerable<SectionReferenceDto> Sections { get; set; }
    }
}
