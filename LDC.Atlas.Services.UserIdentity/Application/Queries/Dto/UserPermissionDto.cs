using Newtonsoft.Json;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class UserPermissionDto
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public string ProfileName { get; set; }

        public bool IsTrader { get; set; }

        public bool IsCharterManager { get; set; }

        public bool AllDepartments { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<DepartmentDto> Departments { get; set; }
    }
}
