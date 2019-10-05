using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class YearEndProcessRepository : BaseRepository, IYearEndProcessRepository
    {
        public YearEndProcessRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<YearEndProcessExistance> CheckYearEndProcessExistence(string company, int year)
        {
            YearEndProcessExistance returnValue = new YearEndProcessExistance();

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Year", year);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Exists", false, DbType.Boolean, ParameterDirection.Output);
            queryParameters.Add("@IsLocked", false, DbType.Boolean, ParameterDirection.Output);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckYearEndProcessExist, queryParameters, true);

            returnValue.Exists = queryParameters.Get<bool>("@Exists");
            returnValue.IsLocked = queryParameters.Get<bool>("@IsLocked");

            return returnValue;
        }

        public async Task<bool> ReverseYearEndDocument(string company, int year)
        {

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Year", year);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Status", false, DbType.Boolean, ParameterDirection.Output);

            var status = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.ReverseYearEndDocumentStatus, queryParameters, true);

            return queryParameters.Get<bool>("@Status");
        }

        public async Task<List<YearEndProcessResponse>> CreateAccountingDocumentForYearEndPAndLBookings(string company, int year, long? id)
        {
            List<YearEndProcessResponse> yearEndProcessResponses = new List<YearEndProcessResponse>();

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Year", year);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@BSReserveAccountId", id);
            queryParameters.Add("@Status", false, DbType.Boolean, ParameterDirection.Output);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.CreateAccountingDocumentForYearEndPAndLBooking, queryParameters, true))
            {
                yearEndProcessResponses = (await grid.ReadAsync<YearEndProcessResponse>()).ToList();
            }

            var status = queryParameters.Get<bool>("@Status");

            foreach (var record in yearEndProcessResponses)
            {
                record.IsSuccess = status;
            }

            return yearEndProcessResponses;
        }

        public async Task<List<YearEndProcessResponse>> CreateAccountingDocumentForYearEndBalanceSheetBankAndLedger(string company, int year)
        {
            List<YearEndProcessResponse> yearEndProcessResponses = new List<YearEndProcessResponse>();
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Year", year);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Status", false, DbType.Boolean, ParameterDirection.Output);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.CreateAccountingDocumentForYearEndBalanceSheetBankAndLedger, queryParameters, true))
            {
                yearEndProcessResponses = (await grid.ReadAsync<YearEndProcessResponse>()).ToList();
            }

            var status = queryParameters.Get<bool>("@Status");

            foreach (var record in yearEndProcessResponses)
            {
                record.IsSuccess = status;
            }

            return yearEndProcessResponses;
        }

        public async Task<List<YearEndProcessResponse>> CreateAccountingDocumentForYearEndBalanceSheetCustomerAndVendor(string company, int year)
        {
            List<YearEndProcessResponse> yearEndProcessResponses = new List<YearEndProcessResponse>();
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Year", year);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Status", false, DbType.Boolean, ParameterDirection.Output);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.CreateAccountingDocumentForYearEndBalanceSheetCustomerAndVendor, queryParameters, true))
            {
                yearEndProcessResponses = (await grid.ReadAsync<YearEndProcessResponse>()).ToList();
            }

            var status = queryParameters.Get<bool>("@Status");

            foreach (var record in yearEndProcessResponses)
            {
                record.IsSuccess = status;
            }

            return yearEndProcessResponses;
        }

        public async Task UpdateYearEndSetup(string company, int year)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Year", year);
            queryParameters.Add("@YearEndLocked", true);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateYearEnd, queryParameters, true);

        }

        internal static class StoredProcedureNames
        {
            internal const string CheckYearEndProcessExist = "[Invoicing].[usp_CheckYearEndProcessExistence]";
            internal const string ReverseYearEndDocumentStatus = "[Invoicing].[usp_CreateReverseForYearEndDocument]";
            internal const string CreateAccountingDocumentForYearEndPAndLBooking = "[PreAccounting].[usp_CreateAccountingDocumentForYearEndPAndLBookings]";
            internal const string CreateAccountingDocumentForYearEndBalanceSheetBankAndLedger = "[PreAccounting].[usp_CreateAccountingDocumentForYearEndBalanceSheetBankAndLedger]";
            internal const string CreateAccountingDocumentForYearEndBalanceSheetCustomerAndVendor = "[PreAccounting].[usp_CreateAccountingDocumentForYearEndBalanceSheetCustomerAndVendor]";
            internal const string UpdateYearEnd = "[Invoicing].[usp_UpdateYearEndSetup]";
        }
    }
}
