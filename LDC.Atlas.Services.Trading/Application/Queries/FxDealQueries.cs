using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class FxDealQueries : BaseRepository, IFxDealQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IGridService _gridQueries;

        public FxDealQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper, IGridService gridQueries)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
        }

        public async Task<IEnumerable<FxDealSearchResultDto>> SearchFxDealsAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "fxDealList";

            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            if (grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_FxDealsListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var fxDealResults = await ExecuteDynamicQueryAsync<FxDealSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return fxDealResults.ToList();
        }

        public async Task<IEnumerable<FxDealSearchResultDto>> GetFxDealsAsync(string company, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var fxDeals = await ExecuteQueryAsync<FxDealSearchResultDto>(StoredProcedureNames.ListFxDeals, queryParameters, true);

            return fxDeals.ToList();
        }

        public async Task<IEnumerable<CounterpartyDto>> GetBankBrokerAsync(string company, EntitySearchRequest searchRequest, GridDto grid)
        {
            var dynamicQueryDefinition = AutoMapper.Mapper.Map<DynamicQueryDefinition>(searchRequest);
            var columnConfiguration = AutoMapper.Mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            BuildQueryResult buildQueryResult;

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);
            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition,
                    "[Configuration].[Vw_BankBrokerCounterPartyListAndSearch]", columnConfiguration, companyDate, null, null);
            var bankResults = await ExecuteDynamicQueryAsync<CounterpartyDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return bankResults.ToList();
        }

        public async Task<FxDealDto> GetFxDealByIdAsync(long fxDealId, string company, int? dataVersionId = null)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@FxDeaId", fxDealId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            FxDealDto result;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetFxDealById, queryParameters, true))
            {
                result = (await grid.ReadAsync<FxDealDto>()).FirstOrDefault();

                if (result != null)
                {
                    result.Sections = await grid.ReadAsync<FxDealSectionDto>();

                    result.TotalApplied = result.Sections.Sum(s => s.CoverApplied);
                    result.Balance = result.Amount - result.TotalApplied;
                }
            }

            return result;
        }

        public async Task<IEnumerable<FxDealSectionDto>> GetFxDealSectionsAsync(long fxDealId, string company, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@FxDealId", fxDealId);
            queryParameters.Add("@CompanyId", company);

            var sections = await ExecuteQueryAsync<FxDealSectionDto>(StoredProcedureNames.ListFxDealSections, queryParameters, true);

            return sections.ToList();
        }

        public async Task<IEnumerable<FxDealDto>> GetFxDealsDueForSettlementAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);

            var fxDealList = await ExecuteQueryAsync<FxDealDto>(StoredProcedureNames.ListFxDealsDueForSettlement, queryParameters, true);

            return fxDealList.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string GetFxDealById = "[Trading].[usp_GetFxDealById]";
            internal const string ListFxDeals = "[Trading].[usp_ListFxDeals]";
            internal const string ListFxDealSections = "[Trading].[usp_ListFxDealSections]";
            internal const string ListFxDealsDueForSettlement = "[Trading].[usp_ListFxDealsDueForSettlement]";
        }
    }
}
