using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class DeallocateSectionCommandHandler :
        IRequestHandler<DeallocateSectionCommand>, IRequestHandler<BulkDeallocateSectionCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITradeAllocationRepository _tradeAllocationRepository;
        private readonly IFreezeRepository _freezeRepository;

        public DeallocateSectionCommandHandler(
            IUnitOfWork unitOfWork,
            ITradeAllocationRepository tradeAllocationRepository,
            IFreezeRepository freezeRepository)
        {
            _tradeAllocationRepository = tradeAllocationRepository ?? throw new ArgumentNullException(nameof(tradeAllocationRepository));
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public async Task<Unit> Handle(DeallocateSectionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.Company, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be updated in a freeze if the month is closed.");
                    }
                }

                await _tradeAllocationRepository.DeallocateAsync(request.SectionId, request.ReInstateTrafficDetails, request.Company, request.DataVersionId);

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }


        public async Task<Unit> Handle(BulkDeallocateSectionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.Company, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be updated in a freeze if the month is closed.");
                    }
                }

                await _tradeAllocationRepository.BulkDeallocateAsync(request);

                _unitOfWork.Commit();

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
