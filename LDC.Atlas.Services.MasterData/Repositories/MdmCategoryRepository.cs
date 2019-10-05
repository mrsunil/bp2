using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class MdmCategoryRepository : BaseRepository, IMdmCategoryRepository
    {
        public MdmCategoryRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(MdmCategory),
                       new ColumnAttributeTypeMapper<MdmCategory>());
        }

        public async Task<IEnumerable<MdmCategory>> GetAllAsync()
        {
            var mdmCategories = await ExecuteQueryAsync<MdmCategory>(
                StoredProcedureNames.GetMdmCategories);

            return mdmCategories;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetMdmCategories = "[MasterData].[usp_ListMdmCategory]";
        }
    }
}
