using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TimeZoneRepository : BaseRepository, ITimeZoneRepository
    {
        public TimeZoneRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<TimeZone>> GetAllAsync()
        {
            var timeZones = await ExecuteQueryAsync<TimeZone>(
                StoredProcedureNames.ListTimeZone);

            return timeZones;
        }

        internal static class StoredProcedureNames
        {
            internal const string ListTimeZone = "[Masterdata].[usp_ListTimeZone]";
        }
    }
}