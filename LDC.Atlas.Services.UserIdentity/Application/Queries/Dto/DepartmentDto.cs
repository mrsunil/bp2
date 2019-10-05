using Newtonsoft.Json;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class DepartmentDto
    {
        public long DepartmentId { get; set; }

        [JsonIgnore]
        public string CompanyId { get; set; }
    }
}
