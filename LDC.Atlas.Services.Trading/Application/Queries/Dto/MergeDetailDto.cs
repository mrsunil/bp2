using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    /// <summary>
    /// Information reuqired to check the business rule to enable/disable trade merge button
    /// </summary>
    public class MergeDetailDto
    {
        public bool HasChild { get; set; }

        public bool IsClosed { get; set; }

        public bool IsApproved { get; set; }

        public DateTime? BLDate { get; set; }

        public bool IsAllocated { get; set; }

        public bool IsInvoiced { get; set; }

        public bool HasCost { get; set; }

        public bool IsDisabled { get; set; }

        public IEnumerable<MergeCostDetailDto> Costs { get; set; }
    }
}
