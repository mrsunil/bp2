using LDC.Atlas.Infrastructure;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.UserIdentity.Application.Commands;
using LDC.Atlas.Services.UserIdentity.Application.Queries;
using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using static LDC.Atlas.Services.UserIdentity.Infrastructure.Policies.AuthorizationPoliciesExtension;

namespace LDC.Atlas.Services.UserIdentity.Controllers
{
    [Route("api/v1/useridentity/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class ProfilesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IProfileQueries _profileQueries;

        public ProfilesController(IMediator mediator, IProfileQueries profileQueries)
        {
            _mediator = mediator;
            _profileQueries = profileQueries;
        }

        /// <summary>
        /// Returns the list of profiles.
        /// </summary>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ProfileSummaryDto>), StatusCodes.Status200OK)]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ProfileSummaryDto>>> GetProfiles(
            [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<ProfileSummaryDto> profiles = await _profileQueries.GetProfilesAsync(pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<ProfileSummaryDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, profiles.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns a profile by its identifier.
        /// </summary>
        /// <param name="profileId">The profile identifier.</param>
        [HttpGet("{profileId:int}")]
        [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<ProfileDto>> GetProfileById([Range(1, int.MaxValue)] int profileId)
        {
            var profile = await _profileQueries.GetProfileByIdAsync(profileId);

            if (profile != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, profile.ModifiedDateTime.ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(profile);
        }

        /// <summary>
        /// Returns the list of profiles for a user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        [Route("/api/v1/useridentity/users/{userId:long}/profiles")]
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<UserPermissionDto>), StatusCodes.Status200OK)]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<CollectionViewModel<UserPermissionDto>>> GetUserProfiles([Range(1, long.MaxValue)] long userId)
        {
            IEnumerable<UserPermissionDto> profiles = await _profileQueries.GetUserProfilesAsync(userId);

            var response = new CollectionViewModel<UserPermissionDto>(profiles.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Creates a new profile.
        /// </summary>
        /// <param name="profile">The profile to create.</param>
        /// <response code="201">Profile created.</response>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(ProfileReference), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.ProfilesPolicy)]

        public async Task<IActionResult> CreateProfile([FromBody, Required] CreateProfileCommand profile)
        {
            var commandResult = await _mediator.Send(profile);

            return CreatedAtAction(nameof(GetProfileById), new { profileId = commandResult.ProfileId }, commandResult);
        }

        /// <summary>
        /// Updates an existing profile.
        /// </summary>
        /// <param name="profileId">The identifier of the profile to update.</param>
        /// <param name="profile">The profile to update.</param>
        /// <response code="204">Profile updated.</response>
        [HttpPatch("{profileId:int}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ProfilesPolicy)]
        public async Task<IActionResult> UpdateProfile([Range(1, int.MaxValue)] int profileId, [FromBody, Required] UpdateProfileCommand profile)
        {
            profile.ProfileId = profileId;

            await _mediator.Send(profile);

            return NoContent();
        }

        /// <summary>
        /// Deletes a profile.
        /// </summary>
        /// <param name="profileId">The identifier of the profile to delete.</param>
        [HttpDelete("{profileId:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ProfilesPolicy)]
        public async Task<IActionResult> DeleteProfile([Range(1, int.MaxValue)] int profileId)
        {
            var command = new DeleteProfileCommand
            {
                ProfileId = profileId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Returns profiles based on company.
        /// </summary>
        /// <param name="companyId">The Company id.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getprofilebycompanyId")]
        [ProducesResponseType(typeof(CompanyProfileDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CompanyProfileDto>>> GetProfilesByCompanyId(string companyId, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _profileQueries.GetProfilesByCompanyIdAsync(companyId, pagingOptions.Offset, pagingOptions.Limit);
            var response = new PaginatedCollectionViewModel<CompanyProfileDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }
    }
}