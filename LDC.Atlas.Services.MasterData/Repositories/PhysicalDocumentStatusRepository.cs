using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PhysicalDocumentStatusRepository : BaseRepository, IPhysicalDocumentStatusRepository
    {
        public PhysicalDocumentStatusRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var physicalDocumentStatus = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetPhysicalDocumentStatus);

            return physicalDocumentStatus;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPhysicalDocumentStatus = "[MasterData].[usp_ListPhysicalDocumentStatus]";
        }
    }
}
