using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class GridRepository : BaseRepository, IGridRepository
    {
        public GridRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task UpdateGridAsync(Grid grid)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@GridId", grid.GridId);
            queryParameters.Add("@Configs", GridColumnsTVP(grid.Columns));
            queryParameters.Add("@CompanyId",grid.CompanyId);

            await ExecuteQueryAsync<int>(StoredProcedureNames.UpdateGridConfiguration, queryParameters, true);
        }

        private DataTable GridColumnsTVP(IEnumerable<GridColumn> gridColumns)
        {
            DataTable tableGridColumns = new DataTable();
            tableGridColumns.SetTypeName("[Configuration].[UDTT_GridColumnConfiguration]");

            DataColumn gridColumnId = new DataColumn("[GridColumnId]", typeof(long));
            tableGridColumns.Columns.Add(gridColumnId);

            DataColumn isFilterable = new DataColumn("[IsFilterable]", typeof(bool));
            tableGridColumns.Columns.Add(isFilterable);

            DataColumn isVisible = new DataColumn("[IsVisible]", typeof(bool));
            tableGridColumns.Columns.Add(isVisible);

            DataColumn friendlyName = new DataColumn("[FriendlyName]", typeof(string));
            tableGridColumns.Columns.Add(friendlyName);

            DataColumn sortOrderIndex = new DataColumn("[SortOrderIndex]", typeof(int));
            tableGridColumns.Columns.Add(sortOrderIndex);

            DataColumn isResult = new DataColumn("[IsResult]", typeof(bool));
            tableGridColumns.Columns.Add(isResult);

            foreach (var item in gridColumns)
            {

                var gridColumnsRow = tableGridColumns.NewRow();
                gridColumnsRow[gridColumnId] = item.GridColumnId;
                gridColumnsRow[isFilterable] = item.IsFilterable;
                gridColumnsRow[isVisible] = item.IsVisible;
                gridColumnsRow[friendlyName] = item.FriendlyName;
                gridColumnsRow[sortOrderIndex] = item.SortOrderIndex != null ? item.SortOrderIndex : (object)DBNull.Value;
                gridColumnsRow[isResult] = item.IsResult;

                tableGridColumns.Rows.Add(gridColumnsRow);
            }

            return tableGridColumns;
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateGridConfiguration = "[Configuration].[usp_UpdateGridConfiguration]";
        }
    }
}
