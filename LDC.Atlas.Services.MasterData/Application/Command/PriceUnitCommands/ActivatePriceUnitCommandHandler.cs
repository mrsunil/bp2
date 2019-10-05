using AutoMapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands
{
    public class ActivatePriceUnitCommandHandler :
        IRequestHandler<ActivatePriceUnitCommand>
    {
        private readonly ILogger<ActivatePriceUnitCommandHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPriceUnitRepository _priceUnitRepository;

        public ActivatePriceUnitCommandHandler(
            ILogger<ActivatePriceUnitCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPriceUnitRepository priceUnitRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _priceUnitRepository = priceUnitRepository ?? throw new ArgumentNullException(nameof(priceUnitRepository));
        }

        public async Task<Unit> Handle(ActivatePriceUnitCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _priceUnitRepository.ActivateAsync(request.CompanyId, request.MasterDataList, request.ActivatedCompanies, request.DeactivatedCompanies);

                _logger.LogInformation("Price Units have been successfully activated.");
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
