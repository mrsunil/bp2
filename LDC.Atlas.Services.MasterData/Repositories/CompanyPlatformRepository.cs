using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CompanyPlatformRepository : BaseRepository, ICompanyPlatformRepository
    {
        public CompanyPlatformRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync()
        {
            var companyPlatforms = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetCompanyPlatforms);

            return companyPlatforms;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCompanyPlatforms = "[Masterdata].[usp_ListCompanyPlatform]";
        }
    }
}