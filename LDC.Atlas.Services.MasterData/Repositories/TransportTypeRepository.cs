using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TransportTypeRepository : BaseRepository, ITransportTypeRepository
    {
        public TransportTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(TransportType),
                       new ColumnAttributeTypeMapper<TransportType>());
        }

        public async Task<IEnumerable<TransportType>> GetAllAsync(string companyId, bool includeDeactivated = false, string transportTypeCode = null, string transportTypeDescription = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@TransportTypeCode", transportTypeCode);
            queryParameters.Add("@Description", transportTypeDescription);

            var transportTypes = await ExecuteQueryAsync<TransportType>(
                StoredProcedureNames.GetTransportTypes, queryParameters);

            return transportTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetTransportTypes = "[Masterdata].[usp_ListTransportTypes]";
        }
    }
}
