using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class GridViewService : BaseRepository, IGridViewService
    {
        private readonly IIdentityService _identityService;

        public GridViewService(IDapperContext dapperContext, IIdentityService identityService)
          : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
              typeof(UserGridViewDto),
              new ColumnAttributeTypeMapper<UserGridViewDto>());
            _identityService = identityService;
        }

        public async Task<UserGridViewDto> GetUserGridViewById(string userId, string company, int gridViewId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridViewId", gridViewId);

            UserGridViewDto gridView = await ExecuteQueryFirstOrDefaultAsync<UserGridViewDto>(StoredProcedureNames.GetGridViewDetails, queryParameters);

            // A user can access a gridView if he is the owner, or if the gridView is shared with all users for the requested company
            if (gridView.CreatedBy == userId
                || (gridView.IsSharedWithAllUsers && gridView.IsSharedWithAllCompanies)
                || (gridView.IsSharedWithAllUsers && gridView.CompanyId == company))
            {
                return gridView;
            }

            throw new AtlasSecurityException("You are not the owner of this gridView or it is not shared with you.");
        }

        public async Task<IEnumerable<UserGridViewDto>> GetUserGridViews(string company, string gridCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UIComponentCode", gridCode);
            queryParameters.Add("@CompanyId", company);

            var gridViews = await ExecuteQueryAsync<UserGridViewDto>(StoredProcedureNames.GetUsersGridViews, queryParameters, true);

            return gridViews;
        }

        public async Task<IEnumerable<UserGridViewDto>> GetGridViews(string company, string gridCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UIComponentCode", gridCode);

            return await ExecuteQueryAsync<UserGridViewDto>(StoredProcedureNames.GetGridViews, queryParameters);
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
            internal const string GetUsersGridViews = "[Configuration].[usp_ListUserGridViews]";
            internal const string GetGridViewDetails = "[Configuration].[usp_GetGridViewDetails]";
            internal const string GetGridViews = "[Configuration].[usp_ListGridViews]";
            internal const string IsGridViewNameExists = "[Configuration].[usp_GridViewNameExists]";
        }
    }
}
