namespace LDC.Atlas.Services.Execution.Entities
{
    public class AllocateSection
    {
        public long SectionId { get; set; }

        public long AllocatedSectionId { get; set; }

        public decimal AllocatedQuantity { get; set; }
    }
}