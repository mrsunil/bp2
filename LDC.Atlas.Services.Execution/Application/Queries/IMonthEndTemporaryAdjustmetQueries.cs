using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
  public interface IMonthEndTemporaryAdjustmetQueries
    {
        Task<IEnumerable<MonthEndTemporaryAdjustmentReport>> GetMonthEndTemporaryAdjustmentReportAsync(string company, short type, int? reportType, int? dataVersionId, int? offset, int? limit);

        Task<IEnumerable<FxDealMonthEndTemporaryAdjustmentReport>> GetFxDealDetailsGenerateMonthEndAsync(string company, int? dataVersionId, int? offset, int? limit);

    }
}
