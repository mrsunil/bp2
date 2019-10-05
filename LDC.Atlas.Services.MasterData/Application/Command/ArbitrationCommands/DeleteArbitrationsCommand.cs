using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.ArbitrationCommands
{
    public class DeleteArbitrationsCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        public List<Arbitration> MasterDataList { get; set; }
    }
}
