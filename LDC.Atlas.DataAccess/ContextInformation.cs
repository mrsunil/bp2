using LDC.Atlas.Application.Core;

namespace LDC.Atlas.DataAccess
{
    public class ContextInformation : IContextInformation
    {
        public string ApiServiceName { get; set; }

        public string ApiActionName { get; set; }

        public string UserId { get; set; }

        public string CompanyId { get; set; }

        public int? DataVersionId { get; set; }

        public string ActivityId { get; set; }
    }
}
