using System;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class BatchHistory
    {
        public long BatchHistoryId { get; set; }

        public int GroupId { get; set; }

        public int ActionId { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public BatchExecutionStatus Status { get; set; }

        public string Message { get; set; }
    }

    public enum BatchExecutionStatus
    {
        Unknown = 0,
        Completed = 1,
        Failed = 2
    }
}
