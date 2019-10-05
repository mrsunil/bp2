using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CompanyRepository : BaseRepository, ICompanyRepository
    {
        public CompanyRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<Company>> GetAllAsync(long? counterpartyId = null)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@counterpartyId", counterpartyId);

            var companies = await ExecuteQueryAsync<Company>(
                StoredProcedureNames.GetCompanies, queryParameters);

            return companies;
        }

        public async Task<Company> GetCompanyByIdAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", companyId);

            var companySettings = await ExecuteQueryAsync<Company>(
                StoredProcedureNames.GetCompanySettings, queryParameters);

            return companySettings.FirstOrDefault<Company>();
        }

        public async Task<IEnumerable<Company>> GetAllByCounterpartyIdAsync(string companyId, long counterpartyId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@counterpartyId", counterpartyId);

            var companies = await ExecuteQueryAsync<Company>(
                StoredProcedureNames.GetCompanySettingsByCounterpartyId, queryParameters);

            return companies;
        }

        public async Task<bool> CheckCompanyNameExistsAsync(string companyName)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyName);
            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckCompanyNameExists, queryParameters);

            return exists;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCompanies = "[Masterdata].[usp_ListCompanies]";
            internal const string GetCompanySettings = "[Masterdata].[usp_GetCompanySettings]";
            internal const string GetCompanySettingsByCounterpartyId = "[Masterdata].[usp_GetCompanySettingsByCounterpartyId]";
            internal const string CheckCompanyNameExists = "[MasterData].[usp_CheckCompanyNameExists]";
        }
    }
}
