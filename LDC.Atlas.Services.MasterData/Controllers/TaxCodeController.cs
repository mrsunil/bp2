using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Application.Command;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class TaxCodeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITaxCodeRepository _taxCodeRepository;
        private readonly IMediator _mediator;
        public TaxCodeController(IUnitOfWork unitOfWork, ITaxCodeRepository taxCodeRepository, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _taxCodeRepository = taxCodeRepository;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of Tax Types.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<TaxCodeEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TaxCodeEntity>>> Get(
            string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            IEnumerable<TaxCodeEntity> taxCode = await _taxCodeRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<TaxCodeEntity>(taxCode.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditTaxCodePolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] TaxCodesUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
