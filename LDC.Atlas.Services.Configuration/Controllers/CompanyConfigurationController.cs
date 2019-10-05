using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using LDC.Atlas.Services.Configuration.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Configuration.Entities;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class CompanyConfigurationController : ControllerBase
    {
        private readonly ICompanyConfigurationQueries _companyConfigurationQueries;
        private readonly IMediator _mediator;

        public CompanyConfigurationController(IMediator mediator, ICompanyConfigurationQueries companyConfigurationQueries)
        {
            _mediator = mediator;
            _companyConfigurationQueries = companyConfigurationQueries;
        }

        /// <summary>
        /// Returns a list of companies configuration setup details.
        /// <param name="company">The company code.</param>
        /// <param name="year">This is Year , used to fetch accounting parameter details</param>
        /// </summary>
        [HttpGet("getcompanyconfiguration")]
        [ProducesResponseType(typeof(CompanyConfigurationDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CompanyConfigurationDto>> GetCompanyConfiguration(string company, int year)
        {
            var companyConfiguration = await _companyConfigurationQueries.GetCompanyConfigurationAsync(company, year);

            if (companyConfiguration != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, DateTime.Now.ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(companyConfiguration);
        }

        /// <summary>
        /// Returns a list of companies configuration setup details.
        /// <param name="company">The company code.</param>
        /// </summary>
        [HttpGet("getdefaultaccounting")]
        [ProducesResponseType(typeof(DefaultAccountingSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<DefaultAccountingSetupDto>> GetDefaultAccounting(string company)
        {
            var defaultAccounting = await _companyConfigurationQueries.GetDefaultAccountingSetup(company);

            return Ok(defaultAccounting);
        }

        /// <summary>
        /// Returns a list of companies with company details.
        /// </summary>
        [HttpGet("getcompanylistdetails")]
        [ProducesResponseType(typeof(CompanyListDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CompanyListDto>> GetCompanyListDetails()
        {
            var companyList = await _companyConfigurationQueries.GetCompanyListDetails();

            return Ok(companyList);
        }

        /// <summary>
        /// Return the acconting details of the company
        /// </summary>
        /// <param name="company">The company name</param>
        /// <param name="year">The Year number</param>
        [HttpGet("getaccountingparameters")]
        [ProducesResponseType(typeof(AccountingParameterDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<AccountingParameterDto>> GetAccountingParameterAsync(string company, int year)
        {
            IEnumerable<AccountingParameterDto> accountingParameter = await _companyConfigurationQueries.GetAccountingParameterSetUpByCompany(company, year);

            return Ok(accountingParameter);
        }

        /// <summary>
        /// Return the trading next number details of the company
        /// </summary>
        /// <param name="company">The company name</param>
        [HttpGet("gettradingparameters")]
        [ProducesResponseType(typeof(TradeParameterDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<TradeParameterDto>> GetTradeParameterAsync(string company)
        {
            IEnumerable<TradeParameterDto> tradingParameter = await _companyConfigurationQueries.GetTradeParameterSetUpByCompany(company);

            return Ok(tradingParameter);
        }

        /// <summary>
        /// Returns a InvoicenSetup its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getinvoicesetup")]
        [ProducesResponseType(typeof(InvoiceSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<InvoiceSetupDto>> GetInvoiceSetupByCompany(string company)
        {
            var invoiceSetup = await _companyConfigurationQueries.GetInvoiceSetupByCompany(company);

            if (invoiceSetup != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, DateTime.Now.ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(invoiceSetup);
        }

        /// <summary>
        /// Returns a Company Setup its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getcompanysetup")]
        [ProducesResponseType(typeof(InterfaceSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CompanySetupDto>> GetCompanySetupByCompany(string company)
        {
            var companySetup = await _companyConfigurationQueries.GetCompanySetupByCompany(company);

            return Ok(companySetup);
        }

        /// <summary>
        /// Returns a Company Setup its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("checktransationexistsbycompanyid")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CheckTransactionDataExists(string company)
        {
            var transactionExists = await _companyConfigurationQueries.CheckTransactionDataExists(company);
            return Ok(transactionExists);
        }


        /// <summary>
        /// Returns a Company Setup its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("gettradesetup")]
        [ProducesResponseType(typeof(TradeSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<TradeSetupDto>> GetTradeSetupByCompany(string company)
        {
            var companySetup = await _companyConfigurationQueries.GetTradeSetupByCompany(company);

            return Ok(companySetup);
        }

        /// <summary>
        /// Returns a InterCo or No InterCo user list.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getinterconointercousers")]
        [ProducesResponseType(typeof(InterCoNoInterCoUsersDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<InterCoNoInterCoUsersDto>> GetInterCoNoInterCoUsers(string company)
        {
            var companySetup = await _companyConfigurationQueries.GetInterCoNoInterCoUsers();

            return Ok(companySetup);
        }

        /// <summary>
        /// Returns a InterCo or No InterCo emails id list.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getinterconointercoemails")]
        [ProducesResponseType(typeof(InterCoNoInterCoUsersDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<InterCoNoInterCoEmailSetupDto>> GetInterCoNoInterCoEmailSetup(string company)
        {
            var interCoNoInterCoEmailSetup = await _companyConfigurationQueries.GetInterCoNoInterCoEmailSetup(company);

            return Ok(interCoNoInterCoEmailSetup);
        }

        /// <summary>
        /// Updates an existing company details.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The company details to update.</param>
        /// <response code="204">company updated</response>
        [HttpPatch("updateCompanyConfiguration")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateCompanyConfiguration(string company, [FromBody, Required] UpdateCompanyConfigurationCommand request)
        {
            request.CompanyId = company;
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Delete a company.
        /// </summary>
        /// <param name="company">The company details to delete.</param>
        /// <response code="204">company deleted</response>
        [HttpDelete("deletecompany")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteCompany(string company)
        {
            var command = new DeleteCompanyCommand
            {
                CompanyId = company
            };
            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Freeze a company.
        /// </summary>
        /// <param name="company">The company details to freeze.</param>
        /// <response code="204">company frozen</response>
        [HttpPatch("updateisfrozenforcompany")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateIsFrozenForCompany(string company, [FromBody, Required] UpdateIsFrozenForCompanyCommand request)
        {
            request.CompanyId = company;

            await _mediator.Send(request);

            return NoContent();
        }


        /// <summary>
        /// Returns a Allocation Set Up its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getallocationsetupbycompanyid")]
        [ProducesResponseType(typeof(AllocationSetUpDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AllocationSetUpDto>>> GetAllocationSetUpByCompanyId(string company)
        {
            var allocationSetup = await _companyConfigurationQueries.GetAllocationSetUpByCompanyId(company);
            return Ok(allocationSetup);
        }

        /// <summary>
        /// Returns a Interface Setup its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getinterfacesetup")]
        [ProducesResponseType(typeof(InterfaceSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<InterfaceSetupDto>>> GetInterfaceSetupByCompany(string company)
        {
            var interfaceSetup = await _companyConfigurationQueries.GetInterfaceSetupByCompany(company);

            if (interfaceSetup != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, DateTime.Now.ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(interfaceSetup);
        }

        /// <summary>
        /// Returns a Mandatory and Trade Approval and Image set-up fields
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getmandatoryfieldsetupbycompanyid")]
        [ProducesResponseType(typeof(MandatoryTradeApprovalImageSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<MandatoryTradeApprovalImageSetupDto>>> GetMandatoryFieldSetupByCompanyId(string company)
        {
            var mandatoryFieldsSetUp = await _companyConfigurationQueries.GetMandatoryFieldSetupByCompanyId(company);
            return Ok(mandatoryFieldsSetUp);
        }

        /// <summary>
        /// Get the allocation fields for create company
        /// </summary>
        [HttpGet("getallocationsetup")]
        [ProducesResponseType(typeof(AllocationSetUpDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AllocationSetUpDto>>> GetAllocationSetUp()
        {
            var allocationSetup = await _companyConfigurationQueries.GetAllocationSetUp();
            return Ok(allocationSetup);
        }


        /// <summary>
        /// Returns mandatory trade approval and iscopy fields list for create company
        /// </summary>
        [HttpGet("getmandatoryfieldsetup")]
        [ProducesResponseType(typeof(MandatoryTradeApprovalImageSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<MandatoryTradeApprovalImageSetupDto>>> GetMandatoryFieldSetup()
        {
            var mandatoryFieldsSetUp = await _companyConfigurationQueries.GetMandatoryFieldSetup();
            return Ok(mandatoryFieldsSetUp);
        }

        /// <summary>
        /// Returns a Company Setup its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("checkcounterpartyexists")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CheckCounterpartyExists(string company)
        {
            var counterpartyExists = await _companyConfigurationQueries.CheckCounterpartyforCompanyExists(company);
            return Ok(counterpartyExists);
        }

        /// <summary>
        /// Returns the List of fields to be configured for Main Accounting
        /// </summary>
        [HttpGet("getmainaccountingsetup")]
        [ProducesResponseType(typeof(MainAccountingSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<MainAccountingSetupDto>>> GetMainAccountingSetup()
        {
            var mainAccountingSetup = await _companyConfigurationQueries.GetMainAccountingSetup();
            return Ok(mainAccountingSetup);
        }
    }
}