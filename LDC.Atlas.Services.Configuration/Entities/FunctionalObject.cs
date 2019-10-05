using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class FunctionalObject
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public IEnumerable<ApplicationTable> Tables { get; set; }
    }
}
