using MediatR;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class DeallocateSectionCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        [Required]
        public long SectionId { get; set; }

        [Required]
        public bool ReInstateTrafficDetails { get; set; }
    }


    public class DeallocateBulkSections 
    {
        [Required]
        public long SectionId { get; set; }

        [Required]
        public bool ReInstateTrafficDetails { get; set; }
    }

    public class BulkDeallocateSectionCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        public IEnumerable<DeallocateBulkSections> DeallocateBulkSections { get; set; }
    }
}
