using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class WeightUnit
    {
        public long WeightUnitId { get; set; }

        public string MdmId { get; set; }

        public string WeightCode { get; set; }

        public string Description { get; set; }

        public string DisplayName => WeightCode;

        public int DecimalNbr { get; set; }

        public decimal ConversionFactor { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
