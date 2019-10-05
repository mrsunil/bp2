using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands
{
    public class ActivatePriceUnitCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public IEnumerable<int> ActivatedCompanies { get; set; }

        public IEnumerable<int> DeactivatedCompanies { get; set; }

        public IEnumerable<long> MasterDataList { get; set; }
    }
}
