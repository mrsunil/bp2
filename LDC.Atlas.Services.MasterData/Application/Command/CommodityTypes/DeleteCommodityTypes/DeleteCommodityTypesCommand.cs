using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.MasterData.Application.Command.CommodityTypes.DeleteCommodityTypes
{
    public class DeleteCommodityTypesCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        [Required]
        public IEnumerable<long> MasterDataList { get; set; }
    }
}