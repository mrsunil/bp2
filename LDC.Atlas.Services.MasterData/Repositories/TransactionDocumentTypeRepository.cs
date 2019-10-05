using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TransactionDocumentTypeRepository : BaseRepository, ITransactionDocumentTypeRepository
    {
        public TransactionDocumentTypeRepository(IDapperContext drapperContext)
            : base(drapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(TransactionDocumentType),
                       new ColumnAttributeTypeMapper<TransactionDocumentType>());
        }

        public async Task<IEnumerable<TransactionDocumentType>> GetAllAsync(string company)
        {
            var transactionDocumentList = await ExecuteQueryAsync<TransactionDocumentType>(
               StoredProcedureNames.GetTransactionDocumentTypes);

            return transactionDocumentList;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetTransactionDocumentTypes = "[Masterdata].[usp_ListTransactionDocumentTypes]";
        }

    }
}
