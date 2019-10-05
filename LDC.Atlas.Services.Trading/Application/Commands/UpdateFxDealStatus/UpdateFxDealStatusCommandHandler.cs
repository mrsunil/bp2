using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDealStatus
{
    public class UpdateFxDealStatusCommandHandler : IRequestHandler<UpdateFxDealStatusCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxDealRepository _fxDealRepository;

        public UpdateFxDealStatusCommandHandler(
            ILogger<UpdateFxDealStatusCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IFxDealRepository fxDealRepository)
        {
            _fxDealRepository = fxDealRepository ?? throw new ArgumentNullException(nameof(fxDealRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Unit> Handle(UpdateFxDealStatusCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _fxDealRepository.UpdateFxDealStatus(request.CompanyId);

                _logger.LogInformation("Fx deal status updated for campany {Atlas_CompanyId} updated.", request.CompanyId);

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
