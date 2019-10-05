using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class BusinessSector
    {
        public long SectorId { get; set; }

        public string SectorCode { get; set; }

        public string DisplayName => SectorCode;

        public string MdmId { get; set; }

        public string Description { get; set; }

        public bool IsDeactivated { get; set; }

        public int? CostTypeId { get; set; }

        public string CompanyId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
