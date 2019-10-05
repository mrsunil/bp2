using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Services.Reporting.Entities;
using LDC.Atlas.Services.Reporting.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Commands
{
    public class ReportCommandsHandler :
        IRequestHandler<CreateReportCriteriasCommand, int>
    {
        private readonly ILogger<ReportCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IReportRepository _reportRepository;
        private readonly IGridService _gridQueries;
        private readonly ISystemDateTimeService _systemDateTimeService;

        public ReportCommandsHandler(
            ILogger<ReportCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IReportRepository reportRepository,
            IGridService gridQueries,
            ISystemDateTimeService systemDateTimeService)
        {
            _reportRepository = reportRepository ?? throw new ArgumentNullException(nameof(reportRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
        }

        public async Task<int> Handle(CreateReportCriteriasCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var grid = await _gridQueries.GetGrid(request.ReportCriterias.GridName, request.Company);

                if (grid == null)
                {
                    throw new Exception($"No grid configuration found for {request.ReportCriterias.GridName}.");
                }

                var dynamicQueryDefinition = Mapper.Map<DynamicQueryDefinition>(request.ReportCriterias);

                var columnConfiguration = Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

                var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);

                var criterias = DynamicQueryBuilder.BuildReportFilters(dynamicQueryDefinition, columnConfiguration, companyDate);

                ReportPredicate predicate = new ReportPredicate
                {
                    CompanyId = request.Company,
                    Criterias = criterias.Select(c => new ReportCriteria { Value = c.Item1, TableAlias = c.Item2 })
                };

                var predicateId = await _reportRepository.CreateReportCriteriasAsync(predicate);

                _unitOfWork.Commit();

                _logger.LogInformation("New report criterias created with id {Atlas_PredicateId}.", predicateId);

                return predicateId;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
