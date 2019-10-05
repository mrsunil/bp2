using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class MergeContracts
    {
        public long MergeToSectionId { get; set; }

        public IEnumerable<long> MergeFromSectionIds { get; set; }

        public TradeMergeOption MergeOption { get; set; }

        public decimal Quantity { get; set; }

        public decimal ContractedValue { get; set; }
    }
}
