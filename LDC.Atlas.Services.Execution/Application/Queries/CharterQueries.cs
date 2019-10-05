using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class CharterQueries : BaseRepository, ICharterQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;
        private readonly IGridService _gridQueries;

        public CharterQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper, IGridService gridQueries)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(typeof(CharterSummaryDto), new ColumnAttributeTypeMapper<CharterSummaryDto>());
            SqlMapper.SetTypeMap(typeof(CharterDto), new ColumnAttributeTypeMapper<CharterDto>());
             _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));

        }

        public async Task<IEnumerable<CharterSummaryDto>> GetChartersAsync(string[] company, string charterReference, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", ToSelectedCompanyTVP(company));
            queryParameters.Add("@charterRef", charterReference);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var charters = await ExecuteQueryAsync<CharterSummaryDto>(StoredProcedureNames.GetCharters, queryParameters, true);

            return charters.ToList();
        }

        public async Task<IEnumerable<CharterSummaryDto>> SearchChartersAsync(string company, EntitySearchRequest searchRequest)
        {
            var grideCode = "charterlist";

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

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_CharterListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var charters = await ExecuteDynamicQueryAsync<CharterSummaryDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return charters.ToList();
        }

        public async Task<CharterDto> GetCharterByIdAsync(long charterId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CharterID", charterId);
            queryParameters.Add("@companyId", company);

            CharterDto charter;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCharterById, queryParameters, true))
            {
                charter = grid.Read<CharterDto>().FirstOrDefault();
                if (charter != null)
                {
                    charter.SectionsAssigned = grid.Read<SectionAssignedToCharterDto>();
                }
            }

            return charter;
        }

        public async Task<CharterDto> GetCharterBySectionIdAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyID", company);

            CharterDto charter;

            charter = await ExecuteQueryFirstOrDefaultAsync<CharterDto>(StoredProcedureNames.GetCharterBySectionId, queryParameters, false);

            return charter;
        }

        public async Task<IEnumerable<SectionAssignedToCharterDto>> GetSectionsAssignedToCharterAsync(long charterId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CharterID", charterId);
            queryParameters.Add("@companyId", company);

            var sections = await ExecuteQueryAsync<SectionAssignedToCharterDto>(StoredProcedureNames.GetSectionsAssignedToCharter, queryParameters, true);

            return sections.ToList();
        }

        public async Task<IEnumerable<SectionAssignedToCharterDto>> GetContractsToBeAssignedToCharterAsync(string contractLabel, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ContractLabel", contractLabel);
            queryParameters.Add("@companyId", company);

            var sections = await ExecuteQueryAsync<SectionAssignedToCharterDto>(StoredProcedureNames.GetPhysicalContractsForCharterAssignation, queryParameters, true);

            return sections.ToList();
        }

        public async Task<bool> CheckCharterReferenceExistsAsync(string charterReference, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@company", company);
            queryParameters.Add("@charterRef", charterReference);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckCharterReferenceExists, queryParameters);

            return exists;
        }

        public async Task<IEnumerable<CharterManagerDto>> FindCharterManagersByNameAsync(string company, string name)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Name", name);

            return await ExecuteQueryAsync<CharterManagerDto>(StoredProcedureNames.GetCharterManagers, queryParameters);
        }

        public async Task<IEnumerable<CharterManagerDto>> GetCharterManagersAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryAsync<CharterManagerDto>(StoredProcedureNames.GetCharterManagers, queryParameters);
        }

        private static DataTable ToSelectedCompanyTVP(string[] selectedCompanies)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_VarcharList]");
            var name = new DataColumn("[Name]", typeof(string));
            table.Columns.Add(name);
            foreach (string company in selectedCompanies)
            {
                var row = table.NewRow();
                row[name] = company;
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<IEnumerable<CharterBulkClosureDto>> GetAssignedSectionDetailsForBulkClosure(string company, long[] charterIds)
        {
            IEnumerable<CharterBulkClosureDto> charterBulkClosureDtos;
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CharterIds", ToSelectedCharterTVP(charterIds));
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCharterAndSectionDetail, queryParameters, true))
            {
                charterBulkClosureDtos = (await grid.ReadAsync<CharterBulkClosureDto>()).ToList();

                var assignedSectionList = (await grid.ReadAsync<AssignedSectionToCharterBulkClosureDto>()).ToList();

                var costAssignedList = (await grid.ReadAsync<CostAssignedToSectionDto>()).ToList();

                foreach (CharterBulkClosureDto charter in charterBulkClosureDtos)
                {
                    charter.SectionsAssigned = assignedSectionList.Where(section => section.CharterId == charter.CharterId);

                    foreach (AssignedSectionToCharterBulkClosureDto section in assignedSectionList)
                    {
                        section.CostAssigned = costAssignedList.Where(cost => cost.SectionId == section.SectionId);
                    }
                }
            }

            return charterBulkClosureDtos;

        }

        public async Task<IEnumerable<SectionAssignedToCharterDto>> SearchCharterAssignmentsAsync(string company, EntitySearchRequest searchRequest, GridDto grid)
        {
            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, "[Configuration].[Vw_CharterSectionAssignmentListAndSearch]", columnConfiguration, companyDate, dataVersionId);

            var charterAssignmentSections = await ExecuteDynamicQueryAsync<SectionAssignedToCharterDto>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return charterAssignmentSections.ToList();
        }

        private static DataTable ToSelectedCharterTVP(long[] charterIds)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");
            var id = new DataColumn("[Id]", typeof(long));
            table.Columns.Add(id);
            foreach (long charterId in charterIds)
            {
                var row = table.NewRow();
                row[id] = charterId;
                table.Rows.Add(row);
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string GetCharters = "[Logistic].[usp_ListCharters]";
            internal const string GetCharterById = "[Logistic].[usp_GetCharterById]";
            internal const string CheckCharterReferenceExists = "[Logistic].[GET_CharterReferenceExists]";
            internal const string GetSectionsAssignedToCharter = "[Logistic].[usp_ListSectionsAssignedToCharter]";
            internal const string GetCharterManagers = "[Logistic].[usp_ListCharterManagersByCompany]";
            internal const string GetCharterBySectionId = "[Logistic].[usp_GETCharterBySectionId]";
            internal const string GetPhysicalContractsForCharterAssignation = "[Logistic].[usp_GetPhysicalContractsForCharterAssignation]";
            internal const string GetCharterAndSectionDetail = "[Logistic].[usp_GetCharterAndSectionDetails]";
        }
    }
}
