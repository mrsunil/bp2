using LDC.Atlas.Application.Core.Entities;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class ReversalAccountingDocumentDto : PaginatedItem
    {
        public long AccountingId { get; set; }

        public IEnumerable<AccountingSearchResultDto> AccountingDocumentLines { get; set; }
    }
}
