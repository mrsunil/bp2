using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class AllocationSetUp
    {
        public int? AllocationFieldSetupId { get; set; }

        public int TradeSetupId { get; set; }

        public int FieldId { get; set; }

        public string FieldName { get; set; }

        public bool DifferenceBlocking { get; set; }

        public bool DifferenceWarning { get; set; }

    }
}
