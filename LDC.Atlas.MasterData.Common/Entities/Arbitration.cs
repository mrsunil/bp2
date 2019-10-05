using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Arbitration
    {
        public long ArbitrationId { get; set; }

        public string ArbitrationCode { get; set; }

        public string Description { get; set; }

        public string DisplayName => ArbitrationCode;

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
