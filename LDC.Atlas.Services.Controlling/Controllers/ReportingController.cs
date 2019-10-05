using LDC.Atlas.Services.Controlling.Entities;
using LDC.Atlas.Services.Controlling.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Transactions;

namespace LDC.Atlas.Services.Controlling.Controllers
{
    [Route("api/v1/controlling/[controller]/{company}")]
    public class ReportingController : ControllerBase
    {
        private readonly IReportingRepository _reportingRepository;

        public ReportingController(
            IReportingRepository reportingRepository)
        {
            _reportingRepository = reportingRepository;
        }

        [HttpGet("Ldeom/Accruals/")]
        public async Task<IActionResult> GetAccrualsForLdeomReport(string company)
        {
            IEnumerable<Accrual> accruals = await _reportingRepository.GetAccrualsForLdeomReport(company);
            return Ok(accruals);
        }

        [HttpGet("Ldeom/Aggregations/")]
        public async Task<IActionResult> GetAggregationsForLdeomReport(string company)
        {
            return Ok(await _reportingRepository.GetAggregationsForLdeomReport(company));
        }
    }
}
