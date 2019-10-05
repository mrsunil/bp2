using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.CurrencyCommands
{
    public class DeleteCurrenciesCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        public List<Currency> MasterDataList { get; set; }
    }
}
