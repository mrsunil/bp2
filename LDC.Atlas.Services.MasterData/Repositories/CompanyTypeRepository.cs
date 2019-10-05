using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CompanyTypeRepository : BaseRepository, ICompanyTypeRepository
    {
        public CompanyTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync()
        {
            var companyTypes = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetCompanyTypes);

            return companyTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCompanyTypes = "[Masterdata].[usp_ListCompanyType]";
        }
    }
}