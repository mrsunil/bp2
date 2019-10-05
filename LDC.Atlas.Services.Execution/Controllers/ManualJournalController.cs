using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Controllers
{
    [Route("api/v1/execution/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class ManualJournalController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IManualJournalQueries _manualJournalQueries;

        public ManualJournalController( IMediator mediator, IManualJournalQueries manualJournalQueries)
        {
            _mediator = mediator;
            _manualJournalQueries = manualJournalQueries;
        }

        /// <summary>
        /// Creates a manual journal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The manual document to create.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.CreateEditDocumentPolicy)]
        public async Task<IActionResult> CreateManualJournal(string company, [FromBody, Required] CreateManualJournalDocumentCommand request)
        {
            request.Company = company;

             var getFieldsConfiguration = await _manualJournalQueries.GetManualJournalFieldsConfiguration(company);

            List<ItemConfigurationPropertiesDto> fieldList = new List<ItemConfigurationPropertiesDto>();

            foreach (var item in getFieldsConfiguration)
            {
                fieldList.Add(new ItemConfigurationPropertiesDto()
                {
                    DefaultValue = item.DefaultValue,
                    DisplayName = item.DisplayName,
                    Format = item.Format,
                    Id = item.Id,
                    IsMandatory = item.IsMandatory,
                });
            }

            request.ManualJournal.FieldsConfigurations = fieldList;

            request.ManualJournal.ManualJournalLines.ToList().ForEach(lines => lines.FieldsConfigurations = fieldList);

            request.ManualJournal.ManualJournalLines.ToList().ForEach(lines => lines.TransactionDocumentTypeId = request.ManualJournal.TransactionDocumentTypeId);

            var commandResult = await _mediator.Send(request);

            return Ok(commandResult);
        }

        [HttpGet("getMandatoryFieldsConfiguration")]
        [ProducesResponseType(typeof(ItemConfigurationPropertiesDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ItemConfigurationPropertiesDto>>> GetMandatoryFieldsConfiguration(string company)
        {
            var mandatoryFieldsConfiguration = await _manualJournalQueries.GetManualJournalFieldsConfiguration(company);

            var response = new CollectionViewModel<ItemConfigurationPropertiesDto>(mandatoryFieldsConfiguration.ToList());

            return Ok(response);
        }
    }
}
