using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Document.Entities
{
    public class PhysicalDocumentTypeDto
    {
        [Column(Name = "EnumEntityId")]
        public int PhysicalDocumentTypeId { get; set; }

        [Column(Name = "EnumEntityValue")]
        public string PhysicalDocumentTypeLabel { get; set; }
    }
}
