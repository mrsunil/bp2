using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Controllers
{
    [Route("api/v1/trading/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class PhysicalContractsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPhysicalContractQueries _physicalContractQueries;

        public PhysicalContractsController(IMediator mediator, IPhysicalContractQueries physicalContractQueries)
        {
            _mediator = mediator;
            _physicalContractQueries = physicalContractQueries;
        }


        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("Allocate")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionSummaryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<SectionSummaryDto>>> GetTradeForAllocation(
           string company,
           EntitySearchRequest searchRequest)
        {

            var searchResult = await _physicalContractQueries.GetTradesForAllocationAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
           
        }

        /// <summary>
        /// Checks if a contract reference exists.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="contractRef">The contract reference.</param>
        /// <param name="dataVersionId">The data version id if database is not current.</param>
        [HttpHead("{contractRef}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<IActionResult> CheckContractReferenceExists(string company, string contractRef, [FromQuery] long? dataVersionId = null)
        {
            var contractExists = await _physicalContractQueries.CheckContractReferenceExistsAsync(company, contractRef, dataVersionId);

            if (!contractExists)
            {
                return NoContent();
            }

            return Ok();
        }

        /// <summary>
        /// Returns a physical contract by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="physicalContractId">The physical contract identifier.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{physicalContractId:long}")]
        [ProducesResponseType(typeof(PhysicalContractDto), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<ActionResult<PhysicalContractDto>> GetPhysicalContractById(
            string company, [Range(1, long.MaxValue)] long physicalContractId, [FromQuery] long? dataVersionId = null)
        {
            PhysicalContractDto physicalContract = await _physicalContractQueries.GetPhysicalContractByIdAsync(company, physicalContractId, dataVersionId);

            return Ok(physicalContract);
        }

        /// <summary>
        /// Creates a new physical contract.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="physicalContract">The physical contract to add.</param>
        /// <response code="201">Physical contract created.</response>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        /*[ProducesResponseType(StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]*/
        [Authorize(Policies.CreateTradePhysicalPolicy)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CreatePhysicalContract(string company, [FromBody, Required] CreatePhysicalFixedPricedContractCommand physicalContract)
        {
            physicalContract.CompanyId = company;

            var getFieldsConfiguration = await _physicalContractQueries.GetMandatoryFieldsConfiguration(company, "PhysicalTradeCapture");

            List<FieldsConfiguration> fieldList = new List<FieldsConfiguration>();
            foreach (var item in getFieldsConfiguration)
            {
                fieldList.Add(new FieldsConfiguration()
                {
                    DefaultValue = item.DefaultValue,
                    DisplayName = item.DisplayName,
                    Format = item.Format,
                    Id = item.Id,
                    IsMandatory = item.IsMandatory,
                });
            }
            physicalContract.FieldsConfigurations = fieldList;

            var sectionReference = await _mediator.Send(physicalContract);

            return Ok(sectionReference);
        }

        /// <summary>
        /// Updates an existing physical contract.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="physicalContractId">The identifier of the physical contract to update.</param>
        /// <param name="physicalContract">The physical contract to update.</param>
        /// <response code="204">Physical contract updated.</response>
        [HttpPatch("{physicalContractId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<IActionResult> UpdatePhysicalContract(string company, [Range(1, long.MaxValue)] long physicalContractId, [FromBody, Required] UpdatePhysicalContractCommand physicalContract)
        {
            physicalContract.CompanyId = company;
            physicalContract.PhysicalContractId = physicalContractId;

            var getFieldsConfiguration = await _physicalContractQueries.GetMandatoryFieldsConfiguration(company, "PhysicalTradeCapture");

            List<FieldsConfiguration> fieldList = new List<FieldsConfiguration>();
            foreach (var item in getFieldsConfiguration)
            {
                fieldList.Add(new FieldsConfiguration()
                {
                    DefaultValue = item.DefaultValue,
                    DisplayName = item.DisplayName,
                    Format = item.Format,
                    Id = item.Id,
                    IsMandatory = item.IsMandatory,
                });
            }
            physicalContract.FieldsConfigurations = fieldList;

            var sectionReference = await _mediator.Send(physicalContract);

            return Ok(sectionReference);
        }

        /// <summary>
        /// Updates physical Trades in Bulk
        /// </summary>
        /// <param name="company"> The companyId</param>
        /// <param name="physicalTradeBulkEdit">Contains the list of physical Trades</param>
        [HttpPatch("physicaltradebulkedit")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<IActionResult> PhysicalTradeBulkEdit(string company, PhysicalTradeBulkEditCommand physicalTradeBulkEdit)
        {
            physicalTradeBulkEdit.CompanyId = company;
            await _mediator.Send(physicalTradeBulkEdit);

            return NoContent();
        }

        /// <summary>
        /// Creates new tranches for  a contract.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionToTranche">The section tranches to add.</param>
        /// <response code="200">Tranches created.</response>
        [HttpPost("tranche")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IEnumerable<SectionReference>), StatusCodes.Status200OK)]
        [Authorize(Policies.CreateTrancheSplitPolicy)]
        public async Task<IActionResult> CreateSectionTranche(string company, [FromBody, Required] CreateTrancheCommand sectionToTranche)
        {
            sectionToTranche.CompanyId = company;

            var section = await _mediator.Send(sectionToTranche);

            return Ok(section);
        }

        /// <summary>
        /// Creates new splits for a contract.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionToSplit">The section splits to add.</param>
        /// <response code="200">Splits created.</response>
        [HttpPost("split")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IEnumerable<SectionReference>), StatusCodes.Status200OK)]
        [Authorize(Policies.CreateTrancheSplitPolicy)]
        public async Task<IActionResult> CreateSectionSplit(string company, [FromBody, Required] CreateSplitCommand sectionToSplit)
        {
            sectionToSplit.CompanyId = company;

            var section = await _mediator.Send(sectionToSplit);

            return Ok(section);
        }

        /// <summary>
        /// Creates new splits for a contract.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="splitDetails">The details of the split action.</param>
        /// <response code="200">Splits created.</response>
        [HttpPost("splitcontract")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IEnumerable<SectionReference>), StatusCodes.Status200OK)]
        [Authorize(Policies.CreateTrancheSplitPolicy)]
        public async Task<ActionResult> CreateSplitForContract(string company, SplitDetailsCommand splitDetails)
        {
            splitDetails.CompanyId = company;

            var response = await _mediator.Send(splitDetails);

            return Ok(response);
        }

		/// <summary>
		/// Creates new splits for a contract.
		/// </summary>
		/// <param name="company">The company code.</param>
		/// <param name="bulkSplitDetails">The details of the split action.</param>
		/// <response code="200">Splits created.</response>
        [HttpPost("bulksplitcontract")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IEnumerable<SectionReference>), StatusCodes.Status200OK)]

        public async Task<ActionResult> CreateBulkSplitForContract(string company, BulkSplitDetailsCommand bulkSplitDetails)
        {
            bulkSplitDetails.CompanyId = company;

            var response = await _mediator.Send(bulkSplitDetails);

            return Ok(response);
        }

        /// <summary>
        /// Validate the Interco contract Fields and returns the missing values.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="intercoValidation">The details of the Interco validation command.</param>
        /// <response code="200">Splits created.</response>
        [HttpPost("validateIntercoFields")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IntercoValidation), StatusCodes.Status200OK)]
        [Authorize(Policies.CreateTrancheSplitPolicy)]
        public async Task<ActionResult> ValidateIntercoFields(IntercoValidationCommand intercoValidation)
        {
            var response = await _mediator.Send(intercoValidation);

            return Ok(response);
        }

        /// <summary>
        /// Create Manual Interco Contract from normal contracts.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The identifier of the contract to clone as Interco contract.</param>
        /// <param name="manualInterco">The interco contract details to be created.</param>
        /// <response code="204">Physical contract updated.</response>
        [HttpPost("{sectionId:long}/createManualInterco")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(IEnumerable<SectionReference>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateManualIntercoContract(string company, long sectionId, CreateManualIntercoCommand manualInterco)
        {
            manualInterco.Company = company;
            manualInterco.SectionId = sectionId;

            var response = await _mediator.Send(manualInterco);

            return Ok(response);
        }


        /// <summary>
        /// Returns mandatory fields configuration for Trade
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("{formId}/getMandatoryFieldsConfiguration")]
        [ProducesResponseType(typeof(ItemConfigurationPropertiesDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ItemConfigurationPropertiesDto>>> GetMandatoryFieldsConfiguration(string company, string formId)
        {
            var mandatoryFieldsConfiguration = await _physicalContractQueries.GetMandatoryFieldsConfiguration(company, formId);
            return Ok(mandatoryFieldsConfiguration);
        }
    }
}