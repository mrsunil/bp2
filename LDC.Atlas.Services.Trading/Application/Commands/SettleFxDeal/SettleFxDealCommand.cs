using LDC.Atlas.Execution.Common.Entities;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands.SettleFxDeal
{
    public class FxDealDocumentCreationCommand : IRequest<List<TransactionCreationResponse>>
    {

        public IEnumerable<FxDealDto> FxDealIds { get; set; }

        public bool IsReversal { get; set; }

        internal string Company { get; set; }
    }

}
