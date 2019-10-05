using LDC.Atlas.Services.AccountingInterface.Application.Commands;
using LDC.Atlas.Services.AccountingInterface.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.AccountingInterface.Repositories
{
    public interface IAccountingInterfaceRepository
    {
        Task InsertOrUpdateInterfaceStatusAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus);

        Task InsertInterfaceLogsAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus, string message);

        Task<string> GetESBMessageAsync(long documentId, string companyId);

        Task<InterfaceStatus> GetDocumentStatus(int interfaceType, string companyId, string documentReference, long? transactionDocumentId = null, long? accountingDocumentId = null);

        Task<int> GetTATypeIdAsync(long transactionDocumentId, DocumentType documentTypeId, string companyId);
        Task<int> GetJLTypeIdAsync(long transactionDocumentId, DocumentType documentTypeId, string companyId);

        Task<string> GetDocumentReferenceByAccountingId(long documentId, int transactionDocumentTypeId, string companyId);
    }
}
