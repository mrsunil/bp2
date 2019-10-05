using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class ManualJournalRepository : BaseRepository, IManualJournalRepository
    {
        public ManualJournalRepository(IDapperContext dapperContext)
      : base(dapperContext)
        {
        }

        /// <summary>
        /// Saves a journal document (including its lines)
        /// </summary>
        /// <param name="manualJournalDocument"></param>
        /// <param name="company"></param>
        /// <returns></returns>
        public async Task<ManualJournalResponse> CreateManualJournal(ManualJournalDocument manualJournalDocument, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@TransactionDocumentId", manualJournalDocument.TransactionDocumentId);
            queryParameters.Add("@DocumentDate", manualJournalDocument.DocumentDate.Date);
            queryParameters.Add("@ValueDate", manualJournalDocument.ValueDate);
            queryParameters.Add("@AccountingPeriod", manualJournalDocument.AccountingPeriod.Date);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CurrencyCode", manualJournalDocument.CurrencyCode);
            queryParameters.Add("@TransactionDocumentTypeId", manualJournalDocument.TransactionDocumentTypeId);
            queryParameters.Add("@AuthorizedForPosting", manualJournalDocument.AuthorizedForPosting);
            queryParameters.Add("@ToInterface", manualJournalDocument.ToInterface);
            queryParameters.Add("@PhysicalDocumentId", manualJournalDocument.PhysicalDocumentId);
            queryParameters.Add("@DocumentReference", manualJournalDocument.DocumentReference);
            queryParameters.Add("@YearNumber", manualJournalDocument.YearNumber);
            queryParameters.Add("@Year", manualJournalDocument.Year);
            queryParameters.Add("@JLTypeId", manualJournalDocument.JLTypeId);
            queryParameters.Add("@TATypeId", manualJournalDocument.TATypeId);
            queryParameters.Add("@JournalLines", ToArrayTVP(manualJournalDocument.ManualJournalLines));
            return await ExecuteQueryFirstOrDefaultAsync<ManualJournalResponse>(StoredProcedureNames.CreateManualJournalDocument, queryParameters, true);
        }

        public async Task<IEnumerable<ManualJournalLineReference>> GetManualJournalLineReferences(long manualJournalDocumentId, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@ManualJournalDocumentId", manualJournalDocumentId);
            queryParameters.Add("@CompanyId", company);
            if (dataVersionId != null)
            {
                queryParameters.Add("@DataVersionId", dataVersionId);
            }

            return await ExecuteQueryAsync<ManualJournalLineReference>(StoredProcedureNames.GetManualJournalLineReferences, queryParameters);
        }

        private DataTable ToArrayTVP(IEnumerable<ManualJournalLine> manualJournalLines)
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_ManualJournalLine]");

            var journalLineId = new DataColumn("[JournalLineId]", typeof(long));
            table.Columns.Add(journalLineId);

            var journalDocumentId = new DataColumn("[JournalDocumentId]", typeof(long));
            table.Columns.Add(journalDocumentId);

            var accountReferenceId = new DataColumn("[AccountReferenceId]", typeof(long));
            table.Columns.Add(accountReferenceId);

            var clientAccountId = new DataColumn("[ClientAccountId]", typeof(long));
            table.Columns.Add(clientAccountId);

            var associatedAccountId = new DataColumn("[AssociatedAccountId]", typeof(long));
            table.Columns.Add(associatedAccountId);

            var accountLineTypeId = new DataColumn("[AccountLineTypeId]", typeof(int));
            table.Columns.Add(accountLineTypeId);

            var costTypeId = new DataColumn("[CostTypeId]", typeof(long));
            table.Columns.Add(costTypeId);

            var amount = new DataColumn("[Amount]", typeof(decimal));
            table.Columns.Add(amount);

            var narrative = new DataColumn("[Narrative]", typeof(string));
            table.Columns.Add(narrative);

            var departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);

            var secondaryDocumentReference = new DataColumn("[SecondaryDocumentReference]", typeof(string));
            table.Columns.Add(secondaryDocumentReference);

            var externalDocumentReference = new DataColumn("[ExternalDocumentReference]", typeof(string));
            table.Columns.Add(externalDocumentReference);

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);

            var quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);

            var costCenter = new DataColumn("[CostCenter]", typeof(string));
            table.Columns.Add(costCenter);

            var accrualNumber = new DataColumn("[AccrualNumber]", typeof(int));
            table.Columns.Add(accrualNumber);

            var charterId = new DataColumn("[CharterId]", typeof(long));
            table.Columns.Add(charterId);

            var lineNumber = new DataColumn("[LineNumber]", typeof(long));
            table.Columns.Add(lineNumber);

            var dealNumber = new DataColumn("[DealNumber]", typeof(string));
            table.Columns.Add(dealNumber);

            var settlementCurrency = new DataColumn("[SettlementCurrency]", typeof(string));
            table.Columns.Add(settlementCurrency);

            var provinceId = new DataColumn("[ProvinceId]", typeof(int));
            table.Columns.Add(provinceId);

            foreach (ManualJournalLine value in manualJournalLines)
            {
                if (value != null)
                {
                    var row = table.NewRow();
                    row[journalDocumentId] = value.JournalDocumentId.HasValue ? (object)value.JournalDocumentId.Value : DBNull.Value;
                    row[accountReferenceId] = value.AccountReferenceId.HasValue ? (object)value.AccountReferenceId.Value : DBNull.Value;
                    row[clientAccountId] = value.ClientAccountId != null ? value.ClientAccountId : (object)DBNull.Value;
                    row[associatedAccountId] = value.AssociatedAccountId != null ? value.AssociatedAccountId : (object)DBNull.Value;
                    row[accountLineTypeId] = value.AccountLineTypeId;
                    row[costTypeId] = value.CostTypeId.HasValue ? (object)value.CostTypeId.Value : DBNull.Value;
                    row[amount] = value.Amount;
                    row[narrative] = value.Narrative;
                    row[departmentId] = value.DepartmentId ?? (object)DBNull.Value; 
                    row[secondaryDocumentReference] = (object)value.SecondaryDocumentReference ?? DBNull.Value;
                    row[externalDocumentReference] = value.ExternalDocumentReference;
                    row[sectionId] = value.SectionId != null ? value.SectionId : (object)DBNull.Value;
                    row[commodityId] = value.CommodityId != null ? value.CommodityId : (object)DBNull.Value;
                    row[quantity] = value.Quantity != null ? value.Quantity : (object)DBNull.Value;
                    row[costCenter] = value.CostCenter ?? (object)DBNull.Value;
                    row[accrualNumber] = value.AccrualNumber != null ? value.AccrualNumber : (object)DBNull.Value;
                    row[charterId] = value.CharterId != null ? value.CharterId : (object)DBNull.Value;
                    row[lineNumber] = value.LineNumber ?? (object)DBNull.Value;
                    row[dealNumber] = value.DealNumber;
                    row[settlementCurrency] = value.SettlementCurrency;
                    row[provinceId] = value.ProvinceId ?? (object)DBNull.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateManualJournalDocument = "[Invoicing].[usp_CreateManualJournal]";
            internal const string GetManualJournalLineReferences = "[Invoicing].[usp_GetJournalLineIdMappingByJournalDocId]";
        }
    }
}
