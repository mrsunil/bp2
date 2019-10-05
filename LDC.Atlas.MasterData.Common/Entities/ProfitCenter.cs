using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class ProfitCenter
    {
        public long ProfitCenterId { get; set; }

        public string MdmId { get; set; }

        public string ProfitCenterCode { get; set; }

        public string Description { get; set; }

        public string AltCode { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
