using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class BankTypeRepository : BaseRepository, IBankTypeRepository
    {
        public BankTypeRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<BankType>> GetAllAsync()
        {
            var queryParameters = new DynamicParameters();

            var bankTypes = await ExecuteQueryAsync<BankType>(
                StoredProcedureNames.GetBankTypes, queryParameters);

            return bankTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetBankTypes = "[Masterdata].[usp_ListBankTypes]";
        }
    }
}
