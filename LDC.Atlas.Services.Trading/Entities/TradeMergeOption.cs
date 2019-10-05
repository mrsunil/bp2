using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Entities
{
    /// <summary>
    /// Merge options used for trade merge
    /// </summary>
    public enum TradeMergeOption
    {
        ContractHeader = 1,
        ContractParent = 2,
        FirstSelectedSplit = 3,
    }
}
