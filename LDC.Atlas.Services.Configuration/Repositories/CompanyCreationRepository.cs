using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class CompanyCreationRepository : BaseRepository, ICompanyCreationRepository
    {
        public CompanyCreationRepository(IDapperContext dapperContext)
     : base(dapperContext)
        {
        }

        public async Task<int> CreateCompanySetup(string companyId, CompanySetup companySetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@CompanyFriendlyCode", companySetup.CompanyFriendlyCode);
            queryParameters.Add("@Description", companySetup.CompanyName);
            /*master data for CounterpartyCompany table while new company creation yet to finish.
            Hardcoding null for now.Has to be mapped to the coorect parameter later.*/
            queryParameters.Add("@DefaultBrokerId", null);
            queryParameters.Add("@FunctionalCurrencyCode", companySetup.FunctionalCurrencyCode);
            queryParameters.Add("@StatutoryCurrencyCode", companySetup.StatutoryCurrencyCode);
            queryParameters.Add("@DefaultBankAccountId", null);
            queryParameters.Add("@ActiveDate", companySetup.CompanyDate);
            queryParameters.Add("@TimeZoneName", companySetup.TimeZone);
            queryParameters.Add("@CounterpartyId", null);   // will pass exact value when masterdata is inserted
            queryParameters.Add("@PriceUnitId", companySetup.PriceUnitId);
            queryParameters.Add("@WeightUnitId", companySetup.WeightUnitId);
            queryParameters.Add("@CountryId", companySetup.CountryId);
            queryParameters.Add("@LdcRegionId", companySetup.LDCRegionId);
            queryParameters.Add("@CompanyTypeId", companySetup.CompanyTypeId);
            queryParameters.Add("@CompanyPlatformId", companySetup.CompanyPlatformId);
            queryParameters.Add("@LegalEntity", companySetup.LegalEntity);
            queryParameters.Add("@LegalEntityCode", companySetup.LegalEntityCode);
            queryParameters.Add("@DefaultProvinceId", companySetup.DefaultProvinceId);
            queryParameters.Add("@DefaultBranchId", companySetup.DefaultBranchId);
            queryParameters.Add("@IsProvinceEnable", companySetup.IsProvinceEnable);
            queryParameters.Add("@Id", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateCompanySetup, queryParameters, true);
            var newCompanyId = queryParameters.Get<int>("@Id");
            return newCompanyId;
        }

        public async Task AddUpdateIntercoEmailAsync(string company, IEnumerable<InterCoNoInterCoEmailSetup> interCoNoInterCoEmailSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@InterCoEmail", ToInterCoNoInterCoArrayTvp(company, interCoNoInterCoEmailSetup));

            await ExecuteNonQueryAsync(StoredProcedureNames.AddUpdateIntercoEmail, queryParameters, true);
        }

        public async Task CreateMainAccountingFieldSetupAsync(string company, IEnumerable<MainAccountingFieldSetup> mainAccountingFields)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@MainAccountingSetup", ToMainAccountingSetupArrayTvp(mainAccountingFields));

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateMainAccountingSetup, queryParameters, true);
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
                    row[tableId] = value.TableId;
                    row[fieldId] = value.FieldId;
                    row[isMandatory] = value.IsMandatory.HasValue ? value.IsMandatory : (object)DBNull.Value;
                    row[isEditable] = value.IsEditable.HasValue ? value.IsEditable : (object)DBNull.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task CreateInvoiceSetup(string companyId, InvoiceSetup invoiceSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@VATActive", invoiceSetup.VatActive);
            queryParameters.Add("@VATLabel", invoiceSetup.VatLabel);
            queryParameters.Add("@DefaultVATCode", invoiceSetup.DefaultVATCode);
            queryParameters.Add("@TolerancePercentage", invoiceSetup.TolerancePercentage);
            queryParameters.Add("@AuthorizedForPosting", invoiceSetup.AuthorizedForPosting);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@PaymentTermId", invoiceSetup.PaymentTermId);
            queryParameters.Add("@ThresholdCostAmount", invoiceSetup.ThresholdCostAmount);
            queryParameters.Add("@DefaultCostVATCode", invoiceSetup.DefaultCostVATCode);
            queryParameters.Add("@TaxTypeId", invoiceSetup.TaxTypeId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateInvoiceSetup, queryParameters, true);
        }

        public async Task CreateRetentionPolicyAsync(string company, RetentionPolicy retentionPolicy)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@WeekendDay", retentionPolicy.WeekendDay);
            queryParameters.Add("@DailyFreezeRetention", retentionPolicy.DailyFreezeRetention);
            queryParameters.Add("@WeeklyFreezeRetention", retentionPolicy.WeeklyFreezeRetention);
            queryParameters.Add("@MonthlyFreezeRetention", retentionPolicy.MonthlyFreezeRetention);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateRetentionPolicy, queryParameters, true);
        }

        public async Task CreateInterfaceSetup(string companyId, IEnumerable<InterfaceSetup> interfaceSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@InterfaceSetup", ToArrayInterfaceSetupTvp(interfaceSetup));

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateInterfaceSetup, queryParameters, true);
        }

        private DataTable ToArrayInterfaceSetupTvp(IEnumerable<InterfaceSetup> interfaceSetups)
        {
            var table = new DataTable();
            table.SetTypeName("[Interface].[UDTT_InterfaceSetup]");

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

                    row[interfaceSetUpId] = DBNull.Value;
                    row[isActive] = value.IsActive;
                    row[interfaceTypeId] = value.InterfaceTypeId;
                    row[legalEntityCode] = value.LegalEntityCode;
                    row[interfaceCode] = value.InterfaceCode;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task CreateUserProfile(int companyId, CompanyCreation companyCreation)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserProfile", ConvertToUDTT(companyCreation));
            queryParameters.Add("@CompanyToCopy", companyCreation.CompanyToCopy);
            queryParameters.Add("@CompanyId", companyId);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUserCompanyProfile, queryParameters, true);
        }

        public async Task CreateMasterDataforNewCompany(string companyToCopy, bool isCounterpartyRequired, int newCompanyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyToCopy);
            queryParameters.Add("@IsCounterpartyData", isCounterpartyRequired);
            queryParameters.Add("@newCompanyId", newCompanyId);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateMasterDataforNewCompany, queryParameters, true);
        }

        public async Task CreateGridConfiguration(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@targetCompany", companyId);
            queryParameters.Add("@createMissingRecords", true);
            queryParameters.Add("@updateExistingRecords", true);
            queryParameters.Add("@deleteExtraRecords", true);
            queryParameters.Add("@ShowExtraRecordsToBeDeleted", false);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUpdateGridConfiguration, queryParameters);
        }

        private static DataTable ConvertToUDTT(CompanyCreation companyCreation)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_bigIntCoupleList]");

            DataColumn userId = new DataColumn("Value1", typeof(long));
            table.Columns.Add(userId);

            DataColumn profileId = new DataColumn("Value2", typeof(long));
            table.Columns.Add(profileId);

            foreach (var item in companyCreation.CompanyUserProfile)
            {
                var row = table.NewRow();

                row[userId] = item.UserId;
                row[profileId] = item.ProfileId;
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<int> CreateTradeSetUp(string companyId, TradeSetup tradeSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@BusinessSectorNominalTradingOperation", tradeSetup.BusinessSectorNominalTradingOperation);
            queryParameters.Add("@BusinessSectorNominalPostingPurpose", tradeSetup.BusinessSectorNominalPostingPurpose);
            queryParameters.Add("@WeightUnitId", tradeSetup.WeightUnitId);
            queryParameters.Add("@TradeSetupId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateTradeSetUp, queryParameters, true);
            var tradeSetUpId = queryParameters.Get<int>("@TradeSetupId");
            return tradeSetUpId;
        }

        public async Task CreateAccountingSetup(string company, DefaultAccountingSetup defaultAccountingSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CashReceivedCostTypeId", defaultAccountingSetup.CashReceivedCostTypeId);
            queryParameters.Add("@CashPaidCostTypeId", defaultAccountingSetup.CashPaidCostTypeId);
            queryParameters.Add("@PurchaseInvoiceCostTypeId", defaultAccountingSetup.PurchaseInvoiceCostTypeId);
            queryParameters.Add("@SalesInvoiceCostTypeId", defaultAccountingSetup.SalesInvoiceCostTypeId);
            queryParameters.Add("@WashoutInvoiceGainsCostTypeId", defaultAccountingSetup.WashoutInvoiceGainsCostTypeId);
            queryParameters.Add("@WashoutInvoiceLossCostTypeId", defaultAccountingSetup.WashoutInvoiceLossCostTypeId);
            queryParameters.Add("@FXRevalCostTypeId", defaultAccountingSetup.FXRevalCostTypeId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DefaultBankAccountId", defaultAccountingSetup.DefaultBankAccountId);
            queryParameters.Add("@SalesLedgerControlClientDebtorsId", defaultAccountingSetup.SalesLedgerControlClientDebtorsId);
            queryParameters.Add("@PurchaseLedgerControlClientCreditorsId", defaultAccountingSetup.PurchaseLedgerControlClientCreditorsId);
            queryParameters.Add("@FXRevalaccountId", defaultAccountingSetup.FXRevalaccountId);
            queryParameters.Add("@SuspenseAccountforWashoutSuspenseId", defaultAccountingSetup.SuspenseAccountforWashoutSuspenseId);
            queryParameters.Add("@RealisedPhysicalsPayableId", defaultAccountingSetup.RealisedPhysicalsPayableId);
            queryParameters.Add("@RealisedPhysicalsReceivableId", defaultAccountingSetup.RealisedPhysicalsReceivableId);
            queryParameters.Add("@MaximumNumberofOpenFinancialYears", null);
            queryParameters.Add("@LastMonthofFinancialYear", null);
            queryParameters.Add("@LastFinancialYearClosed", null);
            queryParameters.Add("@MTMOpenFXPLLossesId", null);
            queryParameters.Add("@MTMOpenFXPLGainsId", null);
            queryParameters.Add("@MTMOpenFXBSLossesId", null);
            queryParameters.Add("@MTMOpenFXBSGainsId", null);
            queryParameters.Add("@MTMFxCostTypeId", null);
            queryParameters.Add("@PLClearanceYepAccountId", defaultAccountingSetup.PLClearanceYepAccountId);
            queryParameters.Add("@BalanceSheetClearanceYepAccountId", defaultAccountingSetup.BalanceSheetClearanceYepAccountId);
            queryParameters.Add("@BSReserveYepAccountId", defaultAccountingSetup.BSReserveYepAccountId);
            queryParameters.Add("@YepCostTypeId", defaultAccountingSetup.YepCostTypeId);
            queryParameters.Add("@VatAccountInputsId", defaultAccountingSetup.VatAccountInputsId);
            queryParameters.Add("@VatAccountOutputsId", defaultAccountingSetup.VatAccountOutputsId);
            queryParameters.Add("@FxAccountGainId", defaultAccountingSetup.FxAccountGainId);
            queryParameters.Add("@FxAccountLossId", defaultAccountingSetup.FxAccountLossId);
            queryParameters.Add("@DealNominalAccountId", defaultAccountingSetup.DealNominalAccountId);
            queryParameters.Add("@SettlementNominalAccountId", defaultAccountingSetup.SettlementNominalAccountId);
            queryParameters.Add("@OpenPeriodCounter", 0);
            queryParameters.Add("@YepDepartmentId", defaultAccountingSetup.YepDepartmentId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateAccountingSetup, queryParameters, true);
        }


        public async Task CreateTransactionData(string companyToCopy, int newCompanyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyToCopy);
            queryParameters.Add("@NewCompanyId", newCompanyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateTransactionData, queryParameters, true);
        }

        public async Task CreateAllocationSetUpAsync(string company, IEnumerable<AllocationSetUp> allocationSetup, int tradeSetupId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@AllocationSetup", ToArrayAllocationTvp(allocationSetup, tradeSetupId));
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateAllocationSetUp, queryParameters, true);
        }

        public async Task CreateTradeFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UnapprovalMandatoryIscopySetup", ToMandatoryFieldArrayTvp(mandatoryTradeApprovalImageSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateTradeFieldSetup, queryParameters, true);
        }

        public async Task CreateTradeImageFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UnapprovalMandatoryIscopySetup", ToImageFieldArrayTvp(mandatoryTradeApprovalImageSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateTradeImageSetup, queryParameters, true);
        }

        public async Task CreateTradeUnapprovedStatusFieldsSetup(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@UnapprovalMandatoryIscopySetup", ToUnapprovalFieldArrayTvp(mandatoryTradeApprovalImageSetup));
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateTradeUnapprovedStatusFieldsSetup, queryParameters, true);
        }

        public async Task CreateAccountingParameterSetUpAsync(string companyId, IEnumerable<AccountingParameter> accountingParameters)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Settings", ToTransactionDocumentTypeArrayTvp(accountingParameters));
            queryParameters.Add("@CompanyId", companyId);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateTransactionDocumentTypeCompanySetting, queryParameters, true);
        }

        public async Task CreateTradeParameterSetUpAsync(string companyId, IEnumerable<TradeParameter> tradeParameters, int tradeSetUpId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Settings", ToContractTypeArrayTvp(tradeParameters));
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateContractTypeCompanySetting, queryParameters, true);
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
                    row[fieldId] = value.FieldId;
                    row[isTrigger] = value.UnApproval;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToArrayAllocationTvp(IEnumerable<AllocationSetUp> value, int tradeSetUpId)
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

            if (value != null)
            {
                foreach (var item in value)
                {
                    var row = table.NewRow();
                    row[allocationFieldSetupId] = DBNull.Value;
                    row[tradeSetupId] = tradeSetUpId;
                    row[fieldId] = item.FieldId;
                    row[differenceBlocking] = item.DifferenceBlocking;
                    row[differenceWarning] = item.DifferenceWarning;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable ToInterCoNoInterCoArrayTvp(string company, IEnumerable<InterCoNoInterCoEmailSetup> interCoNoInterCoEmailIds)
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
                    row[companyId] = company;
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
            DataTable table = new DataTable();
            table.SetTypeName("[Configuration].[UDTT_ContractTypeCompanySetup]");

            DataColumn  contractTypeCompanySettingId = new DataColumn("ContractTypeCompanySettingId", typeof(long));
            table.Columns.Add(contractTypeCompanySettingId);

            DataColumn  contractTypeCode = new DataColumn("ContractTypeCode", typeof(short));
            table.Columns.Add(contractTypeCode);

            DataColumn  nextNumber = new DataColumn("NextNumber", typeof(int));
            table.Columns.Add(nextNumber);

            if (values != null)
            {
                foreach (var value in values)
                {
                    DataRow row = table.NewRow();

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
            DataTable table = new DataTable();
            table.SetTypeName("[Configuration].[UDTT_TransactionDocumentTypeCompanySetup]");

            DataColumn  transactionDocumentTypeCompanySettingId = new DataColumn("TransactionDocumentTypeCompanySettingId", typeof(long));
            table.Columns.Add(transactionDocumentTypeCompanySettingId);

            DataColumn  transactionDocumentTypeId = new DataColumn("TransactionDocumentTypeId", typeof(short));
            table.Columns.Add(transactionDocumentTypeId);

            DataColumn  year = new DataColumn("Year", typeof(int));
            table.Columns.Add(year);

            DataColumn  nextNumber = new DataColumn("NextNumber", typeof(int));
            table.Columns.Add(nextNumber);

            if (values != null)
            {
                foreach (var value in values)
                {
                    DataRow row = table.NewRow();

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
            internal const string CreateCompanySetup = "[MasterData].[usp_CreateCompany]";
            internal const string CreateInterfaceSetup = "[Interface].[usp_CreateInterfaceSetup]";
            internal const string CreateInvoiceSetup = "[Invoicing].[usp_CreateInvoiceSetup]";
            internal const string AddUpdateIntercoEmail = "[Trading].[usp_AddUpdateIntercoEmail]";
            internal const string CreateUserCompanyProfile = "[Authorization].[usp_CreateUserCompanyProfile]";
            internal const string CreateMasterDataforNewCompany = "[MasterData].[usp_CreateMasterDataforNewCompany]";
            internal const string CreateTradeSetUp = "[Trading].[usp_CreateTradeSetup]";
            internal const string CreateAllocationSetUp = "[Logistic].[usp_CreateAllocationSetup]";
            internal const string CreateMandatoryFieldSetup = "[Trading].[usp_CreateMandatoryTradeApprovalImageSetup]";
            internal const string CreateUpdateGridConfiguration = "[Deployment].[usp_UpdateConfigurationGrid]";
            internal const string CreateTransactionData = "[MasterData].[usp_CreateTransactionData]";
            internal const string CreateTradeFieldSetup = "[Trading].[usp_CreateTradeFieldSetup]";
            internal const string CreateTradeImageSetup = "[Trading].[usp_CreateTradeImageSetup]";
            internal const string CreateTradeUnapprovedStatusFieldsSetup = "[Trading].[usp_CreateTradeUnapprovedStatusFieldsSetup]";
            internal const string CreateMainAccountingSetup = "[PreAccounting].[usp_CreateMainAccountingSetup]";
            internal const string CreateAccountingSetup = "[PreAccounting].[usp_CreateAccountingSetup]";
            internal const string CreateRetentionPolicy = "[Freeze].[usp_CreateRetentionPolicy]";
            internal const string CreateTransactionDocumentTypeCompanySetting = "[Configuration].[usp_CreateTransactionDocumentTypeCompanySetup]";
            internal const string CreateContractTypeCompanySetting = "[Configuration].[usp_CreateContractTypeCompanySetup]";
        }
    }
}
