using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ProvinceRepository : BaseRepository, IProvinceRepository
    {
        public ProvinceRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Province),
                       new ColumnAttributeTypeMapper<Province>());
        }

        public async Task<IEnumerable<Province>> GetAllAsync(string company, bool includeDeactivated = false, string stateCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@StateCode", stateCode);
            queryParameters.Add("@Description", description);

            var provinces = await ExecuteQueryAsync<Province>(
                StoredProcedureNames.GetProvinces,
                queryParameters);

            return provinces;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetProvinces = "[Masterdata].[usp_ListProvinces]";
        }
    }
}
