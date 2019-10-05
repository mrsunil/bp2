using LDC.Atlas.Services.PreAccounting.Entities;
using MediatR;
using System.Collections.Generic;

[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("LDC.Atlas.IntegrationTest")]
namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class CreateAccountingDocumentCommand : IRequest<IEnumerable<long>>
    {
        internal string Company { get; set; }

        public long DocId { get; set; }

        public bool PostOpClosedPolicy { get; set; }
    }
}
