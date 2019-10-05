using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public interface IAccountingSetUpQueries
    {
        Task<AccountingSetupDto> GetAccountingSetup(string companyId);
    }
}
