using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.PeriodTypeCommands
{
    public class DeletePeriodTypesCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        public List<PeriodType> MasterDataList { get; set; }
    }
}
