using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.Interface.Application.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LDC.Atlas.Application.Core.Entities;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LDC.Atlas.Services.Interface.Controllers
{
    [Route("api/v1/interface/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class BuilderController : Controller
    {
        private readonly IBuilderQueries _builderQueries;

        public BuilderController(IBuilderQueries builderQueries)
        {
            _builderQueries = builderQueries;
        }

        /// <summary>
        /// Returns the message to be sent to ESB based on the Interface Type and Document Reference
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="interfaceTypeId">Type of the Interface.</param>
        /// <param name="objectTypeId"> Object Type of the Interface.</param>
        /// <param name="docId">Document Reference.</param>
        [HttpGet]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetMessage(string company, [FromQuery] int interfaceTypeId, [FromQuery] int objectTypeId, [FromQuery] string docId)
        {
            string response = string.Empty;
            var cashOrAccountingId = await _builderQueries.GetAccountingDocumentIdandCashIdbyDocumentReference(company, docId, interfaceTypeId, objectTypeId);
            switch (interfaceTypeId)
            {
                case (int)BusinessApplicationType.TRAX:
                    {
                        response = await _builderQueries.GetTraxMessageAsync(company, cashOrAccountingId);
                        break;
                    }
                case (int)BusinessApplicationType.AX:
                    {
                        response = await _builderQueries.GetXMLForAccountingInterfaceAsync(company, cashOrAccountingId);
                        break;
                    }
            }
            return Ok(response);
        }

        /// <summary>
        /// Returns whether the Document Exists for the company or not
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="docId">Document Reference.</param>
        /// <param name="objectTypeId"> Object Type of the Interface.</param>
        [HttpGet("checkdocumentreferenceexists")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CheckDocumentReferenceExists(string company, [FromQuery] string docId, [FromQuery] int objectTypeId)
        {

            var documentidexists = await _builderQueries.CheckDocumentReferenceforCompanyExists(company, docId, objectTypeId);
            return Ok(documentidexists);
        }

    }
}
