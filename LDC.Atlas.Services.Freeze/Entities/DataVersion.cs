using System;

namespace LDC.Atlas.Services.Freeze.Entities
{
    public class DataVersion
    {
        public int DataVersionId { get; set; }

        public string CompanyId { get; set; }

        public DateTime FreezeDate { get; set; }

        public DataVersionType DataVersionTypeId { get; set; }

        public DateTime StartDateTime { get; set; }

        public DateTime? EndDateTime { get; set; }
    }
}