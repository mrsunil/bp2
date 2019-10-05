using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.MasterData.Common.Entities;
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
    public class DateFormatPreferenceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateFormatPreferenceRepository _dateFormatPreferenceRepository;
        private readonly IRedisConnectionFactory _cache;

        public DateFormatPreferenceController(IUnitOfWork unitOfWork, IDateFormatPreferenceRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _dateFormatPreferenceRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of date formats.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<DateFormat>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<DateFormat>>> Get()
        {
            IEnumerable<DateFormat> dateFormat = await _dateFormatPreferenceRepository.GetAllAsync();

            var response = new CollectionViewModel<DateFormat>(dateFormat.ToList());

            return Ok(response);
        }

    }
}