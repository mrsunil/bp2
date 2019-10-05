namespace LDC.Atlas.Services.Processor.Entities
{
    public class ProcessType
    {
        public int ProcessTypeId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsActive { get; set; }

        public string Verb { get; set; }

        public string EndPoint { get; set; }
    }
}