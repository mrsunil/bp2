using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Document.Entities;
using LDC.Atlas.Services.Document.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Controllers
{
    [Route("api/v1/document/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class OperationsController : ControllerBase
    {
        private readonly IOperationRepository _operationRepository;

        public OperationsController(IOperationRepository operationRepository)
        {
            _operationRepository = operationRepository;
        }

        /// <summary>
        /// Returns the list of operations.
        /// </summary>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<OperationDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<OperationDto>>> GetOperations(
            [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<OperationDto> operations = await _operationRepository.GetOperationsAsync(pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<OperationDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, operations.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns an operation by its identifier.
        /// </summary>
        /// <param name="operationId">The operation identifier.</param>
        [HttpGet("{operationId:long}", Name = nameof(GetOperationById))]
        [ProducesResponseType(typeof(OperationDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OperationDto>> GetOperationById(long operationId)
        {
            if (operationId <= 0)
            {
                return BadRequest();
            }

            var operation = await _operationRepository.GetOperationByIdAsync(operationId);

            if (operation != null)
            {
                return Ok(operation);
            }

            return NotFound();
        }
    }
}
