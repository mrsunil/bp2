using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class FilterSetRepository : BaseRepository, IFilterSetRepository
    {
        public FilterSetRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<int> CreateFilterSetAsync(FilterSet filterSet)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", filterSet.Name);
            queryParameters.Add("@CompanyId", filterSet.CompanyId);
            queryParameters.Add("@UIComponentCode", filterSet.GridCode);
            queryParameters.Add("@IsDefault", filterSet.IsDefault);
            queryParameters.Add("@IsSharedWithAllCompanies", filterSet.IsSharedWithAllCompanies);
            queryParameters.Add("@IsSharedWithAllUsers", filterSet.IsSharedWithAllUsers);

            queryParameters.Add("@listFilters", ToArrayTVP(filterSet.Filters));

            queryParameters.Add("@FilterSetId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateFilterSet, queryParameters, true);

            int createdFilterSetId = queryParameters.Get<int>("@FilterSetId");

            return createdFilterSetId;
        }

        public async Task UpdateFilterSetAsync(FilterSet filterSet)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FilterSetId", filterSet.FilterSetId);
            queryParameters.Add("@Name", filterSet.Name);
            queryParameters.Add("@IsSharedWithAllCompanies", filterSet.IsSharedWithAllCompanies);
            queryParameters.Add("@IsSharedWithAllUsers", filterSet.IsSharedWithAllUsers);

            queryParameters.Add("@listFilters", ToArrayTVP(filterSet.Filters));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateFilterSet, queryParameters, true);
        }

        public async Task DeleteFilterSetAsync(int filterSetId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FilterSetId", filterSetId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteFilterSet, queryParameters);
        }

        public async Task CreateFavoriteFilterSetAsync(int filterSetId, string gridCode, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FilterSetId", filterSetId);
            queryParameters.Add("@UIComponentCode", gridCode);
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateFavoriteFilterSet, queryParameters, true);
        }

        public async Task<UserFilterSetDto> GetUserFilterSetByIdAsync(long userId, string company, int filterSetId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FilterSetId", filterSetId);

            UserFilterSetDto filterSet;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetFilterSetDetails, queryParameters))
            {
                filterSet = grid.Read<UserFilterSetDto>().FirstOrDefault();
                if (filterSet != null)
                {
                    filterSet.Filters = grid.Read<FilterDto>().ToList();
                }
                else
                {
                    return null;
                }
            }

            // A user can access a filter set if he is the owner, or if the filter set is shared with all users for all companies or for the requested company
            if (filterSet.OwnerId == userId
                || (filterSet.IsSharedWithAllUsers && filterSet.IsSharedWithAllCompanies)
                || (filterSet.IsSharedWithAllUsers && filterSet.CompanyId == company))
            {
                return filterSet;
            }

            throw new AtlasSecurityException("You are not the owner of this filter set or it is not shared with you.");
        }

        private static DataTable ToArrayTVP(IEnumerable<Filter> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Configuration].[UDTT_Filter]");

            var operatorColumn = new DataColumn("Operator", typeof(string));
            table.Columns.Add(operatorColumn);

            var value1Column = new DataColumn("Value1", typeof(string));
            table.Columns.Add(value1Column);

            var value2Column = new DataColumn("Value2", typeof(string));
            table.Columns.Add(value2Column);

            var gridColumnId = new DataColumn("GridColumnId", typeof(string));
            table.Columns.Add(gridColumnId);

            var isActiveColumn = new DataColumn("IsActive", typeof(bool));
            table.Columns.Add(isActiveColumn);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[operatorColumn] = value.Operator;
                    row[value1Column] = value.Value1;
                    row[value2Column] = value.Value2;
                    row[gridColumnId] = value.GridColumnId;
                    row[isActiveColumn] = value.IsActive;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateFilterSet = "[Configuration].[usp_SaveFilterSet]";
            internal const string UpdateFilterSet = "[Configuration].[usp_UpdateFilterSet]";
            internal const string DeleteFilterSet = "[Configuration].[usp_DeleteFilterSet]";
            internal const string CreateFavoriteFilterSet = "[Configuration].[usp_SaveFavoriteFilterSet]";
            internal const string GetFilterSetDetails = "[Configuration].[Usp_GetFilterSetDetails]";
        }
    }
}
