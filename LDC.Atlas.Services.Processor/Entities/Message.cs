using System;

namespace LDC.Atlas.Services.Processor.Entities
{
    public class Message
    {
        public int MessageId { get; set; }

        public int ProcessTypeId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string Content { get; set; }

        public MessageStatus Status { get; set; }

        public DateTime StatusDateTime { get; set; }

        public int Retry { get; set; }

        public string Error { get; set; }

        public string CompanyId { get; set; }
    }
}