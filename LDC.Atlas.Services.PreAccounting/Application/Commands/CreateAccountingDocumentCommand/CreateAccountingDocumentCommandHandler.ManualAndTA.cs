using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class CreateAccountingDocumentCommandHandler
    {
        private async Task<AccountingDocument> GetInformationForManualJournal(bool postOpClosedPolicy, long docId, int docTypeId, AccountingSetupDto accountingSetup, Company company, DateTime companyDate)
        {
            AccountingDocument accountingDocument = null;

            ManualJournalDocumentDto manualJournal = null;

            manualJournal = await _accountingQueries.GetManualJournalbyTransactionDocumentId(docId, company.CompanyId);

            var fxRates = CommonRules.GetFxRateInformation(manualJournal.DocumentDate, manualJournal.CurrencyCode, company);

            if (manualJournal != null && fxRates.AreAllFilled())
            {
                accountingDocument = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPolicy, docId, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, null, null, null, manualJournal);

                if (accountingDocument != null)
                {
                    accountingDocument.AccountingDocumentLines = await CreateAccountingDocumentLines(docTypeId, company, accountingSetup, fxRates, null, null, null, null, manualJournal);

                    accountingDocument.StatusId = await CommonRules.GetAccountingDocumentStatus(accountingSetup, _accountingQueries, accountingDocument, company.CompanyId, companyDate, null, null);
                }
            }

            return accountingDocument;
        }

        private async Task<AccountingDocument> GetInformationForMonthEndTA(
            bool postOpClosedPrivilege,
            long docId,
            int docTypeId,
            AccountingSetupDto accountingSetup,
            Company company,
            DateTime companyDate,
            MonthEndTADocumentDto monthEndTADocument)
        {
            AccountingDocument accountingDocument = null;

            DateTime documentDate = new DateTime(monthEndTADocument.ValueDate.Value.Year, monthEndTADocument.ValueDate.Value.Month, 1).AddDays(-1);

            var fxRates = CommonRules.GetFxRateInformation(documentDate, monthEndTADocument.CurrencyCode, company);

            if (monthEndTADocument != null && fxRates.AreAllFilled())
            {
                accountingDocument = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPrivilege, docId, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, null, null, null, null, null, monthEndTADocument);

                if (accountingDocument != null)
                {
                    accountingDocument.AccountingDocumentLines = await CreateAccountingDocumentLines(docTypeId, company, accountingSetup, fxRates, null, null, null, null, null, null, monthEndTADocument);

                    accountingDocument.StatusId = await CommonRules.GetAccountingDocumentStatus(accountingSetup, _accountingQueries, accountingDocument, company.CompanyId, companyDate, null, null);
                }
            }

            return accountingDocument;
        }

        private async Task<(AccountingDocument, MonthEndTADocumentDto)> CreateAccountingForTAandJL(bool postOpClosedPrivilege, TransactionDocumentDto transactionDocument, long docId, int docTypeId, AccountingSetupDto accountingSetup, Company company, DateTime companyDate)
        {
            var monthEnd = await _accountingQueries.GetMonthEndTAbyTransactionDocumentId(company.CompanyId, docId);
            AccountingDocument accountingDocument = null;
            if (monthEnd == null)
            {
                accountingDocument = await GetInformationForManualJournal(postOpClosedPrivilege, docId, docTypeId, accountingSetup, company, companyDate);
                accountingDocument.StatusId = transactionDocument.AuthorizedForPosting ? accountingDocument.StatusId : PostingStatus.Incomplete;
                accountingDocument.ErrorMessage = transactionDocument.AuthorizedForPosting ? accountingDocument.ErrorMessage : string.Empty;
            }
            else
            {
                accountingDocument = await GetInformationForMonthEndTA(postOpClosedPrivilege, docId, docTypeId, accountingSetup, company, companyDate, monthEnd);
            }

            return (accountingDocument, monthEnd);
        }

        private async Task<IEnumerable<AccountingDocument>> CreateAccountingDocumentPerAccuralNumberTA(AccountingDocument accountingDocumentTA, MonthEndTADocumentDto monthEnd, string company, long docId)
        {
            List<AccountingDocument> accountingDocuments = new List<AccountingDocument>();

            IEnumerable<int> uniqueAccruals = accountingDocumentTA.AccountingDocumentLines.Where(t => t.AccrualNumber != null).Select(x => x.AccrualNumber).Distinct().Cast<int>();

            foreach (int uniqueAccrual in uniqueAccruals)
            {
                AccountingDocument adJL = accountingDocumentTA.ShallowCopy();
                adJL.AccrualNumber = uniqueAccrual;
                if (monthEnd != null)
                {
                    adJL.GLDate = monthEnd.MonthEndTALines.Where(x => x.AccrualNumber == uniqueAccrual).FirstOrDefault().BLDate;
                }

                adJL.AccountingDocumentLines = adJL.AccountingDocumentLines.Where(x => x.AccrualNumber == uniqueAccrual);

                accountingDocuments.Add(adJL);
            }

            return accountingDocuments;
        }

        private async Task<AccountingDocumentLine> CreateAccountingDocumentLineForManualJournal(int docTypeId, Company company, ManualJournalDocumentDto manualJournal, FxRateInformation fxRates, ManualJournalLineDto manualJournalLine, int postingLineId, AccountingSetupDto accountingSetup)
        {
            AccountingDocumentLine accountingDocumentLine = new AccountingDocumentLine();

            accountingDocumentLine.JournalLineId = manualJournalLine.JournalLineId;
            accountingDocumentLine.SourceJournalLineId = manualJournalLine.JournalLineId;
            accountingDocumentLine.PostingLineId = postingLineId;
            accountingDocumentLine.CostTypeCode = manualJournalLine.CostTypeCode;
            accountingDocumentLine.Amount = manualJournalLine.Amount;
            accountingDocumentLine.DepartmentId = manualJournalLine.DepartmentId;
            accountingDocumentLine.AssociatedAccountCode = manualJournalLine.AssociatedAccountCode;
            accountingDocumentLine.PaymentTermCode = null;
            accountingDocumentLine.ContractSectionCode = manualJournalLine.ContractSectionCode;
            accountingDocumentLine.CommodityId = manualJournalLine.CommodityId;
            accountingDocumentLine.Quantity = manualJournalLine.Quantity;
            accountingDocumentLine.VATTurnover = null;
            accountingDocumentLine.SectionId = manualJournalLine.SectionId;
            accountingDocumentLine.AccountLineTypeId = manualJournalLine.AccountLineTypeId;
            if (manualJournal.TATypeId == (int)TAType.ManualMarkToMarket)
            {
                accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
            }
            else
            {
                accountingDocumentLine.AccountingCategoryId = (manualJournalLine.AccountLineTypeId == (int)AccountLineType.C || (manualJournalLine.AccountLineTypeId == (int)AccountLineType.V)) ? (int)AccountingCategory.C : (int)AccountingCategory.N;
            }
            accountingDocumentLine.CompanyId = manualJournalLine.CompanyId;
            accountingDocumentLine.CharterId = manualJournalLine.CharterId;
            accountingDocumentLine.SecondaryDocumentReference = manualJournalLine.SecondaryDocumentReference;
            accountingDocumentLine.CostCenter = (manualJournal.TATypeId == (int)TAType.ManualMarkToMarket) ? null : manualJournalLine.CostCenter;
            accountingDocumentLine.AccrualNumber = manualJournalLine.AccrualNumber;
            accountingDocumentLine.VATCode = null;
            accountingDocumentLine.ClientAccount = (manualJournal.TATypeId == (int)TAType.ManualMarkToMarket) ? null : manualJournalLine.ClientAccountCode;
            accountingDocumentLine.Amount = Math.Round(manualJournalLine.Amount, CommonRules.RoundDecimals);

            if (manualJournal.JLTypeId == (int)JLType.ManualRegularJournal || manualJournal.TATypeId == (int)TAType.ManualTemporaryAdjustment || manualJournal.TATypeId == (int)TAType.ManualMarkToMarket)
            {
                accountingDocumentLine.AccountReference = manualJournalLine.AccountReference;
            }
            else
            {
                accountingDocumentLine.AccountReference = manualJournalLine.AccountLineTypeId == (int)AccountLineType.V ? accountingSetup.PurchaseLedgerControlClientCreditors : accountingSetup.SalesLedgerControlClientDebtors;
            }

            decimal? amountInUSD = accountingDocumentLine.Amount;

            if (manualJournal.CurrencyCode != null && manualJournal.CurrencyCode.ToUpperInvariant() != "USD")
            {
                amountInUSD = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, accountingDocumentLine.Amount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
            }

            await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLine, amountInUSD, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);

            if (docTypeId == (int)DocumentType.MJL)
            {
                accountingDocumentLine.Narrative = manualJournalLine.Narrative;
                accountingDocumentLine.ClientReference = manualJournalLine.ExternalDocumentReference;
            }

            if (docTypeId == (int)DocumentType.MTA)
            {
                if (manualJournal.TATypeId == (int)TAType.ManualMarkToMarket)
                {
                    accountingDocumentLine.Narrative = manualJournalLine.Narrative;
                }
                else
                {
                    manualJournalLine.Narrative = manualJournalLine.Narrative == null ? string.Empty : manualJournalLine.Narrative;
                    accountingDocumentLine.Narrative = manualJournalLine.Narrative.Trim().Length > 0 ? manualJournalLine.Narrative : "Manual Accrual of " + manualJournal.AccountingPeriod.ToString("MMM-yyyy", CultureInfo.InvariantCulture);
                }
                accountingDocumentLine.ClientReference = null;
            }

            return accountingDocumentLine;
        }

        private async Task<AccountingDocumentLine> CreateAccountingDocumentLineForMonthEndTA(int docTypeId, Company company, MonthEndTADocumentDto monthEndDocument, FxRateInformation fxRates, MonthEndTALineDto monthEndLine, int postingLineId)
        {
            AccountingDocumentLine accountingDocumentLine = new AccountingDocumentLine();

            accountingDocumentLine.PostingLineId = postingLineId;
            accountingDocumentLine.ClientReference = null;
            accountingDocumentLine.PaymentTermCode = null;
            accountingDocumentLine.SecondaryDocumentReference = null;
            accountingDocumentLine.SourceTALineId = monthEndLine.TemporaryAdjustmentLineId;

            // Binding the cost type associated with business sector if business sector posting is configured
            if (monthEndDocument.BusinessSectorNominalPostingPurpose == true && monthEndLine.SectionId != null && monthEndLine.BusinessSectorCostTypeCode != null)
            {
                accountingDocumentLine.CostTypeCode = monthEndLine.BusinessSectorCostTypeCode;
            }
            else
            {
                accountingDocumentLine.CostTypeCode = monthEndLine.CostTypeCode;
            }

            accountingDocumentLine.DepartmentId = monthEndLine.DepartmentId;
            accountingDocumentLine.AssociatedAccountCode = monthEndLine.AssociatedAccountCode;
            accountingDocumentLine.Quantity = monthEndLine.Quantity != null ? (decimal)monthEndLine.Quantity : monthEndLine.Quantity;
            accountingDocumentLine.CommodityId = monthEndLine.CommodityId;
            accountingDocumentLine.VATTurnover = null;
            accountingDocumentLine.VATCode = null;
            accountingDocumentLine.CharterId = monthEndLine.CharterId;
            accountingDocumentLine.CostCenter = null;
            if (monthEndLine.ReportTypeId == ReportType.Realized)
            {
                 accountingDocumentLine.Narrative = "Accruals of " + monthEndDocument.AccountingPeriod.Value.ToString("MMM-yyyy", CultureInfo.InvariantCulture);
            }
            else if (monthEndDocument.TATypeId == (int)TAType.FxDealMonthTemporaryAdjustment)
            {
                accountingDocumentLine.Narrative = "Accruals of " + monthEndDocument.AccountingPeriod.Value.ToString("MMM-yyyy", CultureInfo.InvariantCulture) + " " + monthEndLine.CurrencyCouple + " " + monthEndLine.Reference;
            }
            else
            {
                accountingDocumentLine.Narrative = "AccrualsRev of " + monthEndDocument.AccountingPeriod.Value.ToString("MMM-yyyy", CultureInfo.InvariantCulture) + " " + monthEndLine.InvoiceDocumentReference;
            }

            accountingDocumentLine.SectionId = monthEndLine.SectionId;
            accountingDocumentLine.SourceFxDealId = monthEndLine.FxDealId;
            accountingDocumentLine.AccrualNumber = monthEndLine.AccrualNumber;

            accountingDocumentLine.Amount = Math.Round((decimal)monthEndLine.Amount, CommonRules.RoundDecimals);

            decimal? amountInUSD = accountingDocumentLine.Amount;

            if (monthEndDocument.CurrencyCode != null && monthEndDocument.CurrencyCode.ToUpperInvariant() != "USD")
            {
                amountInUSD = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, accountingDocumentLine.Amount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
            }

            if (amountInUSD != null)
            {
                amountInUSD = Math.Round((decimal)amountInUSD, CommonRules.RoundDecimals);
            }

            accountingDocumentLine.StatutoryCurrency = amountInUSD;
            if (company.StatutoryCurrencyCode != null && amountInUSD != null && company.StatutoryCurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                accountingDocumentLine.StatutoryCurrency = (await _foreignExchangeRateService.Convert(CommonRules.BaseCurrency, company.StatutoryCurrencyCode, (decimal)amountInUSD, monthEndLine.BLDate)).ConvertedValue;
            }

            accountingDocumentLine.FunctionalCurrency = amountInUSD;
            if (company.FunctionalCurrencyCode != null && amountInUSD != null && company.FunctionalCurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                accountingDocumentLine.FunctionalCurrency = (await _foreignExchangeRateService.Convert(CommonRules.BaseCurrency, company.FunctionalCurrencyCode, (decimal)amountInUSD, monthEndLine.BLDate)).ConvertedValue;
            }

            if (accountingDocumentLine.StatutoryCurrency != null)
            {
                accountingDocumentLine.StatutoryCurrency = Math.Round((decimal)accountingDocumentLine.StatutoryCurrency, CommonRules.RoundDecimals, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
            }

            if (accountingDocumentLine.FunctionalCurrency != null)
            {
                accountingDocumentLine.FunctionalCurrency = Math.Round((decimal)accountingDocumentLine.FunctionalCurrency, CommonRules.RoundDecimals, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
            }

            if (monthEndDocument.TATypeId != (int)TAType.FxDealMonthTemporaryAdjustment)
            {
                switch (monthEndLine.NominalOrClientLeg)
                {
                    case AccountingDocumentLineType.Client:
                        accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.C;
                        accountingDocumentLine.AccountLineTypeId = monthEndLine.Amount >= 0 ? (int)AccountLineType.C : (int)AccountLineType.V;
                        accountingDocumentLine.ClientAccount = monthEndLine.AssociatedAccountCode;
                        accountingDocumentLine.PostingLineId = 1;
                        break;
                    case AccountingDocumentLineType.Nominal:
                        accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
                        accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                        accountingDocumentLine.ClientAccount = null;
                        accountingDocumentLine.PostingLineId = 2;
                        break;
                }
            }

            // Binding the Nominal Account associated with business sector if business sector posting is configured and if account line type is "L"
            if (monthEndDocument.BusinessSectorNominalPostingPurpose == true && monthEndLine.SectionId != null
                && monthEndLine.BusinessSectorNominalAccountCode != null && accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.L)
            {
                accountingDocumentLine.AccountReference = monthEndLine.BusinessSectorNominalAccountCode;
            }
            else
            {
                accountingDocumentLine.AccountReference = monthEndLine.NominalAccount;
            }

            return accountingDocumentLine;
        }
    }
}
