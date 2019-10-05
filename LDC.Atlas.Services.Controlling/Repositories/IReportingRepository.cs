using LDC.Atlas.Services.Controlling.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Repositories
{
    public interface IReportingRepository
    {
        Task<IEnumerable<Accrual>> GetAccrualsForLdeomReport(string company);

        Task<IEnumerable<Aggregation>> GetAggregationsForLdeomReport(string company);
    }
}
