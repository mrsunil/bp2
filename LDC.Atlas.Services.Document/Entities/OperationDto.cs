using System;

namespace LDC.Atlas.Services.Document.Entities
{
    public class OperationDto
    {
        public long OperationId { get; set; }

        public string Status { get; set; } // "notstarted | running | succeeded | failed"

        public string ResourceLocation { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }
    }
}