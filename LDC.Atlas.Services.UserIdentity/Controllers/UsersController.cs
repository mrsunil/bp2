using LDC.Atlas.Application.Core.Services;
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
    public class UsersController : ControllerBase
    {
        private readonly IUserQueries _userQueries;
        private readonly IMediator _mediator;
        private readonly IIdentityService _identityService;

        public UsersController(IMediator mediator, IUserQueries userQueries, IIdentityService identityService)
        {
            _userQueries = userQueries;
            _mediator = mediator;
            _identityService = identityService;
        }

        /// <summary>
        /// Returns the list of users.
        /// </summary>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="name">The username searched.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<UserDto>), StatusCodes.Status200OK)]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<UserDto>>> GetUsers(
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string name)
        {
            IEnumerable<UserDto> users = await _userQueries.GetUsersAsync(name);

            users = users.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<UserDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, users.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns a user by its identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="includeDeletedUsers">Option to also return a deleted user.</param>
        [HttpGet("{userId:long}")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<UserDto>> GetUserById([Range(1, long.MaxValue)] long userId, [FromQuery] bool includeDeletedUsers = false)
        {
            var user = await _userQueries.GetUserByIdAsync(userId, includeDeletedUsers);

            if (user != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, user.ModifiedDateTime != null ? user.ModifiedDateTime.Value.ToString("R", CultureInfo.InvariantCulture) : string.Empty);
            }

            return Ok(user);
        }

        /// <summary>
        /// Returns a user by its AD identifier (UPN or Azure Object Identifier).
        /// </summary>
        /// <param name="userId">The user identifier in the AD.</param>
        [HttpGet("{userId}")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<UserDto>> GetUserByActiveDirectoryId([Required] string userId)
        {
            var user = await _userQueries.GetUserByActiveDirectoryIdAsync(userId);

            if (user != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, user.ModifiedDateTime != null ? user.ModifiedDateTime.Value.ToString("R", CultureInfo.InvariantCulture) : string.Empty);
            }

            return Ok(user);
        }

        /// <summary>
        /// Returns the list of privileges for the current user in a company.
        /// </summary>
        /// <param name="company">The company.</param>
        [HttpGet("me/privileges")]
        [ProducesResponseType(typeof(CollectionViewModel<UserCompanyPrivilegesDto>), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<CollectionViewModel<UserCompanyPrivilegesDto>>> GetMyPrivileges([FromQuery] string company)
        {
            var userId = _identityService.GetUserAtlasId();

            IEnumerable<UserPrivilegeDto> privileges = await _userQueries.GetPrivilegesForUserAsync(userId, company);

            var results = from p in privileges
                          group p by p.CompanyId into g
                          select new UserCompanyPrivilegesDto { CompanyId = g.Key, Privileges = g.Select(p => new UserCompanyPrivilegeDto { ProfileId = p.ProfileId, PrivilegeName = p.PrivilegeName, Permission = p.Permission }) };

            var response = new CollectionViewModel<UserCompanyPrivilegesDto>(results.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the current user.
        /// </summary>
        [HttpGet("me")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            var userId = _identityService.GetUserAtlasId();

            var user = await _userQueries.GetUserByIdAsync(userId);

            if (user != null && !user.IsDisabled)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, user.ModifiedDateTime != null ? user.ModifiedDateTime.Value.ToString("R", CultureInfo.InvariantCulture) : string.Empty);
            }

            return Ok(user);
        }

        /// <summary>
        /// Updates the last connection date for the current user with the current date.
        /// </summary>
        [HttpPost("me/lastconnectiondatetime")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> UpdateMyLastConnectionDate()
        {
            var userId = _identityService.GetUserAtlasId();

            var command = new UpdateUserLastConnectionDateCommand
            {
                UserId = userId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Search for users in the Active Directory.
        /// </summary>
        /// <param name="pagingOptions">The paging options.</param>
        /// <param name="searchTerm">The search term.</param>
        [Route("/api/v1/useridentity/directory/users")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DirectoryUser>), StatusCodes.Status200OK)]
        [HttpGet]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DirectoryUser>>> GetDirectoryUsers([FromQuery] PagingOptions pagingOptions, [FromQuery, Required, MinLength(3)] string searchTerm)
        {
            var users = await _userQueries.GetDirectoryUsersAsync(searchTerm);

            users = users.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<DirectoryUser>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, users.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Returns an Active Directory users by its identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        [Route("/api/v1/useridentity/directory/users/{userId}")]
        [ProducesResponseType(typeof(DirectoryUser), StatusCodes.Status200OK)]
        [HttpGet]
        [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
        public async Task<ActionResult<DirectoryUser>> GetDirectoryUsersById(string userId)
        {
            var user = await _userQueries.GetDirectoryUserByIdAsync(userId);

            return Ok(user);
        }

        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="user">The user to create.</param>
        /// <response code="201">User created.</response>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(UserReference), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.UsersPolicy)]
        public async Task<IActionResult> CreateUser([FromBody, Required] CreateUserCommand user)
        {
            var userReference = await _mediator.Send(user);

            return CreatedAtAction(nameof(GetUserById), new { userId = userReference.UserId }, userReference);
        }

        /// <summary>
        /// Updates a user.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="user">The user information to update.</param>
        /// <response code="204">User updated.</response>
        [HttpPatch("{userId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.UsersPolicy)]
        public async Task<IActionResult> UpdateUser([Range(1, long.MaxValue)] long userId, [FromBody, Required] UpdateUserCommand user)
        {
            user.UserId = userId;

            await _mediator.Send(user);

            return NoContent();
        }

        /// <summary>
        /// Deletes a user.
        /// </summary>
        /// <param name="userId">The identifier of the user to delete.</param>
        [HttpDelete("{userId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.UsersPolicy)]
        public async Task<IActionResult> DeleteUser([Range(1, long.MaxValue)] long userId)
        {
            var command = new DeleteUserCommand
            {
                UserId = userId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Returns users based on profile.
        /// </summary>
        /// <param name="profileIds">The Profile ids.</param>
        /// <param name="companyId">The Company id.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getusersbyprofileId")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<UserAccountDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<UserAccountDto>>> GetUsersByProfileId([FromQuery] string profileIds, string companyId, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _userQueries.GetUsersByProfilesAsync(profileIds.Split(',').Select(int.Parse).ToArray(), companyId, pagingOptions.Offset, pagingOptions.Limit);
            var response = new PaginatedCollectionViewModel<UserAccountDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Save AD data through overnight process.
        /// </summary>
        [HttpPost("saveactivedirdata")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> SyncAndSavADStatus()
        {
            InsertUpdateActiveDirectoryUserCommand command = new InsertUpdateActiveDirectoryUserCommand();
            await _mediator.Send(command);
            return NoContent();
        }
    }
}
