using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.RegionCommands
{
    public class DeleteRegionsCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        public List<Region> MasterDataList { get; set; }
    }
}
