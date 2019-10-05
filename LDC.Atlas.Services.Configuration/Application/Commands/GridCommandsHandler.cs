using AutoMapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class GridCommandsHandler : IRequestHandler<UpdateGridCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGridRepository _gridRepository;
        private readonly IMapper _mapper;

        public GridCommandsHandler(
            ILogger<GridCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IGridRepository gridConfigurationRepository,
            IMapper mapper)
        {
            _gridRepository = gridConfigurationRepository ?? throw new ArgumentNullException(nameof(gridConfigurationRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Unit> Handle(UpdateGridCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var grid = _mapper.Map<Grid>(request);

                await _gridRepository.UpdateGridAsync(grid);

                _unitOfWork.Commit();

                _logger.LogInformation("Grid configuration with id {Atlas_GridId} updated.", request.GridCode);
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
