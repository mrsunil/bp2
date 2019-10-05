using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class AccountLineTypes
    {
        [Column(Name = "EnumEntityId")]
        public int AccountLineTypeId { get; set; }
        
        [Column(Name = "EnumEntityValue")]
        public string AccountLineTypeCode { get; set; }

        [Column(Name = "EnumEntityDescription")]
        public string Description { get; set; }
    }
}
