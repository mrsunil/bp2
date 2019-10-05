using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Execution.Common.Queries.Dto;
using LDC.Atlas.Infrastructure.Services;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Execution.Common.Queries
{
    public class AccountingSetUpQueries : BaseRepository, IAccountingSetUpQueries
    {
        private readonly IIdentityService _identityService;

        public AccountingSetUpQueries(IDapperContext dapperContext, IIdentityService identityService)
            : base(dapperContext)
        {
            _identityService = identityService;
            SqlMapper.SetTypeMap(typeof(AccountingSetupDto), new ColumnAttributeTypeMapper<AccountingSetupDto>());
        }

        public async Task<AccountingSetupDto> GetAccountingSetup(string companyId)
        {
            var queryParameters = new DynamicParameters();
            AccountingSetupDto accountingSetup;

            queryParameters.Add("@CompanyId", companyId);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingSetup, queryParameters))
            {
                accountingSetup = (await grid.ReadAsync<AccountingSetupDto>()).FirstOrDefault();
            }

            return accountingSetup;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
        }
    }
}
