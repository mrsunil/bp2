using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class DateFormatPreferenceRepository : BaseRepository, IDateFormatPreferenceRepository
    {
        public DateFormatPreferenceRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(DateFormat),
                       new ColumnAttributeTypeMapper<DateFormat>());
        }

        public async Task<IEnumerable<DateFormat>> GetAllAsync()
        {
            var dateFormat = await ExecuteQueryAsync<DateFormat>(StoredProcedureNames.ListDateFormat);
            return dateFormat;
        }

        internal static class StoredProcedureNames
        {
            internal const string ListDateFormat = "[MasterData].[usp_ListDateFormats]";
        }
    }
}
