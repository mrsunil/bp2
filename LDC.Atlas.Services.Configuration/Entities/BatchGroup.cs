using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class BatchGroup
    {
        public int BatchGroupId { get; set; }

        public ICollection<BatchCompany> Companies { get; set; }
    }

    public class BatchCompany
    {
        public int Id { get; set; }

        public string CompanyId { get; set; }

        public int Order { get; set; }
    }

    public class BatchConfig
    {
        public int BatchGroupId { get; set; }

        public int BatchActionId { get; set; }

        public bool IsEnabled { get; set; }
    }
}
