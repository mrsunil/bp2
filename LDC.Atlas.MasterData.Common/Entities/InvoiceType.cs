using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class InvoiceType
    {
        [Column(Name = "EnumEntityId")]
        public int InvoiceTypeId { get; set; }

        [Column(Name = "EnumEntityValue")]
        public string Name { get; set; }

        [Column(Name = "EnumEntityDescription")]
        public string Description { get; set; }

        public int ContractTypeCode { get; set; }
    }
}
