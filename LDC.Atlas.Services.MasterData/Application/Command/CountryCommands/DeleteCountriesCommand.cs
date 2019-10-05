using LDC.Atlas.Services.MasterData.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Command.CountryCommands
{
    public class DeleteCountriesCommand : IRequest<ICollection<MasterDataDeletionResult>>
    {
        public List<Country> MasterDataList { get; set; }
    }
}
