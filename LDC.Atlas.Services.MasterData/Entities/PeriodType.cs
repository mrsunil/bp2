using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class PeriodType
    {
        [Column(Name = "EnumEntityId")]
        public int PeriodTypeId { get; set; }

        [Column(Name = "EnumEntityValue")]
        public string PeriodTypeCode { get; set; }

        [Column(Name = "EnumEntityDescription")]
        public string PeriodTypeDescription { get; set; }

        public string Description => PeriodTypeDescription;

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
