using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Lock.Application.Commands;
using LDC.Atlas.Services.Lock.Application.Logic;
using LDC.Atlas.Services.Lock.Application.Queries;
using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using LDC.Atlas.Services.Lock.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Controllers
{
    [Route("api/v1/lock/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class LocksController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILockQueries _lockQueries;

        public LocksController(
            IMediator mediator,
            ILockQueries lockQueries)
        {
            _mediator = mediator;
            this._lockQueries = lockQueries;
        }

        /// <summary>
        /// Returns the list of locks.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<LockDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<LockDto>>> GetLocks(
            string company,
            [FromQuery] PagingOptions pagingOptions)
        {
            var locks = await _lockQueries.GetLocksAsync(company, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<LockDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, locks.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of locks.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="resourceId">The resource identifier.</param>
        /// <param name="applicationSessionId">Application Session Id</param>
        [HttpGet("contract/{resourceId}/applicationSessionId/{applicationSessionId}")]
        [ProducesResponseType(typeof(CollectionViewModel<LockDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<LockStateResponseDto>> GetContractLockState(string company, long resourceId, string applicationSessionId)
        {
            var lockState = await _lockQueries.GetLockStateAsync(company, resourceId, applicationSessionId, ResourceType.Contract);
            return Ok(lockState);
        }

        [HttpGet("islocked/{resourceId}/applicationSessionId/{applicationSessionId}/resourceType/{resourceType}")]
        [ProducesResponseType(typeof(IsLockedDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<IsLockedDto>> GetIsLocked(string company, long resourceId, string applicationSessionId, string resourceType)
        {
            var lockState = await _lockQueries.GetLockStateAsync(company, resourceId, applicationSessionId, resourceType);
            var response = new IsLockedDto()
            {
                IsLocked = lockState.IsLocked,
                Message = LockMessage.GenerateLockMessage(lockState)
            };
            return Ok(response);
        }

        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> LockResource(
            string company,
            [FromBody, Required] LockResourceCommand lockResourceCommand)
        {
            lockResourceCommand.CompanyId = company;

            var locks = await _mediator.Send(MapLockResourceCommand(lockResourceCommand));

            return Ok(locks);
        }

        private static readonly Dictionary<string, LockResourceCommand> ResourceTypeLockCommandDictionary = new Dictionary<string, LockResourceCommand>()
        {
            { ResourceType.Contract,  new LockContractCommand() },
            { ResourceType.Charter,  new LockCharterCommand() },
            { ResourceType.FxDeal,  new LockFxDealCommand() },
            { ResourceType.UserAccount,  new LockUserAccountCommand() },
            { ResourceType.UserProfile,  new LockUserProfileCommand() },
            { ResourceType.CostMatrix,  new LockCostMatrixCommand() },
            { ResourceType.CashDocument,  new LockCashDocumentCommand() },
            { ResourceType.Invoice,  new LockInvoiceCommand() },
            { ResourceType.AccountingDocument,  new LockAccountingDocumentCommand() },
        };

        private static LockResourceCommand MapLockResourceCommand(LockResourceCommand lockResourceCommand)
        {
            LockResourceCommand command = ResourceTypeLockCommandDictionary[lockResourceCommand.ResourceType];
            command.CompanyId = lockResourceCommand.CompanyId;
            command.ApplicationSessionId = lockResourceCommand.ApplicationSessionId;
            command.FunctionalContext = lockResourceCommand.FunctionalContext;
            command.ResourceCode = lockResourceCommand.ResourceCode;
            command.ResourceId = lockResourceCommand.ResourceId;
            command.ResourceType = lockResourceCommand.ResourceType;
            return command;
        }

        [HttpPost("unlock")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UnlockResource(
            string company,
            [FromBody, Required] UnlockResourceCommand unlockResourceCommand)
        {
            unlockResourceCommand.CompanyId = company;
            var locks = await _mediator.Send(MapUnlockResourceCommand(unlockResourceCommand));
            return NoContent();
        }

        private static readonly Dictionary<string, UnlockResourceCommand> ResourceTypeUnlockCommandDictionary = new Dictionary<string, UnlockResourceCommand>()
        {
            { ResourceType.Contract,  new UnlockContractCommand() },
            { ResourceType.Charter,  new UnlockCharterCommand() },
            { ResourceType.FxDeal,  new UnlockFxDealCommand() },
            { ResourceType.UserAccount,  new UnlockUserAccountCommand() },
            { ResourceType.UserProfile,  new UnlockUserProfileCommand() },
            { ResourceType.CostMatrix,  new UnlockCostMatrixCommand() },
            { ResourceType.CashDocument,  new UnlockCashDocumentCommand() },
            { ResourceType.Invoice,  new UnlockInvoiceCommand() },
            { ResourceType.AccountingDocument,  new UnlockAccountingDocumentCommand() },
        };

        private static UnlockResourceCommand MapUnlockResourceCommand(UnlockResourceCommand lockResourceCommand)
        {
            var command = ResourceTypeUnlockCommandDictionary[lockResourceCommand.ResourceType];
            command.CompanyId = lockResourceCommand.CompanyId;
            command.ApplicationSessionId = lockResourceCommand.ApplicationSessionId;
            command.FunctionalContext = lockResourceCommand.FunctionalContext;
            command.ResourceCode = lockResourceCommand.ResourceCode;
            command.ResourceId = lockResourceCommand.ResourceId;
            command.ResourceType = lockResourceCommand.ResourceType;
            return command;
        }

        /// <summary>
        /// Deletes a lock.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="deleteLocksCommand">Locks Ids to be deleted.</param>
        [HttpPost("delete")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteLocks(string company, [FromBody] DeleteLocksCommand deleteLocksCommand)
        {
            if (deleteLocksCommand == null)
            {
                throw new ArgumentNullException(nameof(deleteLocksCommand));
            }

            await _mediator.Send(deleteLocksCommand);
            return NoContent();
        }

        /// <summary>
        /// Refresh the lock ownership.
        /// </summary>
        /// <param name="company">Company</param>
        /// <param name="refreshLockOwnershipCommand">Locks Ids to be deleted.</param>
        [HttpPost("refresh")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> RefreshLockOwnership(string company, [FromBody, Required] RefreshLockOwnershipCommand refreshLockOwnershipCommand)
        {
            refreshLockOwnershipCommand.Company = company;
            await _mediator.Send(refreshLockOwnershipCommand);
            return NoContent();
        }

        [HttpDelete("cleansession/{applicationSessionId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<IsLockedDto>> CleanSession(string applicationSessionId)
        {
            var command = new CleanSessionCommand
            {
                ApplicationSessionId = applicationSessionId
            };

            await _mediator.Send(command);

            return NoContent();
        }
    }
}