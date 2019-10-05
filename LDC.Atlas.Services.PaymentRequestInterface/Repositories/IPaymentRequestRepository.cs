using LDC.Atlas.Services.PaymentRequestInterface.Application.Commands;
using LDC.Atlas.Services.PaymentRequestInterface.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Repositories
{
   public interface IPaymentRequestRepository
    {
        Task InsertOrUpdateInterfaceStatusAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus);

        Task InsertInterfaceLogsAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus, string message);

        Task<string> GetTRAXMessageAsync(long cashId, string companyId);

        Task<string> GetLegalEntityCodeAsync(string companyId, long businessTypeId);

        Task<PaymentRequestStatus> GetPaymentRequestStatus(int interfaceType, string companyId, string documentReference, long? transactionDocumentId = null);
    }
}
