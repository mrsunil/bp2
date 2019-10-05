using LDC.Atlas.Services.AccountingInterface.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.AccountingInterface.Services
{
    public interface IESBService
    {
        Task<string> CallESBClient(string xmlMessageForAccounting, DocumentType documentType, int tAorJLTypeId);
    }
}
