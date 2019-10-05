using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class ApplicationTable
    {
        public int TableId { get; set; }

        public string TableName { get; set; }

        public string Description { get; set; }

        public IEnumerable<ApplicationField> Fields { get; set; }
    }
}
