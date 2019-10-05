using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.AccountingInterface.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.AccountingInterface.Application.Queries
{
    public class AccountingInterfaceQueries : BaseRepository, IAccountingInterfaceQueries
    {
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IMapper _mapper;

        public AccountingInterfaceQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper)
            : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<AccountingInterfaceErrorDto>> GetListOfTechnicalErrorsAsync(string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);

            var accountingErrorList = await ExecuteQueryAsync<AccountingInterfaceErrorDto>(StoredProcedureNames.GetErrorList, queryParameters);

            return accountingErrorList;
        }

        private static class StoredProcedureNames
        {
            internal const string GetErrorList = "[Interface].[usp_GetErrorDetailsForInterface]";
        }
    }
}
