using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class StartStopPostingProcessCommandHandler : IRequestHandler<StartStopPostingProcessCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IProcessMessageService _processMessageService;

        public StartStopPostingProcessCommandHandler(
          ILogger<StartStopPostingProcessCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IIdentityService identityService,
          IMapper mapper,
          IProcessMessageService processMessageService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
        }

        public async Task<bool> Handle(StartStopPostingProcessCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _processMessageService.StartStopProcessType(ProcessType.AtlasPostingProcessor, request.IsActive);

                _unitOfWork.Commit();

                _logger.LogInformation("Posting Process Start/Stop successfully.");

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