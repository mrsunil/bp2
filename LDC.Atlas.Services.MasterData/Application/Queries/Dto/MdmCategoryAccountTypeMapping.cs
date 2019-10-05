using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Queries.Dto
{
    public class MdmCategoryAccountTypeMapping
    {
        public long MdmCategoryID { get; set; }

        public string MdmCategoryCode { get; set; }

        public long AccountTypeID { get; set; }

        public string Name { get; set; }

    }
}
