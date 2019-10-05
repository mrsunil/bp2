using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Vat
    {
        public string VatCode { get; set; }

        public int VatId { get; set; }

        [Column(Name = "Description")]
        public string VatDescription { get; set; }

        public decimal Rate { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string InputAccount { get; set; }

        public string OutputAccount { get; set; }
    }
}
