using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class MdmCategory
    {
        public long MdmCategoryId { get; set; }

        public int MdmId { get; set; }

        public string MdmCategoryCode { get; set; }

        public string CounterpartyId { get; set; }

        public string MdmCategoryDescription { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

    }
}
