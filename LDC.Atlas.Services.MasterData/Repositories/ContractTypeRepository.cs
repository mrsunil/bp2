using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ContractTypeRepository : BaseRepository, IContractTypeRepository
    {
        public ContractTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var contractTypes = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetContractTypes);

            return contractTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetContractTypes = "[Masterdata].[usp_ListContractTypes]";
        }
    }
}
