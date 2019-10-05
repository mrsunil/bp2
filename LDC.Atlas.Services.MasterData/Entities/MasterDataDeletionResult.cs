using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class MasterDataDeletionResult
    {
        public long Id { get; set; }

        public string Code { get; set; }

        public MasterDataOperationStatus MasterDataOperationStatus { get; set; }
    }
}
