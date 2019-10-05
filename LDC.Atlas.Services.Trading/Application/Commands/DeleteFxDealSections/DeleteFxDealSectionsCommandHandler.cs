using AutoMapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDealSections
{
    public class DeleteFxDealSectionsCommandHandler : IRequestHandler<DeleteFxDealSectionsCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxDealRepository _fxDealRepository;
        private readonly IMapper _mapper;

        public DeleteFxDealSectionsCommandHandler(
            ILogger<DeleteFxDealSectionsCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IFxDealRepository fxDealRepository,
            IMapper mapper)
        {
            _fxDealRepository = fxDealRepository ?? throw new ArgumentNullException(nameof(fxDealRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<Unit> Handle(DeleteFxDealSectionsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _fxDealRepository.DeleteFxDealSectionsAsync(request.SectionIds, request.FxDealId, request.CompanyId);

                _logger.LogInformation("Sections have been deleted for fx deal with id {Atlas_FxDealId}.", request.FxDealId);

                _unitOfWork.Commit();
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
