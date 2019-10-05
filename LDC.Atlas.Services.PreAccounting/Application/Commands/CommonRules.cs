using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Application.Queries;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Infrastructure.Policies;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public static class CommonRules
    {
        public const string BaseCurrency = "USD";
        public const int RoundDecimals = 2;

        internal static async Task<PostingStatus> ReturnAccountingDocumentStatus(IAccountingDocumentQueries accountingQueries, AccountingDocument accountingDocument, DateTime companyDate, string company, AccountingSetupDto accountingSetup)
        {
            accountingDocument.ErrorMessage = string.Empty;

            // Sanity Check
            bool isLegSumValid = CommonRules.CheckSanityCheck(accountingDocument);
            MappingErrorMessages messages;

            if (isLegSumValid)
            {
                if (CommonRules.CheckFxRateConverted(accountingDocument))
                {
                    bool ifInterface = await CommonRules.CheckIfInterface(accountingQueries, accountingDocument.TransactionDocumentId, company);

                    messages = await CommonRules.CheckMappingError(accountingQueries, accountingDocument.AccountingDocumentLines, company, accountingDocument.TransactionDocumentTypeId);

                    if (ifInterface)
                    {
                        if (!messages.C2CCode)
                        {
                            accountingDocument.ErrorMessage = "C2C Code Is NULL ;";
                        }

                        if (!messages.CostAlternativeCode)
                        {
                            accountingDocument.ErrorMessage += "Cost Alternative Code  Is NULL ;";
                        }

                        if (!messages.TaxInterfaceCode)
                        {
                            accountingDocument.ErrorMessage += "Tax Interface Code Is NULL ;";
                        }

                        if (!messages.DepartmentAlternativeCode)
                        {
                            accountingDocument.ErrorMessage += "Department Alternative Code Is NULL ;";
                        }

                        if (!messages.NominalAlternativeAccount)
                        {
                            accountingDocument.ErrorMessage += "Nominal Alternative Code Is NULL ;";
                        }

                        if (!string.IsNullOrEmpty(accountingDocument.ErrorMessage))
                        {
                            return PostingStatus.MappingError;
                        }
                    }

                    if (CommonRules.MandatoryFieldValidation(accountingDocument))
                    {
                        accountingDocument.ErrorMessage = "Mandatory Field Missing";

                        return PostingStatus.Held;
                    }

                    if (accountingDocument.DocumentDate.Date > companyDate.Date)
                    {
                        accountingDocument.ErrorMessage = "Future document date";
                        return PostingStatus.Held;
                    }

                    if (!IsMonthOpenForAccounting(accountingSetup.LastMonthClosed, accountingDocument.AccountingDate, accountingSetup.NumberOfOpenPeriod))
                    {
                        accountingDocument.ErrorMessage = "Period is not open for accounting";
                        return PostingStatus.Held;
                    }

                    return PostingStatus.Authorised;
                }
                else
                {
                    accountingDocument.ErrorMessage = "No Fxrates Found";
                    return PostingStatus.Held;
                }
            }
            else
            {
                accountingDocument.ErrorMessage = "Unbalanced document";
                return PostingStatus.Held;
            }
        }

        internal static async Task<AccountingDocument> CalculateFunctionalAndStatutoryCurrencyAccountingLine(IForeignExchangeRateService foreignExchangeRateService, AccountingDocument document)
        {
            AccountingDocument accountingDocumentStatus = new AccountingDocument();

            accountingDocumentStatus.AccountingId = document.AccountingId;

            foreach (AccountingDocumentLine documentLine in document.AccountingDocumentLines)
            {
                documentLine.Amount = Math.Round(documentLine.Amount, CommonRules.RoundDecimals);

                decimal? amountInUSD = documentLine.Amount;

                if (document.CurrencyCode != null && document.CurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                {
                    var result = await foreignExchangeRateService.Convert(document.CurrencyCode, CommonRules.BaseCurrency, documentLine.Amount, (DateTime)document.GLDate);
                    amountInUSD = result.ConvertedValue;
                    document.Roe = result.Rate;
                }

                if (amountInUSD != null)
                {
                    documentLine.StatutoryCurrency = amountInUSD;

                    if (document.StatutoryCurrencyCode != null && document.StatutoryCurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                    {
                        var result = await foreignExchangeRateService.Convert(CommonRules.BaseCurrency, document.StatutoryCurrencyCode, (decimal)amountInUSD, (DateTime)document.GLDate);
                        documentLine.StatutoryCurrency = result.ConvertedValue;
                    }

                    documentLine.FunctionalCurrency = amountInUSD;
                    if (document.FunctionalCurrencyCode != null && document.FunctionalCurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                    {
                        var result = await foreignExchangeRateService.Convert(CommonRules.BaseCurrency, document.FunctionalCurrencyCode, (decimal)amountInUSD, (DateTime)document.GLDate);
                        documentLine.FunctionalCurrency = result.ConvertedValue;
                    }

                    if (documentLine.StatutoryCurrency != null)
                    {
                        documentLine.StatutoryCurrency = Math.Round((decimal)documentLine.StatutoryCurrency, CommonRules.RoundDecimals, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
                    }

                    if (documentLine.FunctionalCurrency != null)
                    {
                        documentLine.FunctionalCurrency = Math.Round((decimal)documentLine.FunctionalCurrency, CommonRules.RoundDecimals, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
                    }
                }
                else
                {
                    documentLine.FunctionalCurrency = null;
                    documentLine.StatutoryCurrency = null;
                }
            }

            return document;
        }

        internal static DateTime CalculateAccountPeriod(AccountingSetupDto accountingSetup, DateTime documentDate, bool isPostOpClosedPrivilege)
        {
            if (accountingSetup == null)
            {
                throw new Exception("Unable to create document header and lines");
            }

            if (IsLastMonthForOperationOpen(accountingSetup.LastMonthClosedForOperation, documentDate))
            {
                return documentDate;
            }
            else
            {
                if (isPostOpClosedPrivilege)
                {
                    if (IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, documentDate, accountingSetup.NumberOfOpenPeriod))
                    {
                        return documentDate;
                    }
                    else
                    {
                        if (IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, accountingSetup.LastMonthClosedForOperation, accountingSetup.NumberOfOpenPeriod))
                        {
                            return accountingSetup.LastMonthClosedForOperation;
                        }

                        return accountingSetup.LastMonthClosedForOperation.AddMonths(1);
                    }
                }

                return accountingSetup.LastMonthClosedForOperation.AddMonths(1);
            }
        }

        internal static bool IsMonthOpenForAccounting(DateTime lastMonthForAccounting, DateTime documentDate, int numberOfOpenPeriod)
        {
            for (int i = numberOfOpenPeriod; i >= 0 ; i--)
            {
                DateTime lastMonthAddition = lastMonthForAccounting.AddMonths(i);

                if (documentDate.Year < lastMonthAddition.Year
                    || (documentDate.Year == lastMonthAddition.Year && documentDate.Month <= lastMonthAddition.Month))
                {
                    return true;
                }
            }

            return false;
        }

        internal static bool IsLastMonthForAccountingOpen(DateTime lastMonthForAccounting, DateTime documentDate, int numberOfOpenPeriod)
        {
            int[] openMonthsForAccounting = new int[numberOfOpenPeriod];

            for (int i = 1; i <= numberOfOpenPeriod; i++)
            {
                openMonthsForAccounting[i - 1] = 0;

                if (lastMonthForAccounting.Month + i > 12)
                {
                    if (lastMonthForAccounting.Year + 1 == documentDate.Year)
                    {
                        openMonthsForAccounting[i - 1] = lastMonthForAccounting.Month + i - 12;
                    }
                }
                else
                {
                    if (lastMonthForAccounting.Year == documentDate.Year)
                    {
                        openMonthsForAccounting[i - 1] = lastMonthForAccounting.Month + i;
                    }
                }
            }

            if (openMonthsForAccounting.Contains(documentDate.Month))
            {
                return true;
            }

            return false;
        }

        internal static bool IsLastMonthForOperationOpen(DateTime lastMonthForOperation, DateTime documentDate)
        {
            if ((lastMonthForOperation.Year == documentDate.Year && lastMonthForOperation.Month < documentDate.Month) || lastMonthForOperation.Year < documentDate.Year)
            {
                return true;
            }

            return false;
        }

        internal static FxRateInformation GetFxRateInformation(DateTime blDate, string currency, Company company)
        {
            var fxRateInvoiceCurrencyCode = new FxRateConversion
            {
                FxDate = blDate,
                FxCurrency = currency
            };

            var fxRateStatutoryCurrencyCode = new FxRateConversion
            {
                FxDate = blDate,
                FxCurrency = company.StatutoryCurrencyCode
            };

            var fxRateFunctionalCurrencyCode = new FxRateConversion
            {
                FxDate = blDate,
                FxCurrency = company.FunctionalCurrencyCode
            };

            FxRateInformation fxRateInformation = new FxRateInformation(fxRateInvoiceCurrencyCode, fxRateStatutoryCurrencyCode, fxRateFunctionalCurrencyCode);

            return fxRateInformation;
        }

        internal static async Task<AccountingDocument> CreateAccountingDocument(
            IMasterDataService masterDataService,
            long userId,
            bool postOpClosedPrivilege,
            long docId,
            int docTypeId,
            string baseCurrency,
            FxRateConversion fxRate,
            AccountingSetupDto accountingSetup,
            InvoiceInformationDto invoiceInformation = null,
            CashInformationDto cashInformation = null,
            DateTime? blDate = null,
            ManualJournalDocumentDto manualJournal = null,
            RevaluationInformationDto revalInformation = null,
            MonthEndTADocumentDto monthEndTADocument = null,
            CounterpartyInformationDto counterpartyInformation = null,
            CashForCounterpartyDto cashForCounterpartyDto = null,
            FxSettlementDocumentDto fxSettlementDocument = null)
        {
            AccountingDocument accountingDocument = new AccountingDocument();
            accountingDocument.UserCreator = userId;
            accountingDocument.TransactionDocumentId = docId;
            accountingDocument.ProvinceId = null;
            accountingDocument.OriginalReferenceId = null;

            if (fxRate.FxCurrency.ToUpperInvariant() == baseCurrency)
            {
                accountingDocument.Roe = 1;
                accountingDocument.RoeType = "M";
            }
            else
            {
                FxRate fxRateUSD = await masterDataService.GetFxRateAsync(fxRate.FxDate, fxRate.FxCurrency);
                accountingDocument.Roe = fxRateUSD != null ? fxRateUSD.Rate : null;
                accountingDocument.RoeType = fxRateUSD != null ? fxRateUSD.CurrencyRoeType : null;
            }

            accountingDocument.TransactionDocumentTypeId = docTypeId;
            accountingDocument.AcknowledgementDate = null;

            switch (docTypeId)
            {
                case (int)DocumentType.PI:
                case (int)DocumentType.SI:
                case (int)DocumentType.CN:
                case (int)DocumentType.DN:
                    accountingDocument.CurrencyCode = invoiceInformation.Currency;
                    accountingDocument.AccountingPeriod = CommonRules.CalculateAccountPeriod(accountingSetup, invoiceInformation.InvoiceDate, postOpClosedPrivilege);
                    accountingDocument.DocumentDate = invoiceInformation.InvoiceDate;
                    accountingDocument.ValueDate = invoiceInformation.InvoiceDueDate;
                    accountingDocument.GLDate = blDate;
                    accountingDocument.OriginalValueDate = invoiceInformation.InvoiceDueDate;
                    accountingDocument.AccountingDate = CommonRules.CalculateAccountPeriod(accountingSetup, invoiceInformation.InvoiceDate, postOpClosedPrivilege);

                    break;
                case (int)DocumentType.CP:
                case (int)DocumentType.CI:
                    if (counterpartyInformation != null && cashForCounterpartyDto.CashTypeId == (int)CashSelectionType.PaymentDifferentClient && cashForCounterpartyDto.JLTypeId == (int)JLType.CounterPartyTransfer)
                    {
                        accountingDocument.CurrencyCode = counterpartyInformation.CurrencyCode;
                        accountingDocument.AccountingPeriod = CommonRules.CalculateAccountPeriod(accountingSetup, counterpartyInformation.DocumentDate, postOpClosedPrivilege);
                        accountingDocument.DocumentDate = counterpartyInformation.DocumentDate;
                        accountingDocument.ValueDate = counterpartyInformation.ValueDate == null ? counterpartyInformation.DocumentDate : (DateTime)counterpartyInformation.ValueDate;
                        accountingDocument.GLDate = counterpartyInformation.DocumentDate;
                        accountingDocument.OriginalValueDate = counterpartyInformation.ValueDate == null ? counterpartyInformation.DocumentDate : (DateTime)counterpartyInformation.ValueDate;
                        accountingDocument.AccountingDate = CommonRules.CalculateAccountPeriod(accountingSetup, counterpartyInformation.DocumentDate, postOpClosedPrivilege);
                    }
                    else
                    {
                        accountingDocument.CurrencyCode = cashInformation.Currency;
                        accountingDocument.AccountingPeriod = CommonRules.CalculateAccountPeriod(accountingSetup, cashInformation.DocumentDate, postOpClosedPrivilege);
                        accountingDocument.DocumentDate = cashInformation.DocumentDate;
                        accountingDocument.ValueDate = cashInformation.ValueDate;
                        accountingDocument.GLDate = cashInformation.DocumentDate;
                        accountingDocument.OriginalValueDate = cashInformation.ValueDate;
                        accountingDocument.AccountingDate = CommonRules.CalculateAccountPeriod(accountingSetup, cashInformation.DocumentDate, postOpClosedPrivilege);
                    }

                    break;
                case (int)DocumentType.MTA:
                case (int)DocumentType.MJL:
                    if (monthEndTADocument != null && (monthEndTADocument.TATypeId == (int)TAType.MonthEndTemporaryAdjustment || monthEndTADocument.TATypeId == (int)TAType.FxDealMonthTemporaryAdjustment))
                    {
                        accountingDocument.CurrencyCode = monthEndTADocument.CurrencyCode;
                        accountingDocument.ValueDate = monthEndTADocument.ValueDate;
                        accountingDocument.DocumentDate = new DateTime(accountingDocument.ValueDate.Value.Year, accountingDocument.ValueDate.Value.Month, 1).AddDays(-1);
                        accountingDocument.AccountingPeriod = monthEndTADocument.AccountingPeriod.Value;
                        accountingDocument.GLDate = monthEndTADocument.MonthEndTALines.FirstOrDefault().BLDate;
                        accountingDocument.OriginalValueDate = (DateTime)monthEndTADocument.ValueDate;
                        accountingDocument.AccountingDate = accountingDocument.DocumentDate.Year == monthEndTADocument.AccountingPeriod.Value.Year && accountingDocument.DocumentDate.Month == monthEndTADocument.AccountingPeriod.Value.Month ? accountingDocument.DocumentDate : new DateTime(monthEndTADocument.AccountingPeriod.Value.Year, monthEndTADocument.AccountingPeriod.Value.Month, 1);
                    }
                    else
                    {
                        accountingDocument.CurrencyCode = manualJournal.CurrencyCode;
                        accountingDocument.AccountingPeriod = manualJournal.AccountingPeriod;
                        accountingDocument.DocumentDate = manualJournal.DocumentDate;
                        accountingDocument.GLDate = manualJournal.DocumentDate;
                        accountingDocument.OriginalValueDate = manualJournal.ValueDate == null ? manualJournal.DocumentDate : (DateTime)manualJournal.ValueDate;
                        accountingDocument.AccountingDate = manualJournal.DocumentDate;

                        if (docTypeId == (int)DocumentType.MTA)
                        {
                            accountingDocument.ValueDate = manualJournal.ValueDate == null ? new DateTime(manualJournal.DocumentDate.Year, manualJournal.DocumentDate.Month, 1).AddMonths(1) : (DateTime)manualJournal.ValueDate;
                        }

                        if (docTypeId == (int)DocumentType.MJL)
                        {
                            accountingDocument.ValueDate = manualJournal.ValueDate == null ? manualJournal.DocumentDate : manualJournal.ValueDate;
                        }
                    }

                    break;
                case (int)DocumentType.FJ:
                    accountingDocument.DocumentReference = fxSettlementDocument.DocumentReference;
                    if (fxSettlementDocument.IsNdf)
                    {
                        accountingDocument.ValueDate = fxSettlementDocument.NdfAgreedDate;
                    }
                    else
                    {
                        accountingDocument.ValueDate = fxSettlementDocument.MaturityDate;
                    }
                    accountingDocument.DocumentDate = fxSettlementDocument.MaturityDate;
                    accountingDocument.GLDate = fxSettlementDocument.MaturityDate;
                    accountingDocument.OriginalValueDate = fxSettlementDocument.DocumentDate;
                    if (fxSettlementDocument != null && fxSettlementDocument.FxSettlementDocumentTypeId != FxSettlementDocumentType.FxDeal)
                    {
                        accountingDocument.CurrencyCode = fxSettlementDocument.SettlementCurrencyCode;
                    }
                    else
                    {
                        accountingDocument.CurrencyCode = fxSettlementDocument.CurrencyCode;
                    }

                    break;
            }

            return accountingDocument;
        }

        internal static InvoiceFunction CheckInvoiceType(int invoiceType)
        {
            switch (invoiceType)
            {
                case (int)Entities.InvoiceType.CostCredit:
                case (int)Entities.InvoiceType.CostDebit:
                case (int)Entities.InvoiceType.CostPay:
                case (int)Entities.InvoiceType.CostReceive:
                    return InvoiceFunction.Cost;
                case (int)Entities.InvoiceType.CommercialPurchase:
                case (int)Entities.InvoiceType.CommercialSale:
                    return InvoiceFunction.Commercial;
                case (int)Entities.InvoiceType.WashoutCredit:
                case (int)Entities.InvoiceType.WashoutDebit:
                    return InvoiceFunction.Washout;
                case (int)Entities.InvoiceType.Reversal:
                    return InvoiceFunction.Reversal;
                case (int)Entities.InvoiceType.GoodsCostPurchase:
                case (int)Entities.InvoiceType.GoodsCostSales:
                    return InvoiceFunction.GoodsAndCost;
                case (int)Entities.InvoiceType.CancelledCredit:
                case (int)Entities.InvoiceType.CancelledDebit:
                    return InvoiceFunction.Cancelled;
            }

            return InvoiceFunction.Commercial;
        }

        internal static async Task<AccountingDocumentLine> CalculateFunctionalAndStatutoryCurrency(IForeignExchangeRateService foreignExchangeRateService, AccountingDocumentLine accountingDocumentLine, decimal? amountInUSD, FxRateInformation fxRates, Company company, string baseCurrency, int decimals)
        {
            if (amountInUSD != null)
            {
                amountInUSD = Math.Round((decimal)amountInUSD, decimals);

                accountingDocumentLine.StatutoryCurrency = amountInUSD;
                if (company.StatutoryCurrencyCode != null && amountInUSD != null && company.StatutoryCurrencyCode.ToUpperInvariant() != baseCurrency)
                {
                    accountingDocumentLine.StatutoryCurrency = (await foreignExchangeRateService.Convert(baseCurrency, fxRates.FxRateStatutoryCurrency.FxCurrency, (decimal)amountInUSD, fxRates.FxRateStatutoryCurrency.FxDate)).ConvertedValue;
                }

                accountingDocumentLine.FunctionalCurrency = amountInUSD;
                if (company.FunctionalCurrencyCode != null && amountInUSD != null && company.FunctionalCurrencyCode.ToUpperInvariant() != baseCurrency)
                {
                    accountingDocumentLine.FunctionalCurrency = (await foreignExchangeRateService.Convert(baseCurrency, fxRates.FxRateFunctionalCurrency.FxCurrency, (decimal)amountInUSD, fxRates.FxRateFunctionalCurrency.FxDate)).ConvertedValue;
                }

                if (accountingDocumentLine.StatutoryCurrency != null)
                {
                    accountingDocumentLine.StatutoryCurrency = Math.Round((decimal)accountingDocumentLine.StatutoryCurrency, decimals, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
                }

                if (accountingDocumentLine.FunctionalCurrency != null)
                {
                    accountingDocumentLine.FunctionalCurrency = Math.Round((decimal)accountingDocumentLine.FunctionalCurrency, decimals, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
                }
            }
            else
            {
                accountingDocumentLine.StatutoryCurrency = null;
                accountingDocumentLine.FunctionalCurrency = null;
            }

            return accountingDocumentLine;
        }

        internal static void PostingLineIdOrder(IEnumerable<AccountingDocumentLine> accountingDocumentLines)
        {
                int postingLineId = 1;
                accountingDocumentLines.FirstOrDefault(client => client.AccountingCategoryId == (int)AccountingCategory.C).PostingLineId = postingLineId++;
                accountingDocumentLines.FirstOrDefault(tax => tax.AccountingCategoryId == (int)AccountingCategory.T).PostingLineId = postingLineId++;
                foreach (AccountingDocumentLine nominal in accountingDocumentLines.Where(nominal => nominal.AccountingCategoryId == (int)AccountingCategory.N))
                {
                    nominal.PostingLineId = postingLineId++;
                }
        }

        internal static async Task<PostingStatus> GetAccountingDocumentStatus(AccountingSetupDto accountingSetup,IAccountingDocumentQueries accountingQuerie, AccountingDocument accountingDocument, string company, DateTime companyDate, InvoiceInformationDto invoiceInformation = null, CashInformationDto cashInformation = null, RevaluationInformationDto revalInformation = null, CounterpartyInformationDto counterpartyInformation = null)
        {
            accountingDocument.ErrorMessage = string.Empty;

            if (invoiceInformation != null)
            {
                if (!CheckPostingForAuthorized(invoiceInformation))
                {
                    return PostingStatus.Incomplete;
                }
            }
            else if (cashInformation != null)
            {
                if (!CheckPostingForAuthorized(null, cashInformation))
                {
                    return PostingStatus.Incomplete;
                }
            }
            else if (revalInformation != null)
            {
                if (!CheckPostingForAuthorized(null, null, revalInformation))
                {
                    return PostingStatus.Incomplete;
                }
            }
            else if (counterpartyInformation != null)
            {
                if (!CheckPostingForAuthorized(null, null, null, counterpartyInformation))
                {
                    return PostingStatus.Incomplete;
                }
            }

            if (CheckSanityCheck(accountingDocument))
            {
                if (CheckFxRateConverted(accountingDocument))
                {
                    bool ifInterface = await CheckIfInterface(accountingQuerie, accountingDocument.TransactionDocumentId, company);

                    MappingErrorMessages messages = await CheckMappingError(accountingQuerie, accountingDocument.AccountingDocumentLines, company, accountingDocument.TransactionDocumentTypeId);

                    if (ifInterface)
                    {
                        if (!messages.C2CCode)
                        {
                            accountingDocument.ErrorMessage = "C2C Code Is NULL ;";
                        }

                        if (!messages.CostAlternativeCode)
                        {
                            accountingDocument.ErrorMessage += "Cost Alternative Code Is NULL ;";
                        }

                        if (!messages.TaxInterfaceCode)
                        {
                            accountingDocument.ErrorMessage += "Tax Interface Code Is NULL ;";
                        }

                        if (!messages.NominalAlternativeAccount)
                        {
                            accountingDocument.ErrorMessage += "Nominal Alternative Code Is NULL ;";
                        }

                        if (!messages.DepartmentAlternativeCode)
                        {
                            accountingDocument.ErrorMessage += "Department Alternative Code Is NULL ;";
                        }

                        if (!string.IsNullOrEmpty(accountingDocument.ErrorMessage))
                        {
                            return PostingStatus.MappingError;
                        }
                    }

                    if (MandatoryFieldValidation(accountingDocument))
                    {
                        accountingDocument.ErrorMessage = "Mandatory Field Missing";

                        return PostingStatus.Held;
                    }

                    if (CheckFutureDate(accountingDocument, companyDate))
                    {
                        accountingDocument.ErrorMessage = "Future document date";
                        return PostingStatus.Held;
                    }
                    if (!IsMonthOpenForAccounting(accountingSetup.LastMonthClosed, accountingDocument.AccountingDate, accountingSetup.NumberOfOpenPeriod))
                    {
                        accountingDocument.ErrorMessage = "Period is not open for accounting";
                        return PostingStatus.Held;
                    }

                    return PostingStatus.Authorised;
                }
                else
                {
                    accountingDocument.ErrorMessage = "No Fxrate found";
                    return PostingStatus.Held;
                }
            }
            else
            {
                accountingDocument.ErrorMessage = "Unbalanced document";
                return PostingStatus.Held;
            }
        }

        // This is to be develop in coming sprint. Created Block with default return false
        internal static async Task<MappingErrorMessages> CheckMappingError(IAccountingDocumentQueries accountingQueries, IEnumerable<AccountingDocumentLine> accountingDocumentLine, string company, long transactionDocumentTypeId)
        {
            return await accountingQueries.GetMapppingErrorAsync(accountingDocumentLine, company, transactionDocumentTypeId);
        }

        // This is to be develop in coming sprint. Created Block with default return false
        internal static async Task<bool> CheckIfInterface(IAccountingDocumentQueries accountingQueries, long docId, string company)
        {
            return (await accountingQueries.GetTransactionDocumentTypeByDocId(docId, company)).ToInterface;
        }

        internal static bool CheckPostingForAuthorized(InvoiceInformationDto invoiceInformation = null, CashInformationDto cashInformation = null, RevaluationInformationDto revalInformation = null, CounterpartyInformationDto counterpartyInformation = null)
        {
            if (invoiceInformation != null)
            {
                return invoiceInformation.AuthorizedForPosting;
            }

            if (revalInformation != null)
            {
                return true;
            }

            if (counterpartyInformation != null)
            {
                return true;
            }

            return cashInformation.AuthorizedForPosting;
        }

        internal static bool CheckSanityCheck(AccountingDocument accountingDocument)
        {
            bool isValid = accountingDocument.AccountingDocumentLines.Select(x => x.Amount).Sum() == 0;
            decimal remainingamount;

            if (isValid)
            {
                bool isFunctionalCurrencyConverted = accountingDocument.AccountingDocumentLines.Where(x => x.FunctionalCurrency == null).Count() == 0;
                bool isStatutoryCurrencyConverted = accountingDocument.AccountingDocumentLines.Where(x => x.StatutoryCurrency == null).Count() == 0;
                if (isFunctionalCurrencyConverted)
                {
                    remainingamount = accountingDocument.AccountingDocumentLines.Select(x => (decimal)x.FunctionalCurrency).Sum();

                    if (remainingamount != 0)
                    {
                        accountingDocument.AccountingDocumentLines.OrderByDescending(x => Math.Abs((decimal)x.FunctionalCurrency)).FirstOrDefault().FunctionalCurrency = accountingDocument.AccountingDocumentLines.OrderByDescending(x => Math.Abs((decimal)x.FunctionalCurrency)).FirstOrDefault().FunctionalCurrency - remainingamount;
                    }
                }

                if (isStatutoryCurrencyConverted)
                {
                    remainingamount = accountingDocument.AccountingDocumentLines.Select(x => (decimal)x.StatutoryCurrency).Sum();

                    if (remainingamount != 0)
                    {
                        accountingDocument.AccountingDocumentLines.OrderByDescending(x => Math.Abs((decimal)x.StatutoryCurrency)).FirstOrDefault().StatutoryCurrency = accountingDocument.AccountingDocumentLines.OrderByDescending(x => Math.Abs((decimal)x.StatutoryCurrency)).FirstOrDefault().StatutoryCurrency - remainingamount;
                    }
                }
            }

            return isValid;
        }

        internal static bool CheckFutureDate(AccountingDocument accountingDocument, DateTime companyDate)
        {
            return accountingDocument.DocumentDate.Date > companyDate.Date;
        }

        internal static bool MandatoryFieldValidation(AccountingDocument accountingDocument)
        {
            bool isAnyNullOrEmpty = true;

            if (!IsNullOrEmptyOrZero(accountingDocument.AccountingPeriod)
                && !IsNullOrEmptyOrZero(accountingDocument.DocumentDate)
                && !IsNullOrEmptyOrZero(accountingDocument.GLDate)
                && !IsNullOrEmptyOrZero(accountingDocument.AccountingDate)
                && !IsNullOrEmptyOrZero(accountingDocument.TransactionDocumentTypeId)
                 && !IsNullOrEmptyOrZero(accountingDocument.CurrencyCode))
            {
                foreach (var accountingDocumentLine in accountingDocument.AccountingDocumentLines)
                {
                    if (!IsNullOrEmptyOrZero(accountingDocumentLine.PostingLineId)
                        && !IsNullOrEmptyOrZero(accountingDocumentLine.AccountLineTypeId)
                        && !IsNullOrEmptyOrZero(accountingDocumentLine.CostTypeCode)
                        && !IsNullOrEmptyOrZero(accountingDocumentLine.DepartmentId)
                        && !IsNullOrEmptyOrZero(accountingDocumentLine.AccountingCategoryId)
                        && !IsNullOrEmptyOrZero(accountingDocumentLine.AccountReference))
                    {
                        isAnyNullOrEmpty = false;
                    }
                    else
                    {
                        break;
                    }
                }
            }

            return isAnyNullOrEmpty;
        }

        internal static bool CheckFxRateConverted(AccountingDocument accountingDocument)
        {
            bool isFunctionalCurrencyNull = accountingDocument.AccountingDocumentLines.Where(x => x.FunctionalCurrency == null).Count() == 0;
            bool isStatutoryCurrencyNull = accountingDocument.AccountingDocumentLines.Where(x => x.StatutoryCurrency == null).Count() == 0;
            return isFunctionalCurrencyNull && isStatutoryCurrencyNull;
        }

        internal static async Task<bool> CheckPrivileges(IAuthorizationService authorizationService, IIdentityService identityService)
        {
            var authorizationResult = await authorizationService.AuthorizeAsync(identityService.GetUser(), Policies.PostOpClosedPolicy);

            return authorizationResult.Succeeded;
        }

        private static bool IsNullOrEmptyOrZero(object value)
        {
            if (value == null)
            {
                return true;
            }
            else if (value is DateTime)
            {
                return (DateTime)value == default(DateTime);
            }
            else if (value is string)
            {
                return string.IsNullOrEmpty((string)value);
            }
            else if (value is long || value is int || value is decimal || value is double)
            {
                return string.Format(CultureInfo.InvariantCulture, "{0}", value).Equals("0", StringComparison.InvariantCultureIgnoreCase);
            }

            return false;
        }

        internal static int CalculateDirectionFactorForClientLines(CashInformationDto cashInformation)
        {
            return CalculateDirectionFactorForClientLines((CashSelectionType)cashInformation.CashTypeId);
        }

        internal static int CalculateDirectionFactorForClientLines(CashSelectionType cashType)
        { 
            int directionFactor = 1;
            switch (cashType)
            {
                case CashSelectionType.SimpleCashPayment: // This value should not be possible there...
                case CashSelectionType.PaymentFullPartialTransaction:
                case CashSelectionType.PaymentDifferentClient:
                case CashSelectionType.PaymentDifferentCurrency:
                    directionFactor = 1;
                    break;
                case CashSelectionType.SimpleCashReceipt: // This value should not be possible there...
                case CashSelectionType.ReceiptDifferentCurrency:
                case CashSelectionType.ReceiptFullPartialTransaction:
                    directionFactor = -1;
                    break;
            }

            return directionFactor;
        }
    }

    internal class FxRateInformation
    {
        public FxRateInformation(FxRateConversion fxRateInvoiceCurrency, FxRateConversion fxRateStatutoryCurrency, FxRateConversion fxRateFunctionalCurrency)
        {
            FxRateInvoiceCurrency = fxRateInvoiceCurrency;
            FxRateStatutoryCurrency = fxRateStatutoryCurrency;
            FxRateFunctionalCurrency = fxRateFunctionalCurrency;
        }

        public FxRateConversion FxRateInvoiceCurrency { get; private set; }

        public FxRateConversion FxRateStatutoryCurrency { get; private set; }

        public FxRateConversion FxRateFunctionalCurrency { get; private set; }

        public bool AreAllFilled()
        {
            return FxRateInvoiceCurrency != null && FxRateStatutoryCurrency != null && FxRateFunctionalCurrency != null;
        }
    }
}