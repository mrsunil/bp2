using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    /// <summary>
    /// This DTO is used hold trade parameters details in IT parameters tab in  company creation/update module.
    /// </summary>
    public class TradeParameterDto
    {
        public string CompanyId { get; set; }

        public int? ContractTypeCompanySetupId { get; set; }

        public int ContractTypeCode { get; set; }

        public int? NextNumber { get; set; }
    }
}
