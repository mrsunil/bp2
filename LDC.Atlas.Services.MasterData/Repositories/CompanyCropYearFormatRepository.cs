using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CompanyCropYearFormatRepository : BaseRepository, ICompanyCropYearFormatRepository
    {

        public CompanyCropYearFormatRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync()
        {
            var queryParameters = new DynamicParameters();

            var companies = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.ListCompanyCropYearFormat, queryParameters);

            return companies;
        }

        internal static class StoredProcedureNames
        {
            internal const string ListCompanyCropYearFormat = "[MasterData].[usp_ListCompanyCropYearFormat]";
        }
    }
}
