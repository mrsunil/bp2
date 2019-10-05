using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class FormsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFormService _formQueries;

        public FormsController(
            IMediator mediator,
            IFormService formConfigurationQueries)
        {
            _mediator = mediator;
            _formQueries = formConfigurationQueries;
        }

        /// <summary>
        /// Returns a form configuration by its form identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="formId">The form identifier.</param>
        [HttpGet("{formId}")]
        [ProducesResponseType(typeof(FormDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<FormDto>> GetFormConfiguration(string company, string formId)
        {
            var config = await _formQueries.GetForm(formId, company);

            return Ok(config);
        }
    }
}