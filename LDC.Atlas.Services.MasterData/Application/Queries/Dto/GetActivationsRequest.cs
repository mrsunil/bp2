using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Queries.Dto
{
    public class GetActivationsRequest
    {
        public IEnumerable<long> MasterDataList { get; set; }
    }
}
