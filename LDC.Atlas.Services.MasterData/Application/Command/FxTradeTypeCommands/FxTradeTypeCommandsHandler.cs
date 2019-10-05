using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class FxTradeTypeCommandsHandler :
        IRequestHandler<FxTradeTypeGlobalUpdateCommands>,
        IRequestHandler<FxTradeTypeLocalUpdateCommands>
    {

        private readonly ILogger<FxTradeTypeCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IFxTradeTypeRepository _fxTradeTypeRepository;

        public FxTradeTypeCommandsHandler(
            ILogger<FxTradeTypeCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IFxTradeTypeRepository fxTradeTypeConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _fxTradeTypeRepository = fxTradeTypeConfigurationRepository ?? throw new ArgumentNullException(nameof(fxTradeTypeConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of  Fx Trade Type
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Price unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(FxTradeTypeGlobalUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _fxTradeTypeRepository.UpdateFxTradeType(request.MasterDataList, true,request.Company);

                _logger.LogInformation("Fx Trade Type updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Fx Trade Type update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Handling the "update" event of Fx Trade Type
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Price unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(FxTradeTypeLocalUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
               await _fxTradeTypeRepository.UpdateFxTradeType(request.MasterDataList, false, request.Company);

                _logger.LogInformation("Fx Trade Type updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Fx Trade Type update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Handling the "create" event of a commodity configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to create commodities and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(FxTradeTypeCreateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
               // await _fxTradeTypeRepository.CreateArbitration(request.MasterDataList);

                _logger.LogInformation("Fx Trade Type created.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Fx Trade Type create failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
