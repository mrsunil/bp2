using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
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

        public long? NominalAccountId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public bool IsACashCost { get; set; }

        public string OtherAcc { get; set; }

        public string OtherAccUse { get; set; }

        public string ClientControl { get; set; }

        public bool Freight { get; set; }

        public bool InStock { get; set; }

        public string Accrue { get; set; }

        public string ObjectCode { get; set; }

        public bool IsDeactivated { get; set; }

        public bool BackOff { get; set; }

        public string InterfaceCode { get; set; }

        public string SectionCode { get; set; }

        public bool Insurance { get; set; }

        public string AltCode { get; set; }

        public bool IsATradeCost { get; set; }

        public bool IsACommission { get; set; }

     }
}
