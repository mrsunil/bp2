namespace LDC.Atlas.Application.Core.Entities
{
    public class PaginatedItem
    {
        [Newtonsoft.Json.JsonIgnore]
        public int TotalCount { get; set; }
    }
}
