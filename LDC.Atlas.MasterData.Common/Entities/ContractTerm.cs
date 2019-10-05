using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class ContractTerm
    {
        public string ContractTermCode { get; set; }

        public string MDMId { get; set; }

        public string Description { get; set; }

        public string DisplayName => ContractTermCode;

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public long ContractTermId { get; set; }
    }
}
