using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Application.Command;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;
using LDC.Atlas.Services.MasterData.Model;
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
    public class PaymentTermsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentTermsRepository _paymentTermsRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public PaymentTermsController(IUnitOfWork unitOfWork, IPaymentTermsRepository paymentTermsRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _paymentTermsRepository = paymentTermsRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of payment terms.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="code">The start of the paymentTerm code to search for</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<PaymentTerms>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<PaymentTerms>>> Get(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            var paymentTerms = await _paymentTermsRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, pagingOptions.Offset, null, includeDeactivated, code, description);

            var response = new CollectionViewModel<PaymentTerms>(paymentTerms.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditPaymentTermPolicy)]
        public async Task<IActionResult> Update([FromBody, Required] PaymentTermsUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
