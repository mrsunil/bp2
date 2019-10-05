using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class RateTypesRepository : BaseRepository, IRateTypesRepository
    {
        public RateTypesRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var postingStatus = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetRateTypes);

            return postingStatus;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetRateTypes = "[Masterdata].[usp_ListRateTypes]";
        }
    }
}
