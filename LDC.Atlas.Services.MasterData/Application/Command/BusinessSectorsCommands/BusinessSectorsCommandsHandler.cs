using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.MasterData.Entities;
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
    public class BusinessSectorsCommandsHandler : IRequestHandler<BusinessSectorsUpdateCommands>
    {
        private readonly ILogger<BusinessSectorsCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IBusinessSectorRepository _businessSectorRepository;

        public BusinessSectorsCommandsHandler(
            ILogger<BusinessSectorsCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IBusinessSectorRepository businessSectorConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _businessSectorRepository = businessSectorConfigurationRepository ?? throw new ArgumentNullException(nameof(businessSectorConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a business sector configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update businessSector and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(BusinessSectorsUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _businessSectorRepository.UpdateBusinessSector(request.MasterDataList);

                _logger.LogInformation("Business Sectors updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch (Exception ex)
            {
                _logger.LogError("business Sectors update failed. Error : " + ex.Message);
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}