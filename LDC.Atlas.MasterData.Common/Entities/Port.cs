using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Port
    {
        public long PortId { get; set; }

        public string PortCode { get; set; }

        [Column(Name = "Description")]
        public string PortDescription { get; set; }

        public int CountryId { get; set; }

        public string DisplayName => PortCode;

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
