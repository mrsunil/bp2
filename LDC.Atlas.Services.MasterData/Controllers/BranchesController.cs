using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class BranchesController : ControllerBase
    {
        private readonly IBranchRepository _branchRepository;

        public BranchesController(IBranchRepository branchRepository)
        {
            _branchRepository = branchRepository;
        }

        /// <summary>
        /// Returns the list of provinces.
        /// </summary>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Branch>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Branch>>> Get(
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false)
        {
            var branches = await _branchRepository.GetAllAsync();

            var response = new CollectionViewModel<Branch>(branches.ToList());

            return Ok(response);
        }
    }
}
