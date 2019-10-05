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

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class TransactionDocumentTypeController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly ITransactionDocumentTypeRepository _transactionDocumentTypeRepository;

        public TransactionDocumentTypeController(IUnitOfWork unitOfWork, ITransactionDocumentTypeRepository transactionDocumentTypeRepository)
        {
            _unitOfWork = unitOfWork;
            _transactionDocumentTypeRepository = transactionDocumentTypeRepository;
        }

        /// <summary>
        /// Returns the list of physical document types.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<TransactionDocumentType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TransactionDocumentType>>> Get(string company)
        {
            IEnumerable<TransactionDocumentType> documentTypes = await _transactionDocumentTypeRepository.GetAllAsync(company);

            var response = new CollectionViewModel<TransactionDocumentType>(documentTypes.ToList());

            return Ok(response);
        }
    }
}

