using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class MandatoryTradeApprovalImageSetup
    {
        public int TradeSetupId { get; set; }

        public int FieldId { get; set; }

        public string FieldName { get; set; }

        public bool Mandatory { get; set; }

        public bool UnApproval { get; set; }

        public bool IsCopy { get; set; }
    }
}
