using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace LDC.Atlas.Services.Freeze.Application.Commands
{
    public class CreateGlobalFreezeResult
    {
        public ICollection<CreateGlobalFreezeResultDto> Freezes { get; } = new Collection<CreateGlobalFreezeResultDto>();
    }

    public class CreateGlobalFreezeResultDto
    {
        public int? DataVersionId { get; set; }

        public string CompanyId { get; set; }
    }
}
