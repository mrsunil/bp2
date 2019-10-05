using MediatR;
using System.Collections.Generic;
using static LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.PricesUnitsBaseCommands;

namespace LDC.Atlas.Services.MasterData.Application.Command.CreatePricesUnits
{
    public class CreatePricesUnitsCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public IEnumerable<GlobalPriceUnitDto> MasterDataList { get; set; }
    }
}
