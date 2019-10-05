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
    public class PaymentTermsCommandsHandler : IRequestHandler<PaymentTermsUpdateCommands>
    {
        private readonly ILogger<PaymentTermsCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPaymentTermsRepository _paymentTermsRepository;

        public PaymentTermsCommandsHandler(
            ILogger<PaymentTermsCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPaymentTermsRepository paymentTermsConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _paymentTermsRepository = paymentTermsConfigurationRepository ?? throw new ArgumentNullException(nameof(paymentTermsConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a contract term configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update contractTerms and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(PaymentTermsUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _paymentTermsRepository.UpdatePaymentTerm(request.MasterDataList);

                _logger.LogInformation("Payment Terms updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch (Exception ex)
            {
                _logger.LogError("Payment Terms update failed. Error : " + ex.Message);
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}