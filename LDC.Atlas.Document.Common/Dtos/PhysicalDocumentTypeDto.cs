using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Document.Common.Dtos
{
    public class PhysicalDocumentTypeDto
    {
        [Column(Name = "EnumEntityId")]
        public int PhysicalDocumentTypeId { get; set; }

        [Column(Name = "EnumEntityValue")]
        public string PhysicalDocumentTypeLabel { get; set; }

        public string TemplatesPaths { get; set; }
    }
}
