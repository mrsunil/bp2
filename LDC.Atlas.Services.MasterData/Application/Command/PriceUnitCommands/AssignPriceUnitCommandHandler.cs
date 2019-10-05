using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands
{
    public class AssignPriceUnitCommandHandler :
        IRequestHandler<AssignPriceUnitCommand>
    {
        private readonly ILogger<AssignPriceUnitCommandHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPriceUnitRepository _priceUnitRepository;
        private readonly IWeightUnitRepository _weightUnitRepository;

        public AssignPriceUnitCommandHandler(
            ILogger<AssignPriceUnitCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPriceUnitRepository priceUnitRepository,
            IWeightUnitRepository weightUnitRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _priceUnitRepository = priceUnitRepository ?? throw new ArgumentNullException(nameof(priceUnitRepository));
            _weightUnitRepository = weightUnitRepository ?? throw new ArgumentNullException(nameof(weightUnitRepository));
        }

        public async Task<Unit> Handle(AssignPriceUnitCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                // If a MasterData assigned to a company has one or several fields which refer to another MasterData,
                // we must check that the reffered MasterData is also assigned to the same company.
                var priceUnits = await _priceUnitRepository.GetAllAsync(null, pricesUnitsIds: request.MasterDataList);

                var weightUnitIds = priceUnits.Where(p => p.WeightUnitId.HasValue).Select(p => p.WeightUnitId.Value).ToList();
                var weightUnitAssignments = await _weightUnitRepository.GetAssignmentsAsync(weightUnitIds);

                var unAssignments = weightUnitAssignments
                    .Where(a => request.AssignedCompanies.Contains(a.CompanyId))
                    .Where(a => a.AssignmentState != Entities.CompanyAssignmentState.All);
                if (unAssignments.Any())
                {
                    var companyCodes = string.Join(", ", unAssignments.Select(a => a.CompanyCode));
                    throw new AtlasBusinessException($"The weight units linked to these price units are not all assigned to companies {companyCodes}");
                }

                await _priceUnitRepository.AssignAsync(request.CompanyId, request.MasterDataList, request.AssignedCompanies, request.DeassignedCompanies);

                _logger.LogInformation("Price Units have been successfully assigned.");
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
