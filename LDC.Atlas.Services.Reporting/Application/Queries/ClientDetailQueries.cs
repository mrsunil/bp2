using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries
{
    public class ClientDetailQueries : BaseRepository, IClientDetailsQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IGridService _gridQueries;

        public ClientDetailQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IGridService gridQueries)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
        }

        public async Task<IEnumerable<ReferentialCounterPartySearchResultDto>> SearchReferentialCounterPartyListAsync(string company, EntitySearchRequest searchRequest, bool showDuplicateCounterpartyData = false)
        {
            var grideCode = "referentialCounterPartiesGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_ReferentialCounterPartyListAndSearch]", columnConfiguration, companyDate);

            var referentialCounterPartySearchResult = await ExecuteDynamicQueryAsync<ReferentialCounterPartySearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            if (showDuplicateCounterpartyData == false)
            {
                var result = referentialCounterPartySearchResult.ToList();
                return result.GroupBy(counterpartyData => counterpartyData.CounterpartyCode).Select(duplicateRow => duplicateRow.First());
            }

            return referentialCounterPartySearchResult.ToList();
        }

        public async Task<IEnumerable<ReferentialBulkEditDto>> SearchBulkEditReferentialCounterPartyListAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "bulkEditGrid";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_BulkEditCounterPartyListAndSearch]", columnConfiguration, companyDate);

            var referentialCounterPartySearchResult = await ExecuteDynamicQueryAsync<ReferentialBulkEditDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return referentialCounterPartySearchResult.ToList();
        }
    }
}
