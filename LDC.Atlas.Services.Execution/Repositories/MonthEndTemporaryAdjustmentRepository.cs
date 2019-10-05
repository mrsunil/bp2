using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class MonthEndTemporaryAdjustmentRepository : BaseRepository, IMonthEndTemporaryAdjustmentRepository
    {
        public MonthEndTemporaryAdjustmentRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<MonthEndTAResponse> SaveMonthEndReport(List<MonthEndTemporaryAdjustmentReport> monthEndTAReport, string company, int? dataVersionId, int? reportType, DateTime documentDate, DateTime? accountingPeriod)
        {
            var monthEndTAReportData = monthEndTAReport.GroupBy(x => x.CurrencyCode);
            int year = documentDate.Year;
            string monthEndTAReferenceNumber = string.Empty;
            List<long> transactionDocumentIdList = new List<long>();
            foreach (var monthEndTA in monthEndTAReportData)
            {
                var queryParameters = new DynamicParameters();
                queryParameters.Add("@CurrencyCode", monthEndTA.First().CurrencyCode);
                queryParameters.Add(DataVersionIdParameter, dataVersionId);
                queryParameters.Add("@CompanyId", company);
                queryParameters.Add("@MonthEndTemporaryAdjustmentDocument", ToArrayTVP(monthEndTA, accountingPeriod));
                queryParameters.Add("@DocumentDate", documentDate);
                queryParameters.Add("@AuthorizedForPosting", 1);
                queryParameters.Add("@PhysicalDocumentId", null);
                queryParameters.Add("@MatchingStatusId", 1);
                queryParameters.Add("@Year", year);
                queryParameters.Add("@TATypeId", reportType == 3 ?  TAType.FxDealMonthTemporaryAdjustment: TAType.MonthEndTemporaryAdjustment);
                queryParameters.Add("@DocumentReference", dbType: DbType.String, size: 10, direction: ParameterDirection.Output);
                queryParameters.Add("@CurrentDocumentReferenceNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);
                queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
                queryParameters.Add("@TemporaryAdjustmentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
                queryParameters.Add("@ReportTypeId", reportType);


                await ExecuteNonQueryAsync(
                  StoredProcedureNames.CreateMonthEndTemporaryAdjustmentDocument,
                  queryParameters,
                 true);

                string documentReference = queryParameters.Get<string>("@DocumentReference");
                var transactionDocumentId = queryParameters.Get<long>("@TransactionDocumentId");

                monthEndTAReferenceNumber = monthEndTAReferenceNumber + "," + documentReference;
                transactionDocumentIdList.Add(transactionDocumentId);
            }

            monthEndTAReferenceNumber = monthEndTAReferenceNumber.Trim(',');

            return new MonthEndTAResponse() { MonthEndTAReferenceNumber = monthEndTAReferenceNumber, TransactionDocumentId = transactionDocumentIdList };
        }

        private DataTable ToArrayTVP(IEnumerable<MonthEndTemporaryAdjustmentReport> monthEndTemporaryAdjustmentReport, DateTime? accountingPeriod1)
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_MonthEndTemporaryAdjustmentDocument]");

            var accountingPeriod = new DataColumn("[AccountingPeriod]", typeof(DateTime));
            table.Columns.Add(accountingPeriod);

            var accrualNumber = new DataColumn("AccrualNumber", typeof(long));
            table.Columns.Add(accrualNumber);

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var costId = new DataColumn("[CostId]", typeof(long));
            table.Columns.Add(costId);

            var accruedAmount = new DataColumn("[Amount]", typeof(decimal));
            table.Columns.Add(accruedAmount);

            var quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);

            var accountLineTypeId = new DataColumn("[AccountLineTypeId]", typeof(int));
            table.Columns.Add(accountLineTypeId);

            var invoiceTransactionDocumentId = new DataColumn("[InvoiceTransactionDocumentId]", typeof(int));
            table.Columns.Add(invoiceTransactionDocumentId);

            var nominalAccountId = new DataColumn("[NominalAccountId]", typeof(int));
            table.Columns.Add(nominalAccountId);

            var fxDealId = new DataColumn("[FxDealId]", typeof(int));
            table.Columns.Add(fxDealId);

            if (monthEndTemporaryAdjustmentReport != null && monthEndTemporaryAdjustmentReport.Any())
            {
                foreach (MonthEndTemporaryAdjustmentReport monthEndTemporaryAdjustment in monthEndTemporaryAdjustmentReport)
                {
                    var row = table.NewRow();
                    row[accountingPeriod] = accountingPeriod1.HasValue ? accountingPeriod1 : (object)DBNull.Value; 
                    row[accrualNumber] = monthEndTemporaryAdjustment.AccrualNumber;
                    row[sectionId] = monthEndTemporaryAdjustment.SectionId == 0 ? (object)DBNull.Value : monthEndTemporaryAdjustment.SectionId;
                    row[costId] = monthEndTemporaryAdjustment.CostId == 0 ? (object)DBNull.Value : monthEndTemporaryAdjustment.CostId;
                    row[accruedAmount] = monthEndTemporaryAdjustment.AccruedAmount;
                    row[quantity] = monthEndTemporaryAdjustment.Quantity;
                    row[accountLineTypeId] = monthEndTemporaryAdjustment.AccountLineTypeId.HasValue ? monthEndTemporaryAdjustment.AccountLineTypeId : (object)DBNull.Value;
                    row[nominalAccountId] = monthEndTemporaryAdjustment.NominalAccountId == 0 ? (object)DBNull.Value : monthEndTemporaryAdjustment.NominalAccountId;
                    row[fxDealId] = monthEndTemporaryAdjustment.FxDealId == 0 ? (object)DBNull.Value : monthEndTemporaryAdjustment.FxDealId;
                    row[invoiceTransactionDocumentId] = monthEndTemporaryAdjustment.InvoiceTransactionDocumentId == null ? (object)DBNull.Value : monthEndTemporaryAdjustment.InvoiceTransactionDocumentId;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string CreateMonthEndTemporaryAdjustmentDocument = "[Invoicing].[usp_CreateMonthEndTemporaryAdjustmentDocument]";
        }
    }
}
