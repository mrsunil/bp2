using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Commands
{
    public class AuditCommandsHandler :
        IRequestHandler<ProcessDataChangeLogsRequest>
    {
        private readonly ILogger<ReportCommandsHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditRepository _auditRepository;

        public AuditCommandsHandler(
            ILogger<ReportCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IAuditRepository auditRepository)
        {
            _auditRepository = auditRepository ?? throw new ArgumentNullException(nameof(auditRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Unit> Handle(ProcessDataChangeLogsRequest request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _auditRepository.ProcessDataChangeLogAsync(request.ChangeLogId);

                _unitOfWork.Commit();

                _logger.LogInformation("Processing of DataChangeLog {Atlas_ChangeLogId} has been finished.", request.ChangeLogId);

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
