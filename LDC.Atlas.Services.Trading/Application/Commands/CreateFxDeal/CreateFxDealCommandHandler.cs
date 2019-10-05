using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Execution.Common;
using LDC.Atlas.Execution.Common.Entities;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LDC.Atlas.Services.Trading.Application.Commands.SettleFxDeal;

namespace LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal
{
    public class CreateFxDealCommandHandler : IRequestHandler<CreateFxDealCommand, FxDealReference>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxDealRepository _fxDealRepository;
        private readonly IMapper _mapper;
        private readonly IMasterDataService _masterDataService;
        private readonly IUserService _userService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IIdentityService _identityService;
        private readonly ITransactionDocumentService _transactionDocumentService;

        public CreateFxDealCommandHandler(
            ILogger<CreateFxDealCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IFxDealRepository fxDealRepository,
            IMapper mapper,
            IMasterDataService masterDataService,
            IIdentityService identityService,
            ISystemDateTimeService systemDateTimeService,
            IUserService userService,
            ITransactionDocumentService transactionDocumentService)
        {
            _fxDealRepository = fxDealRepository ?? throw new ArgumentNullException(nameof(fxDealRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _transactionDocumentService = transactionDocumentService ?? throw new ArgumentNullException(nameof(transactionDocumentService));
        }

        public async Task<FxDealReference> Handle(CreateFxDealCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var fxDeal = _mapper.Map<FxDeal>(request);
                var company = await _masterDataService.GetCompanyByIdAsync(request.CompanyId);

                if (company.IsProvinceEnable)
                {
                    fxDeal.ProvinceId = company.DefaultProvinceId;
                    fxDeal.BranchId = company.DefaultBranchId;
                }
                else
                {
                    fxDeal.ProvinceId = null;
                    fxDeal.BranchId = null;
                }

                fxDeal.FxDealStatusId = (int)FxDealStatus.Open;

                IEnumerable<MasterData.Common.Entities.FxTradeType> fxTradeType = await _masterDataService.GetFxTradeTypes(request.CompanyId);

                if (fxDeal.FxTradeTypeId != null)
                {
                    var objectFxTradeType = fxTradeType.FirstOrDefault(x => x.FxTradeTypeId == fxDeal.FxTradeTypeId);

                    if (!objectFxTradeType.IsNdf)
                    {
                        fxDeal.NdfAgreedDate = null;
                        fxDeal.NdfAgreedRate = null;
                    }
                }
                else
                {
                    fxDeal.NdfAgreedDate = null;
                    fxDeal.NdfAgreedRate = null;
                }               

                //await FxDealCommonRules.ValidateFxDeal(fxDeal, _identityService, _masterDataService, _userService, _systemDateTimeService);

                // The length of this value must be of 6 digits, prefixed by zeros if the number is shorter.
                fxDeal.Reference = DateTime.UtcNow.ToString("HHmmss");

                var newFxDealId = await _fxDealRepository.CreateFxDealAsync(fxDeal, request.CompanyId);

                _logger.LogInformation("New fx deal created with id {Atlas_FxDealId}.", newFxDealId);

                _unitOfWork.Commit();

                return newFxDealId;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
