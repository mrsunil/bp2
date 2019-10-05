using AutoMapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Application.Command.UpdatePricesUnits;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using static LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.PricesUnitsBaseCommands;

namespace LDC.Atlas.Services.MasterData.Application.Command.CreatePricesUnits
{
    public class CreatePricesUnitsCommandHandler : IRequestHandler<CreatePricesUnitsCommand>
    {
        private readonly ILogger<CreatePricesUnitsCommandHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPriceUnitRepository _priceUnitRepository;

        public CreatePricesUnitsCommandHandler(
            ILogger<CreatePricesUnitsCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPriceUnitRepository priceUnitRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _priceUnitRepository = priceUnitRepository ?? throw new ArgumentNullException(nameof(priceUnitRepository));
        }

        public async Task<Unit> Handle(CreatePricesUnitsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                IEnumerable<PriceUnit> priceUnits = _mapper.Map<IEnumerable<PriceUnit>>(request.MasterDataList);
                await _priceUnitRepository.CreateAsync(request.CompanyId, priceUnits);

                _logger.LogInformation("Price Units have been successfully created.");
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
