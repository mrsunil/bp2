using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class CompanyConfigurationRepository : BaseRepository, ICompanyConfigurationRepository
    {
        public CompanyConfigurationRepository(IDapperContext dapperContext)
      : base(dapperContext)
        {
        }

        public async Task UpdateCompanySetupAsync(string company, CompanySetup companySetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companySetup.CompanyId);
            queryParameters.Add("@Description", companySetup.CompanyName);
            queryParameters.Add("@DefaultBrokerId", companySetup.DefaultBrokerId);
            queryParameters.Add("@FunctionalCurrencyCode", companySetup.FunctionalCurrencyCode);
            queryParameters.Add("@StatutoryCurrencyCode", companySetup.StatutoryCurrencyCode);
            queryParameters.Add("@DefaultBankAccountId", null);
            queryParameters.Add("@ActiveDate", companySetup.CompanyDate);
            queryParameters.Add("@TimeZoneName", companySetup.TimeZone);
            queryParameters.Add("@CounterpartyId", companySetup.CounterpartyId);
            queryParameters.Add("@IsLocked", null);
            queryParameters.Add("@PriceUnitId", companySetup.PriceUnitId);
            queryParameters.Add("@WeightUnitId", companySetup.WeightUnitId);
            queryParameters.Add("@CountryId", companySetup.CountryId);
            queryParameters.Add("@LdcRegionId", companySetup.LDCRegionId);
            queryParameters.Add("@CompanyTypeId", companySetup.CompanyTypeId);
            queryParameters.Add("@CompanyPlatformId", companySetup.CompanyPlatformId);
            queryParameters.Add("@CropYearId", companySetup.CropYearFormatId);
            queryParameters.Add("@LegalEntity", companySetup.LegalEntity);
            queryParameters.Add("@LegalEntityCode", companySetup.LegalEntityCode);
            queryParameters.Add("@CompanyFriendlyCode", companySetup.CompanyFriendlyCode);
            queryParameters.Add("@DefaultProvinceId", companySetup.DefaultProvinceId);
            queryParameters.Add("@DefaultBranchId", companySetup.DefaultBranchId);
            queryParameters.Add("@IsProvinceEnable", companySetup.IsProvinceEnable);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCompany, queryParameters, true);
        }

        public async Task UpdateInterfaceSetupAsync(string company, IEnumerable<InterfaceSetup> interfaceSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@InterfaceSetup", ToArrayInterfaceSetupTvp(interfaceSetup));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInterfaceSetup, queryParameters, true);
        }

        public async Task UpdateInvoiceSetupAsync(string company, InvoiceSetup invoiceSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@InvoiceSetupId", invoiceSetup.InvoiceSetupId);
            queryParameters.Add("@VATActive", invoiceSetup.VatActive);
            queryParameters.Add("@VATLabel", invoiceSetup.VatLabel);
            queryParameters.Add("@DefaultVATCode", invoiceSetup.DefaultVATCode);
            queryParameters.Add("@TolerancePercentage", invoiceSetup.TolerancePercentage);
            queryParameters.Add("@AuthorizedForPosting", invoiceSetup.AuthorizedForPosting);
            queryParameters.Add("@ModifiedDateTime", DateTime.Now);
            queryParameters.Add("@ModifiedBy", null);
            queryParameters.Add("@PaymentTermId", invoiceSetup.PaymentTermId);
            queryParameters.Add("@ThresholdCostAmount", invoiceSetup.ThresholdCostAmount);
            queryParameters.Add("@DefaultCostVATCode", invoiceSetup.DefaultCostVATCode);
            queryParameters.Add("@TaxTypeId", invoiceSetup.TaxTypeId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateInvoiceSetup, queryParameters, true);
        }

        public async Task UpdateRetentionPolicyAsync(string company, RetentionPolicy retentionPolicy)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@WeekendDay", retentionPolicy.WeekendDay);
            queryParameters.Add("@DailyFreezeRetention", retentionPolicy.DailyFreezeRetention);
            queryParameters.Add("@WeeklyFreezeRetention", retentionPolicy.WeeklyFreezeRetention);
            queryParameters.Add("@MonthlyFreezeRetention", retentionPolicy.MonthlyFreezeRetention);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateRetentionPolicy, queryParameters, true);
        }

        public async Task UpdateAllocationSetUpAsync(string company, IEnumerable<AllocationSetUp> allocationSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@AllocationSetup", ToArrayAllocationTvp(allocationSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateAllocationSetup, queryParameters, true);
        }

        public async Task UpdateTradeFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UnapprovalMandatoryIscopySetup", ToMandatoryFieldArrayTvp(mandatoryTradeApprovalImageSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTradeFieldSetup, queryParameters, true);
        }

        public async Task UpdateTradeImageFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UnapprovalMandatoryIscopySetup", ToImageFieldArrayTvp(mandatoryTradeApprovalImageSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTradeImageSetup, queryParameters, true);
        }

        public async Task UpdateTradeUnapprovedStatusFieldsSetup(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@FieldList", ToUnapprovalFieldArrayTvp(mandatoryTradeApprovalImageSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTradeUnapprovedStatusFieldsSetup, queryParameters, true);
        }

        private DataTable ToMandatoryFieldArrayTvp(IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_MandatoryTradeApprovalImageSetup]");

            var tradeSetupId = new DataColumn("TradeSetupId", typeof(long));
            table.Columns.Add(tradeSetupId);

            var fieldId = new DataColumn("FieldId", typeof(int));
            table.Columns.Add(fieldId);

            var mandatory = new DataColumn("Mandatory", typeof(bool));
            table.Columns.Add(mandatory);

            var isTrigger = new DataColumn("IsTrigger", typeof(bool));
            table.Columns.Add(isTrigger);

            var isCopy = new DataColumn("IsCopy", typeof(bool));
            table.Columns.Add(isCopy);

            if (mandatoryTradeApprovalImageSetup != null)
            {
                foreach (var value in mandatoryTradeApprovalImageSetup)
                {
                    var row = table.NewRow();
                    row[tradeSetupId] = value.TradeSetupId;
                    row[fieldId] = value.FieldId;
                    row[mandatory] = value.Mandatory;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToImageFieldArrayTvp(IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_MandatoryTradeApprovalImageSetup]");

            var tradeSetupId = new DataColumn("TradeSetupId", typeof(long));
            table.Columns.Add(tradeSetupId);

            var fieldId = new DataColumn("FieldId", typeof(int));
            table.Columns.Add(fieldId);

            var mandatory = new DataColumn("Mandatory", typeof(bool));
            table.Columns.Add(mandatory);

            var isTrigger = new DataColumn("IsTrigger", typeof(bool));
            table.Columns.Add(isTrigger);

            var isCopy = new DataColumn("IsCopy", typeof(bool));
            table.Columns.Add(isCopy);

            if (mandatoryTradeApprovalImageSetup != null)
            {
                foreach (var value in mandatoryTradeApprovalImageSetup)
                {
                    var row = table.NewRow();
                    row[tradeSetupId] = value.TradeSetupId;
                    row[fieldId] = value.FieldId;
                    row[isCopy] = value.IsCopy;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToUnapprovalFieldArrayTvp(IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_MandatoryTradeApprovalImageSetup]");

            var tradeSetupId = new DataColumn("TradeSetupId", typeof(long));
            table.Columns.Add(tradeSetupId);

            var fieldId = new DataColumn("FieldId", typeof(int));
            table.Columns.Add(fieldId);

            var mandatory = new DataColumn("Mandatory", typeof(bool));
            table.Columns.Add(mandatory);

            var isTrigger = new DataColumn("IsTrigger", typeof(bool));
            table.Columns.Add(isTrigger);

            var isCopy = new DataColumn("IsCopy", typeof(bool));
            table.Columns.Add(isCopy);

            if (mandatoryTradeApprovalImageSetup != null)
            {
                foreach (var value in mandatoryTradeApprovalImageSetup)
                {
                    var row = table.NewRow();
                    row[tradeSetupId] = value.TradeSetupId;
                    row[fieldId] = value.FieldId;
                    row[isTrigger] = value.UnApproval;
                    table.Rows.Add(row);
                }
            }

            return table;
        }


        public async Task UpdateTradeSetupAsync(string company, TradeSetup tradeSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TradeSetupId", tradeSetup.TradeSetupId);
            queryParameters.Add("@CompanyId", tradeSetup.CompanyId);
            queryParameters.Add("@BusinessSectorNominalTradingOperation", tradeSetup.BusinessSectorNominalTradingOperation);
            queryParameters.Add("@BusinessSectorNominalPostingPurpose", tradeSetup.BusinessSectorNominalPostingPurpose);
            queryParameters.Add("@WeightUnitId", null);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTradeSetup, queryParameters, true);
        }

        public async Task UpdateAccountingSetup(string company, DefaultAccountingSetup defaultAccountingSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DataVersionId", null);
            queryParameters.Add("@LastMonthClosed", null);
            queryParameters.Add("@LastMonthClosedForOperation", null);
            queryParameters.Add("@NumberOfOpenPeriod", null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@OpenPeriodCounter", null);
            queryParameters.Add("@MaximumNumberofOpenFinancialYears", null);
            queryParameters.Add("@LastMonthofFinancialYear", null);
            queryParameters.Add("@LastFinancialYearClosed", null);
            queryParameters.Add("@CashReceivedCostTypeId", defaultAccountingSetup.CashReceivedCostTypeId);
            queryParameters.Add("@CashPaidCostTypeId", defaultAccountingSetup.CashPaidCostTypeId);
            queryParameters.Add("@PurchaseInvoiceCostTypeId", defaultAccountingSetup.PurchaseInvoiceCostTypeId);
            queryParameters.Add("@SalesInvoiceCostTypeId", defaultAccountingSetup.SalesInvoiceCostTypeId);
            queryParameters.Add("@WashoutInvoiceGainsCostTypeId", defaultAccountingSetup.WashoutInvoiceGainsCostTypeId);
            queryParameters.Add("@WashoutInvoiceLossCostTypeId", defaultAccountingSetup.WashoutInvoiceLossCostTypeId);
            queryParameters.Add("@FXRevalCostTypeId", defaultAccountingSetup.FXRevalCostTypeId);
            queryParameters.Add("@DefaultBankAccountId", defaultAccountingSetup.DefaultBankAccountId);
            queryParameters.Add("@SalesLedgerControlClientDebtorsId", defaultAccountingSetup.SalesLedgerControlClientDebtorsId);
            queryParameters.Add("@PurchaseLedgerControlClientCreditorsId", defaultAccountingSetup.PurchaseLedgerControlClientCreditorsId);
            queryParameters.Add("@FXRevalaccountId", defaultAccountingSetup.FXRevalaccountId);
            queryParameters.Add("@SuspenseAccountforWashoutSuspenseId", defaultAccountingSetup.SuspenseAccountforWashoutSuspenseId);
            queryParameters.Add("@RealisedPhysicalsPayableId", defaultAccountingSetup.RealisedPhysicalsPayableId);
            queryParameters.Add("@RealisedPhysicalsReceivableId", defaultAccountingSetup.RealisedPhysicalsReceivableId);
            queryParameters.Add("@VatAccountInputsId", defaultAccountingSetup.VatAccountInputsId);
            queryParameters.Add("@VatAccountOutputsId", defaultAccountingSetup.VatAccountOutputsId);
            queryParameters.Add("@FxAccountGainId", defaultAccountingSetup.FxAccountGainId);
            queryParameters.Add("@FxAccountLossId", defaultAccountingSetup.FxAccountLossId);
            queryParameters.Add("@PLClearanceYepAccountId", defaultAccountingSetup.PLClearanceYepAccountId);
            queryParameters.Add("@BalanceSheetClearanceYepAccountId", defaultAccountingSetup.BalanceSheetClearanceYepAccountId);
            queryParameters.Add("@BSReserveYepAccountId", defaultAccountingSetup.BSReserveYepAccountId);
            queryParameters.Add("@YepCostTypeId", defaultAccountingSetup.YepCostTypeId);
            queryParameters.Add("@DealNominalAccountId ", defaultAccountingSetup.DealNominalAccountId);
            queryParameters.Add("@SettlementNominalAccountId", defaultAccountingSetup.SettlementNominalAccountId);
            queryParameters.Add("@CancellationGainCostTypeId", defaultAccountingSetup.CancellationGainCostTypeId);
            queryParameters.Add("@CancellationLossCostTypeId", defaultAccountingSetup.CancellationLossCostTypeId);
            queryParameters.Add("@YepDepartmentId", defaultAccountingSetup.YepDepartmentId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateAccountingSetup, queryParameters, true);
        }

        public async Task DeleteCompanyAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteCompany, queryParameters, true);
        }

        public async Task UpdateIsFrozenForCompanyAsync(string companyId, int isFrozen)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@IsFrozen", isFrozen);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateIsFrozenForCompany, queryParameters,true);
        }

        public async Task AddUpdateIntercoEmailAsync(string company, IEnumerable<InterCoNoInterCoEmailSetup> interCoNoInterCoEmailSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@InterCoEmail", ToInterCoNoInterCoArrayTvp(interCoNoInterCoEmailSetup));

            await ExecuteNonQueryAsync(StoredProcedureNames.AddUpdateIntercoEmail, queryParameters, true);
        }


        public async Task UpdateAccountingParameterSetUpAsync(string company, IEnumerable<AccountingParameter> accountingParameters)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Settings", ToTransactionDocumentTypeArrayTvp(accountingParameters));
            queryParameters.Add("@CompanyId", company);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateTransactionDocumentTypeCompanySetting, queryParameters, true);
        }

        public async Task UpdateTradeParameterSetUpAsync(string company, IEnumerable<TradeParameter> tradeParameters)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Settings", ToContractTypeArrayTvp(tradeParameters));
            queryParameters.Add("@CompanyId", company);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateContractTypeCompanySetting, queryParameters, true);
        }

        public async Task UpdateMainAccountingFieldSetupAsync(string company, IEnumerable<MainAccountingFieldSetup> mainAccountingFields)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@MainAccountingSetup", ToMainAccountingSetupArrayTvp(mainAccountingFields));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateMainAccountingSetup, queryParameters, true);
        }

        private DataTable ToMainAccountingSetupArrayTvp(IEnumerable<MainAccountingFieldSetup> mainAccountingField)
        {
            var table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_MainAccountingSetup]");

            var mainAccountingSetupId = new DataColumn("MainAccountingSetupId", typeof(long));
            table.Columns.Add(mainAccountingSetupId);

            var tableId = new DataColumn("TableId", typeof(int));
            table.Columns.Add(tableId);

            var fieldId = new DataColumn("FieldId", typeof(int));
            table.Columns.Add(fieldId);

            var isMandatory = new DataColumn("IsMandatory", typeof(bool));
            table.Columns.Add(isMandatory);

            var isEditable = new DataColumn("IsEditable", typeof(bool));
            table.Columns.Add(isEditable);

            if (mainAccountingField != null)
            {
                foreach (var value in mainAccountingField)
                {
                    var row = table.NewRow();
                    row[mainAccountingSetupId] = value.MainAccountingSetupId.HasValue ? value.MainAccountingSetupId : (object)DBNull.Value;
                    row[tableId] = value.TableId;
                    row[fieldId] = value.FieldId;
                    row[isMandatory] = value.IsMandatory.HasValue ? value.IsMandatory : (object)DBNull.Value;
                    row[isEditable] = value.IsEditable.HasValue ? value.IsEditable : (object)DBNull.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToArrayInterfaceSetupTvp(IEnumerable<InterfaceSetup> interfaceSetups)
        {
            var table = new DataTable();
            table.SetTypeName("[Interface].[UDTT_InterFaceSetup]");

            var interfaceSetUpId = new DataColumn("InterfaceSetUpId", typeof(long));
            table.Columns.Add(interfaceSetUpId);

            var isActive = new DataColumn("IsActive", typeof(bool));
            table.Columns.Add(isActive);

            var interfaceTypeId = new DataColumn("InterfaceTypeId", typeof(long));
            table.Columns.Add(interfaceTypeId);

            var legalEntityCode = new DataColumn("LegalEntityCode", typeof(string));
            table.Columns.Add(legalEntityCode);

            var interfaceCode = new DataColumn("InterfaceCode", typeof(string));
            table.Columns.Add(interfaceCode);

            var countryId = new DataColumn("CountryId", typeof(long));
            table.Columns.Add(countryId);

            if (interfaceSetups != null)
            {
                foreach (var value in interfaceSetups)
                {
                    var row = table.NewRow();
                    row[interfaceSetUpId] = value.InterfaceSetUpId.HasValue ? value.InterfaceSetUpId : (object)DBNull.Value;
                    row[isActive] = value.IsActive;
                    row[interfaceTypeId] = value.InterfaceTypeId.HasValue ? value.InterfaceTypeId : (object)DBNull.Value;
                    row[legalEntityCode] = value.LegalEntityCode;
                    row[interfaceCode] = value.InterfaceCode;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToArrayAllocationTvp(IEnumerable<AllocationSetUp> allocationSetUp)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_AllocationSetup]");

            var allocationFieldSetupId = new DataColumn("AllocationFieldSetupId", typeof(long));
            table.Columns.Add(allocationFieldSetupId);

            var tradeSetupId = new DataColumn("TradeSetupId", typeof(long));
            table.Columns.Add(tradeSetupId);

            var fieldId = new DataColumn("FieldId", typeof(int));
            table.Columns.Add(fieldId);

            var differenceBlocking = new DataColumn("DifferenceBlocking", typeof(bool));
            table.Columns.Add(differenceBlocking);

            var differenceWarning = new DataColumn("DifferenceWarning", typeof(string));
            table.Columns.Add(differenceWarning);


            if (allocationSetUp != null)
            {
                foreach (var value in allocationSetUp)
                {
                    var row = table.NewRow();
                    row[allocationFieldSetupId] = value.AllocationFieldSetupId;
                    row[tradeSetupId] = value.TradeSetupId;
                    row[fieldId] = value.FieldId;
                    row[differenceBlocking] = value.DifferenceBlocking;
                    row[differenceWarning] = value.DifferenceWarning;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToInterCoNoInterCoArrayTvp(IEnumerable<InterCoNoInterCoEmailSetup> interCoNoInterCoEmailIds)
        {
            var table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_InterCoEmailSetup]");

            var configId = new DataColumn("ConfigId", typeof(long));
            table.Columns.Add(configId);

            var companyId = new DataColumn("CompanyId", typeof(string));
            table.Columns.Add(companyId);

            var userId = new DataColumn("UserId", typeof(long));
            table.Columns.Add(userId);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            var isInterCo = new DataColumn("IsInterCo", typeof(bool));
            table.Columns.Add(isInterCo);

            if (interCoNoInterCoEmailIds != null)
            {
                foreach (var value in interCoNoInterCoEmailIds)
                {
                    var row = table.NewRow();

                    row[configId] = value.ConfigId.HasValue ? value.ConfigId.Value : (object)DBNull.Value;
                    row[companyId] = value.CompanyId;
                    row[userId] = value.UserId;
                    row[isDeactivated] = value.IsDeactivated;
                    row[isInterCo] = value.IsInterCo;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToContractTypeArrayTvp(IEnumerable<TradeParameter> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Configuration].[UDTT_ContractTypeCompanySetup]");

            var contractTypeCompanySettingId = new DataColumn("ContractTypeCompanySettingId", typeof(long));
            table.Columns.Add(contractTypeCompanySettingId);

            var contractTypeCode = new DataColumn("ContractTypeCode", typeof(short));
            table.Columns.Add(contractTypeCode);

            var nextNumber = new DataColumn("NextNumber", typeof(int));
            table.Columns.Add(nextNumber);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();

                    row[contractTypeCompanySettingId] = value.ContractTypeCompanySetupId.HasValue ? value.ContractTypeCompanySetupId.Value : (object)DBNull.Value;
                    row[contractTypeCode] = value.ContractTypeCode;
                    row[nextNumber] = value.NextNumber;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToTransactionDocumentTypeArrayTvp(IEnumerable<AccountingParameter> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Configuration].[UDTT_TransactionDocumentTypeCompanySetup]");

            var transactionDocumentTypeCompanySettingId = new DataColumn("TransactionDocumentTypeCompanySettingId", typeof(long));
            table.Columns.Add(transactionDocumentTypeCompanySettingId);

            var transactionDocumentTypeId = new DataColumn("TransactionDocumentTypeId", typeof(short));
            table.Columns.Add(transactionDocumentTypeId);

            var year = new DataColumn("Year", typeof(int));
            table.Columns.Add(year);

            var nextNumber = new DataColumn("NextNumber", typeof(int));
            table.Columns.Add(nextNumber);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();

                    row[transactionDocumentTypeCompanySettingId] = value.TransactionDocumentTypeCompanySetupId.HasValue ? value.TransactionDocumentTypeCompanySetupId.Value : (object)DBNull.Value;
                    row[transactionDocumentTypeId] = value.TransactionDocumentTypeId;
                    row[nextNumber] = value.NextNumber;
                    row[year] = value.Year;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateCompany = "[MasterData].[usp_UpdateCompany]";
            internal const string UpdateInterfaceSetup = "[Interface].[usp_UpdateInterfaceSetup]";
            internal const string UpdateInvoiceSetup = "[Invoicing].[usp_UpdateInvoiceSetup]";
            internal const string UpdateTradeSetup = "[Trading].[usp_UpdateTradeSetup]";
            internal const string AddUpdateIntercoEmail = "[Trading].[usp_AddUpdateIntercoEmail]";
            internal const string UpdateAllocationSetup = "[Logistic].[usp_UpdateAllocationSetup]";
            internal const string DeleteCompany = "[MasterData].[usp_DeleteCompany]";
            internal const string UpdateIsFrozenForCompany = "[MasterData].[usp_UpdateIsFrozenForCompany]";
            internal const string UpdateTradeFieldSetup = "[Trading].[usp_UpdateTradeFieldSetup]";
            internal const string UpdateTradeImageSetup = "[Trading].[usp_UpdateTradeImageSetup]";
            internal const string UpdateTradeUnapprovedStatusFieldsSetup = "[Trading].[usp_UpdateTradeUnapprovedStatusFieldsSetup]";
            internal const string UpdateMainAccountingSetup = "[PreAccounting].[usp_UpdateMainAccountingSetup]";
            internal const string UpdateTransactionDocumentTypeCompanySetting = "[Configuration].[usp_UpdateTransactionDocumentTypeCompanySetup]";
            internal const string UpdateContractTypeCompanySetting = "[Configuration].[usp_UpdateContractTypeCompanySetup]";
            internal const string UpdateAccountingSetup = "[PreAccounting].[usp_UpdateAccountingSetup]";
            internal const string UpdateRetentionPolicy = "[Freeze].[usp_UpdateRetentionPolicy]";
        }
    }
}
