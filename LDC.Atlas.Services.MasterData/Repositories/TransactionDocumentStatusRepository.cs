using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TransactionDocumentStatusRepository: BaseRepository, ITransactionDocumentStatusRepository
    {
        public TransactionDocumentStatusRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var physicalDocumentStatusList = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetPostingStatus);

            return physicalDocumentStatusList;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPostingStatus = "[MasterData].[usp_ListPostingStatus]";
        }
    }
}
