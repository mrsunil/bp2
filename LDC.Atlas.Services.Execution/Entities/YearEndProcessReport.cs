using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class YearEndProcessResponse
    {
        public bool IsSuccess { get; set; }

        public string DocumentReference { get; set; }
    }

    public class YearEndProcessReportResponse
    {
        public string ReportName { get; set; }

        public List<YearEndProcessResponse> YearEndProcessResponses { get; set; }
    }
}