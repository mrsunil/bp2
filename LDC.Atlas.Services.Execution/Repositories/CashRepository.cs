using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class CashRepository : BaseRepository, ICashRepository
    {
        public CashRepository(IDapperContext dapperContext)
      : base(dapperContext)
        {
        }

        /// <summary>
        /// This SP creates the following records associated to cash:
        ///   TransactionDocument
        ///   Cash
        ///   CashLines
        ///    CashAdditionalCost
        /// It also creates a Transaction document related to diff ccy(not sure this is the right place...)
        /// and updates the status "to interface" depending on mapping errors(not sure this is the right place...)
        /// </summary>
        /// <param name="cash"></param>
        /// <returns></returns>
        public async Task CreateCashAsync(Cash cash)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CashTypeId", cash.ChildCashTypeId);
            queryParameters.Add("@NominalBankAccountCode", cash.NominalBankAccountCode);
            queryParameters.Add("@OwnerName", cash.OwnerName);
            queryParameters.Add("@CounterPartyDocumentReference", cash.CounterpartyDocumentReference);
            queryParameters.Add("@CounterPartyCode", cash.CounterPartyCode);
            queryParameters.Add("@ValueDate", cash.ValueDate);
            queryParameters.Add("@Amount", cash.Amount);
            queryParameters.Add("@CharterId", cash.CharterId);
            queryParameters.Add("@NominalAccountCode", cash.NominalAccountCode);
            queryParameters.Add("@DepartmentId", cash.DepartmentId);
            queryParameters.Add("@Narrative", cash.Narrative);
            queryParameters.Add("@TransmitToTreasury", cash.ToTransmitToTreasury);
            queryParameters.Add("@DocumentDate", cash.DocumentDate);
            queryParameters.Add("@CurrencyCode", cash.CurrencyCode);
            queryParameters.Add("@AuthorizedForPosting", cash.AuthorizedForPosting);
            queryParameters.Add("@PhysicalDocumentId", cash.PhysicalDocumentId);
            queryParameters.Add("@CompanyId", cash.CompanyId);
            queryParameters.Add("@AdditionalCostDetails", ToArrayTvp(cash.AdditionalCostDetails));
            queryParameters.Add("@DocumentReference", cash.DocumentReference);
            queryParameters.Add("@CostTypeCode", cash.CostTypeCode);
            queryParameters.Add("@YearNumber", cash.YearNumber);
            queryParameters.Add("@TransactionDocumentTypeId", cash.TransactionDocumentTypeId);
            queryParameters.Add("@Year", cash.Year);
            queryParameters.Add("@BankAccountCode", cash.BankAccountCode);
            queryParameters.Add("@UrgentPayment", cash.UrgentPayment);
            queryParameters.Add("@CashId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@MatchingCashId", cash.MatchingCashId == 0 ? null : cash.MatchingCashId);
            queryParameters.Add("@MatchingCCY", cash.MatchingCurrency);
            queryParameters.Add("@MatchingAmount", cash.MatchingAmount);
            queryParameters.Add("@MatchingRate", cash.MatchingRate);
            queryParameters.Add("@MatchingRateType", cash.MatchingRateType);
            queryParameters.Add("@MatchingStatusId", cash.MatchingStatusId == 0 ? null : cash.MatchingStatusId);
            queryParameters.Add("@MatchingYearNumber", cash.MatchedYeanNumber);
            queryParameters.Add("@MatchingDocumentReference", cash.MatchedDocumentReference);
            queryParameters.Add("@MatchedTransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@PaymentCounterpartyCode", cash.PaymentCounterpartyCode);
            queryParameters.Add("@CashDocumentTypeId", cash.CashDocumentType);
            queryParameters.Add("@JLTransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@CounterpartyTransferId", null);
            queryParameters.Add("@RevaluationDocumentId", null);
            queryParameters.Add("@CashLines", ToCashLinesArrayTvp(cash));

            MappingErrorFields mappingErrorFields;
            using (
                 var grid = await ExecuteQueryMultipleAsync(
                     StoredProcedureNames.CreateCash,
                     queryParameters,
                     true))
            {
                mappingErrorFields = (await grid.ReadAsync<MappingErrorFields>()).First();
                cash.CashLines = (await grid.ReadAsync<CashLine>()).ToList();
            }

            cash.C2CCode = mappingErrorFields.C2CCode;
            cash.CostAlternativeCode = mappingErrorFields.CostAlternativeCode;
            cash.DepartmentAlternativeCode = mappingErrorFields.DepartmentAlternativeCode;
            cash.NominalAlternativeAccount = mappingErrorFields.NominalAlternativeAccount;
            cash.TaxInterfaceCode = mappingErrorFields.TaxInterfaceCode;

            long cashId = queryParameters.Get<long>("@CashId");
            long transactionDocumentId = queryParameters.Get<long>("@TransactionDocumentId");
            long? matchedTransactionDocumentId = queryParameters.Get<long?>("@MatchedTransactionDocumentId");
            long? jLTransactionDocumentId = queryParameters.Get<long?>("@JLTransactionDocumentId");

            cash.CashId = cashId;
            cash.TransactionDocumentId = transactionDocumentId;
            cash.MatchedTransactionDocumentId = matchedTransactionDocumentId;
            cash.JLTransactionDocumentId = jLTransactionDocumentId;
        }

        public async Task<CashDocumentReference> GetDocumentReferenceValues(string companyId, int year, long transactionDocumentTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@Year", year);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@TransactionTypeYearCounter", dbType: DbType.Int32, direction: ParameterDirection.Output);
            queryParameters.Add("@Label", dbType: DbType.String, direction: ParameterDirection.Output, size: 100);
            await ExecuteNonQueryAsync(StoredProcedureNames.GetDocumentReferenceValue, queryParameters);

            int transactionTypeYearCounter = queryParameters.Get<int>("@TransactionTypeYearCounter");
            string label = queryParameters.Get<string>("@Label");

            return new CashDocumentReference()
            {
                TransactionTypeYearCounter = transactionTypeYearCounter,
                Label = label
            };
        }

        public async Task<CashDocumentReference> GetCashDocumentLabelValue(long cashTypeId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CashTypeId", cashTypeId);
            var result = await ExecuteQueryFirstOrDefaultAsync<CashDocumentReference>(StoredProcedureNames.GetTransactionDocumentTypeForCashType, queryParameters, false);

            return result;
        }

        public async Task<CashDocumentReference> GetAdditionalCashYearNumber(string companyId, int year)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@year", year);
            queryParameters.Add("@TransactionTypeYearCounter", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GetDocumentReferenceValueforAdditionalCash, queryParameters);

            int transactionTypeYearCounter = queryParameters.Get<int>("@TransactionTypeYearCounter");
            return new CashDocumentReference() { TransactionTypeYearCounter = transactionTypeYearCounter };
        }

        public async Task DeleteAccountingDocument(long transactionDocumentId, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteAccountingDocument, queryParameters, true);
        }

        public async Task<long?> CreateUpdateDocumentMatchingsForCashByPickingCreation(MatchFlag matchFlag, bool isEdit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", matchFlag.CompanyId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CashIdOfCashByPicking", matchFlag.CashIdOfCashByPicking);
            queryParameters.Add("@DocumentMatching", CashToDocumentMatchingTvp(matchFlag.DocumentMatchings, isEdit));
            queryParameters.Add("@MatchFlagId", matchFlag.MatchFlagId == 0 ? null : matchFlag.MatchFlagId);
            queryParameters.Add("@IsPrematch", matchFlag.IsPrematch);
            queryParameters.Add("@CounterpartyId", matchFlag.CounterPartyId);
            queryParameters.Add("@CounterPartyCode", matchFlag.CounterPartyCode);
            queryParameters.Add("@CurrencyCode", matchFlag.CurrencyCode);
            queryParameters.Add("@MatchingStatusId", matchFlag.MatchingStatusId == 0 ? null : matchFlag.MatchingStatusId);
            queryParameters.Add("@MatchFlagIdInserted", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@DocumentReference", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@CurrentDocumentReferenceNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentIdRevarsal", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@MatchFlagCodeInserted", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@PaymentDocumentDate", matchFlag.PaymentDocumentDate);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUpdateDocumentMatchingForCashByPickingCreation, queryParameters, true);
            return queryParameters.Get<long?>("@MatchFlagIdInserted");
        }

        public async Task UpdateCashAsync(Cash cash)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CashId", cash.CashId);
            queryParameters.Add("@NominalBankAccountCode", cash.NominalBankAccountCode);
            queryParameters.Add("@OwnerName", cash.OwnerName);
            queryParameters.Add("@CounterPartyDocumentReference", cash.CounterpartyDocumentReference);
            queryParameters.Add("@CounterPartyCode", cash.CounterPartyCode);
            queryParameters.Add("@ValueDate", cash.ValueDate);
            queryParameters.Add("@Amount", cash.Amount);
            queryParameters.Add("@CharterId", cash.CharterId);
            queryParameters.Add("@NominalAccountCode", cash.NominalAccountCode);
            queryParameters.Add("@DepartmentId", cash.DepartmentId);
            queryParameters.Add("@Narrative", cash.Narrative);
            queryParameters.Add("@TransmitToTreasury", cash.ToTransmitToTreasury);
            queryParameters.Add("@DocumentDate", cash.DocumentDate);
            queryParameters.Add("@CurrencyCode", cash.CurrencyCode);
            queryParameters.Add("@AuthorizedForPosting", cash.AuthorizedForPosting);
            queryParameters.Add("@PhysicalDocumentId", cash.PhysicalDocumentId);
            queryParameters.Add("@CompanyId", cash.CompanyId);
            queryParameters.Add("@AdditionalCostDetails", ToArrayTvp(cash.AdditionalCostDetails));
            queryParameters.Add("@CostTypeCode", cash.CostTypeCode);
            queryParameters.Add("@TransactionDocumentId", cash.TransactionDocumentId);
            queryParameters.Add("@BankAccountCode", cash.BankAccountCode);
            queryParameters.Add("@UrgentPayment", cash.UrgentPayment);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@MatchingCashId", cash.MatchingCashId == 0 ? null : cash.MatchingCashId);
            queryParameters.Add("@MatchingCCY", cash.MatchingCurrency);
            queryParameters.Add("@MatchingAmount", cash.MatchingAmount);
            queryParameters.Add("@MatchingRate", cash.MatchingRate);
            queryParameters.Add("@MatchingRateType", cash.MatchingRateType);
            queryParameters.Add("@MatchingStatusId", cash.MatchingStatusId == 0 ? null : cash.MatchingStatusId);
            queryParameters.Add("@CounterpartyTransferId", null);
            queryParameters.Add("@RevaluationDocumentId", null);
            queryParameters.Add("@PaymentCounterpartyCode", cash.PaymentCounterpartyCode);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCashandAdditionalCost, queryParameters, true);
        }

        public async Task<Cash> CreateDocumentMatchingDifferentClient(Cash cash, IEnumerable<ManualJournalLine> manualJournalLines)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", cash.CompanyId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@DocumentMatching", CashToDocumentMatchingTvp(cash.DocumentMatchings, false)); // Here always send false, as this variable is used only for diff ccy
            queryParameters.Add("@MatchFlagId", cash.MatchFlagId == 0 ? null : cash.MatchFlagId);
            queryParameters.Add("@CashId", cash.CashId);
            queryParameters.Add("@IsPrematch", cash.IsPrematch);
            queryParameters.Add("@CurrencyCode", cash.CurrencyCode);
            queryParameters.Add("@AuthorizedForPosting", true);
            queryParameters.Add("@DocumentDate", cash.DocumentDate);
            queryParameters.Add("@ValueDate", cash.ValueDate);
            queryParameters.Add("@Year", cash.DocumentDate.Year);
            queryParameters.Add("@MatchingStatusId", cash.MatchingStatusId == 0 ? null : cash.MatchingStatusId);
            queryParameters.Add("@ManualJournalLine", ToJournalLinesForDiffClients(manualJournalLines)); // TODO - remove the parameter and this line when the document matching is implemented for diff clients
            queryParameters.Add("@MatchFlagIdCashInserted", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@MatchFlagIdInvoiceInserted", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@DocumentReference", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@CurrentDocumentReferenceNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@MatchingCounterPartyId", cash.MatchingCounterpartyId);
            queryParameters.Add("@PaymentCounterPartyId", cash.PaymentCounterpartyId);
            queryParameters.Add("@CounterPartyTransferId", cash.CounterPartyTransferId);
            queryParameters.Add("@JLTypeId", (short)JLType.CounterPartyTransfer);
            queryParameters.Add("@ValueDate", cash.ValueDate);
            queryParameters.Add("@JournalId", dbType: DbType.Int64, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateDocumentMatchingDifferentClient, queryParameters, true);

            long? matchFlagIdCashInserted = queryParameters.Get<long?>("@MatchFlagIdCashInserted");
            long? matchFlagIdInvoiceInserted = queryParameters.Get<long?>("@MatchFlagIdInvoiceInserted");
            return new Cash() { MatchFlagIdCashInserted = matchFlagIdCashInserted, MatchFlagIdInvoiceInserted = matchFlagIdInvoiceInserted };
        }

        private DataTable ToArrayTvp(IEnumerable<CashAdditionalCost> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_AdditionalCost]");

            var cashAdditionalCostId = new DataColumn("CashAdditionalCostId", typeof(long));
            table.Columns.Add(cashAdditionalCostId);

            var costType = new DataColumn("CostType", typeof(string));
            table.Columns.Add(costType);

            var accountId = new DataColumn("AccountId", typeof(long));
            table.Columns.Add(accountId);

            var currencyCode = new DataColumn("CurrencyCode", typeof(string));
            table.Columns.Add(currencyCode);

            var costDirectionId = new DataColumn("CostDirectionId", typeof(int));
            table.Columns.Add(costDirectionId);

            var cashTypeId = new DataColumn("CashTypeId", typeof(long));
            table.Columns.Add(cashTypeId);

            var amount = new DataColumn("Amount", typeof(decimal));
            table.Columns.Add(amount);

            var narrative = new DataColumn("Narrative", typeof(string));
            table.Columns.Add(narrative);

            var documentReference = new DataColumn("DocumentReference", typeof(string));
            table.Columns.Add(documentReference);

            var year = new DataColumn("Year", typeof(int));
            table.Columns.Add(year);

            var yearNumber = new DataColumn("YearNumber", typeof(int));
            table.Columns.Add(yearNumber);

            var accountLineType = new DataColumn("AccountLineType", typeof(string));
            table.Columns.Add(accountLineType);

            var clientAccount = new DataColumn("ClientAccount", typeof(long));
            table.Columns.Add(clientAccount);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[cashAdditionalCostId] = value.CashAdditionalCostId;
                    row[costType] = value.CostTypeCode;
                    row[accountId] = value.AccountId;
                    row[accountLineType] = value.AccountLineType;
                    row[currencyCode] = value.CurrencyCode;
                    row[costDirectionId] = value.CostDirectionId;
                    row[cashTypeId] = value.CashTypeId;
                    row[amount] = value.Amount;
                    row[narrative] = value.Narrative;
                    row[documentReference] = value.DocumentReference;
                    row[year] = value.Year;
                    row[yearNumber] = value.YearNumber;
                    row[clientAccount] = value.ClientAccount != null ? value.ClientAccount : (object)DBNull.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable CashToDocumentMatchingTvp(ICollection<DocumentMatching> documentMatchings, bool isEdit)
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_DocumentMatching]");

            var transactionDocumentId = new DataColumn("TransactionDocumentId", typeof(long));
            table.Columns.Add(transactionDocumentId);
            var matchedAmount = new DataColumn("MatchedAmount", typeof(decimal));
            table.Columns.Add(matchedAmount);
            var matchingStatusId = new DataColumn("MatchingStatusId", typeof(short));
            table.Columns.Add(matchingStatusId);
            var isCash = new DataColumn("IsCash", typeof(bool));
            table.Columns.Add(isCash);

            var amountInFunctionalCurrency = new DataColumn("AmountInFunctionalCurrency", typeof(decimal));
            table.Columns.Add(amountInFunctionalCurrency);
            var amountInStatutoryCurrency = new DataColumn("AmountInStatutoryCurrency", typeof(decimal));
            table.Columns.Add(amountInStatutoryCurrency);
            var valueDate = new DataColumn("ValueDate", typeof(DateTime));
            table.Columns.Add(valueDate);
            var departmentId = new DataColumn("DepartmentId", typeof(long));
            table.Columns.Add(departmentId);
            var transactionDirectionId = new DataColumn("TransactionDirectionId", typeof(int));
            table.Columns.Add(transactionDirectionId);
            var lineId = new DataColumn("[LineId]", typeof(int));
            table.Columns.Add(lineId);

            var secondaryDocumentReferenceId = new DataColumn("[SecondaryDocumentReferenceId]", typeof(long));
            table.Columns.Add(secondaryDocumentReferenceId);

            var sourceJournalLineId = new DataColumn("SourceJournalLineId", typeof(long));
            table.Columns.Add(sourceJournalLineId);
            var sourceInvoiceId = new DataColumn("SourceInvoiceId", typeof(long));
            table.Columns.Add(sourceInvoiceId);
            var sourceCashLineId = new DataColumn("SourceCashLineId", typeof(long));
            table.Columns.Add(sourceCashLineId);
            var matchedJournalLineId = new DataColumn("MatchedJournalLineId", typeof(long));
            table.Columns.Add(matchedJournalLineId);
            var matchedInvoiceId = new DataColumn("MatchedInvoiceId", typeof(long));
            table.Columns.Add(matchedInvoiceId);
            var matchedCashLineId = new DataColumn("MatchedCashLineId", typeof(long));
            table.Columns.Add(matchedCashLineId);

            foreach (var item in documentMatchings)
            {
                var row = table.NewRow();
                row[transactionDocumentId] = item.TransactionDocumentId.HasValue ? item.TransactionDocumentId.Value : (object)DBNull.Value;
                row[matchedAmount] = item.MatchedAmount;
                row[matchingStatusId] = DBNull.Value;
                row[valueDate] = item.ValueDate.HasValue ? item.ValueDate.Value : (object)DBNull.Value;
                row[departmentId] = item.DepartmentId.HasValue ? item.DepartmentId.Value : (object)DBNull.Value;
                row[transactionDirectionId] = item.TransactionDirectionId.HasValue ? item.TransactionDirectionId.Value : (object)DBNull.Value;

                row[amountInFunctionalCurrency] = item.AmountInFunctionalCurrency.HasValue ? item.AmountInFunctionalCurrency.Value : (object)DBNull.Value;
                row[amountInStatutoryCurrency] = item.AmountInStatutoryCurrency.HasValue ? item.AmountInStatutoryCurrency.Value : (object)DBNull.Value;

                row[secondaryDocumentReferenceId] = item.SecondaryDocumentReferenceId.HasValue ? item.SecondaryDocumentReferenceId.Value : (object)DBNull.Value;
                row[sourceCashLineId] = item.SourceCashLineId.HasValue ? item.SourceCashLineId.Value : (object)DBNull.Value;
                row[sourceJournalLineId] = item.SourceJournalLineId.HasValue ? item.SourceJournalLineId.Value : (object)DBNull.Value;
                row[sourceInvoiceId] = item.SourceInvoiceId.HasValue ? item.SourceInvoiceId.Value : (object)DBNull.Value;
                row[matchedJournalLineId] = item.MatchedJournalLineId.HasValue ? item.MatchedJournalLineId.Value : (object)DBNull.Value;
                row[matchedInvoiceId] = item.MatchedInvoiceId.HasValue ? item.MatchedInvoiceId.Value : (object)DBNull.Value;
                row[matchedCashLineId] = item.MatchedCashLineId.HasValue ? item.MatchedCashLineId.Value : (object)DBNull.Value;

                row[lineId] = (object)DBNull.Value;
                table.Rows.Add(row);
            }

            return table;
        }

        /// <summary>
        /// Delete a cash by passing either a cash id or the transaction document id
        /// </summary>
        /// <param name="company"></param>
        /// <param name="cashId">Id of the cash ; if not null, transactionDocumentId must be null and vice versa</param>
        /// <param name="transactionDocumentId">Id of the transaction document; if not null, cash id must be null and vice versa</param>
        /// <param name="physicalDelete">Pass true if you want to physically delete the record. If false is passed,
        /// a logical delete is made</param>
        /// <returns></returns>
        public async Task DeleteCashAsync(string company,
            long? cashId,
            long? transactionDocumentId = null,
            bool physicalDelete = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CashId", cashId);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@PhysicalDelete", physicalDelete);
            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteCash, queryParameters, true);
        }

        public async Task UpdateCashPhysicalDocument(long cashId, long physicalDocumentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CashId", cashId);
            queryParameters.Add("@PhysicalDocumentId ", physicalDocumentId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCashPhysicalDocument, queryParameters, true);
        }

        private DataTable ToJournalLinesForDiffClients(IEnumerable<ManualJournalLine> manualJournalLines)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_ManualJournalLine]");

            DataColumn journalLineId = new DataColumn("[JournalLineId]", typeof(long));
            table.Columns.Add(journalLineId);

            DataColumn journalDocumentId = new DataColumn("[JournalDocumentId]", typeof(long));
            table.Columns.Add(journalDocumentId);

            DataColumn accountReferenceId = new DataColumn("[AccountReferenceId]", typeof(long));
            table.Columns.Add(accountReferenceId);

            DataColumn clientAccountId = new DataColumn("[ClientAccountId]", typeof(long));
            table.Columns.Add(clientAccountId);

            DataColumn associatedAccountId = new DataColumn("[AssociatedAccountId]", typeof(long));
            table.Columns.Add(associatedAccountId);

            DataColumn accountLineTypeId = new DataColumn("[AccountLineTypeId]", typeof(int));
            table.Columns.Add(accountLineTypeId);

            DataColumn costTypeId = new DataColumn("[CostTypeId]", typeof(long));
            table.Columns.Add(costTypeId);

            DataColumn amount = new DataColumn("[Amount]", typeof(decimal));
            table.Columns.Add(amount);

            DataColumn narrative = new DataColumn("[Narrative]", typeof(string));
            table.Columns.Add(narrative);

            DataColumn departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);

            DataColumn secondaryDocumentReference = new DataColumn("[SecondaryDocumentReference]", typeof(string));
            table.Columns.Add(secondaryDocumentReference);

            DataColumn externalDocumentReference = new DataColumn("[ExternalDocumentReference]", typeof(string));
            table.Columns.Add(externalDocumentReference);

            DataColumn sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            DataColumn commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);

            DataColumn quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);

            DataColumn costCenter = new DataColumn("[CostCenter]", typeof(string));
            table.Columns.Add(costCenter);

            DataColumn accrualNumber = new DataColumn("[AccrualNumber]", typeof(int));
            table.Columns.Add(accrualNumber);

            DataColumn charterId = new DataColumn("[CharterId]", typeof(long));
            table.Columns.Add(charterId);

            foreach (var journalLine in manualJournalLines)
            {
                var journalLineRow = table.NewRow();
                journalLineRow[clientAccountId] = journalLine.ClientAccountId ?? (object)DBNull.Value;
                journalLineRow[accountLineTypeId] = journalLine.AccountLineTypeId;
                journalLineRow[amount] = journalLine.Amount ?? (object)DBNull.Value;
                journalLineRow[narrative] = journalLine.Narrative;
                journalLineRow[departmentId] = journalLine.DepartmentId ?? (object)DBNull.Value;
                journalLineRow[secondaryDocumentReference] = journalLine.SecondaryDocumentReference;
                journalLineRow[externalDocumentReference] = journalLine.ExternalDocumentReference;
                journalLineRow[charterId] = journalLine.CharterId ?? (object)DBNull.Value;
                journalLineRow[sectionId] = journalLine.SectionId ?? (object)DBNull.Value;
                table.Rows.Add(journalLineRow);
            }

            return table;
        }

        public async Task<Cash> GetCashByIdAsync(string company, long cashId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@cashId", cashId);
            queryParameters.Add("@DataversionId", null);
            Cash cash;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCashbyCashId, queryParameters, true))
            {
                cash = (await grid.ReadAsync<Cash>()).FirstOrDefault();
                var additionalCost = await grid.ReadAsync<CashAdditionalCost>();
                cash.AdditionalCostDetails = additionalCost.ToList();
                var invoiceDetails = await grid.ReadAsync<DocumentMatching>();
                cash.DocumentMatchings = invoiceDetails.ToList();
            }

            return cash;
        }

        private static DataTable ToCashLinesArrayTvp(Cash cash)
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_CashLine]");

            var cashId = new DataColumn("CashId", typeof(long));
            table.Columns.Add(cashId);

            var departmentId = new DataColumn("DepartmentId", typeof(long));
            table.Columns.Add(departmentId);

            var transactionDirectionId = new DataColumn("TransactionDirectionId", typeof(int));
            table.Columns.Add(transactionDirectionId);

            var amount = new DataColumn("Amount", typeof(decimal));
            table.Columns.Add(amount);

            var amountInFunctionalCurrency = new DataColumn("AmountInFunctionalCurrency", typeof(decimal));
            table.Columns.Add(amountInFunctionalCurrency);

            var amountInStatutoryCurrency = new DataColumn("AmountInStatutoryCurrency", typeof(decimal));
            table.Columns.Add(amountInStatutoryCurrency);

            var initiallyMatchedJournalLineId = new DataColumn("InitiallyMatchedJournalLineId", typeof(long));
            table.Columns.Add(initiallyMatchedJournalLineId);

            var initiallyMatchedInvoiceId = new DataColumn("InitiallyMatchedInvoiceId", typeof(long));
            table.Columns.Add(initiallyMatchedInvoiceId);

            var initiallyMatchedCashLineId = new DataColumn("InitiallyMatchedCashLineId", typeof(long));
            table.Columns.Add(initiallyMatchedCashLineId);

            if (cash.CashLines != null)
            {
                foreach (var cashLine in cash.CashLines)
                {
                    var row = table.NewRow();
                    row[cashId] = cashLine.CashId;
                    row[departmentId] = cashLine.DepartmentId;
                    row[transactionDirectionId] = cashLine.TransactionDirectionId;
                    row[amount] = cashLine.Amount ?? (object)DBNull.Value;
                    row[amountInFunctionalCurrency] = cashLine.AmountInFunctionalCurrency ?? (object)DBNull.Value;
                    row[amountInStatutoryCurrency] = cashLine.AmountInStatutoryCurrency ?? (object)DBNull.Value;
                    row[initiallyMatchedCashLineId] = cashLine.InitiallyMatchedCashLineId ?? (object)DBNull.Value;
                    row[initiallyMatchedInvoiceId] = cashLine.InitiallyMatchedInvoiceId ?? (object)DBNull.Value;
                    row[initiallyMatchedJournalLineId] = cashLine.InitiallyMatchedJournalLineId ?? (object)DBNull.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task<string> GetJournalDocumentReference(string company, int year)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Year", year);
            queryParameters.Add("@TransactionDocumentTypeId", 9);
            queryParameters.Add("@DocumentDate", 9);
            queryParameters.Add("@DocumentReference", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);

            await ExecuteNonQueryAsync(StoredProcedureNames.GetDocumentReferenceDetails, queryParameters);

            return queryParameters.Get<string>("@DocumentReference");
        }

        public async Task<CashReferences> GetLinkedRecordsForCashUpdate(long cashId, string companyCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyCode);
            queryParameters.Add("@CashId", cashId);

            CashReferences linkedRecordsOfCash = new CashReferences();
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetLinkedRecordsOfCash, queryParameters))
            {
                linkedRecordsOfCash.CashTransactionDocumentIds = await grid.ReadAsync<CashShortInformationForDeletion>();
                linkedRecordsOfCash.ManualJournalTransactionDocumentIds = await grid.ReadAsync<long>();
                linkedRecordsOfCash.MatchFlagIds = await grid.ReadAsync<long>();
            }

            return linkedRecordsOfCash;
        }

        public async Task UpdateCashCounterpartyTransferId(string companyCode, long cashId, long? counterPartyTransferTransactionDocumentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyCode);
            queryParameters.Add("@CashId", cashId);
            queryParameters.Add("@CounterPartyTransferTransactionDocumentId", counterPartyTransferTransactionDocumentId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCashCounterpartyTransferId, queryParameters, true);
        }

        public async Task ReplaceTransactionDocumentIdsInLogs(string companyCode, IEnumerable<OldNewId> oldNewIds)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyCode);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@OldNewIds", ToTransactionDocumentIdsArrayTvp(oldNewIds));

            await ExecuteNonQueryAsync(StoredProcedureNames.ReplaceTransactionDocumentIdsInLogs, queryParameters, true);
        }

        private static DataTable ToTransactionDocumentIdsArrayTvp(IEnumerable<OldNewId> oldNewIds)
        {
            var table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_OldNewIds]");

            var oldTransactionDocumentId = new DataColumn("OldTransactionDocumentId", typeof(long));
            table.Columns.Add(oldTransactionDocumentId);

            var newTransactionDocumentId = new DataColumn("NewTransactionDocumentId", typeof(long));
            table.Columns.Add(newTransactionDocumentId);

            foreach (var item in oldNewIds)
            {
                var row = table.NewRow();
                row[oldTransactionDocumentId] = item.OldTransactionDocumentId;
                row[newTransactionDocumentId] = item.NewTransactionDocumentId;
                table.Rows.Add(row);
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateCashCounterpartyTransferId = "[Invoicing].[usp_UpdateCashCounterpartyTransferId]";
            internal const string CreateCash = "[Invoicing].[usp_CreateCash]";
            internal const string GetDocumentReferenceValue = "[Invoicing].[usp_GetDocumentReferenceValue]";
            internal const string GetTransactionDocumentTypeForCashType = "[Invoicing].[usp_GetTransactionDocumentTypeForCashType]";
            internal const string GetDocumentReferenceValueforAdditionalCash = "[Invoicing].[usp_GetDocumentReferenceValueforAdditionalCash]";
            internal const string UpdateCashandAdditionalCost = "[Invoicing].[usp_UpdateCashandAdditionalCost]";
            internal const string CreateUpdateDocumentMatchingForCashByPickingCreation = "[Invoicing].[usp_CreateUpdateDocumentMatching]";
            internal const string DeleteCash = "[Invoicing].[usp_DeleteCash]";
            internal const string CreateDocumentMatchingDifferentClient = "[Invoicing].[usp_CreateDocumentMatchingDifferentClient]";
            internal const string DeleteAccountingDocument = "[PreAccounting].[usp_DeleteAccountingDocument]";
            internal const string UpdateCashPhysicalDocument = "[Invoicing].[usp_UpdateCashPhysicalDocument]";
            internal const string GetCashbyCashId = "[Invoicing].[usp_GetCashbyCashId]";
            internal const string GetDocumentReferenceDetails = "[Invoicing].[usp_GetDocumentReferenceDetails]";
            internal const string GetLinkedRecordsOfCash = "[Invoicing].[usp_GetLinkedRecordsForCashUpdate]";
            internal const string ReplaceTransactionDocumentIdsInLogs = "[Invoicing].[usp_ReplaceTransactionDocumentIdsInLogs]";
        }
    }
}
