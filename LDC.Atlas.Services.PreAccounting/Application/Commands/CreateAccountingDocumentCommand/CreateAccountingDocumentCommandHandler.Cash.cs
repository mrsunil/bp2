using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class CreateAccountingDocumentCommandHandler
    {
        private async Task<List<AccountingDocument>> GetInformationForCash(bool postOpClosedPrivilege, long docId, int docTypeId, AccountingSetupDto accountingSetup, Company company, DateTime companyDate)
        {
            List<AccountingDocument> accountingDocuments = new List<AccountingDocument>();
            CashInformationDto cashInformation = await _accountingQueries.GetCashInformationForAccountingDocument(docId, company.CompanyId);

            if (accountingSetup == null)
            {
                throw new Exception("No accounting setup found.");
            }

            var fxRates = CommonRules.GetFxRateInformation(cashInformation.DocumentDate, cashInformation.Currency, company);

            if (cashInformation.CashTypeId == (int)CashSelectionType.SimpleCashPayment || cashInformation.CashTypeId == (int)CashSelectionType.SimpleCashReceipt)
            {
                /* Simple cash */

                var accountingDocument = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPrivilege, docId, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, null, cashInformation);

                if (accountingDocument != null)
                {
                    accountingDocument.AccountingDocumentLines = await CreateAccountingDocumentLines(docTypeId, company, accountingSetup, fxRates, null, null, null, cashInformation);
                    accountingDocuments.Add(accountingDocument);
                    accountingDocument.StatusId = await CommonRules.GetAccountingDocumentStatus(accountingSetup, _accountingQueries, accountingDocument, company.CompanyId, companyDate, null, cashInformation);
                }

                // the cashLines list is supposed to contain one unique cash line information  ; we initialize the "C" acc line with the ID of the cash line
                if (cashInformation.CashLines != null && cashInformation.CashLines.Any())
                {
                    var cashLineRecord = cashInformation.CashLines.FirstOrDefault();
                    foreach (var accountingLine in accountingDocument.AccountingDocumentLines)
                    {
                        if (accountingLine.AccountingCategoryId == (int)AccountingCategory.C)
                        {
                            accountingLine.SourceCashLineId = cashLineRecord.CashLineId;
                        }
                    }
                }
            }
            else
            {
                /* Cash by picking */
                var accountingDocument = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPrivilege, docId, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, null, cashInformation);
                accountingDocument.AccountingDocumentLines = await CreateAccountingDocumentLinesForCashPickingTransaction(docTypeId, company, fxRates, accountingSetup, cashInformation);
                accountingDocument.StatusId = await CommonRules.GetAccountingDocumentStatus(accountingSetup, _accountingQueries, accountingDocument, company.CompanyId, companyDate, null, cashInformation);
                accountingDocuments.Add(accountingDocument);

                // If diff ccy, then process the paid cash (the one with the same currency than the invoices)
                if (cashInformation.CashTypeId == (int)CashSelectionType.PaymentDifferentCurrency || cashInformation.CashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency)
                {
                    // Get information for the paid cash
                    CashInformationDto paidCashInformation = await _accountingQueries.GetCashInformationForAccountingDocument(cashInformation.PaymentTransactionDocumentId.Value, company.CompanyId);
                    if (paidCashInformation == null)
                    {
                        throw new AtlasBusinessException("Cannot retrieve information for the associated cash.");
                    }

                    fxRates = CommonRules.GetFxRateInformation(paidCashInformation.DocumentDate, paidCashInformation.Currency, company);
                    var accountingDocumentForPaidCash = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPrivilege, cashInformation.PaymentTransactionDocumentId.Value, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, null, paidCashInformation);
                    // Create the lines for the accounting document in the cash currency (in case of diff ccy)
                    accountingDocumentForPaidCash.AccountingDocumentLines = await CreateAccountingDocumentLineForCashPaidCashInAnotherCcy(docTypeId, company, fxRates, accountingSetup, cashInformation, paidCashInformation);

                    // We don't want this accounting document to be individually posted ; the posting will be done
                    // automatically when posting the matched cash. Puttin the status id to the value "Incomplete" prevent to send this document to the message queue
                    // later in the code
                    accountingDocumentForPaidCash.StatusId = PostingStatus.Incomplete;

                    // Overriding the Roe + type with the information entered by the end user within the screen
                    // (we don't want to use the "current" roe)
                    // This is done the cash which is NOT in USD ; as a reminder, in cash by picking diff ccy, we have the assumption that
                    // one of the currency is USD, and the second is not!
                    if (accountingDocument.CurrencyCode != "USD")
                    {
                        accountingDocument.Roe = paidCashInformation.MatchingRate;
                    }
                    else
                    {
                        accountingDocumentForPaidCash.Roe = paidCashInformation.MatchingRate;
                    }

                    accountingDocuments.Add(accountingDocumentForPaidCash);
                }
            }

            return accountingDocuments;
        }

        private async Task<IEnumerable<AccountingDocumentLine>> CreateAccountingDocumentLinesForCashPickingTransaction(int docTypeId, Company company, FxRateInformation fxRates, AccountingSetupDto accountingSetup, CashInformationDto cashInformation)
        {
            List<AccountingDocumentLine> accountingDocumentLines = new List<AccountingDocumentLine>();

            int postingLineId = 1;

            // To make the accounting lines' sum equal to 0
            int directionFactor = CommonRules.CalculateDirectionFactorForClientLines(cashInformation);

            // Create one client line per cash line
            foreach (var cashline in cashInformation.CashLines)
            {
                var documentMatchingForSourceDocument = cashInformation.DocumentMatchingsForCashByPicking.Where(d => d.MatchedCashLineId == cashline.CashLineId).FirstOrDefault();

                // ClientLine For cash document
                AccountingDocumentLine accountingDocumentLineForClient = new AccountingDocumentLine();
                accountingDocumentLineForClient.CostTypeCode = cashInformation.CostTypeCode;
                accountingDocumentLineForClient.AssociatedAccountCode = cashInformation.PaymentCounterpartyCode == null ? cashInformation.CounterpartyCode : cashInformation.PaymentCounterpartyCode;
                accountingDocumentLineForClient.ClientReference = null;
                accountingDocumentLineForClient.PaymentTermCode = null;
                accountingDocumentLineForClient.ContractSectionCode = null;
                accountingDocumentLineForClient.VATTurnover = null;
                accountingDocumentLineForClient.VATCode = null;
                accountingDocumentLineForClient.CharterId = cashInformation.CharterId;
                accountingDocumentLineForClient.DepartmentId = cashline.DepartmentId;
                accountingDocumentLineForClient.CommodityId = null;
                accountingDocumentLineForClient.Quantity = 0;
                accountingDocumentLineForClient.SectionId = null;
                accountingDocumentLineForClient.PostingLineId = postingLineId;
                accountingDocumentLineForClient.Narrative = cashInformation.Narrative;
                accountingDocumentLineForClient.AccountingCategoryId = (int)AccountingCategory.C;
                accountingDocumentLineForClient.AccountLineTypeId = (int)cashline.TransactionDirectionId;
                accountingDocumentLineForClient.AccountReference = accountingDocumentLineForClient.AccountLineTypeId == (int)AccountLineType.V ? accountingSetup.PurchaseLedgerControlClientCreditors : accountingSetup.SalesLedgerControlClientDebtors;
                accountingDocumentLineForClient.Amount = directionFactor * cashline.Amount.Value;

                // In case of diff Client, the accounting line should have the payee as Client Account
                if (cashInformation.CashTypeId == (int)CashSelectionType.PaymentDifferentClient)
                {
                    if (cashInformation.SecondaryReferencesForCashByPicking != null && cashInformation.SecondaryReferencesForCashByPicking.Any())
                        accountingDocumentLineForClient.SecondaryDocumentReference = cashInformation.SecondaryReferencesForCashByPicking.First().DocumentReference;
                    else
                        accountingDocumentLineForClient.SecondaryDocumentReference = documentMatchingForSourceDocument == null ? null : documentMatchingForSourceDocument.DocumentReference;

                    accountingDocumentLineForClient.ClientAccount = cashInformation.PaymentCounterpartyCode;
                }
                else if (cashInformation.CashTypeId == (int)CashSelectionType.PaymentDifferentCurrency || cashInformation.CashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency)
                {
                    var matchedDocument = cashInformation.DocumentMatchingsForCashByPicking.FirstOrDefault(dm => dm.MatchedCashLineId.HasValue && dm.MatchedCashLineId.Value == cashline.CashLineId);
                    accountingDocumentLineForClient.SecondaryDocumentReference = matchedDocument?.DocumentReference;
                    accountingDocumentLineForClient.ClientAccount = cashInformation.CounterpartyCode;
                }
                else
                {
                    accountingDocumentLineForClient.SecondaryDocumentReference = documentMatchingForSourceDocument == null ? null : documentMatchingForSourceDocument.DocumentReference;
                    accountingDocumentLineForClient.ClientAccount = cashInformation.CounterpartyCode;
                }

                // Updating the referenced IDs
                accountingDocumentLineForClient.SourceCashLineId = cashline.CashLineId;
                accountingDocumentLineForClient.SourceJournalLineId = null;
                accountingDocumentLineForClient.SourceInvoiceId = null;

                decimal? amountInUSD = accountingDocumentLineForClient.Amount;
                if (cashInformation.Currency != null && cashInformation.Currency.ToUpperInvariant() != CommonRules.BaseCurrency)
                {
                    amountInUSD = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, (decimal)amountInUSD, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
                }

                accountingDocumentLineForClient = await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForClient, amountInUSD, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
                postingLineId++;
                accountingDocumentLines.Add(accountingDocumentLineForClient);
            }

            var cashMatchingTotal = cashInformation.CashLines.Sum(s => s.Amount);

            // Nominal Line for Cash Document
            decimal totalCostAmountForClient = 0;

            if (cashInformation.AdditionalCosts != null && cashInformation.AdditionalCosts.Any())
            {
                foreach (var additionalCostsDto in cashInformation.AdditionalCosts.ToList())
                {
                    totalCostAmountForClient += additionalCostsDto.CostDirectionId == (int)CostDirectionType.Pay ? additionalCostsDto.Amount : -additionalCostsDto.Amount;

                    AccountingDocumentLine accountingDocumentLineForAdditionalCosts = new AccountingDocumentLine();

                    accountingDocumentLineForAdditionalCosts.PostingLineId = postingLineId;
                    accountingDocumentLineForAdditionalCosts.AccountLineTypeId = additionalCostsDto.AccountLineTypeId ?? (int)AccountLineType.L;
                    accountingDocumentLineForAdditionalCosts.AccountReference = additionalCostsDto.AccountReference;
                    accountingDocumentLineForAdditionalCosts.CostTypeCode = additionalCostsDto.CostTypeCode;
                    accountingDocumentLineForAdditionalCosts.AssociatedAccountCode = additionalCostsDto.ClientAccountCode;
                    accountingDocumentLineForAdditionalCosts.DepartmentId = cashInformation.DepartmentId;
                    accountingDocumentLineForAdditionalCosts.Narrative = additionalCostsDto.Narrative;
                    accountingDocumentLineForAdditionalCosts.AccountingCategoryId = (int)AccountingCategory.N;
                    accountingDocumentLineForAdditionalCosts.ClientAccount = additionalCostsDto.ClientAccountCode;
                    accountingDocumentLineForAdditionalCosts.ClientAccountId = additionalCostsDto.ClientAccountId;
                    accountingDocumentLineForAdditionalCosts.CommodityId = null;
                    accountingDocumentLineForAdditionalCosts.ClientReference = null;
                    accountingDocumentLineForAdditionalCosts.CharterId = cashInformation.CharterId;
                    accountingDocumentLineForAdditionalCosts.SourceCostLineId = additionalCostsDto.CashAdditionalCostId;

                    // the sign of the accounting line representing the cost depends on the cost type (payable / receivable )
                    accountingDocumentLineForAdditionalCosts.Amount = Math.Round(
                            additionalCostsDto.CostDirectionId == (int)CostDirectionType.Pay
                        ? additionalCostsDto.Amount
                        : -additionalCostsDto.Amount, CommonRules.RoundDecimals);

                    if (cashInformation.SecondaryReferencesForCashByPicking != null && cashInformation.SecondaryReferencesForCashByPicking.Any())
                    {
                        var docreference = cashInformation.SecondaryReferencesForCashByPicking.FirstOrDefault();
                        accountingDocumentLineForAdditionalCosts.SecondaryDocumentReference = docreference.DocumentReference;
                    }

                    decimal? additionalCostAmount = accountingDocumentLineForAdditionalCosts.Amount;

                    if (additionalCostsDto.CurrencyCode != null && additionalCostsDto.CurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                    {
                        additionalCostAmount = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, (decimal)additionalCostAmount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
                    }

                    accountingDocumentLineForAdditionalCosts = await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForAdditionalCosts, additionalCostAmount, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
                    postingLineId++;

                    accountingDocumentLines.Add(accountingDocumentLineForAdditionalCosts);
                }
            }

            // Bank Line for Cash Document
            AccountingDocumentLine accountingDocumentLineForBank = new AccountingDocumentLine();
            accountingDocumentLineForBank.AssociatedAccountCode = cashInformation.PaymentCounterpartyCode == null ? cashInformation.CounterpartyCode : cashInformation.PaymentCounterpartyCode;
            accountingDocumentLineForBank.ClientAccount = cashInformation.PaymentCounterpartyCode == null ? cashInformation.CounterpartyCode : cashInformation.PaymentCounterpartyCode;
            accountingDocumentLineForBank.ClientReference = null;
            accountingDocumentLineForBank.PaymentTermCode = null;
            accountingDocumentLineForBank.ContractSectionCode = null;
            accountingDocumentLineForBank.VATTurnover = null;
            accountingDocumentLineForBank.VATCode = null;
            accountingDocumentLineForBank.CharterId = cashInformation.CharterId;
            accountingDocumentLineForBank.DepartmentId = cashInformation.DepartmentId;
            if (cashInformation.SecondaryReferencesForCashByPicking != null && cashInformation.SecondaryReferencesForCashByPicking.Any())
            {
                accountingDocumentLineForBank.SecondaryDocumentReference = cashInformation.SecondaryReferencesForCashByPicking.First().DocumentReference;
            }

            accountingDocumentLineForBank.CommodityId = null;
            accountingDocumentLineForBank.Quantity = 0;
            accountingDocumentLineForBank.SectionId = null;
            accountingDocumentLineForBank.PostingLineId = postingLineId;
            accountingDocumentLineForBank.Narrative = cashInformation.Payee;
            accountingDocumentLineForBank.AccountingCategoryId = (int)AccountingCategory.N;

            if (cashInformation.MatchingCCY == null && (cashInformation.CashTypeId == (int)CashSelectionType.PaymentDifferentCurrency || cashInformation.CashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency))
            {
                // Use type Ledger in case of DifferentCurrency for the accounting document not in the cash currency
                accountingDocumentLineForBank.AccountLineTypeId = (int)AccountLineType.L;
                // And use the nominal account & cost type configured for the company
                accountingDocumentLineForBank.AccountReference = accountingSetup.FXRevalaccount;
                accountingDocumentLineForBank.CostTypeCode = accountingSetup.FXReval;
            }
            else
            {
                accountingDocumentLineForBank.AccountLineTypeId = (int)AccountLineType.B;
                accountingDocumentLineForBank.AccountReference = cashInformation.NominalAccount;
                accountingDocumentLineForBank.CostTypeCode = cashInformation.CostTypeCode;
            }

            decimal totalAmount = cashMatchingTotal.Value + (directionFactor * totalCostAmountForClient);

            accountingDocumentLineForBank.Amount = directionFactor * (-1) * totalAmount;
            decimal? bankLineAmount = accountingDocumentLineForBank.Amount;
            if (cashInformation.Currency != null && cashInformation.Currency.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                bankLineAmount = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, (decimal)bankLineAmount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
            }

            accountingDocumentLineForBank = await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForBank, bankLineAmount, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
            postingLineId++;
            accountingDocumentLines.Add(accountingDocumentLineForBank);

            return accountingDocumentLines;
        }

        private async Task<IEnumerable<AccountingDocumentLine>> CreateAccountingDocumentLineForCashPaidCashInAnotherCcy(int docTypeId, Company company, FxRateInformation fxRates, AccountingSetupDto accountingSetup, CashInformationDto cashInformation, CashInformationDto paidCashInformation)
        {
            List<AccountingDocumentLine> accountingDocumentLines = new List<AccountingDocumentLine>();

            int postingLineId = 1;

            // To make the accounting lines' sum equal to 0
            int directionFactor = CommonRules.CalculateDirectionFactorForClientLines(cashInformation);

            // Create the ledger line representing the payment in the cash effective currency
            AccountingDocumentLine accountingDocumentLineForPayment = new AccountingDocumentLine();
            accountingDocumentLineForPayment.AssociatedAccountCode = cashInformation.CounterpartyCode;
            accountingDocumentLineForPayment.ClientAccount = cashInformation.CounterpartyCode;
            accountingDocumentLineForPayment.ClientReference = null;
            accountingDocumentLineForPayment.PaymentTermCode = null;
            accountingDocumentLineForPayment.ContractSectionCode = null;
            accountingDocumentLineForPayment.VATTurnover = null;
            accountingDocumentLineForPayment.VATCode = null;
            accountingDocumentLineForPayment.CharterId = cashInformation.CharterId;
            accountingDocumentLineForPayment.DepartmentId = cashInformation.DepartmentId;

            accountingDocumentLineForPayment.CommodityId = null;
            accountingDocumentLineForPayment.Quantity = 0;
            accountingDocumentLineForPayment.SectionId = null;
            accountingDocumentLineForPayment.PostingLineId = postingLineId;
            accountingDocumentLineForPayment.Narrative = cashInformation.Payee;
            accountingDocumentLineForPayment.AccountingCategoryId = (int)AccountingCategory.N;
            accountingDocumentLineForPayment.AccountLineTypeId = (int)AccountLineType.L;
            accountingDocumentLineForPayment.ClientAccount = cashInformation.CounterpartyCode;

            // all the lines of this cash must have the reference of the "matching cash"
            accountingDocumentLineForPayment.SecondaryDocumentReference = paidCashInformation.CashDocRef;

            accountingDocumentLineForPayment.Amount = directionFactor * paidCashInformation.Amount;

            // Use the nominal account & cost type configured for the company
            accountingDocumentLineForPayment.AccountReference = accountingSetup.FXRevalaccount;
            accountingDocumentLineForPayment.CostTypeCode = accountingSetup.FXReval;

            var cashMatchingTotal = accountingDocumentLineForPayment.Amount;

            await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForPayment, cashMatchingTotal, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
            postingLineId++;

            accountingDocumentLines.Add(accountingDocumentLineForPayment);

            decimal totalCostAmountForClient = 0;

            // The cost, on a « L » line (one line per CostType) => sum (per costType) in cash currency
            if (paidCashInformation.AdditionalCosts != null && paidCashInformation.AdditionalCosts.Any())
            {
                foreach (var additionalCostsDto in paidCashInformation.AdditionalCosts.ToList())
                {
                    totalCostAmountForClient += additionalCostsDto.CostDirectionId == (int)CostDirectionType.Pay ? additionalCostsDto.Amount : -additionalCostsDto.Amount;

                    AccountingDocumentLine accountingDocumentLineForAdditionalCosts = new AccountingDocumentLine();

                    accountingDocumentLineForAdditionalCosts.PostingLineId = postingLineId;
                    accountingDocumentLineForAdditionalCosts.AccountLineTypeId = (int)AccountLineType.L;
                    accountingDocumentLineForAdditionalCosts.AccountReference = additionalCostsDto.AccountReference;
                    accountingDocumentLineForAdditionalCosts.CostTypeCode = additionalCostsDto.CostTypeCode;
                    accountingDocumentLineForAdditionalCosts.AssociatedAccountCode = null;
                    accountingDocumentLineForAdditionalCosts.DepartmentId = paidCashInformation.DepartmentId;
                    accountingDocumentLineForAdditionalCosts.Narrative = additionalCostsDto.Narrative;
                    accountingDocumentLineForAdditionalCosts.AccountingCategoryId = (int)AccountingCategory.N;
                    accountingDocumentLineForAdditionalCosts.ClientAccount = additionalCostsDto.ClientAccountCode;
                    accountingDocumentLineForAdditionalCosts.ClientAccountId = additionalCostsDto.ClientAccountId;
                    accountingDocumentLineForAdditionalCosts.CommodityId = null;
                    accountingDocumentLineForAdditionalCosts.ClientReference = null;
                    accountingDocumentLineForAdditionalCosts.CharterId = paidCashInformation.CharterId;
                    accountingDocumentLineForAdditionalCosts.SourceCostLineId = additionalCostsDto.CashAdditionalCostId;

                    // the sign of the accounting line representing the cost depends on the cost type (payable / receivable)
                    accountingDocumentLineForAdditionalCosts.Amount = Math.Round(
                            additionalCostsDto.CostDirectionId == (int)CostDirectionType.Pay
                        ? additionalCostsDto.Amount
                        : -additionalCostsDto.Amount, CommonRules.RoundDecimals);

                    // all the lines of this cash must have the reference of the "matching cash"
                    accountingDocumentLineForAdditionalCosts.SecondaryDocumentReference = paidCashInformation.CashDocRef;

                    decimal? additionalCostAmount = accountingDocumentLineForAdditionalCosts.Amount;

                    if (additionalCostsDto.CurrencyCode != null && additionalCostsDto.CurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                    {
                        additionalCostAmount = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, (decimal)additionalCostAmount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
                    }

                    accountingDocumentLineForAdditionalCosts = await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForAdditionalCosts, additionalCostAmount, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
                    postingLineId++;

                    accountingDocumentLines.Add(accountingDocumentLineForAdditionalCosts);
                }
            }

            // Bank Line for Cash Document
            AccountingDocumentLine accountingDocumentLineForBank = new AccountingDocumentLine();
            accountingDocumentLineForBank.CostTypeCode = cashInformation.CostTypeCode;
            accountingDocumentLineForBank.AssociatedAccountCode = cashInformation.CounterpartyCode;
            accountingDocumentLineForBank.ClientAccount = cashInformation.CounterpartyCode;
            accountingDocumentLineForBank.ClientReference = null;
            accountingDocumentLineForBank.PaymentTermCode = null;
            accountingDocumentLineForBank.ContractSectionCode = null;
            accountingDocumentLineForBank.VATTurnover = null;
            accountingDocumentLineForBank.VATCode = null;
            accountingDocumentLineForBank.CharterId = cashInformation.CharterId;
            accountingDocumentLineForBank.DepartmentId = cashInformation.DepartmentId;

            // all the lines of this cash must have the reference of the "matching cash"
            accountingDocumentLineForBank.SecondaryDocumentReference = paidCashInformation.CashDocRef;

            accountingDocumentLineForBank.CommodityId = null;
            accountingDocumentLineForBank.Quantity = 0;
            accountingDocumentLineForBank.SectionId = null;
            accountingDocumentLineForBank.PostingLineId = postingLineId;
            accountingDocumentLineForBank.Narrative = cashInformation.Payee;
            accountingDocumentLineForBank.AccountingCategoryId = (int)AccountingCategory.N;
            accountingDocumentLineForBank.AccountReference = cashInformation.NominalAccount;
            accountingDocumentLineForBank.AccountLineTypeId = (int)AccountLineType.B;

            accountingDocumentLineForBank.Amount = (-1) * (cashMatchingTotal + totalCostAmountForClient);
            decimal? bankLineAmount = accountingDocumentLineForBank.Amount;
            if (cashInformation.Currency != null && cashInformation.Currency.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                bankLineAmount = (await _foreignExchangeRateService.Convert(cashInformation.Currency, CommonRules.BaseCurrency, (decimal)bankLineAmount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
            }

            accountingDocumentLineForBank = await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForBank, bankLineAmount, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
            postingLineId++;
            accountingDocumentLines.Add(accountingDocumentLineForBank);

            return accountingDocumentLines;
        }

        private async Task<AccountingDocumentLine> CreateAccountingDocumentLineForSimpleCash(
            AccountingDocumentLineType accountingDocumentLineType, int docTypeId, CashInformationDto cashInformation,
            Company company, FxRateInformation fxRates, int postingLineId, AccountingSetupDto accountingSetup)
        {
            AccountingDocumentLine accountingDocumentLine = new AccountingDocumentLine();
            accountingDocumentLine.SecondaryDocumentReference = cashInformation.CounterpartyDocumentReference;
            accountingDocumentLine.CostTypeCode = cashInformation.CostTypeCode;
            accountingDocumentLine.AssociatedAccountCode = cashInformation.CounterpartyCode;
            accountingDocumentLine.ClientReference = null;
            accountingDocumentLine.PaymentTermCode = null;
            accountingDocumentLine.ContractSectionCode = null;
            accountingDocumentLine.VATTurnover = null;
            accountingDocumentLine.CommodityId = null;
            accountingDocumentLine.VATCode = null;
            accountingDocumentLine.CharterId = cashInformation.CharterId;
            accountingDocumentLine.DepartmentId = cashInformation.DepartmentId;
            accountingDocumentLine.Quantity = 0;
            accountingDocumentLine.SectionId = null;

            decimal totalCostAmountForClient = 0;
            if (cashInformation.AdditionalCosts != null && cashInformation.AdditionalCosts.Any())
            {
                foreach (var additionalCostsDto in cashInformation.AdditionalCosts.ToList())
                {
                    totalCostAmountForClient += additionalCostsDto.CostDirectionId == (int)CostDirectionType.Pay ? additionalCostsDto.Amount : -additionalCostsDto.Amount;
                }
            }

            switch (accountingDocumentLineType)
            {
                case AccountingDocumentLineType.Client:
                    // in the case of a simple cash, the cash contains one unique line
                    // with the amount corresponding to the amount exchanged with the customer
                    // Note that this amount is different from the value of Cash.Amount in the case of a
                    // Cash receipt (CI), as the costs are included in the client amount
                    //
                    // The calculation below duplicates the rule written in
                    // CreateCashCommandHandler.GenerateCashLineForSimpleCash for the calculation of the cash line
                    if (docTypeId == (int)DocumentType.CP)
                    {
                        accountingDocumentLine.Amount = cashInformation.Amount;
                    }
                    else
                    {
                        accountingDocumentLine.Amount = -(cashInformation.Amount + totalCostAmountForClient);
                    }

                    accountingDocumentLine.PostingLineId = postingLineId;
                    accountingDocumentLine.Narrative = cashInformation.Narrative;
                    accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.C;
                    accountingDocumentLine.AccountLineTypeId = docTypeId == (int)DocumentType.CP ? (int)AccountLineType.V : (int)AccountLineType.C;
                    accountingDocumentLine.AccountReference = accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.V ? accountingSetup.PurchaseLedgerControlClientCreditors : accountingSetup.SalesLedgerControlClientDebtors;
                    accountingDocumentLine.ClientAccount = cashInformation.CounterpartyCode;
                    break;
                case AccountingDocumentLineType.Nominal:
                    // Creation of the Bank accounting line
                    if (docTypeId == (int)DocumentType.CP)
                    {
                        accountingDocumentLine.Amount = -(cashInformation.Amount + totalCostAmountForClient);
                    }
                    else
                    {
                        // In the case of a CI (cash receipt), the costs are integrated in the client line
                        // => not to be integrated in the bank line
                        accountingDocumentLine.Amount = cashInformation.Amount;
                    }

                    accountingDocumentLine.PostingLineId = postingLineId;
                    accountingDocumentLine.Narrative = cashInformation.Payee;
                    accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
                    accountingDocumentLine.AccountReference = cashInformation.NominalAccount;
                    accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.B;
                    break;
                default:
                    throw new Exception("Unable to create document header and lines.");
            }

            accountingDocumentLine.Amount = Math.Round(accountingDocumentLine.Amount, CommonRules.RoundDecimals);

            decimal? amountInUSD = accountingDocumentLine.Amount;

            if (cashInformation.Currency != null && cashInformation.Currency.ToUpperInvariant() != "USD")
            {
                amountInUSD = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, accountingDocumentLine.Amount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
            }

            await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLine, amountInUSD, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);

            return accountingDocumentLine;
        }
    }
}
