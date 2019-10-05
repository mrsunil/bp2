using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FxTradeType = LDC.Atlas.Services.PreAccounting.Entities.FxTradeType;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class CreateAccountingDocumentCommandHandler
    {
        private async Task<AccountingDocument> CreateAccountingDocumentForFxDeal(bool postOpClosedPolicy, long docId, int docTypeId, AccountingSetupDto accountingSetup, Company company, string companyId, DateTime companyDate)
        {
            AccountingDocument accountingDocument = new AccountingDocument();
            FxSettlementDocumentDto fxSettlementDocument = null;
            FxRateInformation fxRates = null;
            fxSettlementDocument = await _accountingQueries.GetFxSettlementbyTransactionDocumentId(docId, company.CompanyId);

            if (fxSettlementDocument.FxSettlementDocumentTypeId == FxSettlementDocumentType.FxDeal)
            {
                fxRates = CommonRules.GetFxRateInformation(fxSettlementDocument.DocumentDate, fxSettlementDocument.CurrencyCode, company);
            }
            else
            {
                fxRates = CommonRules.GetFxRateInformation(fxSettlementDocument.DocumentDate, fxSettlementDocument.SettlementCurrencyCode, company);
            }

            if (fxSettlementDocument != null && fxRates.AreAllFilled())
            {
                accountingDocument = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPolicy, docId, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, null, null, null, null, null, null, null, null, fxSettlementDocument);

                accountingDocument.AccountingPeriod = CommonRules.CalculateAccountPeriod(accountingSetup, fxSettlementDocument.DocumentDate, postOpClosedPolicy);
                accountingDocument.AccrualNumber = CommonRules.IsLastMonthForOperationOpen(accountingSetup.LastMonthClosedForOperation, fxSettlementDocument.DocumentDate) ?
                    fxSettlementDocument.AccrualNumber :
                    null;
                accountingDocument.AccountingDate = accountingDocument.DocumentDate.Year == accountingDocument.AccountingPeriod.Year
                    && accountingDocument.DocumentDate.Month == accountingDocument.AccountingPeriod.Month ?
                    accountingDocument.DocumentDate :
                    new DateTime(accountingDocument.AccountingPeriod.Year, accountingDocument.AccountingPeriod.Month, 1);

                if (accountingDocument != null)
                {
                    accountingDocument.AccountingDocumentLines = await CreateAccountingDocumentLines(docTypeId, company, accountingSetup, fxRates, null, null, null, null, null, null, null, fxSettlementDocument);

                    accountingDocument.StatusId = await CommonRules.GetAccountingDocumentStatus(accountingSetup, _accountingQueries, accountingDocument, company.CompanyId, companyDate, null, null);
                }
            }

            return accountingDocument;
        }

        private async Task<AccountingDocumentLine> CreateAccountingDocumentLineForFJDocument(int docTypeId, int postingLineId, AccountingSetupDto accountingSetup, AccountLineType lineType, Company company, FxRateInformation fxRates, FxSettlementDocumentDto fxSettlementDocument)
        {
            AccountingDocumentLine accountingDocumentLine = new AccountingDocumentLine();

            accountingDocumentLine.PostingLineId = postingLineId;
            accountingDocumentLine.AssociatedAccountId = fxSettlementDocument.CounterpartyId;
            accountingDocumentLine.DepartmentId = fxSettlementDocument.DepartmentId;
            if (fxSettlementDocument.IsNdf)
            {
                accountingDocumentLine.Narrative = string.Concat(
                Convert.ToString(fxSettlementDocument.Reference),
                " ",
                fxSettlementDocument.Memorandum,
                " NDF ", ((DateTime)fxSettlementDocument.NdfAgreedDate).ToString("dd MMM yyyy"));
            }
            else
            {
                accountingDocumentLine.Narrative = string.Concat(
                Convert.ToString(fxSettlementDocument.Reference),
                " ",
                fxSettlementDocument.Memorandum);
            }
            accountingDocumentLine.AccountLineTypeId = (int)lineType;
            accountingDocumentLine.DepartmentId = fxSettlementDocument.DepartmentId;
            accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
            accountingDocumentLine.TransactionDocumentId = (int)DocumentType.FJ;
            accountingDocumentLine.CostTypeCode = accountingSetup.FXReval;
            accountingDocumentLine.SecondaryDocumentReference = fxSettlementDocument.DocumentReference;
            accountingDocumentLine.AssociatedAccountId = fxSettlementDocument.BrokerId;

            if (fxSettlementDocument.FxSettlementDocumentTypeId != FxSettlementDocumentType.FxDeal)
            {
                accountingDocumentLine.Amount = Math.Round(
                    CalculateFxDealAmountForSettlementCurrency(
                        fxSettlementDocument.Amount,
                        fxSettlementDocument.SpotRate,
                        fxSettlementDocument.FwPoints,
                        fxSettlementDocument.SpotRateType),
                    CommonRules.RoundDecimals);

                if (fxSettlementDocument.IsNdf)
                {
                    accountingDocumentLine.SecondaryDocumentReference = null;

                    decimal dealtAmount = fxSettlementDocument.Amount;

                    decimal settledAmount = accountingDocumentLine.Amount;

                    switch (lineType)
                    {
                        case AccountLineType.B:
                            if (fxSettlementDocument.DealDirectionId == (int)FxDealDirection.Buy)
                            {
                                settledAmount = -1 * settledAmount;
                            }
                            else
                            {
                                dealtAmount = -1 * dealtAmount;
                            }
                            break;
                        case AccountLineType.L:
                            if (fxSettlementDocument.DealDirectionId == (int)FxDealDirection.Buy)
                            {
                                dealtAmount = -1 * dealtAmount;
                            }
                            else
                            {
                                settledAmount = -1 * settledAmount;
                            }
                            break;
                        default:
                            throw new Exception("Unable to create document header and lines.");
                    }

                    if (fxSettlementDocument.CurrencyCode == "USD" && fxSettlementDocument.SettlementCurrencyCode != "USD")
                    {
                        FxRate fxRateUSD = await _masterDataService.GetFxRateAsync((DateTime)fxSettlementDocument.NdfAgreedDate, fxSettlementDocument.SettlementCurrencyCode);

                        if (fxRateUSD.CurrencyRoeType == "M")
                        {
                            accountingDocumentLine.Amount = fxSettlementDocument.NdfAgreedRate == null ? Math.Round((dealtAmount / (decimal)fxRateUSD.Rate) + settledAmount, CommonRules.RoundDecimals) : Math.Round((dealtAmount / (decimal)fxSettlementDocument.NdfAgreedRate) + settledAmount, CommonRules.RoundDecimals);
                        }
                        else
                        {
                            accountingDocumentLine.Amount = fxSettlementDocument.NdfAgreedRate == null ? Math.Round((dealtAmount * (decimal)fxRateUSD.Rate) + settledAmount, CommonRules.RoundDecimals) : Math.Round((dealtAmount * (decimal)fxSettlementDocument.NdfAgreedRate) + settledAmount, CommonRules.RoundDecimals);
                        }
                    }
                    else if (fxSettlementDocument.CurrencyCode != "USD" && fxSettlementDocument.SettlementCurrencyCode == "USD")
                    {
                        FxRate fxRateUSD = await _masterDataService.GetFxRateAsync((DateTime)fxSettlementDocument.NdfAgreedDate, fxSettlementDocument.CurrencyCode);

                        if (fxRateUSD.CurrencyRoeType == "D")
                        {
                            accountingDocumentLine.Amount = fxSettlementDocument.NdfAgreedRate == null ? Math.Round((dealtAmount / (decimal)fxRateUSD.Rate) + settledAmount, CommonRules.RoundDecimals) : Math.Round((dealtAmount / (decimal)fxSettlementDocument.NdfAgreedRate) + settledAmount, CommonRules.RoundDecimals);
                        }
                        else
                        {
                            accountingDocumentLine.Amount = fxSettlementDocument.NdfAgreedRate == null ? Math.Round((dealtAmount * (decimal)fxRateUSD.Rate) + settledAmount, CommonRules.RoundDecimals) : Math.Round((dealtAmount * (decimal)fxSettlementDocument.NdfAgreedRate) + settledAmount, CommonRules.RoundDecimals);
                        }
                    }
                    else if (fxSettlementDocument.CurrencyCode != "USD" && fxSettlementDocument.SettlementCurrencyCode != "USD")
                    {
                        FxRate fxRateUSD1 = await _masterDataService.GetFxRateAsync((DateTime)fxSettlementDocument.NdfAgreedDate, fxSettlementDocument.CurrencyCode);
                        FxRate fxRateUSD2 = await _masterDataService.GetFxRateAsync((DateTime)fxSettlementDocument.NdfAgreedDate, fxSettlementDocument.SettlementCurrencyCode);

                        decimal crossSettlementROESettCcy = 1;

                        if (fxSettlementDocument.NdfAgreedRate == null)
                        {
                            if (fxRateUSD1.CurrencyRoeType == "M" && fxRateUSD2.CurrencyRoeType == "M")
                            {
                                crossSettlementROESettCcy = (decimal)fxRateUSD1.Rate / (decimal)fxRateUSD2.Rate;
                            }
                            else if (fxRateUSD1.CurrencyRoeType == "M" && fxRateUSD2.CurrencyRoeType == "D")
                            {
                                crossSettlementROESettCcy = (decimal)fxRateUSD1.Rate * (decimal)fxRateUSD2.Rate;
                            }
                            else if (fxRateUSD1.CurrencyRoeType == "D" && fxRateUSD2.CurrencyRoeType == "M")
                            {
                                crossSettlementROESettCcy = (1 / (decimal)fxRateUSD1.Rate) / (decimal)fxRateUSD2.Rate;
                            }
                            else
                            {
                                crossSettlementROESettCcy = (decimal)fxRateUSD2.Rate / (decimal)fxRateUSD1.Rate;
                            }
                        }
                        else
                        {
                            crossSettlementROESettCcy = (decimal)fxSettlementDocument.NdfAgreedRate;
                        }

                        accountingDocumentLine.Amount = Math.Round((dealtAmount * crossSettlementROESettCcy) - settledAmount, CommonRules.RoundDecimals);
                    }
                    else
                    {
                        accountingDocumentLine.Amount = Math.Round(dealtAmount + settledAmount, CommonRules.RoundDecimals);
                    }
                }
            }
            else
            {
                accountingDocumentLine.Amount = Math.Round(fxSettlementDocument.Amount, CommonRules.RoundDecimals);
            }

            // Amount conversion for StaturoyCurrency and FunctionalCurrency
            decimal? amountInUSD = accountingDocumentLine.Amount;

            if (fxSettlementDocument.CurrencyCode != null && fxSettlementDocument.CurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                amountInUSD = (await _foreignExchangeRateService.Convert(fxSettlementDocument.CurrencyCode, CommonRules.BaseCurrency, accountingDocumentLine.Amount, fxSettlementDocument.DocumentDate)).ConvertedValue;
                if (amountInUSD != null)
                {
                    amountInUSD = Math.Round((decimal)amountInUSD, CommonRules.RoundDecimals);
                }
            }

            accountingDocumentLine.StatutoryCurrency = amountInUSD;
            accountingDocumentLine.FunctionalCurrency = amountInUSD;

            if (company.StatutoryCurrencyCode != null && amountInUSD != null && company.StatutoryCurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                accountingDocumentLine.StatutoryCurrency = (await _foreignExchangeRateService.Convert(CommonRules.BaseCurrency, company.StatutoryCurrencyCode, (decimal)amountInUSD, fxSettlementDocument.DocumentDate)).ConvertedValue;
            }

            if (company.FunctionalCurrencyCode != null && amountInUSD != null && company.FunctionalCurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
            {
                accountingDocumentLine.FunctionalCurrency = (await _foreignExchangeRateService.Convert(CommonRules.BaseCurrency, company.FunctionalCurrencyCode, (decimal)amountInUSD, fxSettlementDocument.DocumentDate)).ConvertedValue;
            }

            // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
            if (accountingDocumentLine.StatutoryCurrency != null)
            {
                accountingDocumentLine.StatutoryCurrency = Math.Round((decimal)accountingDocumentLine.StatutoryCurrency, CommonRules.RoundDecimals, MidpointRounding.AwayFromZero);
            }

            if (accountingDocumentLine.FunctionalCurrency != null)
            {
                accountingDocumentLine.FunctionalCurrency = Math.Round((decimal)accountingDocumentLine.FunctionalCurrency, CommonRules.RoundDecimals, MidpointRounding.AwayFromZero);
            }

            accountingDocumentLine.AccountReference = await GetAccountReferenceForFJDocument(
            lineType,
            company,
            fxSettlementDocument);

            if (!fxSettlementDocument.IsNdf)
            {
                switch (lineType)
                {
                    case AccountLineType.B:
                        if (fxSettlementDocument.DealDirectionId == (int)FxDealDirection.Buy)
                        {
                            if (fxSettlementDocument.FxSettlementDocumentTypeId == FxSettlementDocumentType.FxDeal)
                            {
                                accountingDocumentLine.Amount = accountingDocumentLine.Amount;
                            }
                            else
                            {
                                accountingDocumentLine.Amount = (-1) * accountingDocumentLine.Amount;
                            }
                        }
                        else
                        {
                            if (fxSettlementDocument.FxSettlementDocumentTypeId == FxSettlementDocumentType.FxDeal)
                            {
                                accountingDocumentLine.Amount = (-1) * accountingDocumentLine.Amount;
                            }
                            else
                            {
                                accountingDocumentLine.Amount = accountingDocumentLine.Amount;
                            }
                        }

                        break;
                    case AccountLineType.L:
                        if (fxSettlementDocument.DealDirectionId == (int)FxDealDirection.Buy)
                        {
                            if (fxSettlementDocument.FxSettlementDocumentTypeId == FxSettlementDocumentType.FxDeal)
                            {
                                accountingDocumentLine.Amount = (-1) * accountingDocumentLine.Amount;
                            }
                            else
                            {
                                accountingDocumentLine.Amount = accountingDocumentLine.Amount;
                            }
                        }
                        else
                        {
                            if (fxSettlementDocument.FxSettlementDocumentTypeId == FxSettlementDocumentType.FxDeal)
                            {
                                accountingDocumentLine.Amount = accountingDocumentLine.Amount;
                            }
                            else
                            {
                                accountingDocumentLine.Amount = (-1) * accountingDocumentLine.Amount;
                            }
                        }

                        break;
                    default:
                        throw new Exception("Unable to create document header and lines.");
                }
            }

            return accountingDocumentLine;
        }

        private async Task<string> GetAccountReferenceForFJDocument(
            AccountLineType lineType,
            Company company,
            FxSettlementDocumentDto fxSettlementDocument)
        {
            string nominalAccountForAccountReference = string.Empty;
            NominalAccount nominalAccount = null;

            switch (lineType)
            {
                case AccountLineType.B:
                    nominalAccount = fxSettlementDocument.FxSettlementDocumentTypeId == FxSettlementDocumentType.FxDeal ?
                        await _masterDataService.GetNominalAccountsById(fxSettlementDocument.NominalAccountId, company.CompanyId) :
                        await _masterDataService.GetNominalAccountsById(fxSettlementDocument.SettlementNominalAccountId, company.CompanyId);

                    nominalAccountForAccountReference = nominalAccount.NominalAccountNumber;
                    break;
                case AccountLineType.L:
                    var dealthAmount = (await _foreignExchangeRateService.Convert(
                               CommonRules.BaseCurrency,
                               fxSettlementDocument.CurrencyCode,
                               fxSettlementDocument.Amount,
                               fxSettlementDocument.DocumentDate)).ConvertedValue;
                    var settlementAmount = (await _foreignExchangeRateService.Convert(
                        CommonRules.BaseCurrency,
                        fxSettlementDocument.SettlementCurrencyCode,
                        CalculateFxDealAmountForSettlementCurrency(
                            fxSettlementDocument.Amount,
                            fxSettlementDocument.SpotRate,
                            fxSettlementDocument.FwPoints,
                            fxSettlementDocument.SpotRateType),
                        fxSettlementDocument.DocumentDate)).ConvertedValue;

                    switch (fxSettlementDocument.DealDirectionId)
                    {
                        case (int)FxDealDirection.Buy:
                            if (dealthAmount < settlementAmount)
                            {
                                // pick the config for FX settlement Loss
                                nominalAccount = await _masterDataService.GetNominalAccountsById(company.SettlementLossNominalId, company.CompanyId);
                            }
                            else
                            {
                                // pick the config for FX settlement Gain
                                nominalAccount = await _masterDataService.GetNominalAccountsById(company.SettlementGainNominalId, company.CompanyId);
                            }

                            nominalAccountForAccountReference = nominalAccount.NominalAccountNumber;

                            break;
                        case (int)FxDealDirection.Sell:
                            if (dealthAmount > settlementAmount)
                            {
                                // pick the config for FX settlement Loss
                                nominalAccount = await _masterDataService.GetNominalAccountsById(company.SettlementLossNominalId, company.CompanyId);
                            }
                            else
                            {
                                // pick the config for FX settlement Gain
                                nominalAccount = await _masterDataService.GetNominalAccountsById(company.SettlementGainNominalId, company.CompanyId);
                            }

                            nominalAccountForAccountReference = nominalAccount.NominalAccountNumber;
                            break;
                    }

                    break;
            }

            return nominalAccountForAccountReference;
        }

        private decimal CalculateFxDealAmountForSettlementCurrency(decimal amount, decimal spotRate, decimal fwPoints, string spotRateType)
        {
            decimal calculatedAmount = 0;
            switch (spotRateType)
            {
                case "M":
                    calculatedAmount = amount * (spotRate + fwPoints);
                    break;
                case "D":
                    calculatedAmount = amount / (spotRate + fwPoints);
                    break;
            }

            return calculatedAmount;
        }

        private async Task UpdateFxDealInformation(long companyId, long docId, long accountingDocumentId, string company)
        {
            FxSettlementDocumentDto fxSettlementDocument = null;

            _unitOfWork.BeginTransaction();
            try
            {
                fxSettlementDocument = await _accountingQueries.GetFxSettlementbyTransactionDocumentId(docId, company);

                await _accountingDocumentRepository.CreateAccountingDocumentFxSettlement(
                    accountingDocumentId,
                    company,
                    string.Concat(fxSettlementDocument.CurrencyCode, "_", fxSettlementDocument.SettlementCurrencyCode),
                    fxSettlementDocument.Reference);
                _unitOfWork.Commit();
            }
            catch (Exception ex)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
