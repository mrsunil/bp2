using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.ListAndSearch.Common
{
    public abstract class BaseListAndSearch : BaseRepository
    {
        protected readonly IIdentityService _identityService;
        protected readonly ISystemDateTimeService _systemDateTimeService;
        protected readonly IUserService _userService;
        protected readonly IMapper _mapper;
        protected readonly IGridService _gridQueries;
        protected readonly IGridViewService _gridViewQueries;

        public BaseListAndSearch(
            IDapperContext dapperContext,
            IIdentityService identityService,
            ISystemDateTimeService systemDateTimeService,
            IUserService userService,
            IMapper mapper,
            IGridService gridQueries,
            IGridViewService gridViewQueries)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
            _gridViewQueries = gridViewQueries ?? throw new ArgumentNullException(nameof(gridViewQueries));
        }

        protected virtual async Task<IEnumerable<T>> SearchAsync<T>(string company, EntitySearchRequest searchRequest, string gridCode, string viewName, bool skipPaginationLimit = false)
        {
            var grid = await _gridQueries.GetGrid(gridCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {gridCode}.");
            }

            if (!skipPaginationLimit && grid.MaxNumberOfRecords.HasValue && grid.MaxNumberOfRecords < searchRequest.Limit)
            {
                searchRequest.Limit = grid.MaxNumberOfRecords;
            }

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            var userDepartments = (await _userService.GetUserByIdAsync(_identityService.GetUserAtlasId(), false)).Permissions
                             .FirstOrDefault(permission => permission.CompanyId == company)
                            ?.Departments.Select(department => department.DepartmentId).ToList();

            var dataVersionId = searchRequest.DataVersionId ?? await _systemDateTimeService.GetCompanyCurrentDataVersionId(company);

            var buildQueryResult = DynamicQueryBuilder.BuildQuery(company, _identityService.GetUserName(), dynamicQueryDefinition, viewName, columnConfiguration, companyDate, dataVersionId, userDepartments);

            var results = await ExecuteDynamicQueryAsync<T>(buildQueryResult.Sql, buildQueryResult.Parameters);

            return results.ToList();
        }

        protected virtual async Task<DataTable> ConvertSearchResultToDataTableAsync<T>(string company, string grideCode, int? gridViewId, IEnumerable<T> searchResult)
        {
            var grid = await _gridQueries.GetGrid(grideCode, company);

            if (grid == null)
            {
                throw new AtlasTechnicalException($"No grid configuration found for {grideCode}.");
            }

            DataTableSettings settings = new DataTableSettings();
            settings.DataTableName = grid.Name;

            if (gridViewId.HasValue)
            {
                // Use the selected grid view to configure the columns
                var userGridViewDto = await _gridViewQueries.GetUserGridViewById(_identityService.GetUserName(), company, gridViewId.Value);

                if (grid == null)
                {
                    throw new AtlasTechnicalException($"No grid view found for id {gridViewId.Value}.");
                }

                var agGridColumns = JsonConvert.DeserializeObject<List<AgGridColumnDto>>(userGridViewDto.GridViewColumnConfig);

                //var agGridColumnConfigToD = agGridColumnConfig.AgGridColumns.Where(c => !c.Hide).ToList();

                foreach (var agGridColumn in agGridColumns)
                {
                    var gridColumnDto = grid.Columns.FirstOrDefault(c => c.FieldName.Equals(agGridColumn.ColId, StringComparison.InvariantCultureIgnoreCase));

                    if (gridColumnDto != null)
                    {
                        settings.Columns.Add(new DataTableColumnSetting
                        {
                            DisplayName = gridColumnDto.FriendlyName,
                            IsExportable = !agGridColumn.Hide, // gridColumnDto.IsVisible,
                            PropertyName = gridColumnDto.FieldName,
                            Order = agGridColumns.IndexOf(agGridColumn) + 1
                        });
                    }
                }
            }
            else
            {
                // Use the grid configuration to configure the columns
                foreach (var gridColumnDto in grid.Columns)
                {
                    settings.Columns.Add(new DataTableColumnSetting
                    {
                        DisplayName = gridColumnDto.FriendlyName,
                        IsExportable = gridColumnDto.IsVisible,
                        PropertyName = gridColumnDto.FieldName
                    });
                }
            }

            var dataTable = searchResult.ToList().ToDataTable(settings);

            return dataTable;
        }

        protected virtual async Task<List<string>> GenerateFormatedClauses(string company, EntitySearchRequest searchRequest, string grideCode)
        {
            var grid = await _gridQueries.GetGrid(grideCode, company);

            var dynamicQueryDefinition = _mapper.Map<DynamicQueryDefinition>(searchRequest);

            var columnConfiguration = _mapper.Map<List<ColumnConfiguration>>(grid.Columns);

            List<string> formatedClauses = new List<string>();
            foreach (var clause in dynamicQueryDefinition.Clauses.Clauses)
            {
                var formatedClause = DynamicQueryBuilder.FormatClause(clause, columnConfiguration);
                formatedClauses.Add(formatedClause);
            }

            return formatedClauses;
        }
    }

    public static class ListAndSearchExportFormat
    {
        public const string Excel = "excel";
    }
}
