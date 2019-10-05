using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.ArbitrationCommands
{
    public class DeactivateArbitrationsCommand : IRequest
    {
        public IEnumerable<int> ActivatedCompanies { get; set; }
    }
}
