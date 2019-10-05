using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDeal
{
    public class DeleteFxDealCommandHandler : IRequestHandler<DeleteFxDealCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxDealRepository _fxDealRepository;
        private readonly IMapper _mapper;

        public DeleteFxDealCommandHandler(
            ILogger<DeleteFxDealCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IFxDealRepository fxDealRepository,
            IMapper mapper)
        {
            _fxDealRepository = fxDealRepository ?? throw new ArgumentNullException(nameof(fxDealRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Unit> Handle(DeleteFxDealCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                // Load fx deal from DB
                FxDeal fxDeal = new FxDeal { FxDealStatusId = (int)FxDealStatus.Open };

                if (fxDeal == null)
                {
                    throw new NotFoundException("fxDeal", request.FxDealId);
                }

                // Check fx deal status
                if (fxDeal.FxDealStatusId == (int)FxDealStatus.Open
                    || (fxDeal.FxDealStatusId == (int)FxDealStatus.Settled && !fxDeal.Sections.Any()))
                {
                    await _fxDealRepository.DeleteFxDealAsync(request.FxDealId, request.Company);

                    if (fxDeal.FxDealStatusId == (int)FxDealStatus.Settled)
                    {
                        _logger.LogWarning("Settled Fx deal with id {Atlas_FxDealId} deleted.", request.FxDealId);
                    }
                    else
                    {
                        _logger.LogInformation("Fx deal with id {Atlas_FxDealId} deleted.", request.FxDealId);
                    }

                    _unitOfWork.Commit();
                }
                else
                {
                    throw new AtlasBusinessException("This Fx deal cannot be deleted.");
                }
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }
    }
}
