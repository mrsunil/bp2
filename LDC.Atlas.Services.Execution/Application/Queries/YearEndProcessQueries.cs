using AutoMapper;
using Dapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class YearQueries : BaseRepository, IYearEndProcessQueries
    {
        private readonly IIdentityService _identityService;
        private readonly IMapper _mapper;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IGridService _gridQueries;

        public YearQueries(IDapperContext dapperContext, IIdentityService identityService, ISystemDateTimeService systemDateTimeService, IMapper mapper, IGridService gridQueries)
           : base(dapperContext)
        {
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _gridQueries = gridQueries ?? throw new ArgumentNullException(nameof(gridQueries));
        }

        public async Task<IEnumerable<YearEndProcessDto>> GetYearEndProcessAsync(string company, int year)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@year", year);
            var yearEndProcessList = await ExecuteQueryAsync<YearEndProcessDto>(StoredProcedureNames.GetPnLClearanceByYear, queryParameters, true);

            return yearEndProcessList.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string GetPnLClearanceByYear = "[Invoicing].[usp_GetPnLClearanceByYear]";
        }
    }
}