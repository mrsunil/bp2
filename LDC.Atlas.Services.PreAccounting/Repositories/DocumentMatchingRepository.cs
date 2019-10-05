using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Repositories
{
    public class InvoicingRepository : BaseRepository, IInvoicingRepository
    {
        public InvoicingRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task DeleteManualJLOrRevaluationAsync(long transactionDocumentId, string companyCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@CompanyId", companyCode);
            await ExecuteNonQueryAsync(
               StoredProcedureNames.DeleteManualJLOrRevaluation, queryParameters, true);
        }

        public async Task<long> CreateDocumentMatchingAsync(DocumentMatching documentMatching)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DataversionId", documentMatching.DataversionId);
            queryParameters.Add("@TransactionDocumentId", documentMatching.TransactionDocumentId);
            queryParameters.Add("@Amount", documentMatching.Amount);
            queryParameters.Add("@MatchFlagId", documentMatching.MatchFlagId);
            queryParameters.Add("@AmountInFunctionalCurrency", documentMatching.AmountInFunctionalCurrency);
            queryParameters.Add("@AmountInStatutoryCurrency", documentMatching.AmountInStatutoryCurrency);
            queryParameters.Add("@ValueDate", documentMatching.ValueDate);
            queryParameters.Add("@CompanyId", documentMatching.CompanyId);
            queryParameters.Add("@DepartmentId", documentMatching.DepartmentId);
            queryParameters.Add("@TransactionDirectionId", documentMatching.TransactionDirectionId);
            queryParameters.Add("@LineId", documentMatching.LineId);
            queryParameters.Add("@SecondaryDocumentReferenceId", documentMatching.SecondaryDocumentReferenceId);
            queryParameters.Add("@SourceJournalLineId", documentMatching.SourceJournalLineId);
            queryParameters.Add("@SourceInvoiceId", documentMatching.SourceInvoiceId);
            queryParameters.Add("@SourceCashLineId", documentMatching.SourceCashLineId);
            queryParameters.Add("@MatchedJournalLineId", documentMatching.MatchedJournalLineId);
            queryParameters.Add("@MatchedInvoiceId", documentMatching.MatchedInvoiceId);
            queryParameters.Add("@MatchedCashLineId", documentMatching.MatchedCashLineId);

            return await ExecuteScalarAsync<long>(StoredProcedureNames.CreateDocumentMatching, queryParameters, true);
        }

        const string _UDTT_AmountInOtherCurrenciesUpdate_IdName = "[Id]";
        const string _UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName = "[AmountInFunctionalCurrency]";
        const string _UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName = "[AmountInStatutoryCurrency]";


        public async Task UpdateStatutoryAndCurrencyAmounts(
            string companyCode,
            StatutoryAndCurrencyAmountsUpdateInfo statutoryAndCurrencyAmountsUpdateInfo)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyCode);

            var cashLinesAmountsToUpdateTable = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@CashLinesAmountsToUpdate", cashLinesAmountsToUpdateTable);
            foreach (var cashLineAmountToUpdate in statutoryAndCurrencyAmountsUpdateInfo.CashLinesAmountsToUpdate)
            {
                var row = cashLinesAmountsToUpdateTable.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = cashLineAmountToUpdate.CashLineId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = cashLineAmountToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = cashLineAmountToUpdate.AmountInStatutoryCurrency;
                cashLinesAmountsToUpdateTable.Rows.Add(row);
            }

            var cashCostAmountsToUpdateTable = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@CashCostsAmountsToUpdate", cashCostAmountsToUpdateTable);
            foreach (var cashCostAmountToUpdate in statutoryAndCurrencyAmountsUpdateInfo.CashCostsAmountsToUpdate)
            {
                var row = cashCostAmountsToUpdateTable.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = cashCostAmountToUpdate.CashAdditionCostId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = cashCostAmountToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = cashCostAmountToUpdate.AmountInStatutoryCurrency;
                cashCostAmountsToUpdateTable.Rows.Add(row);
            }

            var invoiceLinesAmountsToUpdateTable = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@InvoiceLinesAmountsToUpdate", invoiceLinesAmountsToUpdateTable);
            foreach (var invoiceLineAmountToUpdate in statutoryAndCurrencyAmountsUpdateInfo.InvoiceLinesAmountsToUpdate)
            {
                var row = invoiceLinesAmountsToUpdateTable.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = invoiceLineAmountToUpdate.InvoiceLineId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = invoiceLineAmountToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = invoiceLineAmountToUpdate.AmountInStatutoryCurrency;
                invoiceLinesAmountsToUpdateTable.Rows.Add(row);
            }

            var invoiceAmountsToUpdateTable = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@InvoiceAmountsToUpdate", invoiceAmountsToUpdateTable);
            foreach (var invoiceAmountToUpdate in statutoryAndCurrencyAmountsUpdateInfo.InvoiceAmountsToUpdate)
            {
                var row = invoiceAmountsToUpdateTable.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = invoiceAmountToUpdate.InvoiceId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = invoiceAmountToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = invoiceAmountToUpdate.AmountInStatutoryCurrency;
                invoiceAmountsToUpdateTable.Rows.Add(row);
            }

            var journalLinesAmountsToUpdate = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@JournalLinesAmountsToUpdate", journalLinesAmountsToUpdate);
            foreach (var journalLineAmountsToUpdate in statutoryAndCurrencyAmountsUpdateInfo.JournalLinesAmountsToUpdate)
            {
                var row = journalLinesAmountsToUpdate.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = journalLineAmountsToUpdate.JournalLineId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = journalLineAmountsToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = journalLineAmountsToUpdate.AmountInStatutoryCurrency;
                journalLinesAmountsToUpdate.Rows.Add(row);
            }

            var documentMatchingAmountsToUpdateTable = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@DocumentMatchingToUpdate", documentMatchingAmountsToUpdateTable);
            foreach (var documentMatchingAmountToUpdate in statutoryAndCurrencyAmountsUpdateInfo.DocumentMatchingToUpdate)
            {
                var row = documentMatchingAmountsToUpdateTable.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = documentMatchingAmountToUpdate.DocumentMatchingId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = documentMatchingAmountToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = documentMatchingAmountToUpdate.AmountInStatutoryCurrency;
                documentMatchingAmountsToUpdateTable.Rows.Add(row);
            }

            var accountingLinesAmountsToUpdateTable = Build_UDTT_AmountInOtherCurrenciesUpdate_Table();
            queryParameters.Add("@AccountingLinesAmmountsToUpdate", accountingLinesAmountsToUpdateTable);
            foreach (var accountingLineAmountToUpdate in statutoryAndCurrencyAmountsUpdateInfo.AccountingLinesAmountsToUpdate)
            {
                var row = accountingLinesAmountsToUpdateTable.NewRow();
                row[_UDTT_AmountInOtherCurrenciesUpdate_IdName] = accountingLineAmountToUpdate.AccountingLineId;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName] = accountingLineAmountToUpdate.AmountInFunctionalCurrency;
                row[_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName] = accountingLineAmountToUpdate.AmountInStatutoryCurrency;
                accountingLinesAmountsToUpdateTable.Rows.Add(row);
            }

            await ExecuteQueryAsync<AccountingDocumentCreationStatus>(
                StoredProcedureNames.UpdateStatutoryAndCurrencyAmounts, queryParameters, true);
        }

        private DataTable Build_UDTT_AmountInOtherCurrenciesUpdate_Table()
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_AmountInOtherCurrenciesUpdate]");
            table.Columns.Add(new DataColumn(_UDTT_AmountInOtherCurrenciesUpdate_IdName, typeof(long)));
            table.Columns.Add(new DataColumn(_UDTT_AmountInOtherCurrenciesUpdate_AmountInFunctionalCurrencyName, typeof(decimal)));
            table.Columns.Add(new DataColumn(_UDTT_AmountInOtherCurrenciesUpdate_AmountInStatutoryCurrencyName, typeof(decimal)));
            return table;
        }

        public async Task<DocumentsRateUpdateInformation> UpdateTransactionDocumentRates(
            string companyCode,
            long transactionDocumentId,
            DateTime postingDate)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyCode", companyCode);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@PostingDate", postingDate);

            using (var queryResult = await ExecuteQueryMultipleAsync(StoredProcedureNames.UpdateTransactionDocumentRates, queryParameters, true))
            {
                var result = new DocumentsRateUpdateInformation();
                result.TransactionDocumentInfoForRateUpdate = (await queryResult.ReadAsync<TransactionDocumentInfoForRateUpdate>()).FirstOrDefault();
                result.InvoiceInfoForRateUpdate = (await queryResult.ReadAsync<InvoiceInfoForRateUpdate>()).FirstOrDefault();
                result.InvoiceLinesInfoForRateUpdate = await queryResult.ReadAsync<InvoiceLineInfoForRateUpdate>();
                result.CashLinesInfoForRateUpdate = await queryResult.ReadAsync<CashLineInfoForRateUpdate>();
                result.CashAdditionalCostsInfoForRateUpdate = await queryResult.ReadAsync<CashAdditionalCostInfoForRateUpdate>();
                result.JournalLinesInfoForRateUpdate = await queryResult.ReadAsync<JournalLineInfoForRateUpdate>();
                result.AccountingDocumentLinesInfoForRateUpdate = await queryResult.ReadAsync<AccountingDocumentLineInfoForRateUpdate>();
                result.DocumentMatchingInfoForRateUpdate = await queryResult.ReadAsync<DocumentMatchingInfoForRateUpdate>();
                result.DocumentMatchingOfCounterpartyTransferForRateUpdate = await queryResult.ReadAsync<DocumentMatchingInfoForRateUpdate>();
                return result;
            }
        }


        private static class StoredProcedureNames
        {
            internal const string CreateDocumentMatching = "[PreAccounting].[usp_CreateDocumentMatching]";
            internal const string UpdateTransactionDocumentRates = "[Invoicing].[usp_UpdateTransactionDocumentRates]";
            internal const string UpdateStatutoryAndCurrencyAmounts = "[Invoicing].[usp_UpdateStatutoryAndCurrencyAmounts]";
            internal const string DeleteManualJLOrRevaluation = "[Invoicing].[usp_DeleteManualJLOrRevaluation]";
        }
    }
}
