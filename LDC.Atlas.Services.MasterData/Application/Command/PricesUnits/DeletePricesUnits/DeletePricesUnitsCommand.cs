using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using static LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.PricesUnitsBaseCommands;

namespace LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.DeletePricesUnits
{
    public class DeletePricesUnitsCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        [Required]
        public IEnumerable<long> MasterDataList { get; set; }
    }
}
