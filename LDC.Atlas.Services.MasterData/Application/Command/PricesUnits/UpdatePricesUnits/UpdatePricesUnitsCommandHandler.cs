using AutoMapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command.UpdatePricesUnits
{
    public class UpdatePricesUnitsCommandHandler :
        IRequestHandler<UpdatePricesUnitsCommand>,
        IRequestHandler<UpdatePricesUnitsLocalCommand>
    {
        private readonly ILogger<UpdatePricesUnitsCommandHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPriceUnitRepository _priceUnitRepository;

        public UpdatePricesUnitsCommandHandler(
            ILogger<UpdatePricesUnitsCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPriceUnitRepository priceUnitRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _priceUnitRepository = priceUnitRepository ?? throw new ArgumentNullException(nameof(priceUnitRepository));
        }

        public async Task<Unit> Handle(UpdatePricesUnitsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                IEnumerable<PriceUnit> priceUnits = _mapper.Map<IEnumerable<PriceUnit>>(request.MasterDataList);
                await _priceUnitRepository.UpdateAsync(priceUnits, request.CompanyId, true);

                _logger.LogInformation("Price Units have been successfully updated.");
                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdatePricesUnitsLocalCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                IEnumerable<PriceUnit> priceUnits = _mapper.Map<IEnumerable<PriceUnit>>(request.MasterDataList);
                await _priceUnitRepository.UpdateAsync(priceUnits, request.CompanyId, false);

                _logger.LogInformation("Price Units have been successfully updated.");
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
