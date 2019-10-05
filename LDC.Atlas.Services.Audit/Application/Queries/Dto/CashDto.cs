using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Audit.Application.Queries.Dto
{
    public class CashDto
    {
        public long CashId { get; set; }

        public long TransactionDocumentId { get; set; }
    }
}
