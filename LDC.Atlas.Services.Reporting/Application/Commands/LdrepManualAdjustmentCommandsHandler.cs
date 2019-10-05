using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Entities;
using LDC.Atlas.Services.Reporting.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Commands
{
    public class LdrepManualAdjustmentCommandsHandler : IRequestHandler<CreateUpdateLdrepManualAdjustmentCommand, LdrepManualAdjustment>,
        IRequestHandler<DeleteLdrepManualAdjustmentCommand>
    {
        private readonly ILogger<LdrepManualAdjustmentCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILdrepManualAdjustmentRepository _ldrepManualAdjustmentRepository;
        private readonly IMapper _mapper;

        public LdrepManualAdjustmentCommandsHandler(
            ILogger<LdrepManualAdjustmentCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            ILdrepManualAdjustmentRepository ldrepManualAdjustmentRepository,
            IMapper mapper)
        {
            _ldrepManualAdjustmentRepository = ldrepManualAdjustmentRepository ?? throw new ArgumentNullException(nameof(ldrepManualAdjustmentRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<LdrepManualAdjustment> Handle(CreateUpdateLdrepManualAdjustmentCommand request, CancellationToken cancellationToken)
        {
            var ldrepManualAdjustment = _mapper.Map<LdrepManualAdjustment>(request);

            _unitOfWork.BeginTransaction();
            try
            {
                await _ldrepManualAdjustmentRepository.CreateUpdateLdrepManualAdjustment(ldrepManualAdjustment);

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return ldrepManualAdjustment;
        }

        public async Task<Unit> Handle(DeleteLdrepManualAdjustmentCommand request, CancellationToken cancellationToken)
        {
            var ldrepManualAdjustment = _mapper.Map<LdrepManualAdjustment>(request);

            _unitOfWork.BeginTransaction();
            try
            {
                await _ldrepManualAdjustmentRepository.DeleteLdrepManualAdjustment(ldrepManualAdjustment);

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
