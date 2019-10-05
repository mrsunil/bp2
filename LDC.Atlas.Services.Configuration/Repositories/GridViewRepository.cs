using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class GridViewRepository : BaseRepository, IGridViewRepository
    {
        public GridViewRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task SetGridViewAsFavoriteAsync(int gridViewId, string gridCode, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridViewId", gridViewId);
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.SetGridViewAsFavorite, queryParameters, true);
        }

        public async Task<int> CreateGridViewAsync(GridView gridView)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", gridView.Name);
            queryParameters.Add("@CompanyId", gridView.CompanyId);
            queryParameters.Add("@ColumnConfig", gridView.GridViewColumnConfig);
            queryParameters.Add("@UIComponentCode", gridView.GridCode);
            queryParameters.Add("@IsSharedWithAllCompanies", gridView.IsSharedWithAllCompanies);
            queryParameters.Add("@IsSharedWithAllUsers", gridView.IsSharedWithAllUsers);

            queryParameters.Add("@GridViewId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateGridView, queryParameters, true);

            int createdGridViewId = queryParameters.Get<int>("@GridViewId");
            return createdGridViewId;
        }

        public async Task DeleteGridViewAsync(int gridViewId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridViewId", gridViewId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteGridView, queryParameters);
        }

        public async Task<GridView> GetUserGridViewByIdAsync(string company, int gridViewId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridViewId", gridViewId);

            var res = await ExecuteQueryFirstOrDefaultAsync<GridView>(StoredProcedureNames.GetGridViewDetails, queryParameters);
            return res;
        }

        public async Task UpdateGridViewAsync(GridView gridView)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridViewId", gridView.GridViewId);
            queryParameters.Add("@Name", gridView.Name);
            queryParameters.Add("@UIComponentCode", gridView.GridCode);
            queryParameters.Add("@ColumnConfig", gridView.GridViewColumnConfig);
            queryParameters.Add("@IsSharedWithAllCompanies", gridView.IsSharedWithAllCompanies);
            queryParameters.Add("@IsSharedWithAllUsers", gridView.IsSharedWithAllUsers);
            queryParameters.Add("@CompanyId", gridView.CompanyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateGridView, queryParameters, true);
        }

        public async Task<int> SaveUniqueGridViewAsFavoriteAsync(GridView gridView)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", gridView.CompanyId);
            queryParameters.Add("@ColumnConfig", gridView.GridViewColumnConfig);
            queryParameters.Add("@GridCode", gridView.GridCode);

            queryParameters.Add("@GridViewId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.SaveUniqueGridView, queryParameters, true);

            int createdGridViewId = queryParameters.Get<int>("@GridViewId");
            return createdGridViewId;
        }

        public async Task<IEnumerable<GridView>> GetGridViews(string company, string gridCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UIComponentCode", gridCode);

            return await ExecuteQueryAsync<GridView>(StoredProcedureNames.ListGridViews, queryParameters);
        }

        public async Task<bool> IsGridViewNameExists(string company, string gridCode, string gridViewName)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UIComponentCode", gridCode);
            queryParameters.Add("@GridViewName", gridViewName);

            return await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.IsGridViewNameExists, queryParameters);
        }

        private static class StoredProcedureNames
        {
            internal const string CreateGridView = "[Configuration].[usp_SaveUserGridView]";
            internal const string UpdateGridView = "[Configuration].[usp_UpdateUserGridView]";
            internal const string DeleteGridView = "[Configuration].[usp_DeleteUserGridView]";
            internal const string SetGridViewAsFavorite = "[Configuration].[usp_SetGridViewAsFavorite]";
            internal const string GetGridViewDetails = "[Configuration].[usp_GetGridViewDetails]";
            internal const string SaveUniqueGridView = "[Configuration].[usp_SaveUniqueUserGridView]";
            internal const string ListGridViews = "[Configuration].[usp_ListGridViews]";
            internal const string IsGridViewNameExists = "[Configuration].[usp_GridViewNameExists]";
        }
    }
}
