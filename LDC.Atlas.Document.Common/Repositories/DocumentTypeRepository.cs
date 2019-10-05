using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Document.Common.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Repositories
{
    public class DocumentTypeRepository : BaseRepository, IDocumentTypeRepository
    {
        public DocumentTypeRepository(IDapperContext dapperContext)
       : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                  typeof(PhysicalDocumentTypeDto),
                  new ColumnAttributeTypeMapper<PhysicalDocumentTypeDto>());
        }

        public async Task<IEnumerable<PhysicalDocumentTypeDto>> GetGeneratedDocumentTypesAsync()
        {
            var documentTypes = await ExecuteQueryAsync<PhysicalDocumentTypeDto>(StoredProcedureNames.GetDocumentTypes);

            return documentTypes;
        }

        private static class StoredProcedureNames
        {
            internal const string GetDocumentTypes = "[MasterData].[usp_ListPhysicalDocumentTypes]";
        }
    }
}
