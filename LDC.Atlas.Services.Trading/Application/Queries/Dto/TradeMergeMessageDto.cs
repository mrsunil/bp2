using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    /// <summary>
    /// Information about the blocking/warning messages for trade merge as per the business rules
    /// </summary>
    public class TradeMergeMessageDto
    {
        public long SectionId { get; set; }

        public string ContractSectionCode { get; set; }

        public IEnumerable<string> BlockingOrWarningInput { get; set;  }

        public bool IsBlocking { get; set; }

        public bool IsWarning { get; set; }

    }
}
