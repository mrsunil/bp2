using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
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
    public class InvoiceMarkingsController : ControllerBase
    {
        private readonly IInvoiceMarkingQueries _invoiceMarkingQueries;

        public InvoiceMarkingsController(IInvoiceMarkingQueries invoiceMarkingQueries)
        {
            _invoiceMarkingQueries = invoiceMarkingQueries;
        }

        /// <summary>
        /// Returns the list of invoice markings.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="costId">The cost identifier.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<InvoiceMarkingDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.DeleteCostInvoiceMarkingPolicy)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CollectionViewModel<InvoiceMarkingDto>>> GetInvoiceMarkingsForSection(string company, [FromQuery]long? sectionId, [FromQuery] long? costId)
        {
            IEnumerable<InvoiceMarkingDto> invoiceMarkings = null;

            if (sectionId != null)
            {
                invoiceMarkings = await _invoiceMarkingQueries.GetContractInvoiceMarkingsAsync(sectionId.Value, company);
            }
            else if (costId != null)
            {
                invoiceMarkings = await _invoiceMarkingQueries.GetCostInvoiceMarkingsAsync(costId.Value, company);
            }
            else
            {
                return BadRequest(); // TODO: implements GetInvoiceMarkingsAsync ?
            }

            var response = new CollectionViewModel<InvoiceMarkingDto>(invoiceMarkings.ToList());

            return Ok(response);
        }
    }
}
