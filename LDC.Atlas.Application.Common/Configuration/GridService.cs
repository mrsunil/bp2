using Dapper;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.DataAccess;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public class GridService : BaseRepository, IGridService
    {
        public GridService(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<GridDto> GetGrid(string gridCode, string company)
        {
            GridDto gridConfig = new GridDto();

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridCode", gridCode);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetGridColumnConfig, queryParameters))
            {
                gridConfig = grid.Read<GridDto>().FirstOrDefault();
                if (gridConfig != null)
                {
                    gridConfig.CompanyId = company;
                    gridConfig.Columns = grid.Read<GridColumnDto>().ToList();
                }
            }

            return gridConfig;
        }

        public async Task<GridDto> GetGridByGridId(long gridId, string company)
        {
            GridDto gridConfig = new GridDto();

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@GridId", gridId);
            queryParameters.Add("@CompanyId", company);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetGridColumnConfigByGridId, queryParameters))
            {
                gridConfig = grid.Read<GridDto>().FirstOrDefault();
                if (gridConfig != null)
                {
                    gridConfig.CompanyId = company;
                    gridConfig.Columns = grid.Read<GridColumnDto>().ToList();
                }
            }

            return gridConfig;
        }

        public async Task<List<GridDto>> GetGridConfigByConfigurationTypeId(string configurationTypeId, string company)
        {
            List<GridDto> gridConfigList = new List<GridDto>();

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ConfigurationTypeId", configurationTypeId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@ContextInformation", null);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetGridConfigByTypeId, queryParameters))
            {
                gridConfigList = grid.Read<GridDto>().ToList();
            }

            return gridConfigList;
        }

        private static class StoredProcedureNames
        {
            internal const string GetGridColumnConfig = "[Configuration].[usp_GetGridColumnConfig]";
            internal const string GetGridColumnConfigByGridId = "[Configuration].[usp_GetGridColumnConfigByGridId]";
            internal const string GetGridConfigByTypeId = "[Configuration].[Usp_GetGridConfigByTypeId]";
        }
    }
}
