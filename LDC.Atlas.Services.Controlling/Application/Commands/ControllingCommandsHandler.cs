using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Controlling.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Application.Commands
{
    public class ControllingCommandsHandler : IRequestHandler<ProcessFreezeRecalculationCommand>
    {
        private readonly ILogger<ControllingCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFreezeRecalculationRepository _freezeRecalculationRepository;

        public ControllingCommandsHandler(
           ILogger<ControllingCommandsHandler> logger,
           IIdentityService identityService,
           IUnitOfWork unitOfWork,
           IFreezeRecalculationRepository freezeRecalculationRepository)
        {
            _freezeRecalculationRepository = freezeRecalculationRepository ?? throw new ArgumentNullException(nameof(freezeRecalculationRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        }

        public async Task<Unit> Handle(ProcessFreezeRecalculationCommand request, CancellationToken cancellationToken)
        {
           await _freezeRecalculationRepository.LaunchFreezeRecalculationAsync(request.UserId, request.DataVersionId, request.SectionId, request.RecalculateAccEntries);

            return Unit.Value;
        }
    }
}
