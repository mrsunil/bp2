using AutoMapper;
using LDC.Atlas.Services.Configuration.Application.Queries;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class FeatureFlagsController : ControllerBase
    {
        private readonly IFeatureFlagsQueries featureFlagsQueries;
        private readonly IFeatureBitEvaluator evaluator;
        private readonly IMapper mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="FeatureFlagsController"/> class.
        /// </summary>
        /// <param name="featureFlagsQueries">Interface of the Queries component.</param>
        /// <param name="evaluator">Interface of the feature bits component.</param>
        /// <param name="mapper">Interface of the mapper component.</param>
        public FeatureFlagsController(IFeatureFlagsQueries featureFlagsQueries, IFeatureBitEvaluator evaluator, IMapper mapper)
        {
            this.featureFlagsQueries = featureFlagsQueries;
            this.evaluator = evaluator;
            this.mapper = mapper;
        }

        /// <summary>
        /// Check if a particular flag is enabled or not.
        /// </summary>
        /// <param name="company">Company.</param>
        /// <param name="name">Flag Name.</param>
        /// <returns>The status of the particular flag indicating if it is enabled or not.</returns>
        [HttpGet("{name}")]
        [ProducesResponseType(typeof(FeatureResult), StatusCodes.Status200OK)]
        public async Task<ActionResult<FeatureResult>> Get(string company, string name)
        {
            var featureBits = await this.featureFlagsQueries.GetFeatureFlagAsync(company, name).ConfigureAwait(false);
            FeatureBitDefinition featureBitDefinition = this.mapper.Map<FeatureBitDefinition>(featureBits);
            if (featureBitDefinition != null)
            {
                bool active = this.evaluator.IsEnabled(featureBitDefinition);
                return this.Ok(new FeatureResult()
                {
                    Active = active,
                    Name = name,
                });
            }
            else
            {
                return this.Ok(new FeatureResult()
                {
                    Active = false,
                    Name = name,
                });
            }
        }
    }
}