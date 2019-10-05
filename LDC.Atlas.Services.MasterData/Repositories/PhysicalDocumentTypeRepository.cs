using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PhysicalDocumentTypeRepository : BaseRepository, IPhysicalDocumentTypeRepository
    {
        public PhysicalDocumentTypeRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var physicalDocumentTypes = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetPhysicalDocumentTypes);

            return physicalDocumentTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPhysicalDocumentTypes = "[MasterData].[usp_ListPhysicalDocumentTypes]";
        }
    }
}
