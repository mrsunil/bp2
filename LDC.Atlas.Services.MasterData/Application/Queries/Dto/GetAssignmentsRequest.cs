using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Queries.Dto
{
    public class GetAssignmentsRequest
    {
        public IEnumerable<long> MasterDataList { get; set; }
    }
}
