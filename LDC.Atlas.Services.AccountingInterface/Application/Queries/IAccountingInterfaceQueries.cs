using LDC.Atlas.Services.AccountingInterface.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.AccountingInterface.Application.Queries
{
    public interface IAccountingInterfaceQueries
    {
        Task<IEnumerable<AccountingInterfaceErrorDto>> GetListOfTechnicalErrorsAsync(string company);
    }
}
