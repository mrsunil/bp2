using LDC.Atlas.Services.PreAccounting.Application.Commands;
using LDC.Atlas.Services.PreAccounting.Application.Queries;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Controllers
{
    [Route("api/v1/preaccounting/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class AccountingSetUpController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAccountingSetUpQueries _accountingSetUpQueries;

        public AccountingSetUpController(IMediator mediator, IAccountingSetUpQueries accountingSetUpQueries)
        {
            _mediator = mediator;
            _accountingSetUpQueries = accountingSetUpQueries;
        }

        /// <summary>
        /// Returns the accounting setup details.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(AccountingSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<AccountingSetupDto>> GetAccountingSetup(string company)
        {
            var accountingSetUp = await _accountingSetUpQueries.GetAccountingSetup(company);

            if (accountingSetUp != null)
            {
                return Ok(accountingSetUp);
            }

            return Ok(accountingSetUp);
        }

        /// <summary>
        /// Returns TA document details for a company.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="dataVersionId">The dataVersionId</param>
        [HttpGet("GetTADocDetail")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> GetTADocumentStatus(string company, [FromQuery] int? dataVersionId, [FromQuery] int? reportType)
        {
            var response = await _accountingSetUpQueries.GetTADocumentStatus(company, dataVersionId, reportType);

            return Ok(response);
        }

        /// <summary>
        /// Updates the accounting setup details for a company.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="accountingSetUp">The setup details to update.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<AccountingSetupDto>> UpdateAccountingSetUp(string company, [FromBody, Required] UpdateAccountingSetUpCommand accountingSetUp)
        {
            accountingSetUp.CompanyId = company;

            await _mediator.Send(accountingSetUp);

            return NoContent();
        }
    }
}