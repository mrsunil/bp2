using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands
{
    public class AssignPriceUnitCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public IEnumerable<int> AssignedCompanies { get; set; }

        public IEnumerable<int> DeassignedCompanies { get; set; }

        public IEnumerable<long> MasterDataList { get; set; }
    }
}
