using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class MandatoryTradeApprovalImageSetupDto
    {
        public int TradeSetupId { get; set; }

        public int FieldId { get; set; }

        public string FieldName { get; set; }

        public bool Mandatory { get; set; }

        public bool UnApproval { get; set; }

        public bool IsCopy { get; set; }

        public string FriendlyName { get; set; }
    }
}
