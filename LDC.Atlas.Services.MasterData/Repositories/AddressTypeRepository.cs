using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class AddressTypeRepository : BaseRepository, IAddressTypeRepository
    {
        public AddressTypeRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(EnumEntity),
                       new ColumnAttributeTypeMapper<EnumEntity>());
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync()
        {
            var addressTypes = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetAddressType);

            return addressTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetAddressType = "[MasterData].[usp_ListAddressTypes]";
        }
    }
}
