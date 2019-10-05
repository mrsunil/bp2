using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    /// <summary>
    /// This Entity is used hold accounting parameters details in IT parameters tab in company creation/update module
    /// while creating/updating company functionlity.
    /// </summary>
    public class AccountingParameter
    {
        public long? TransactionDocumentTypeCompanySetupId { get; set; }

        public int Company { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public int NextNumber { get; set; }

        public int Year { get; set; }
    }
}
