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
    public class LanguagePreferenceController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILanguagePreferenceRepository _languagePreferenceRepository;
        private readonly IRedisConnectionFactory _cache;

        public LanguagePreferenceController(IUnitOfWork unitOfWork, ILanguagePreferenceRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _languagePreferenceRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of languagess.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Language>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Language>>> Get()
        {
            IEnumerable<Language> language = await _languagePreferenceRepository.GetAllAsync();

            var response = new CollectionViewModel<Language>(language.ToList());

            return Ok(response);
        }

    }
}