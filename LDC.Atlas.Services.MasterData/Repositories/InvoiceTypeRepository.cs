using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class InvoiceTypeRepository : BaseRepository, IInvoiceTypeRepository
    {
        public InvoiceTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(InvoiceType),
                       new ColumnAttributeTypeMapper<InvoiceType>());
        }

        public async Task<IEnumerable<InvoiceType>> GetAllAsync()
        {
            var invoiceTypes = await ExecuteQueryAsync<InvoiceType>(
                StoredProcedureNames.GetInvoiceTypes);

            return invoiceTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetInvoiceTypes = "[Masterdata].[usp_ListInvoiceTypes]";
        }
    }
}
