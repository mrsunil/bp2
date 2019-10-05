using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    /// <summary>
    /// This DTO is used hold accountingParameter details in IT parameters tab in  company creation/update module.
    /// </summary>
    public class AccountingParameterDto
    {
        public string Company { get; set; }

        public int? TransactionDocumentTypeId { get; set; }

        public int? Year { get; set; }

        public int? NextNumber { get; set; }

        public long? TransactionDocumentTypeCompanySetupId { get; set; }
    }
}