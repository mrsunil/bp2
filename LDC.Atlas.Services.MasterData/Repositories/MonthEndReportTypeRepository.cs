using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class MonthEndReportTypeRepository: BaseRepository, IMonthEndReportTypeRepository
    {

        public MonthEndReportTypeRepository(IDapperContext dapperContext)
       : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var monthEndReportTypeList = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.MonthEndReportType);

            return monthEndReportTypeList;
        }

        internal static class StoredProcedureNames
        {
            internal const string MonthEndReportType = "[MasterData].[usp_ListMonthEndReportType]";
        }
    }
}
