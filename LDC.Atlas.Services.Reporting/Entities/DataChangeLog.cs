using System;

namespace LDC.Atlas.Services.Reporting.Entities
{
    public class DataChangeLog
    {
        public int ChangeLogId { get; set; }

        public int TableName { get; set; }

        public int CompanyId { get; set; }

        public string PreviousRowXmlValues { get; set; }

        public string CurrentRowXmlValues { get; set; }

        public string UserId { get; set; }

        public DateTime CreatedDateTime { get; set; }
    }
}
