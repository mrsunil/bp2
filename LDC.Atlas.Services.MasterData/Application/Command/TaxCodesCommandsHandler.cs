using AutoMapper;
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
using LDC.Atlas.Application.Core.Services;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class TaxCodesCommandsHandler :
        IRequestHandler<TaxCodesUpdateCommands>
    {

        private readonly ILogger<TaxCodesCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ITaxCodeRepository _taxCodesRepository;

        public TaxCodesCommandsHandler(
            ILogger<TaxCodesCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ITaxCodeRepository taxCodesConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _taxCodesRepository = taxCodesConfigurationRepository ?? throw new ArgumentNullException(nameof(taxCodesConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a Price unit configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Price unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(TaxCodesUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _taxCodesRepository.UpdateTaxCodes(request.MasterDataList);

                _logger.LogInformation("TaxCodes updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("TaxCodes update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

    }
}
