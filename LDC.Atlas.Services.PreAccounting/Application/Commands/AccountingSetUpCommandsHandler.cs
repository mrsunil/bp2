using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class AccountingSetUpCommandsHandler :
        IRequestHandler<UpdateAccountingSetUpCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccountingSetUpRepository _accountingSetUpRepository;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;

        public AccountingSetUpCommandsHandler(
              ILogger<AccountingSetUpCommandsHandler> logger,
              IUnitOfWork unitOfWork,
              IAccountingSetUpRepository accountingSetUpRepository,
              IIdentityService identityService,
              IMapper mapper,
              IAuthorizationService authorizationService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _accountingSetUpRepository = accountingSetUpRepository ?? throw new ArgumentNullException(nameof(accountingSetUpRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
        }

        public async Task<Unit> Handle(UpdateAccountingSetUpCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var accountingSetUp = _mapper.Map<AccountingSetup>(request);
                await _accountingSetUpRepository.UpdateAccountingSetUpAsync(accountingSetUp);
                _unitOfWork.Commit();
                _logger.LogInformation("Accounting Setup is updated for the company {Atlas_CompanyId}.", request.CompanyId);
                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
