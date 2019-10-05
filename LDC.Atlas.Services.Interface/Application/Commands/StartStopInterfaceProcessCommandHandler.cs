using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Interface.Application.Commands
{
    public partial class StartStopInterfaceProcessCommandHandler : IRequestHandler<StartStopInterfaceProcessCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IProcessMessageService _processMessageService;

        public StartStopInterfaceProcessCommandHandler(
          ILogger<StartStopInterfaceProcessCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IProcessMessageService processMessageService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
        }

        public async Task<bool> Handle(StartStopInterfaceProcessCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _processMessageService.StartStopProcessType(ProcessType.AtlasPaymentRequestInterfaceProcessor, request.IsActive);
                await _processMessageService.StartStopProcessType(ProcessType.AtlasAccountingInterfaceProcessor, request.IsActive);

                _unitOfWork.Commit();

                _logger.LogInformation("Interface Process Start/Stop successfully.");

                return request.IsActive;
            }
            catch
            {
                _unitOfWork.Rollback();

                throw;
            }
        }
    }
}
