using LDC.Atlas.Application.Core.Services;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Services
{
    public class MachineDateTimeService : ISystemDateTimeService
    {
        public Task<DateTime> GetCompanyDate(string companyId)
        {
            return Task.FromResult(DateTime.UtcNow);
        }

        public Task<int?> GetCompanyCurrentDataVersionId(string companyId)
        {
            return Task.FromResult((int?)0);
        }
    }
}
