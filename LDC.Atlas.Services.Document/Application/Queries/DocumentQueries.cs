using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Document.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Application.Queries
{
    public class DocumentQueries : BaseRepository, IDocumentQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IGridService _gridQueries;

        public DocumentQueries(
            IDapperContext dapperContext,
            IIdentityService identityService,
            ISystemDateTimeService systemDateTimeService,
            IMapper mapper,
            IUserService userService,
            IGridService gridQueries)
       : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
               typeof(ContractAdviceInfoDto),
               new ColumnAttributeTypeMapper<ContractAdviceInfoDto>());
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
        }

        public async Task<ContractAdviceInfoDto> GetContractAdviceInfoAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryFirstOrDefaultAsync<ContractAdviceInfoDto>(StoredProcedureNames.GetContractAdviceInfo, queryParameters);
        }

        public async Task<IEnumerable<PhysicalDocumentSearchResultDto>> SearchPhysicalDocumentsAsync(
            string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "DocumentListAndSearchGrid";

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

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                               .FirstOrDefault(permission => permission.CompanyId == company)
                              .Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_DocumentListAndSearch]", columnConfiguration, companyDate, dataVersionId, userDepartments);

            var documentResults = await ExecuteDynamicQueryAsync<PhysicalDocumentSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return documentResults.ToList();
        }


        public async Task<IEnumerable<PhysicalDocumentSearchResultDto>> GetPhysicalDocumentsAsync(
            string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "physicalDocumentList";

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

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_PhysicalDocumentListAndSearch]", columnConfiguration, companyDate);

            var documentResults = await ExecuteDynamicQueryAsync<PhysicalDocumentSearchResultDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return documentResults.ToList();
        }


        private static class StoredProcedureNames
        {
            internal const string GetContractAdviceInfo = "[Document].[usp_GetContractAdviceInfo]";
        }
    }
}
