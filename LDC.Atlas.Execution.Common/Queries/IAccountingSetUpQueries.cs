using System.Threading.Tasks;
using LDC.Atlas.Execution.Common.Queries.Dto;

namespace LDC.Atlas.Execution.Common.Queries
{
    public interface IAccountingSetUpQueries
    {
        Task<AccountingSetupDto> GetAccountingSetup(string companyId);
    }
}
