using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries
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

        public async Task<bool> GetTADocumentStatus(string companyId, int? dataVersionId, int? reportType)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@ReportTypeId", reportType);

            var result = await ExecuteQueryAsync<AccountingSetupDto>(StoredProcedureNames.GetTADocumentForDataVersion, queryParameters);

            return result.Any();
        }

        internal static class StoredProcedureNames
        {
            internal const string GetAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
            internal const string GetTADocumentForDataVersion = "[Invoicing].[usp_GetTemporaryAdjustmentDocumentForDataVersion]";
        }
    }
}
