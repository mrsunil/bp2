using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Services
{
    public class DatabaseDateTimeService : BaseRepository, ISystemDateTimeService
    {
        // Local cache only valid during the current request livetime
        private IDictionary<string, DateTime> _companyDate = new Dictionary<string, DateTime>();

        public DatabaseDateTimeService(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        public async Task<DateTime> GetCompanyDate(string companyId)
        {
            if (companyId == null)
            {
                throw new ArgumentNullException(nameof(companyId));
            }

            // Retrieve data from cache
            if (!_companyDate.TryGetValue(companyId, out var companyDate))
            {
                var queryParameters = new DynamicParameters();
                queryParameters.Add("@CompanyId", companyId);

                companyDate = await SqlMapper.ExecuteScalarAsync<DateTime>(DapperContext.Connection, "SELECT [dbo].[fn_GetCompanyDate](@CompanyId)", queryParameters, commandType: System.Data.CommandType.Text, transaction: DapperContext.Transaction);

                companyDate = DateTime.SpecifyKind(companyDate, DateTimeKind.Unspecified);

                // Cache the current date of the company
                _companyDate.Add(companyId, companyDate);
            }

            return companyDate;
        }

        public async Task<int?> GetCompanyCurrentDataVersionId(string companyId)
        {
            if (companyId == null)
            {
                throw new ArgumentNullException(nameof(companyId));
            }

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", companyId);

            var dataVersionId = await SqlMapper.ExecuteScalarAsync<int?>(DapperContext.Connection, "SELECT [dbo].[fn_GetDataVersionId](@Company)", queryParameters, commandType: System.Data.CommandType.Text, transaction: DapperContext.Transaction);

            return dataVersionId;
        }
    }
}
