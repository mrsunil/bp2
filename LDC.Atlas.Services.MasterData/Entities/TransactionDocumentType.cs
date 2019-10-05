using LDC.Atlas.DataAccess.DapperMapper;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class TransactionDocumentType
    {
        [Column(Name = "EnumEntityId")]
        public int TransactionDocumentTypeId { get; set; }

        [Column(Name = "EnumEntityValue")]
        public string Label { get; set; }

        [Column(Name = "EnumEntityDescription")]
        public string Description { get; set; }
    }
}
