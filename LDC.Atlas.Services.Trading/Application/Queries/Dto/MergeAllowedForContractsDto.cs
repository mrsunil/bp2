using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    /// <summary>
    /// Returns information to enable/disable the trade merge button along the message 
    /// </summary>
    public class MergeAllowedForContractsDto
    {
        public bool IsAllowed { get; set; }

        public string Message { get; set; }
    }
}
