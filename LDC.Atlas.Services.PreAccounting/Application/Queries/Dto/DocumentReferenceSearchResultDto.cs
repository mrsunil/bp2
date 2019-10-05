using LDC.Atlas.Application.Core.Entities;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class DocumentReferenceSearchResultDto : PaginatedItem
    {
        public string DocumentReference { get; set; }

        public int AccountingId { get; set; }
    }
}
