using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
    public class InvoiceTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInvoiceTypeRepository _invoiceTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public InvoiceTypesController(IUnitOfWork unitOfWork, IInvoiceTypeRepository invoiceTypeRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _invoiceTypeRepository = invoiceTypeRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of Invoice Types.
        /// </summary>
        ///
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<InvoiceType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<InvoiceType>>> Get()
        {
            IEnumerable<InvoiceType> invoiceTypes = await _invoiceTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<InvoiceType>(invoiceTypes.ToList());

            return Ok(response);
        }
    }
}