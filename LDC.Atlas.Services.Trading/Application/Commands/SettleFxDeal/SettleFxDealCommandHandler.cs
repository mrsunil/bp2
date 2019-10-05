using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
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

namespace LDC.Atlas.Services.Trading.Application.Commands.SettleFxDeal
{
    public class SettleFxDealCommandHandler : IRequestHandler<FxDealDocumentCreationCommand, List<TransactionCreationResponse>>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxDealRepository _fxDealRepository;
        private readonly IMapper _mapper;
        private readonly ITransactionDocumentService _transactionDocumentService;
        private readonly IMasterDataService _masterDataService;

        public SettleFxDealCommandHandler(
            ILogger<SettleFxDealCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IFxDealRepository fxDealRepository,
            IMapper mapper,
            ITransactionDocumentService transactionDocumentService,
            IMasterDataService masterDataService)
        {
            _fxDealRepository = fxDealRepository ?? throw new ArgumentNullException(nameof(fxDealRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _transactionDocumentService = transactionDocumentService ?? throw new ArgumentNullException(nameof(transactionDocumentService));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
        }

        public async Task<List<TransactionCreationResponse>> Handle(FxDealDocumentCreationCommand request, CancellationToken cancellationToken)
        {
            List<TransactionCreationResponse> fxDealDocumentCreationResponses = new List<TransactionCreationResponse>();
            foreach (var fxDeal in request.FxDealIds)
            {
                _unitOfWork.BeginTransaction();
                try
                {
                    TransactionCreationResponse dealCurrencyDocumentGenerationResponse = null;

                    IEnumerable<MasterData.Common.Entities.FxTradeType> fxTradeType = await _masterDataService.GetFxTradeTypes(request.Company);
                    var objectFxTradeType = fxDeal.FxTradeTypeId == null ? null :  fxTradeType.FirstOrDefault(x => x.FxTradeTypeId == fxDeal.FxTradeTypeId);

                    if (objectFxTradeType == null || !objectFxTradeType.IsNdf)
                    {
                        dealCurrencyDocumentGenerationResponse = await CreateFJDocumentDealCurrency(fxDeal.FxDealId, fxDeal.FxDealDocumentId, fxDeal.CurrencyCode, fxDeal.MaturityDate, request.IsReversal, request.Company);
                    }

                    var settlementCurrencyDocumentGenerationResponse = await CreateFJDocumentSettlementCurrency(fxDeal.FxDealId, fxDeal.FxSettlementDocumentId, fxDeal.SettlementCurrencyCode, fxDeal.MaturityDate, request.IsReversal, request.Company);
                    if (request.IsReversal == true)
                    {
                        await _fxDealRepository.DeleteFxDealAsync(fxDeal.FxDealId, request.Company);
                        _logger.LogWarning("Settled Fx deal with id {Atlas_FxDealId} deleted.", fxDeal.FxDealId);
                    }
                    else
                    {
                        await _fxDealRepository.UpdateSettleFxDeals(new List<long> { fxDeal.FxDealId }, request.Company);
                        _logger.LogWarning("Fx deal settled with id {Atlas_FxDealId}.", fxDeal.FxDealId);
                    }

                    _unitOfWork.Commit();

                    if (objectFxTradeType == null || !objectFxTradeType.IsNdf)
                    { 
                        fxDealDocumentCreationResponses.Add(dealCurrencyDocumentGenerationResponse);
                    }

                    fxDealDocumentCreationResponses.Add(settlementCurrencyDocumentGenerationResponse);
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }
            }

            return fxDealDocumentCreationResponses;
        }

        private async Task<TransactionCreationResponse> CreateFJDocumentDealCurrency(long fxDealId, long dealTransactionDocumentId, string dealCurrency, DateTime maturityDate, bool isReversal, string company)
        {
            try
            {
                TransactionDocument transactionDocument = new TransactionDocument();
                transactionDocument.TransactionDocumentTypeId = (int)MasterDocumentType.FJ;
                transactionDocument.TransactionDocumentId = dealTransactionDocumentId;
                transactionDocument.DocumentDate = maturityDate;
                transactionDocument.CurrencyCode = dealCurrency;
                transactionDocument.AuthorizedForPosting = true;
                transactionDocument.ToInterface = true;
                transactionDocument.Company = company;

                var transactionDocumentResponse = await _transactionDocumentService.CreateTransactionDocument(transactionDocument);

                if (transactionDocumentResponse != null && transactionDocumentResponse.TransactionDocumentId > 0)
                {
                    if (!isReversal)
                    {
                        await _transactionDocumentService.CreateFxDealSettlementMapping(transactionDocumentResponse.TransactionDocumentId, fxDealId, company, (int)FxSettlementDocumentType.FxDeal);
                    }

                    await _transactionDocumentService.EnqueueMessage(Convert.ToString(transactionDocumentResponse.TransactionDocumentId, System.Globalization.CultureInfo.InvariantCulture), company);
                }

                return transactionDocumentResponse;
            }
            catch
            {
                throw;
            }
        }

        private async Task<TransactionCreationResponse> CreateFJDocumentSettlementCurrency(long fxDealId, long settlementTransactionDocumentId, string settlementCurrency, DateTime maturityDate, bool isReversal, string company)
        {
            try
            {
                TransactionDocument transactionDocument = new TransactionDocument();
                transactionDocument.TransactionDocumentTypeId = (int)MasterDocumentType.FJ;
                transactionDocument.TransactionDocumentId = settlementTransactionDocumentId;
                transactionDocument.DocumentDate = maturityDate;
                transactionDocument.CurrencyCode = settlementCurrency;
                transactionDocument.AuthorizedForPosting = true;
                transactionDocument.ToInterface = true;
                transactionDocument.Company = company;

                var transactionDocumentResponse = await _transactionDocumentService.CreateTransactionDocument(transactionDocument);

                if (transactionDocumentResponse.TransactionDocumentId > 0)
                {
                    if (!isReversal)
                    {
                        await _transactionDocumentService.CreateFxDealSettlementMapping(transactionDocumentResponse.TransactionDocumentId, fxDealId, company, (int)FxSettlementDocumentType.FxSettlement);
                    }

                    await _transactionDocumentService.EnqueueMessage(Convert.ToString(transactionDocumentResponse.TransactionDocumentId, System.Globalization.CultureInfo.InvariantCulture), company);
                }

                return transactionDocumentResponse;
            }
            catch
            {
                throw;
            }
        }
    }
}
