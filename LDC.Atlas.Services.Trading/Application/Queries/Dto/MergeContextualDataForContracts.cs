using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    /// <summary>
    /// For the contextextual data required to check the trade merge
    /// </summary>
    public class MergeContextualDataForContracts
    {
        public IEnumerable<TradeMergeMessageDto> TradeMergeMessages { get; set; }

        public IEnumerable<SectionDto> SectionContextualData { get; set; }

        public IEnumerable<CostDto> CostContextualData { get; set; }
    }
}
