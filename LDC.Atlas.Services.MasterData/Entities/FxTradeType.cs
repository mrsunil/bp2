using System;
namespace LDC.Atlas.Services.MasterData.Entities
{
    public class FxTradeType
    {
        public int FxTradeTypeId { get; set; }

        public string Code { get; set; }

        public string MDMId { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public bool IsNdf { get; set; }

        public int NoOfDays { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
