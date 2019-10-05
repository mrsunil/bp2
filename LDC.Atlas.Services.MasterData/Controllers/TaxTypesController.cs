using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using MediatR;
using System.ComponentModel.DataAnnotations;
using LDC.Atlas.Services.MasterData.Application.Command;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class TaxTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITaxTypeRepository _taxTypesRepository;
        private readonly IMediator _mediator;
        public TaxTypesController(IUnitOfWork unitOfWork, ITaxTypeRepository taxTypesRepository, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _taxTypesRepository = taxTypesRepository;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of Tax Types.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get(string company)
        {
            IEnumerable<EnumEntity> taxTypes = await _taxTypesRepository.GetAllAsync(company);

            var response = new CollectionViewModel<EnumEntity>(taxTypes.ToList());

            return Ok(response);
        }

        //[HttpPatch]
        //[Consumes(MediaTypeNames.Application.Json)]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[Authorize(Policies.EditTaxTypePolicy)]
        //public async Task<IActionResult> Update(string company, [FromBody, Required] TaxCodesUpdateCommands request)
        //{
        //    await _mediator.Send(request);

        //    return NoContent();
        //}
    }
}
