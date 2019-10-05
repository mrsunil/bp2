namespace LDC.Atlas.Application.Core
{
    public interface IContextInformation
    {
        string ApiServiceName { get; set; }

        string ApiActionName { get; set; }

        string UserId { get; set; }

        string CompanyId { get; set; }

        int? DataVersionId { get; set; }

        string ActivityId { get; set; }
    }
}
