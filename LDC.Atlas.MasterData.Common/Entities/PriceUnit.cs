using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class PriceUnit
    {
        public long PriceUnitId { get; set; }

        public string MdmId { get; set; }

        public string PriceCode { get; set; }

        public string Description { get; set; }

        public int DecimalNbr { get; set; }

        public decimal ConversionFactor { get; set; }

        public bool IsDeactivated { get; set; }

        public string DisplayName => PriceCode;

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
