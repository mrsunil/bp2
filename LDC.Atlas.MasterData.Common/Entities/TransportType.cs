using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class TransportType
    {
        public string TransportTypeCode { get; set; }

        [Column(Name = "Description")]
        public string TransportTypeDescription { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}