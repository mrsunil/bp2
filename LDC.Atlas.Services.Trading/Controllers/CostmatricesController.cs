using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Infrastructure.Policies;
using LDC.Atlas.Services.Trading.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Controllers
{
    [Route("api/v1/trading/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class CostMatricesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICostMatricesQueries _costMatricesQueries;
        private readonly ITagService _tagService;

        public CostMatricesController(IMediator mediator, ICostMatricesQueries costmatricesQueries, ITagService tagService)
        {
            _mediator = mediator;
            _costMatricesQueries = costmatricesQueries;
            _tagService = tagService;
        }

        /// <summary>
        /// Returns the list of cost matrix.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <returns>list of cost matrix</returns>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CostMatriceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CostMatriceDto>>> GetCostMatrixList(string company, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _costMatricesQueries.GetCostMatrixListAsync(company);
            var response = new PaginatedCollectionViewModel<CostMatriceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of cost matrix with the Best Match indicator.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The tag paramters that filter the cost matrix.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <returns>list of cost matrix</returns>
        [HttpPost("include-bestmatch")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<RecommendedCostMatriceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<RecommendedCostMatriceDto>>> SearchCostMatrixListWithBestMatch(string company, [FromBody, Required] List<TagDto> request, [FromQuery] PagingOptions pagingOptions)
        {
            List<EntitiesBestMatchDto> costMatricesFromParams = null;

            if (request.Count() > 0)
            {
                costMatricesFromParams = await _tagService.ListCostMatricesOrderedByTagsAsync(company, request);
            }

            var allCostMatrices = await _costMatricesQueries.GetCostMatrixListAsync(company);

            List<RecommendedCostMatriceDto> result = new List<RecommendedCostMatriceDto>();
            RecommendedCostMatriceDto itemRecommended;

            foreach (var itemCostMatrix in allCostMatrices)
            {
                itemRecommended = new RecommendedCostMatriceDto()
                {
                    CostMatrixId = itemCostMatrix.CostMatrixId,
                    CostMatrixLines = itemCostMatrix.CostMatrixLines,
                    CreatedBy = itemCostMatrix.CreatedBy,
                    CreatedDateTime = itemCostMatrix.CreatedDateTime,
                    Description = itemCostMatrix.Description,
                    ModifiedBy = itemCostMatrix.ModifiedBy,
                    ModifiedDateTime = itemCostMatrix.ModifiedDateTime,
                    Name = itemCostMatrix.Name
                };

                if (costMatricesFromParams != null && costMatricesFromParams.Any(t => t.EntityExternalId == itemRecommended.CostMatrixId.ToString(CultureInfo.InvariantCulture)))
                {
                    itemRecommended.BestMatch = costMatricesFromParams.First(t => t.EntityExternalId == itemRecommended.CostMatrixId.ToString(CultureInfo.InvariantCulture)).BestMatch;
                }

                result.Add(itemRecommended);
            }

            var response = new PaginatedCollectionViewModel<RecommendedCostMatriceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.OrderByDescending(t => t.BestMatch).ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns a cost matrix by its identifier.
        /// </summary>
        /// <param name="costMatrixId">The cost matrix identifier.</param>
        [HttpGet("{costMatrixId:long}")]
        [ProducesResponseType(typeof(CostMatriceDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CostMatriceDto>> GetCostMatrixById(long costMatrixId)
        {
            var costMatrix = await _costMatricesQueries.GetCostMatrixByIdAsync(costMatrixId);

            return Ok(costMatrix);
        }

        /// <summary>
        /// Creates a cost matrix.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="costMatrix">The cost matrix to create.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        //[ProducesResponseType(typeof(CostMatrixReference), StatusCodes.Status201Created)]
        //[SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.WriteCostMatricesPolicy)]
        public async Task<ActionResult<CostMatrixReference>> CreateCostMatrix(string company, [FromBody, Required] CreateCostMatrixCommand costMatrix)
        {
            costMatrix.Company = company;

            var costMatrixReference = await _mediator.Send(costMatrix);

            // TODO: return 201
            return Ok(costMatrixReference);
        }

        /// <summary>
        /// Creates a cost matrix with parameters.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="costMatrix">The cost matrix to create.</param>
        [HttpPost("include-parameters")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CostMatrixReference), StatusCodes.Status201Created)]
        [Authorize(Policies.WriteCostMatricesPolicy)]
        public async Task<ActionResult<CostMatrixReference>> CreateCostMatrixWithParameters(string company, [FromBody, Required] CreateCostMatrixWithParametersCommand costMatrix)
        {
            costMatrix.Company = company;

            var costMatrixReference = await _mediator.Send(costMatrix);

            return CreatedAtAction(nameof(CreateCostMatrixWithParameters), costMatrixReference);
        }

        /// <summary>
        /// Updates an existing cost matrix.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="costMatrixId">The identifier of the cost matrix to update.</param>
        /// <param name="costMatrix">The cost matrix to update.</param>
        /// <response code="204">Cost matrix updated.</response>
        [HttpPatch("{costMatrixId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteCostMatricesPolicy)]
        public async Task<IActionResult> UpdateCostMatrix(string company, long costMatrixId, [FromBody, Required] UpdateCostMatrixCommand costMatrix)
        {
            costMatrix.CostMatrixId = costMatrixId;
            costMatrix.Company = company;

            await _mediator.Send(costMatrix);

            return NoContent();
        }

        /// <summary>
        /// Updates an existing cost matrix.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="costMatrixId">The identifier of the cost matrix to update.</param>
        /// <param name="costMatrix">The cost matrix to update.</param>
        /// <response code="204">Cost matrix updated.</response>
        [HttpPost("{costMatrixId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteCostMatricesPolicy)]
        public async Task<IActionResult> UpdateCostMatrixWithParameters(string company, long costMatrixId, [FromBody, Required] UpdateCostMatrixWithParametersCommand costMatrix)
        {
            costMatrix.CostMatrixId = costMatrixId;
            costMatrix.Company = company;

            await _mediator.Send(costMatrix);

            return NoContent();
        }

        /// <summary>
        /// Deletes a cost matrix.
        /// </summary>
        /// <param name="costMatrixId">The identifier of the cost matrix to delete.</param>
        /// <response code="204">Cost matrix deleted</response>
        [HttpDelete("{costMatrixId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteCostMatricesPolicy)]
        public async Task<IActionResult> DeleteCostMatrix(long costMatrixId)
        {
            var command = new DeleteCostMatrixCommand
            {
                CostMatrixId = costMatrixId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Deletes a cost matrix line.
        /// </summary>
        /// <param name="costMatrixId">The identifier of the cost matrix to delete.</param>
        /// <param name="costMatrixLineId">The identifier of the cost matrix.</param>
        /// <response code="204">Cost matrix line deleted.</response>
        [HttpDelete("{costMatrixId:long}/{costMatrixLineId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteCostMatricesPolicy)]
        public async Task<IActionResult> DeleteCostMatrixLine(long costMatrixId, long costMatrixLineId)
        {
            var command = new DeleteCostMatrixLineCommand
            {
                CostMatrixLineId = costMatrixLineId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Checks if a cost matrix name exists.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="name">The name of the cost matrix.</param>
        [HttpHead("{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CheckCostMatrixNameExistsAsync(string company, string name)
        {
            var nameExists = await _costMatricesQueries.CheckCostMatrixNameExistsAsync(company, name);

            if (!nameExists)
            {
                return NoContent();
            }

            return Ok();
        }

        /// <summary>
        /// Get the list of cost Matrices with parameters.
        /// </summary>
        /// <param name="company"></param>
        /// <param name="costMatrixIds"></param>
        /// <returns></returns>
        [HttpGet("tags")]
        [ProducesResponseType(typeof(IEnumerable<CostMatrixWithTagsDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCostMatricesListWithTags(string company, [FromQuery] string costMatrixIds)
        {
            ICollection<CostMatrixWithTagsDto> result = new List<CostMatrixWithTagsDto>();

            var entityTagList = await _tagService.GetTagsListAsync(company, costMatrixIds);

            string[] ids = costMatrixIds.Split(',');

            foreach (var id in ids)
            {
                var costMatrix = await _costMatricesQueries.GetCostMatrixByIdAsync(Convert.ToInt64(id, CultureInfo.InvariantCulture));

                if (costMatrix != null)
                {
                    var costMatrixWithTags = new CostMatrixWithTagsDto
                    {
                        CostMatrixId = costMatrix.CostMatrixId,
                        Description = costMatrix.Description,
                        Name = costMatrix.Name,
                        Tags = TagListByIdOrDefault(id, entityTagList)
                    };

                    result.Add(costMatrixWithTags);
                }
            }

            return Ok(result);

        }

        private static IEnumerable<TagDto> TagListByIdOrDefault(string id, IEnumerable<EntityTagListDto> entityTagList)
        {
            IEnumerable<TagDto> tagList = new List<TagDto>();

            if (entityTagList != null)
            {
                bool found = false;

                int counter = 0;

                int limit = entityTagList.Count();

                while (!found && counter < limit)
                {
                    var currentEntityTag = entityTagList.ElementAt(counter);

                    if (currentEntityTag.EntityExternalId.Equals(id, StringComparison.InvariantCulture))
                    {
                        found = true;
                        tagList = currentEntityTag.Tags;
                    }

                    counter++;
                }
            }

            return tagList;
        }
    }
}
