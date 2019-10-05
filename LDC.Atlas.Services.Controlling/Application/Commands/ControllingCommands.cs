using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Application.Commands
{
    public class ProcessFreezeRecalculationCommand : IRequest
    {
        public string UserId { get; set; } // internal to avoid the exposure in Swagger

        public long SectionId { get; set; }

        public long DataVersionId { get; set; }

        public bool RecalculateAccEntries { get; set; }
    }
}
