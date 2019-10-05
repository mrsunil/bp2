using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries
{
    public interface IAccountingSetUpQueries
    {
        Task<AccountingSetupDto> GetAccountingSetup(string companyId);

        Task<bool> GetTADocumentStatus(string companyId, int? dataVersionId, int? reportType);
    }
}
