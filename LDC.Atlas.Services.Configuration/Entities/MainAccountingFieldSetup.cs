using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class MainAccountingFieldSetup
    {
        public long? MainAccountingSetupId { get; set; }

        public long TableId { get; set; }

        public string FieldId { get; set; }

        public string FieldName { get; set; }

        public bool? IsMandatory { get; set; }

        public bool? IsEditable { get; set; }

    }
}
