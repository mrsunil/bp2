using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class CostType
    {
        public string CostTypeCode { get; set; }

        public int CostTypeId { get; set; }

        public string DisplayName => CostTypeCode;

        public string Name { get; set; }

        [Column(Name = "NoAct")]
        public bool NoAction { get; set; }

        [Column(Name = "InPL")]
        public bool InPNL { get; set; }

        public string NominalAccountCode { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string OtherAcc { get; set; }

        public long? NominalAccountId { get; set; }

        public bool IsATradeCost { get; set; }

    }
}
