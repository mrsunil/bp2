using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class Posting
    {
        public PostingLineRecord CounterpartyLine { get; set; }

        public IEnumerable<PostingLineRecord> VATLines { get; set; }

        public IEnumerable<PostingLineRecord> GoodsLines { get; set; }
    }
}
