using LDC.Atlas.Services.PaymentRequestInterface.Application.Commands;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Services
{
    public interface IPaymentRequestService
    {
        Task<string> CallESBClient(ProcessInterfaceDataChangeLogsRequest request, string paymentRequestMessage, string legalEntityCode);
    }
}
