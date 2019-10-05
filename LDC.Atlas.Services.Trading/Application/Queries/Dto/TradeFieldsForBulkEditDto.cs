using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeFieldsForBulkEditDto
    {
        public string TradeFieldHeader { get; set; }

        public string FieldName { get; set; }

        public int FieldId { get; set; }

        public long TradeFieldHeaderId { get; set; }

        public bool Mandatory { get; set; }

        public string FriendlyName { get; set; }

        public long Unapproval { get; set; }
    }
}
