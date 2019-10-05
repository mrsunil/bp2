using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class ContractTerm
    {
        public long ContractTermId { get; set; }

        public string MDMId { get; set; }

        public string ContractTermCode { get; set; }

        public string Description { get; set; }

        public bool GopInvNoBl { get; set; }

        public bool GosInvNoBl { get; set; }

        public bool GosInvNoAlloc { get; set; }

        public string DisplayName => ContractTermCode;

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
