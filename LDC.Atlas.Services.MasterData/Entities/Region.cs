﻿using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Region
    {
        public long LdcRegionId { get; set; }

        public string MdmId { get; set; }

        public string LdcRegionCode { get; set; }

        public string Description { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
