using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Tags.Dto
{
    /// <summary>
    /// EntitiesBestMatchDto class.
    /// </summary>
    public class EntitiesBestMatchDto
    {
        public long EntityId { get; set; }
        /// <summary>
        /// EntityExternalId field.
        /// </summary>
        public string EntityExternalId { get; set; }

        /// <summary>
        /// BestMatch field.
        /// </summary>
        public int BestMatch { get; set; }
    }
}
