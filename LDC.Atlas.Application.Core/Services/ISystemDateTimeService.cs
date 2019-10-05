using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Core.Services
{
    public interface ISystemDateTimeService
    {
        Task<DateTime> GetCompanyDate(string companyId);

        Task<int?> GetCompanyCurrentDataVersionId(string companyId);
    }
}
