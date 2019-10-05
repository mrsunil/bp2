using LDC.Atlas.Services.Trading.Entities;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands.MergeSection
{
    /// <summary>
    /// Used to merge the selected sectionids
    /// </summary>
    public class MergeSectionCommand : IRequest<bool>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public IEnumerable<MergeContracts> MergeContracts { get; set; }

        public int? DataVersionId { get; set; }
    }
}
