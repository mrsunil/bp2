using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LDC.Atlas.DataAccess;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.Extensions.Logging;
using LDC.Atlas.Infrastructure.Services;
using System.Threading;
using LDC.Atlas.Services.MasterData.Entities;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class CounterpartyCommandsHandler : IRequestHandler<AddUpdateCounterpartyCommand, IEnumerable<int>>,
        IRequestHandler<BulkUpdateCounterpartyCommand, IEnumerable<int>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICounterpartyRepository _counterpartyRepository;
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IProcessMessageService _processMessageService;

        public CounterpartyCommandsHandler(
           ILogger<CounterpartyCommandsHandler> logger,
           IUnitOfWork unitOfWork,
           ICounterpartyRepository counterpartyRepository,
           IIdentityService identityService,
           ISystemDateTimeService systemDateTimeService,
           IMapper mapper,
           IAuthorizationService authorizationService,
           IProcessMessageService processMessageService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _counterpartyRepository = counterpartyRepository ?? throw new ArgumentNullException(nameof(counterpartyRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
        }

        public async Task<IEnumerable<int>> Handle(AddUpdateCounterpartyCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                List<Counterparty> counterpartyList = new List<Counterparty>();
                var counterparty = await MapCommandToCounterparty(request);
                counterpartyList.Add(counterparty);
                var counterpartyIds = await _counterpartyRepository.AddUpdateCounterpartyAsync(counterpartyList, request.Company);
                if (counterparty.CounterpartyID != null && counterparty.CounterpartyID > 0)
                {
                    await _counterpartyRepository.DeleteCounterpartyDetailsAsync(counterpartyList, request.Company);
                }
                _unitOfWork.Commit();
                return counterpartyIds;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<int>> Handle(BulkUpdateCounterpartyCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                List<Counterparty> counterpartyList = new List<Counterparty>();
                foreach (var counterpartyCommand in request.CounterpartyList)
                {
                    var counterparty = await MapCommandToCounterparty(counterpartyCommand);
                    counterpartyList.Add(counterparty);
                }

                var counterpartyIds = await _counterpartyRepository.BulkUpdateCounterpartyAsync(counterpartyList, request.Company);

                _unitOfWork.Commit();
                return counterpartyIds;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<Counterparty> MapCommandToCounterparty(AddUpdateCounterpartyCommand command)
        {
            Counterparty counterparty = new Counterparty();
            counterparty.CounterpartyID = command.CounterpartyID;
            counterparty.CounterpartyCode = command.CounterpartyCode;
            counterparty.Description = command.Description;
            counterparty.CounterpartyType = command.CounterpartyType;
            counterparty.MDMId = command.MDMId;
            counterparty.IsDeactivated = command.IsDeactivated;
            counterparty.CounterpartyTradeStatusId = command.CounterpartyTradeStatusId;
            counterparty.HeadofFamily = command.HeadofFamily;
            counterparty.CountryId = command.CountryId;
            counterparty.ProvinceId = command.ProvinceId;
            counterparty.C2CCode = command.C2CCode;
            counterparty.MDMCategoryCode = command.MDMCategoryCode;
            counterparty.VATRegistrationNumber = command.VATRegistrationNumber;
            counterparty.FiscalRegistrationNumber = command.FiscalRegistrationNumber;
            counterparty.ContractTermId = command.ContractTermId;
            counterparty.ACManagerId = command.ACManagerId;
            counterparty.DepartmentId = command.DepartmentId;
            counterparty.AlternateMailingAddress1 = command.AlternateMailingAddress1;
            counterparty.AlternateMailingAddress2 = command.AlternateMailingAddress2;
            counterparty.AlternateMailingAddress3 = command.AlternateMailingAddress3;
            counterparty.AlternateMailingAddress4 = command.AlternateMailingAddress4;
            counterparty.IntroductoryBrocker = command.IntroductoryBrocker;

            counterparty.CounterpartyAddresses = command.CounterpartyAddresses;
            counterparty.CounterpartyBankAccounts = command.CounterpartyBankAccounts;
            counterparty.CounterpartyBankAccountIntermediaries = command.CounterpartyBankAccountIntermediaries;
            counterparty.CounterpartyContacts = command.CounterpartyContacts;
            counterparty.CounterpartyCompanies = command.CounterpartyCompanies;
            counterparty.CounterpartyTaxes = command.CounterpartyTaxes;
            counterparty.CounterpartyAccountTypes = command.CounterpartyAccountTypes;
            counterparty.CounterpartyMdmCategory = command.CounterpartyMdmCategory;
            return counterparty;
        }
    }
}