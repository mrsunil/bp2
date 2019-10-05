using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class BankNccTypeRepository : BaseRepository, IBankNccTypeRepository
    {
        public BankNccTypeRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync()
        {
            var queryParameters = new DynamicParameters();

            var bankTypes = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetBankNccTypes, queryParameters);

            return bankTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetBankNccTypes = "[Masterdata].[usp_ListBankNccTypes]";
        }
    }
}
