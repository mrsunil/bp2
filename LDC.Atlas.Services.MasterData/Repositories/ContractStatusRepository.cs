using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ContractStatusRepository : BaseRepository, IContractStatusRepository
    {
        public ContractStatusRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var contractStatus = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetContractStatus);

            return contractStatus;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetContractStatus = "[Masterdata].[usp_ListContractStatus]";
        }
    }
}
