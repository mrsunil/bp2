using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class PhysicalContractQueries : BaseRepository, IPhysicalContractQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;
        private readonly IGridService _gridQueries;

        public PhysicalContractQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper, IGridService gridQueries)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));

            SqlMapper.SetTypeMap(
               typeof(SectionSummaryDto),
               new ColumnAttributeTypeMapper<SectionSummaryDto>());
            SqlMapper.SetTypeMap(
               typeof(PhysicalContractDtoDeprecated),
               new ColumnAttributeTypeMapper<PhysicalContractDtoDeprecated>());
            SqlMapper.SetTypeMap(
               typeof(TradeDto),
               new ColumnAttributeTypeMapper<TradeDto>());
            SqlMapper.SetTypeMap(
               typeof(CostDto),
               new ColumnAttributeTypeMapper<CostDto>());
            SqlMapper.SetTypeMap(
                typeof(SectionReferenceDto),
                new ColumnAttributeTypeMapper<SectionReferenceDto>());
        }

        public async Task<PhysicalContractDto> GetPhysicalContractByIdAsync(string company, long physicalContractId, long? dataVersionId)
        {
            PhysicalContractDto trade;
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@PhysicalContractId", physicalContractId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetPhysicalContractById, queryParameters))
            {
                trade = (await grid.ReadAsync<PhysicalContractDto>()).FirstOrDefault();

                if (trade == null)
                {
                    return null;
                }

                trade.Sections = await grid.ReadAsync<SectionReferenceDto>();
            }

            return trade;
        }

        public async Task<bool> CheckContractReferenceExistsAsync(string company, string contractRef, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@PhysicalContractCode", contractRef.PadLeft(7, '0'));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckContractReferenceExists, queryParameters);

            return exists;
        }


        public async Task<IEnumerable<SectionSummaryDto>> GetTradesForAllocationAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "tradeForTradeAllocationList";

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

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_TradeForTradeAllocationListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var tradeAllocationResult = await ExecuteDynamicQueryAsync<SectionSummaryDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return tradeAllocationResult.ToList();
        }

        public async Task<IEnumerable<ItemConfigurationPropertiesDto>> GetMandatoryFieldsConfiguration(string company, string formId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@StringId", formId);
            var mandatoryFieldsResults = await ExecuteQueryAsync<ItemConfigurationPropertiesDto>(StoredProcedureNames.GetMandatoryFieldsForTrade, queryParameters);
            return mandatoryFieldsResults.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string CheckContractReferenceExists = "[Trading].[usp_PhysicalContractReferenceExists]";
            internal const string GetTradesForAllocation = "[Logistic].[usp_getPhysicalContractsForTradeAllocation]";
            internal const string GetPhysicalContractById = "[Trading].[usp_GetPhysicalContractById]";
            internal const string GetMandatoryFieldsForTrade = "[Trading].[usp_GetFieldsConfigurationForTrade]";
        }
    }
}
