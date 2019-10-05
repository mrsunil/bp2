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
    public class DepartmentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public DepartmentsController(IUnitOfWork unitOfWork, IDepartmentRepository departmentRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _departmentRepository = departmentRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of departments.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="selectedCompanies">The selected company code.</param>
        /// <param name="pagingOptions">for paging options code.</param>
        /// <param name="code">The department code.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Department>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Department>>> Get(
            string company,
            [FromQuery] string selectedCompanies,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false)
        {
            bool flag = false;
            var header = this.Http​Context.Request.Headers;
            var referer = header.FirstOrDefault(k => k.Key == "Referer");
            if (referer.Key != null && referer.Value.ToString().ToLower().Contains("/admin/users"))
            {
                flag = true;
            }

            if (!string.IsNullOrEmpty(company) && !string.IsNullOrEmpty(selectedCompanies))
            {
                company = selectedCompanies + ',' + company;
            }

            var departments = await _departmentRepository.GetAllAsync(company.Split(','), code, pagingOptions.Offset, null, flag, includeDeactivated, description);

            var response = new CollectionViewModel<Department>(departments.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditDepartmentPolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] DepartmentsUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
