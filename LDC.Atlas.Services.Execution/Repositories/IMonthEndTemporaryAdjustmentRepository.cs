using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface IMonthEndTemporaryAdjustmentRepository
   {
       Task<MonthEndTAResponse> SaveMonthEndReport(List<MonthEndTemporaryAdjustmentReport> monthEndTAReport, string company, int? dataVersionId, int? reportType, DateTime documentDate, DateTime? AccountingPeriod);
    }
}
