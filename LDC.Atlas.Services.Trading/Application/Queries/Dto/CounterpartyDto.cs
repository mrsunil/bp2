using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class CounterpartyDto
    {
        public int CounterpartyID { get; set; }

        public string CounterpartyCode { get; set; }

        public string Description { get; set; }
    }
}
