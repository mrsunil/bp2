using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Repositories
{
    public class AccountingDocumentRepository : BaseRepository, IAccountingDocumentRepository
    {
        public AccountingDocumentRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<AccountingDocumentCreationStatus>> CreateAccountingDocument(string company, IEnumerable<AccountingDocument> accountingDocuments)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            List<AccountingDocumentLine> accountinngLines = new List<AccountingDocumentLine>();
            foreach (AccountingDocument accountingDocument in accountingDocuments)
            {
                accountingDocument.AccountingDocumentLines.ToList()
                        .ForEach(line => line.TransactionDocumentId = accountingDocument.TransactionDocumentId);
                accountinngLines.AddRange(accountingDocument.AccountingDocumentLines);
            }
            queryParameters.Add("@AccountingDocuments", ToArrayTVP(accountingDocuments));
            queryParameters.Add("@AccountingLines", ConvertAccountingDocumentLinesIntoDataTable(accountinngLines));
            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryAsync<AccountingDocumentCreationStatus>(StoredProcedureNames.CreateAccountingDocument, queryParameters, true);
        }

        /// <summary>
        /// Create Accouting Documents For Reversal
        /// </summary>
        /// <param name="transactionDocumentId">TransactionDocumentId of the reversal</param>
        /// <param name="reversedTransactionDocumentId">TransactionDocumentId of the reversed (original) Document</param>
        /// <param name="company">The company code </param>
        /// <param name="postOpClosedPolicy">True if the user that created the reversal has the PostOpClosed privilege</param>
        /// <returns> The list of new accouting document id created</returns>
        public async Task<IEnumerable<long>> CreateAccountingDocumentForReversal(
            long transactionDocumentId,
            long reversedTransactionDocumentId,
            string company,
            bool postOpClosedPolicy)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@ReversedTransactionDocumentId", reversedTransactionDocumentId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@PostOpClosedPolicy", postOpClosedPolicy);

            return await ExecuteQueryAsync<long>(StoredProcedureNames.CreateAccountingDocumentForReversal, queryParameters, true);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="company"></param>
        /// <param name="accountingDocuments">"Accounting documents", for which only the following properties are usefull
        /// in this context (ie used by the SP) : AccountingId, ErrorMessage, StatusId </param>
        /// <param name="statusId">If set to "posted", the SP will also update the posting date
        /// Note that this parameter SHOULD NOT exist, as the status id is already within the accounting docs passed in parameter</param>
        /// <returns></returns>
        public async Task UpdateAccountingDocumentsStatus(
                        string company,
                        List<AccountingDocumentStatus> accountingDocuments,
                        int statusId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@accountingDocuments", ToArrayTVP(accountingDocuments, statusId));
            queryParameters.Add(DataVersionIdParameter, null);

            if (statusId == (int)PostingStatus.Posted)
            {
                queryParameters.Add("@posted", 1);
            }

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateAccountingDocumentStatus, queryParameters, true);
        }

        public async Task UpdatePrematchForMatchFlag(string company, long? matchFlagId, bool isPrematch)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@MatchFlagId", matchFlagId);
            queryParameters.Add("@Isprematch", isPrematch ? 1 : 0);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePrematchForMatchFlag, queryParameters, true);
        }

        public async Task UpdateAccountingDocumentStatutoryAndFunctionalCurrencyAmounts(string company, AccountingDocument accountingDocument)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@AccountingId", accountingDocument.AccountingId);
            queryParameters.Add("@Roe", accountingDocument.Roe);
            queryParameters.Add("@StatusId", accountingDocument.StatusId);
            queryParameters.Add("@ErrorMessage", accountingDocument.ErrorMessage);
            queryParameters.Add("@AccountingLines", ConvertAccountingDocumentLinesIntoDataTable(accountingDocument.AccountingDocumentLines, true));
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateAccountingDocumentStatutoryAndFunctionalCurrencyAmounts, queryParameters, true);
        }

        public async Task<SectionPostingStatus> UpdateAccountingDocument(AccountingDocument accountingDocument, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingDocumentId", accountingDocument.AccountingId);
            queryParameters.Add("@CurrencyCode", accountingDocument.CurrencyCode);
            queryParameters.Add("@AccountingPeriod", accountingDocument.AccountingPeriod);
            queryParameters.Add("@DocumentDate", accountingDocument.DocumentDate);
            queryParameters.Add("@ValueDate", accountingDocument.ValueDate);
            queryParameters.Add("@GLDate", accountingDocument.GLDate);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@ToInterface", accountingDocument.ToInterface);
            queryParameters.Add("@DmsId", accountingDocument.DmsId);
            queryParameters.Add("@StatusId", accountingDocument.StatusId);
            queryParameters.Add("@ErrorMessage", accountingDocument.ErrorMessage);
            queryParameters.Add("@AccountingLines", ConvertAccountingDocumentLinesIntoDataTable(accountingDocument.AccountingDocumentLines, isUpdate: true));
            IEnumerable<SectionPostingStatus> sectionPostingStatus = await ExecuteQueryAsync<SectionPostingStatus>(StoredProcedureNames.UpdateAccountingDocument, queryParameters, true);
            return sectionPostingStatus.AsList<SectionPostingStatus>().FirstOrDefault();
        }

        public async Task<IEnumerable<AccountingDocument>> GetAccountingDocumentsByAccountingIdsAsync(IEnumerable<long> accountingIds, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@accountingIds", ToArrayTVP(accountingIds));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            IEnumerable<AccountingDocument> lstAccountingDocument;

            using (SqlMapper.GridReader grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingDocumentByAccountingId, queryParameters, true))
            {
                lstAccountingDocument = (await grid.ReadAsync<AccountingDocument>()).ToList();

                IEnumerable<AccountingDocumentLine> accountingDocumentLines = await grid.ReadAsync<AccountingDocumentLine>();

                foreach (AccountingDocument accountingDocument in lstAccountingDocument)
                {
                    accountingDocument.AccountingDocumentLines = accountingDocumentLines.Where(document => document.AccountingDocumentId == accountingDocument.AccountingId);
                }
            }

            return lstAccountingDocument;
        }

        private static DataTable ToArrayTVP(IEnumerable<AccountingDocument> accountingDocuments)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingDocument]");

            DataColumn accountingId = new DataColumn("[AccountingId]", typeof(long));
            table.Columns.Add(accountingId);

            DataColumn transactionDocumentId = new DataColumn("[TransactionDocumentId]", typeof(long));
            table.Columns.Add(transactionDocumentId);

            DataColumn currencyCode = new DataColumn("[CurrencyCode]", typeof(string));
            table.Columns.Add(currencyCode);

            DataColumn accountingPeriod = new DataColumn("[AccountingPeriod]", typeof(DateTime));
            table.Columns.Add(accountingPeriod);

            DataColumn documentDate = new DataColumn("DocumentDate]", typeof(DateTime));
            table.Columns.Add(documentDate);

            DataColumn valueDate = new DataColumn("[ValueDate]", typeof(DateTime));
            table.Columns.Add(valueDate);

            DataColumn acknowledgementDate = new DataColumn("[AcknowledgementDate]", typeof(DateTime));
            table.Columns.Add(acknowledgementDate);

            DataColumn provinceId = new DataColumn("[ProvinceId]", typeof(long));
            table.Columns.Add(provinceId);

            DataColumn originalReferenceId = new DataColumn("[OriginalReferenceId]", typeof(long));
            table.Columns.Add(originalReferenceId);

            DataColumn roe = new DataColumn("[Roe]", typeof(decimal));
            table.Columns.Add(roe);

            DataColumn roeType = new DataColumn("[RoeType]", typeof(string));
            table.Columns.Add(roeType);

            DataColumn gLDate = new DataColumn("[GLDate]", typeof(DateTime));
            table.Columns.Add(gLDate);

            DataColumn transactionDocumentCreationDate = new DataColumn("[TransactionDocumentCreationDate]", typeof(DateTime));
            table.Columns.Add(transactionDocumentCreationDate);

            DataColumn transactionDocumentUserCreator = new DataColumn("[TransactionDocumentUserCreator]", typeof(string));
            table.Columns.Add(transactionDocumentUserCreator);

            DataColumn originalValueDate = new DataColumn("[OriginalValueDate]", typeof(DateTime));
            table.Columns.Add(originalValueDate);

            DataColumn accountingDate = new DataColumn("[AccountingDate]", typeof(DateTime));
            table.Columns.Add(accountingDate);

            DataColumn statusId = new DataColumn("[StatusId]", typeof(int));
            table.Columns.Add(statusId);

            DataColumn errorMessage = new DataColumn("[ErrorMessage]", typeof(string));
            table.Columns.Add(errorMessage);

            DataColumn functionalCurrencyCode = new DataColumn("[FunctionalCurrencyCode]", typeof(string));
            table.Columns.Add(functionalCurrencyCode);

            DataColumn statutoryCurrencyCode = new DataColumn("[StatutoryCurrencyCode]", typeof(string));
            table.Columns.Add(statutoryCurrencyCode);

            DataColumn accrualNumber = new DataColumn("[AccrualNumber]", typeof(int));
            table.Columns.Add(accrualNumber);

            foreach (AccountingDocument value in accountingDocuments)
            {
                if (value != null)
                {
                    DataRow row = table.NewRow();

                    row[transactionDocumentId] = value.TransactionDocumentId;
                    row[currencyCode] = value.CurrencyCode;
                    row[accountingPeriod] = value.AccountingPeriod;
                    row[documentDate] = value.DocumentDate.Date;
                    row[valueDate] = value.ValueDate.HasValue ? value.ValueDate.Value : (object)DBNull.Value;
                    row[acknowledgementDate] = value.AcknowledgementDate ?? (object)DBNull.Value;
                    row[provinceId] = value.ProvinceId ?? (object)DBNull.Value;
                    row[originalReferenceId] = value.OriginalReferenceId ?? (object)DBNull.Value;
                    row[roe] = value.Roe ?? (object)DBNull.Value;
                    row[roeType] = value.RoeType;
                    row[gLDate] = value.GLDate ?? (object)DBNull.Value;
                    row[transactionDocumentCreationDate] = DateTime.UtcNow;
                    row[transactionDocumentUserCreator] = value.UserCreator;
                    row[originalValueDate] = value.OriginalValueDate;
                    row[accountingDate] = value.AccountingDate;
                    row[statusId] = value.StatusId ?? (object)DBNull.Value;
                    row[errorMessage] = value.ErrorMessage;
                    row[functionalCurrencyCode] = value.FunctionalCurrencyCode;
                    row[statutoryCurrencyCode] = value.StatutoryCurrencyCode;
                    row[accrualNumber] = value.AccrualNumber ?? (object)DBNull.Value; ;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        /// <summary>
        /// Generates the datatable representing AccountingDocumentLines to be passed as UDTT as parameter to a SP
        /// </summary>
        /// <param name="accountingDocumentLines">Lines to send as UDTT to the SP</param>
        /// <param name="isUpdate">If true, the id of the line is passed so that the called SP can do an update</param>
        /// <returns>The generated data table</returns>
        internal static DataTable ConvertAccountingDocumentLinesIntoDataTable(IEnumerable<AccountingDocumentLine> accountingDocumentLines, bool isUpdate = false)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingLines]");

            DataColumn accountingDocumentLineId = new DataColumn("[AccountingDocumentLineId]", typeof(long));
            table.Columns.Add(accountingDocumentLineId);

            DataColumn journalLineId = new DataColumn("[JournalLineId]", typeof(long));
            table.Columns.Add(journalLineId);

            DataColumn dataVersionId = new DataColumn("[DataVersionId]", typeof(int));
            table.Columns.Add(dataVersionId);

            DataColumn associatedAccountCode = new DataColumn("[AssociatedAccountCode]", typeof(string));
            table.Columns.Add(associatedAccountCode);

            DataColumn paymentTermCode = new DataColumn("[PaymentTermCode]", typeof(string));
            table.Columns.Add(paymentTermCode);

            DataColumn physicalContractCode = new DataColumn("[PhysicalContractCode]", typeof(string));
            table.Columns.Add(physicalContractCode);

            DataColumn contractSectionCode = new DataColumn("[ContractSectionCode]", typeof(string));
            table.Columns.Add(contractSectionCode);

            DataColumn postingLineId = new DataColumn("[PostingLineId]", typeof(long));
            table.Columns.Add(postingLineId);

            DataColumn quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);

            DataColumn vatTurnover = new DataColumn("[VATTurnover]", typeof(decimal));
            table.Columns.Add(vatTurnover);

            DataColumn accountReference = new DataColumn("[AccountReference]", typeof(string));
            table.Columns.Add(accountReference);

            DataColumn commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);

            DataColumn vatCode = new DataColumn("[VATCode]", typeof(string));
            table.Columns.Add(vatCode);

            DataColumn clientReference = new DataColumn("[ClientReference]", typeof(string));
            table.Columns.Add(clientReference);

            DataColumn accountLineType = new DataColumn("[AccountLineTypeId]", typeof(int));
            table.Columns.Add(accountLineType);

            DataColumn charterId = new DataColumn("[CharterId]", typeof(long));
            table.Columns.Add(charterId);

            DataColumn costTypeCode = new DataColumn("[CostTypeCode]", typeof(string));
            table.Columns.Add(costTypeCode);

            DataColumn amount = new DataColumn("[Amount]", typeof(decimal));
            table.Columns.Add(amount);

            DataColumn departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);

            DataColumn narrative = new DataColumn("[Narrative]", typeof(string));
            table.Columns.Add(narrative);

            DataColumn funtionalCurrency = new DataColumn("[FunctionalCurrency]", typeof(decimal));
            table.Columns.Add(funtionalCurrency);

            DataColumn statutoryCurrency = new DataColumn("[StatutoryCurrency]", typeof(decimal));
            table.Columns.Add(statutoryCurrency);

            DataColumn sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            DataColumn accountCategory = new DataColumn("[AccountCategoryId]", typeof(int));
            table.Columns.Add(accountCategory);

            DataColumn secondaryDocumentReference = new DataColumn("[SecondaryDocumentReference]", typeof(string));
            table.Columns.Add(secondaryDocumentReference);

            DataColumn costCenter = new DataColumn("[CostCenter]", typeof(string));
            table.Columns.Add(costCenter);

            DataColumn accrualNumber = new DataColumn("[AccrualNumber]", typeof(int));
            table.Columns.Add(accrualNumber);

            DataColumn accountReferenceId = new DataColumn("[AccountReferenceId]", typeof(long));
            table.Columns.Add(accountReferenceId);

            DataColumn clientAccountId = new DataColumn("[ClientAccountId]", typeof(long));
            table.Columns.Add(clientAccountId);

            DataColumn associatedAccountId = new DataColumn("[AssociatedAccountId]", typeof(long));
            table.Columns.Add(associatedAccountId);

            DataColumn costTypeId = new DataColumn("[CostTypeId]", typeof(long));
            table.Columns.Add(costTypeId);

            DataColumn paymentTermId = new DataColumn("[PaymentTermId]", typeof(long));
            table.Columns.Add(paymentTermId);

            DataColumn vatId = new DataColumn("[VatId]", typeof(long));
            table.Columns.Add(vatId);

            DataColumn clientAccount = new DataColumn("[ClientAccount]", typeof(string));
            table.Columns.Add(clientAccount);

            DataColumn sourceJournalLineId = new DataColumn("[SourceJournalLineId]", typeof(long));
            table.Columns.Add(sourceJournalLineId);

            DataColumn sourceInvoiceId = new DataColumn("[SourceInvoiceId]", typeof(long));
            table.Columns.Add(sourceInvoiceId);

            DataColumn sourceInvoiceLineId = new DataColumn("[SourceInvoiceLineId]", typeof(long));
            table.Columns.Add(sourceInvoiceLineId);

            DataColumn sourceCostLineId = new DataColumn("[SourceCostLineId]", typeof(long));
            table.Columns.Add(sourceCostLineId);

            DataColumn sourceCashLineId = new DataColumn("[SourceCashLineId]", typeof(long));
            table.Columns.Add(sourceCashLineId);

            DataColumn accountingDocumentId = new DataColumn("[AccountingDocumentId]", typeof(long));
            table.Columns.Add(accountingDocumentId);

            DataColumn transactionDocumentId = new DataColumn("[TransactionDocumentId]", typeof(long));
            table.Columns.Add(transactionDocumentId);

            DataColumn groupId = new DataColumn("[GroupId]", typeof(int));
            table.Columns.Add(groupId);

            DataColumn dealNumber = new DataColumn("[DealNumber]", typeof(string));
            table.Columns.Add(dealNumber);

            DataColumn settlementCurrency = new DataColumn("[SettlementCurrency]", typeof(string));
            table.Columns.Add(settlementCurrency);

            DataColumn provinceId = new DataColumn("[ProvinceId]", typeof(int));
            table.Columns.Add(provinceId);

            DataColumn sourceTALineId = new DataColumn("[SourceTALineId]", typeof(long));
            table.Columns.Add(sourceTALineId);

            DataColumn sourceFxDealId = new DataColumn("[SourceFxDealId]", typeof(long));
            table.Columns.Add(sourceFxDealId);

            foreach (AccountingDocumentLine value in accountingDocumentLines)
            {
                if (value != null)
                {
                    DataRow row = table.NewRow();
                    row[associatedAccountCode] = value.AssociatedAccountCode;
                    row[journalLineId] = value.JournalLineId != null ? value.JournalLineId : (object)DBNull.Value;
                    row[paymentTermCode] = value.PaymentTermCode;
                    row[physicalContractCode] = value.PhysicalContractCode;
                    row[contractSectionCode] = value.ContractSectionCode;
                    row[postingLineId] = value.PostingLineId;
                    row[quantity] = value.Quantity != null ? value.Quantity : (object)DBNull.Value;
                    row[vatTurnover] = value.VATTurnover.HasValue ? value.VATTurnover : (object)DBNull.Value;
                    row[accountReference] = value.AccountReference;
                    row[commodityId] = value.CommodityId != null ? value.CommodityId : (object)DBNull.Value;
                    row[vatCode] = value.VATCode;
                    row[clientReference] = value.ClientReference;
                    row[narrative] = value.Narrative;
                    row[accountLineType] = value.AccountLineTypeId;
                    row[charterId] = value.CharterId.HasValue ? value.CharterId : (object)DBNull.Value;
                    row[costTypeCode] = value.CostTypeCode;
                    row[departmentId] = value.DepartmentId != null ? value.DepartmentId : (object)DBNull.Value;
                    row[amount] = value.Amount;
                    row[funtionalCurrency] = value.FunctionalCurrency.HasValue ? value.FunctionalCurrency.Value : (object)DBNull.Value;
                    row[statutoryCurrency] = value.StatutoryCurrency.HasValue ? value.StatutoryCurrency.Value : (object)DBNull.Value;
                    row[sectionId] = value.SectionId.HasValue ? value.SectionId : (object)DBNull.Value;
                    row[sourceFxDealId] = value.SourceFxDealId.HasValue ? value.SourceFxDealId : (object)DBNull.Value;
                    row[accountCategory] = value.AccountingCategoryId;
                    row[secondaryDocumentReference] = value.SecondaryDocumentReference;
                    row[costCenter] = value.CostCenter;
                    row[accrualNumber] = value.AccrualNumber != null ? value.AccrualNumber : (object)DBNull.Value;
                    row[accountReferenceId] = value.AccountReferenceId != null ? value.AccountReferenceId : (object)DBNull.Value;
                    row[clientAccountId] = value.ClientAccountId != null ? value.ClientAccountId : (object)DBNull.Value;
                    row[associatedAccountId] = value.AssociatedAccountId != null ? value.AssociatedAccountId : (object)DBNull.Value;
                    row[costTypeId] = value.CostTypeId != null ? value.CostTypeId : (object)DBNull.Value;
                    row[paymentTermId] = value.PaymentTermId != null ? value.PaymentTermId : (object)DBNull.Value;
                    row[vatId] = value.VatId != null ? value.VatId : (object)DBNull.Value;
                    row[clientAccount] = value.ClientAccount;
                    row[dataVersionId] = DBNull.Value;
                    row[sourceCashLineId] = value.SourceCashLineId ?? (object)DBNull.Value;
                    row[sourceInvoiceId] = value.SourceInvoiceId ?? (object)DBNull.Value;
                    row[sourceInvoiceLineId] = value.SourceInvoiceLineId ?? (object)DBNull.Value;
                    row[sourceCostLineId] = value.SourceCostLineId ?? (object)DBNull.Value;
                    row[sourceJournalLineId] = value.SourceJournalLineId ?? (object)DBNull.Value;
                    row[accountingDocumentId] = DBNull.Value;
                    row[transactionDocumentId] = value.TransactionDocumentId ?? (object)DBNull.Value;
                    row[groupId] = value.GroupId ?? (object)DBNull.Value;
                    row[dealNumber] = value.DealNumber;
                    row[settlementCurrency] = value.SettlementCurrency;
                    row[provinceId] = value.ProvinceId != null ? value.ProvinceId : (object)DBNull.Value;
                    row[sourceTALineId] = value.SourceTALineId ?? (object)DBNull.Value;

                    if (isUpdate)
                    {
                        row[accountingDocumentLineId] = value.AccountingDocumentLineId != null ? value.AccountingDocumentLineId : (object)DBNull.Value;
                    }

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task<long> CreateRevaluation(
            Revaluation revaluation,
            bool authorizedForPosting)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CurrencyCode", revaluation.CurrencyCode);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", revaluation.CompanyId);
            queryParameters.Add("@MatchingStatusId", null);
            queryParameters.Add("@DocumentDate", revaluation.GLDate);
            queryParameters.Add("@AuthorizedForPosting", authorizedForPosting);
            queryParameters.Add("@PhysicalDocumentId", null);
            queryParameters.Add("@Year", null);
            queryParameters.Add("@PaymentDocumentDate", revaluation.PaymentDocumentDate);
            queryParameters.Add("@MatchFlagId", revaluation.MatchFlagId);
            queryParameters.Add("@DocumentReference", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@CurrentDocumentReferenceNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentTypeId", (int)MasterDocumentType.JL);
            queryParameters.Add("@JLTypeId", (int)JLType.Revaluation);
            queryParameters.Add("@CashByPickingTransactionDocumentId", revaluation.TransactionDocumentId);
            queryParameters.Add("@IsPickTransaction", true);
            queryParameters.Add("@GLDate", revaluation.GLDate);
            queryParameters.Add("@DifferentClientMatchflagId", revaluation.DifferentClientMatchFlagId);
            queryParameters.Add("@RevaluationId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateRevalulation, queryParameters, true);
            return queryParameters.Get<long>("TransactionDocumentId");
        }

        private DataTable ToArrayTVP(IEnumerable<AccountingDocumentStatus> accountingDocuments, int? postingStatusId = null)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingDocument]");

            DataColumn accountingId = new DataColumn("[AccountingId]", typeof(long));
            table.Columns.Add(accountingId);

            DataColumn transactionDocumentId = new DataColumn("[TransactionDocumentId]", typeof(long));
            table.Columns.Add(transactionDocumentId);

            DataColumn currencyCode = new DataColumn("[CurrencyCode]", typeof(string));
            table.Columns.Add(currencyCode);

            DataColumn accountingPeriod = new DataColumn("[AccountingPeriod]", typeof(DateTime));
            table.Columns.Add(accountingPeriod);

            DataColumn documentDate = new DataColumn("DocumentDate]", typeof(DateTime));
            table.Columns.Add(documentDate);

            DataColumn valueDate = new DataColumn("[ValueDate]", typeof(DateTime));
            table.Columns.Add(valueDate);

            DataColumn acknowledgementDate = new DataColumn("[AcknowledgementDate]", typeof(DateTime));
            table.Columns.Add(acknowledgementDate);

            DataColumn provinceId = new DataColumn("[ProvinceId]", typeof(long));
            table.Columns.Add(provinceId);

            DataColumn originalReferenceId = new DataColumn("[OriginalReferenceId]", typeof(long));
            table.Columns.Add(originalReferenceId);

            DataColumn roe = new DataColumn("[Roe]", typeof(decimal));
            table.Columns.Add(roe);

            DataColumn roeType = new DataColumn("[RoeType]", typeof(string));
            table.Columns.Add(roeType);

            DataColumn gLDate = new DataColumn("[GLDate]", typeof(DateTime));
            table.Columns.Add(gLDate);

            DataColumn transactionDocumentCreationDate = new DataColumn("[TransactionDocumentCreationDate]", typeof(DateTime));
            table.Columns.Add(transactionDocumentCreationDate);

            DataColumn transactionDocumentUserCreator = new DataColumn("[TransactionDocumentUserCreator]", typeof(string));
            table.Columns.Add(transactionDocumentUserCreator);

            DataColumn originalValueDate = new DataColumn("[OriginalValueDate]", typeof(DateTime));
            table.Columns.Add(originalValueDate);

            DataColumn accountingDate = new DataColumn("[AccountingDate]", typeof(DateTime));
            table.Columns.Add(accountingDate);

            DataColumn statusId = new DataColumn("[StatusId]", typeof(int));
            table.Columns.Add(statusId);

            DataColumn errorMessage = new DataColumn("[ErrorMessage]", typeof(string));
            table.Columns.Add(errorMessage);

            DataColumn functionalCurrencyCode = new DataColumn("[FunctionalCurrencyCode]", typeof(string));
            table.Columns.Add(functionalCurrencyCode);

            DataColumn statutoryCurrencyCode = new DataColumn("[StatutoryCurrencyCode]", typeof(string));
            table.Columns.Add(statutoryCurrencyCode);

            DataColumn accrualNumber = new DataColumn("[AccrualNumber]", typeof(int));
            table.Columns.Add(accrualNumber);

            foreach (AccountingDocumentStatus value in accountingDocuments)
            {
                if (value != null)
                {
                    DataRow row = table.NewRow();
                    row[accountingId] = value.AccountingId;
                    row[statusId] = postingStatusId == null ? (int)value.StatusId : postingStatusId;
                    row[errorMessage] = value.ErrorMessage;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToArrayTVP(IEnumerable<long> accountingDocumentLines)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingId]");

            DataColumn transactionDocumentId = new DataColumn("[AccountingId]", typeof(long));
            table.Columns.Add(transactionDocumentId);

            foreach (long value in accountingDocumentLines)
            {
                DataRow row = table.NewRow();
                row[transactionDocumentId] = value;
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<long> UpdateAccountingDocumentForTraxResponse(long docId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@TransactionDocumentId", docId);
            return await ExecuteScalarAsync<long>(StoredProcedureNames.UpdateAccountingDocumentForTraxResponse, queryParameters, true);
        }

        public async Task UpdateAccountingDocumentInterfaceStatus(string company, long transactionDocumentId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateAccountingDocumentInterfaceStatus, queryParameters, true);
        }

        public async Task CreateAccountingDocumentFxSettlement(long accountingDocumentId, string companyId, string currencyDescription, string fxDealReference)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@AccountingDocumentId", accountingDocumentId);
            queryParameters.Add("@CurrencyCoupleDescription", currencyDescription);
            queryParameters.Add("@FxDealReference", fxDealReference);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateAccountingDocumentFxSettlement, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string CreateAccountingDocument = "[PreAccounting].[usp_CreateAccountingDocument]";
            internal const string CreateAccountingDocumentForReversal = "[PreAccounting].[usp_CreateAccountingDocumentForReversal]";
            internal const string UpdateAccountingDocumentStatus = "[PreAccounting].[usp_UpdateAccountingDocumentStatus]";
            internal const string UpdateAccountingDocument = "[PreAccounting].[usp_UpdateAccountingDocumentByAccountingDocumentId]";
            internal const string UpdateAccountingDocumentStatutoryAndFunctionalCurrencyAmounts = "[PreAccounting].[usp_UpdateAccountingDocument]";
            internal const string CreateRevalulation = "[Invoicing].[usp_CreateRevaluation]";
            internal const string UpdatePrematchForMatchFlag = "[Invoicing].[usp_UpdatePrematchForMatchFlag ]";
            internal const string GetAccountingDocumentByAccountingId = "[PreAccounting].[usp_GetAccountingDocumentByAccountingId]";
            internal const string UpdateAccountingDocumentInterfaceStatus = "[Interface].[usp_UpdateDocumentStatus]";
            internal const string UpdateAccountingDocumentForTraxResponse = "[PreAccounting].[usp_UpdateAccountingDocumentForTraxResponse]";
            internal const string CreateAccountingDocumentFxSettlement = "[PreAccounting].[usp_CreateAccountingDocumentFxSettlement]";
        }
    }
}
