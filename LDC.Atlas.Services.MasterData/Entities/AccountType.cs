using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class AccountType
    {
        [Column(Name = "EnumEntityId")]
        public long AccountTypeId { get; set; }

        [Column(Name = "EnumEntityValue")]
        public string Name { get; set; }
    }
}
