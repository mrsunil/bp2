using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class InterfaceTypes
    {
        [Column(Name = "EnumEntityId")]
        public long InterfaceTypeId { get; set; }

        [Column(Name = "EnumEntityDescription")]
        public string InterfaceType { get; set; }
    }
}
