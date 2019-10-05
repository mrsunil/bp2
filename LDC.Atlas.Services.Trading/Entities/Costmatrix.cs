using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class CostMatrix
    {
        public long CostMatrixId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<CostMatrixLine> CostMatrixLines { get; set; }
    }
}
