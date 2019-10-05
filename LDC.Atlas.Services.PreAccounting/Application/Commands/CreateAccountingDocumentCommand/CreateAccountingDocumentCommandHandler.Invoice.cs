using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class CreateAccountingDocumentCommandHandler
    {
        private async Task<AccountingDocument> GetInformationForInvoice(bool postOpClosedPrivilege, long docId, int docTypeId, AccountingSetupDto accountingSetup, Company company, string companyId, DateTime companyDate)
        {
            AccountingDocument accountingDocument;
            InvoiceInformationDto invoiceInformation;
            BusinessSectorDto businessSectorInfo;
            IEnumerable<SectionsInformationDto> sectionsInformation;

            IEnumerable<Vat> vat = null;

            invoiceInformation = await _accountingQueries.GetInvoiceInformationForAccountingDocument(docId, company.CompanyId);

            if (invoiceInformation != null)
            {
                if (invoiceInformation.BusinessSectorNominalPostingPurpose == true)
                {
                    var businessSectorCode = invoiceInformation.InvoiceLines.FirstOrDefault().BusinessSectorCode;
                    if (businessSectorCode != null)
                    {
                        businessSectorInfo = await _accountingQueries.GetAccountNumberbyBusinessSectorId(company.CompanyId, businessSectorCode);
                        if (businessSectorInfo != null)
                        {
                            invoiceInformation.CostTypeCode = businessSectorInfo.CostTypeCode;
                            invoiceInformation.AccountReference = businessSectorInfo.AccountNumber;
                        }
                    }
                }

                sectionsInformation = await _accountingQueries.GetSectionsInformationForAccountingDocument(companyId, invoiceInformation.InvoiceId);

                var vatCodes = invoiceInformation.InvoiceLines.Select(x => x.VATCode).Distinct();

                if (sectionsInformation != null && sectionsInformation.Any())
                {
                    vat = await _masterDataService.GetVat(vatCodes, companyId);

                    var blDateList = sectionsInformation.Where(section => section.BLDate != null).ToList();

                    DateTime? blDate = null;

                    if (blDateList.Count > 0)
                    {
                        blDate = blDateList.OrderByDescending(x => x.BLDate).FirstOrDefault().BLDate.Value;

                        if (blDate == null)
                        {
                            blDate = invoiceInformation.InvoiceDate;
                        }
                    }
                    else
                    {
                        blDate = invoiceInformation.InvoiceDate;
                    }

                    var fxRates = CommonRules.GetFxRateInformation((DateTime)blDate, invoiceInformation.Currency, company);

                    if (accountingSetup != null && fxRates.AreAllFilled() && company != null && vat != null)
                    {
                        accountingDocument = await CommonRules.CreateAccountingDocument(_masterDataService, _identityService.GetUserAtlasId(), postOpClosedPrivilege, docId, docTypeId, CommonRules.BaseCurrency, fxRates.FxRateInvoiceCurrency, accountingSetup, invoiceInformation, null, blDate);

                        if (accountingDocument != null)
                        {
                            accountingDocument.AccountingDocumentLines = await CreateAccountingDocumentLines(docTypeId, company, accountingSetup, fxRates, vat, invoiceInformation, sectionsInformation);

                            CommonRules.PostingLineIdOrder(accountingDocument.AccountingDocumentLines);

                            accountingDocument.StatusId = await CommonRules.GetAccountingDocumentStatus(accountingSetup, _accountingQueries, accountingDocument, company.CompanyId, companyDate, invoiceInformation);

                            _logger.LogInformation("Doc with id {Atlas_DocId}.", docId);
                        }
                        else
                        {
                            throw new Exception("Unable to create document header and lines");
                        }
                    }
                    else
                    {
                        throw new Exception("Unable to create document header and lines. Insufficient Information");
                    }
                }
                else
                {
                    throw new Exception("Unable to create document header and lines. There is no section information available.");
                }
            }
            else
            {
                throw new Exception("Unable to create document header and lines. There is no invoice information available.");
            }

            return accountingDocument;
        }

        private async Task<AccountingDocumentLine> CreateAccountingDocumentLineForInvoice(
            AccountingDocumentLineType accountingDocumentLineType, InvoiceInformationDto invoiceInformation,
            IEnumerable<SectionsInformationDto> sectionsInformation, IEnumerable<Vat> vats, Company company,
            AccountingSetupDto accountingSetup, FxRateInformation fxRates, int postingLineId, int index = 0,
            List<AccountingDocumentLine> accountingDocumentLines = null)
        {
            string whiteSpace = " ";
            InvoiceFunction invoiceFunction = CommonRules.CheckInvoiceType(invoiceInformation.InvoiceType);

            AccountingDocumentLine accountingDocumentLine = new AccountingDocumentLine();

            SectionsInformationDto latestSectionsInformation = sectionsInformation.OrderByDescending(x => x.BLDate).FirstOrDefault();
            accountingDocumentLine.AssociatedAccountCode = invoiceInformation.CounterpartyCode;
            accountingDocumentLine.ClientReference = invoiceInformation.ExternalReference;
            accountingDocumentLine.PaymentTermCode = invoiceInformation.PaymentTerms;
            if (invoiceFunction == InvoiceFunction.Commercial)
            {
                if (invoiceInformation.CostTypeCode != null)
                {
                    accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                }
                else
                {
                    accountingDocumentLine.CostTypeCode = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? accountingSetup.PurchaseInvoice : accountingSetup.SalesInvoice;
                }

                accountingDocumentLine.Narrative = string.Concat(latestSectionsInformation.ContractSectionCode, whiteSpace, latestSectionsInformation.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
            }
            else if (invoiceFunction == InvoiceFunction.GoodsAndCost)
            {
                if (invoiceInformation.CostTypeCode != null)
                {
                    accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                }
                else
                {
                    accountingDocumentLine.CostTypeCode = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.GoodsCostPurchase ? accountingSetup.PurchaseInvoice : accountingSetup.SalesInvoice;
                }

                accountingDocumentLine.Narrative = string.Concat(latestSectionsInformation.ContractSectionCode, whiteSpace, latestSectionsInformation.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
            }
            else if (invoiceFunction == InvoiceFunction.Cost)
            {
                accountingDocumentLine.Narrative = string.Concat(latestSectionsInformation.ContractSectionCode, whiteSpace, latestSectionsInformation.CharterReference, whiteSpace, invoiceInformation.InvoiceLines.ToList()[index].CostType);
                accountingDocumentLine.CostTypeCode = invoiceInformation.InvoiceLines.ToList()[index].CostType;
            }
            else if (invoiceFunction == InvoiceFunction.Washout)
            {
                if (invoiceInformation.InvoiceLines.ToList()[index].CostDirectionId != null)
                {
                    accountingDocumentLine.CostTypeCode = invoiceInformation.InvoiceLines.ToList()[index].CostType;
                }
                else
                {
                    int purchaseIndex = index % 2 == 0 ? index + 1 : index - 1;
                    var saleLines = invoiceInformation.InvoiceLines.ToList()[index];
                    var purchaseLines = invoiceInformation.InvoiceLines.ToList()[purchaseIndex];
                    accountingDocumentLine.CostTypeCode = saleLines.InvoiceLineAmount > purchaseLines.InvoiceLineAmount ? accountingSetup.WashoutInvoiceGains : accountingSetup.WashoutInvoiceLoss;
                }

                accountingDocumentLine.Narrative = string.Concat(latestSectionsInformation.ContractSectionCode, whiteSpace, latestSectionsInformation.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
            }
            else if (invoiceFunction == InvoiceFunction.Cancelled)
            {
                accountingDocumentLine.CostTypeCode = invoiceInformation.TransactionDocumentTypeId == (int)MasterDocumentType.CN ? accountingSetup.CancellationLoss : accountingSetup.CancellationGain;

                accountingDocumentLine.Narrative = invoiceInformation.ExternalReference;
            }

            switch (accountingDocumentLineType)
            {
                case AccountingDocumentLineType.Client:
                    accountingDocumentLine.PostingLineId = postingLineId;
                    accountingDocumentLine.ContractSectionCode = latestSectionsInformation.ContractSectionCode;
                    accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.C;
                    accountingDocumentLine.VATTurnover = null;
                    accountingDocumentLine.VATCode = null;
                    accountingDocumentLine.AccountReference = (invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase || invoiceInformation.InvoiceType == (int)Entities.InvoiceType.GoodsCostPurchase) ? accountingSetup.PurchaseLedgerControlClientCreditors : accountingSetup.SalesLedgerControlClientDebtors;
                    accountingDocumentLine.CommodityId = latestSectionsInformation.CommodityId;
                    accountingDocumentLine.CharterId = latestSectionsInformation.CharterId;
                    accountingDocumentLine.DepartmentId = latestSectionsInformation.DepartmentId;
                    accountingDocumentLine.SectionId = latestSectionsInformation.SectionId;
                    accountingDocumentLine.SecondaryDocumentReference = null;
                    accountingDocumentLine.ClientAccount = invoiceInformation.CounterpartyCode;
                    if (invoiceFunction == InvoiceFunction.Commercial)
                    {
                        // The quantity of the client line should be the Sum of quantities of Nominal Legs
                        accountingDocumentLine.Quantity = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(x => x.Quantity).Sum();
                        accountingDocumentLine.AccountLineTypeId = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? (int)AccountLineType.V : (int)AccountLineType.C;
                        decimal totalTaxAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.T).Select(y => y.Amount).Sum();
                        accountingDocumentLine.Amount = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? -(invoiceInformation.SumOfInvoiceTotalAmount + totalTaxAmount) : invoiceInformation.SumOfInvoiceTotalAmount - totalTaxAmount;

                        // Binding the cost type associated with business sector if business sector posting is configured
                        if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.CostTypeCode != null)
                        {
                            accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                        }
                    }
                    else if (invoiceFunction == InvoiceFunction.Cost)
                    {
                        decimal totalNominalAmount = 0;
                        foreach (InvoiceLinesDto invoiceLineNominalClient in invoiceInformation.InvoiceLines)
                        {
                            totalNominalAmount += invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CostCredit || invoiceLineNominalClient.CostDirectionId == (int)Entities.CostDirectionType.Pay ? invoiceLineNominalClient.InvoiceLineAmount : -invoiceLineNominalClient.InvoiceLineAmount;
                        }
                        decimal totalTaxAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.T).Select(y => y.Amount).Sum();
                        accountingDocumentLine.Amount = totalNominalAmount >= 0 ? -invoiceInformation.SumOfInvoiceTotalAmount : invoiceInformation.SumOfInvoiceTotalAmount;
                        accountingDocumentLine.Amount = accountingDocumentLine.Amount - totalTaxAmount;
                        accountingDocumentLine.AccountLineTypeId = invoiceInformation.InvoiceSourceType == (int)InvoiceSourceType.External ? (int)AccountLineType.V : (int)AccountLineType.C;
                        accountingDocumentLine.CostTypeCode = invoiceInformation.InvoiceLines.FirstOrDefault(line => line.InvoiceLineAmount == invoiceInformation.InvoiceLines.Max(max => max.InvoiceLineAmount)).CostType;
                        accountingDocumentLine.Narrative = string.Concat(latestSectionsInformation.ContractSectionCode, whiteSpace, latestSectionsInformation.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
                        accountingDocumentLine.AccountReference = invoiceInformation.InvoiceSourceType == (int)InvoiceSourceType.External ? accountingSetup.PurchaseLedgerControlClientCreditors : accountingSetup.SalesLedgerControlClientDebtors;
                        accountingDocumentLine.Quantity = 0;
                    }
                    else if (invoiceFunction == InvoiceFunction.Washout)
                    {
                        // [WASHOUT_E6] Well, this works only if the washout has only one match (ie only one purchase invoice, one sales invoice...), which is the case
                        // for E6 but which is not true for after e6...
                        InvoiceLinesDto invoiceLinePurchase = invoiceInformation.InvoiceLines.OrderBy(x => Math.Abs(x.InvoiceLineAmount)).FirstOrDefault(x => x.Type == (int)Entities.ContractType.CommercialPurchase);
                        InvoiceLinesDto invoiceLineSale = invoiceInformation.InvoiceLines.FirstOrDefault(x => x.Type == (int)Entities.ContractType.CommercialSale);
                        decimal totalNominalAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(y => y.Amount).Sum();
                        decimal totalTaxAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.T).Select(y => y.Amount).Sum();
                        accountingDocumentLine.ContractSectionCode = invoiceLinePurchase.PhysicalContractCode;
                        accountingDocumentLine.Quantity = invoiceInformation.InvoiceLines.Where(x => x.Type == (int)Entities.ContractType.CommercialPurchase).Select(x => x.Quantity).Sum();
                        accountingDocumentLine.Amount = -(totalNominalAmount + totalTaxAmount);
                        //--change done as part of PBI-22258
                        accountingDocumentLine.AccountLineTypeId = invoiceInformation.InvoiceSourceType == (int)InvoiceSourceType.Inhouse ? (int)AccountLineType.C : (int)AccountLineType.V;
                        accountingDocumentLine.AccountReference = accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.C ? accountingSetup.SalesLedgerControlClientDebtors : accountingSetup.PurchaseLedgerControlClientCreditors;
                        accountingDocumentLine.SectionId = invoiceLinePurchase.SectionId;
                        accountingDocumentLine.CostTypeCode = totalNominalAmount < 0 ? accountingSetup.WashoutInvoiceGains : accountingSetup.WashoutInvoiceLoss;

                    }
                    else if (invoiceFunction == InvoiceFunction.Cancelled)
                    {
                        InvoiceLinesDto invoiceLine = invoiceInformation.InvoiceLines.FirstOrDefault();

                        decimal totalNominalAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(y => y.Amount).Sum();
                        decimal totalTaxAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.T).Select(y => y.Amount).Sum();
                        accountingDocumentLine.ContractSectionCode = invoiceLine.PhysicalContractCode;
                        accountingDocumentLine.Quantity = invoiceLine.Quantity;
                        accountingDocumentLine.Amount = -(totalNominalAmount + totalTaxAmount);
                        accountingDocumentLine.AccountLineTypeId = invoiceInformation.InvoiceSourceType == (int)InvoiceSourceType.Inhouse ? (int)AccountLineType.C : (int)AccountLineType.V;
                        accountingDocumentLine.AccountReference = accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.C ? accountingSetup.SalesLedgerControlClientDebtors : accountingSetup.PurchaseLedgerControlClientCreditors;
                        accountingDocumentLine.SectionId = invoiceLine.SectionId;
                    }
                    else if (invoiceFunction == InvoiceFunction.GoodsAndCost)
                    {
                        var invoiceLinesGoods = invoiceInformation.InvoiceLines.FirstOrDefault(x => x.Type == (int)Entities.ContractType.CommercialPurchase || x.Type == (int)Entities.ContractType.CommercialSale);
                        var invoiceLineCosts = invoiceInformation.InvoiceLines.Where(x => x.CostDirectionId == (int)Entities.CostDirectionType.Pay || x.CostDirectionId == (int)Entities.CostDirectionType.Receive);
                        decimal totalNominalAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(y => y.Amount).Sum();
                        decimal totalTaxAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.T).Select(y => y.Amount).Sum();
                        accountingDocumentLine.Quantity = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(x => x.Quantity).Sum();
                        accountingDocumentLine.Amount = -(totalNominalAmount + totalTaxAmount);
                        accountingDocumentLine.ContractSectionCode = latestSectionsInformation.ContractSectionCode;
                        accountingDocumentLine.SectionId = latestSectionsInformation.SectionId;

                        if (invoiceLinesGoods != null)
                        {
                            accountingDocumentLine.AccountLineTypeId = invoiceLinesGoods.Type == (int)Entities.ContractType.CommercialPurchase ? (int)AccountLineType.V : (int)AccountLineType.C;
                            if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.CostTypeCode != null)
                            {
                                accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                            }
                        }
                        else if (invoiceLineCosts != null)
                        {
                            accountingDocumentLine.AccountLineTypeId = invoiceInformation.InvoiceSourceType == (int)InvoiceSourceType.External ? (int)AccountLineType.V : (int)AccountLineType.C;
                            if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.CostTypeCode != null)
                            {
                                accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                            }
                            else
                            {
                                accountingDocumentLine.CostTypeCode = invoiceLineCosts.FirstOrDefault(line => line.InvoiceLineAmount == invoiceLineCosts.Max(max => max.InvoiceLineAmount)).CostType;
                            }
                        }
                    }

                    break;
                case AccountingDocumentLineType.Tax:
                    Vat vat = vats.ToList()[index];
                    decimal totalInvoiceAmount = invoiceInformation.InvoiceLines.Where(invoiceLine => invoiceLine.VATCode == vat.VatCode).Select(x => x.InvoiceTotalAmount).Sum();
                    decimal totalQuantity = invoiceInformation.InvoiceLines.Where(invoiceLine => invoiceLine.VATCode == vat.VatCode).Select(x => x.Quantity).Sum();
                    accountingDocumentLine.PostingLineId = postingLineId;
                    accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.T;
                    accountingDocumentLine.VATTurnover = Math.Abs(accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(y => y.Amount).Sum());
                    accountingDocumentLine.AccountReference = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? vat.InputAccount.Trim() : vat.OutputAccount.Trim();
                    accountingDocumentLine.VATCode = vat.VatCode;
                    accountingDocumentLine.CommodityId = latestSectionsInformation.CommodityId;
                    accountingDocumentLine.CharterId = latestSectionsInformation.CharterId;
                    accountingDocumentLine.DepartmentId = latestSectionsInformation.DepartmentId;
                    accountingDocumentLine.ContractSectionCode = latestSectionsInformation.ContractSectionCode;
                    accountingDocumentLine.SectionId = latestSectionsInformation.SectionId;
                    accountingDocumentLine.SecondaryDocumentReference = null;
                    accountingDocumentLine.ClientAccount = null;
                    if (invoiceFunction == InvoiceFunction.Commercial)
                    {
                        accountingDocumentLine.Quantity = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? totalQuantity : -totalQuantity;
                        accountingDocumentLine.Amount = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? totalInvoiceAmount : -totalInvoiceAmount;
                        accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                        if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.CostTypeCode != null)
                        {
                            accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                        }
                    }
                    else if (invoiceFunction == InvoiceFunction.Cost)
                    {
                        accountingDocumentLine.Quantity = 0;
                        accountingDocumentLine.AccountReference = totalInvoiceAmount >= 0 ? vat.InputAccount.Trim() : vat.OutputAccount.Trim();
                        accountingDocumentLine.Amount = totalInvoiceAmount;
                        accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                        accountingDocumentLine.CostTypeCode = invoiceInformation.InvoiceLines.FirstOrDefault(line => line.InvoiceLineAmount == invoiceInformation.InvoiceLines.Max(max => max.InvoiceLineAmount)).CostType;
                        accountingDocumentLine.Narrative = string.Concat(latestSectionsInformation.ContractSectionCode, whiteSpace, latestSectionsInformation.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
                    }
                    else if (invoiceFunction == InvoiceFunction.Washout)
                    {
                        InvoiceLinesDto invoiceLinePurchase = invoiceInformation.InvoiceLines.OrderBy(x => Math.Abs(x.InvoiceLineAmount)).FirstOrDefault(x => x.Type == (int)Entities.ContractType.CommercialPurchase);
                        InvoiceLinesDto invoiceLineSale = invoiceInformation.InvoiceLines.FirstOrDefault(x => x.Type == (int)Entities.ContractType.CommercialSale);

                        accountingDocumentLine.AccountReference = totalInvoiceAmount >= 0 ? vat.InputAccount.Trim() : vat.OutputAccount.Trim();
                        accountingDocumentLine.ContractSectionCode = invoiceLinePurchase.PhysicalContractCode;
                        accountingDocumentLine.Quantity = invoiceInformation.InvoiceLines.Where(x => x.Type == (int)Entities.ContractType.CommercialPurchase).Select(x=>x.Quantity).Sum();
                        accountingDocumentLine.Amount = totalInvoiceAmount;
                        accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                        accountingDocumentLine.SectionId = invoiceLinePurchase.SectionId;
                        accountingDocumentLine.SectionId = invoiceLinePurchase.SectionId;
                        decimal totalNominalAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(y => y.Amount).Sum();
                        decimal totalTaxAmount = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.T).Select(y => y.Amount).Sum();
                        accountingDocumentLine.CostTypeCode = totalNominalAmount < 0 ? accountingSetup.WashoutInvoiceGains : accountingSetup.WashoutInvoiceLoss;
                    }
                    else if (invoiceFunction == InvoiceFunction.Cancelled)
                    {
                        InvoiceLinesDto invoiceLine = invoiceInformation.InvoiceLines.FirstOrDefault();

                        accountingDocumentLine.AccountReference = totalInvoiceAmount >= 0 ? vat.InputAccount.Trim() : vat.OutputAccount.Trim();
                        accountingDocumentLine.ContractSectionCode = invoiceLine.PhysicalContractCode;
                        accountingDocumentLine.Quantity = invoiceLine.Quantity;
                        accountingDocumentLine.Amount = 0;
                        accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                        accountingDocumentLine.SectionId = invoiceLine.SectionId;
                    }
                    else if (invoiceFunction == InvoiceFunction.GoodsAndCost)
                    {
                        accountingDocumentLine.Quantity = accountingDocumentLines.Where(x => x.AccountingCategoryId == (int)AccountingCategory.N).Select(x => x.Quantity).Sum();
                        accountingDocumentLine.Amount = totalInvoiceAmount;
                        if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.CostTypeCode != null)
                        {
                            accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                        }

                        accountingDocumentLine.AccountReference = totalInvoiceAmount >= 0 ? vat.InputAccount.Trim() : vat.OutputAccount.Trim();
                        accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                        accountingDocumentLine.ContractSectionCode = latestSectionsInformation.ContractSectionCode;
                        accountingDocumentLine.SectionId = latestSectionsInformation.SectionId;
                    }

                    break;
                case AccountingDocumentLineType.Nominal:
                    long sectionId = invoiceInformation.InvoiceLines.ToList()[index].SectionId;
                    InvoiceLinesDto invoiceLineNominal = invoiceInformation.InvoiceLines.ToList()[index];
                    SectionsInformationDto sectionInfo = sectionsInformation.FirstOrDefault(section => section.SectionId == sectionId);
                    decimal invoiceLineAmount = invoiceInformation.InvoiceLines.ToList()[index].InvoiceLineAmount;
                    accountingDocumentLine.PostingLineId = postingLineId;
                    accountingDocumentLine.ContractSectionCode = sectionInfo.ContractSectionCode;
                    accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
                    accountingDocumentLine.VATTurnover = null;
                    accountingDocumentLine.CommodityId = sectionInfo.CommodityId;
                    accountingDocumentLine.VATCode = invoiceInformation.InvoiceLines.ToList()[index].VATCode;
                    accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                    accountingDocumentLine.CharterId = sectionInfo.CharterId;
                    accountingDocumentLine.DepartmentId = sectionInfo.DepartmentId;
                    accountingDocumentLine.SectionId = sectionInfo.SectionId;
                    accountingDocumentLine.ClientAccount = null;
                    accountingDocumentLine.SourceInvoiceLineId = invoiceLineNominal.InvoiceLineId;
                    if (invoiceFunction == InvoiceFunction.Commercial)
                    {
                        if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.AccountReference != null && invoiceInformation.CostTypeCode != null)
                        {
                            accountingDocumentLine.AccountReference = invoiceInformation.AccountReference;
                            accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                        }
                        else
                        {
                            accountingDocumentLine.AccountReference = accountingSetup.NominalCostTypeInfo.Where(x => x.CostTypeCode == accountingDocumentLine.CostTypeCode).FirstOrDefault().NominalAccountCode;
                        }

                        accountingDocumentLine.Quantity = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? invoiceInformation.InvoiceLines.ToList()[index].Quantity : -invoiceInformation.InvoiceLines.ToList()[index].Quantity;
                        accountingDocumentLine.Amount = invoiceInformation.InvoiceType == (int)Entities.InvoiceType.CommercialPurchase ? invoiceLineAmount : -invoiceLineAmount;
                        if (invoiceLineNominal.CostDirectionId != null)
                        {
                            accountingDocumentLine.Amount = invoiceLineNominal.CostDirectionId == (int)Entities.CostDirectionType.Pay ? invoiceLineAmount : -invoiceLineAmount;
                        }
                        accountingDocumentLine.Narrative = string.Concat(sectionInfo.ContractSectionCode, whiteSpace, sectionInfo.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
                    }
                    else if (invoiceFunction == InvoiceFunction.Cost)
                    {
                        accountingDocumentLine.AccountReference = invoiceInformation.InvoiceLines.ToList()[index].NominalAccount;
                        accountingDocumentLine.Quantity = 0;
                        accountingDocumentLine.Amount = invoiceLineNominal.CostDirectionId == (int)Entities.CostDirectionType.Pay ? invoiceLineAmount : -invoiceLineAmount;
                        accountingDocumentLine.Narrative = string.Concat(sectionInfo.ContractSectionCode, whiteSpace, sectionInfo.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
                    }
                    else if (invoiceFunction == InvoiceFunction.Washout)
                    {
                        if (invoiceInformation.InvoiceLines.ToList()[index].CostDirectionId != null)
                        {
                            accountingDocumentLine.AccountReference = invoiceInformation.InvoiceLines.ToList()[index].NominalAccount;
                        }
                        else
                        {
                            accountingDocumentLine.AccountReference = accountingSetup.NominalCostTypeInfo.Where(x => x.CostTypeCode == accountingDocumentLine.CostTypeCode).FirstOrDefault().NominalAccountCode;
                        }

                        accountingDocumentLine.Narrative = string.Concat(sectionInfo.ContractSectionCode, whiteSpace, sectionInfo.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);

                        accountingDocumentLine.Quantity = invoiceLineNominal.Quantity;

                        if (invoiceLineNominal.CostDirectionId != null)
                        {
                            accountingDocumentLine.Amount = invoiceLineNominal.CostDirectionId == (int)Entities.CostDirectionType.Pay ? invoiceLineAmount : -invoiceLineAmount;
                        }
                        else
                        {
                            int purchaseIndex = index % 2 == 0 ? index + 1 : index - 1;
                            InvoiceLinesDto invoiceLinePurchase = invoiceInformation.InvoiceLines.ToList()[purchaseIndex];
                            InvoiceLinesDto invoiceLineSale = invoiceInformation.InvoiceLines.ToList()[index];
                            accountingDocumentLine.Amount = invoiceLinePurchase.InvoiceLineAmount - invoiceLineSale.InvoiceLineAmount;
                        }
                    }
                    else if (invoiceFunction == InvoiceFunction.Cancelled)
                    {
                        if (invoiceInformation.InvoiceLines.ToList()[index].CostDirectionId != null)
                        {
                            accountingDocumentLine.AccountReference = invoiceInformation.InvoiceLines.ToList()[index].NominalAccount;
                        }
                        else
                        {
                            accountingDocumentLine.AccountReference = accountingSetup.NominalCostTypeInfo.Where(x => x.CostTypeCode == accountingDocumentLine.CostTypeCode).FirstOrDefault().NominalAccountCode;
                        }

                        accountingDocumentLine.Narrative = invoiceInformation.ExternalReference;

                        accountingDocumentLine.Quantity = invoiceLineNominal.Quantity;
                        accountingDocumentLine.Amount = invoiceInformation.TransactionDocumentTypeId == (int)DocumentType.CN ? invoiceInformation.SumOfInvoiceTotalAmount : -invoiceInformation.SumOfInvoiceTotalAmount;
                    }
                    else if (invoiceFunction == InvoiceFunction.GoodsAndCost)
                    {
                        var invoiceLinesGoods = invoiceInformation.InvoiceLines.FirstOrDefault(x => x.Type == (int)Entities.ContractType.CommercialPurchase || x.Type == (int)Entities.ContractType.CommercialSale);
                        var invoiceLineCosts = invoiceInformation.InvoiceLines.Where(x => x.CostDirectionId == (int)Entities.CostDirectionType.Pay || x.CostDirectionId == (int)Entities.CostDirectionType.Receive);
                        if (invoiceLineNominal.CostDirectionId != null)
                        {
                            accountingDocumentLine.Amount = invoiceLineNominal.CostDirectionId == (int)Entities.CostDirectionType.Pay ? invoiceLineAmount : -invoiceLineAmount;
                            accountingDocumentLine.Quantity = 0;
                            if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.AccountReference != null && invoiceInformation.CostTypeCode != null)
                            {
                                accountingDocumentLine.AccountReference = invoiceInformation.AccountReference;
                                accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                            }
                            else
                            {
                                accountingDocumentLine.AccountReference = invoiceLineNominal.NominalAccount;
                                accountingDocumentLine.CostTypeCode = invoiceLineNominal.CostType;
                            }

                            accountingDocumentLine.Narrative = string.Concat(sectionInfo.ContractSectionCode, whiteSpace, sectionInfo.CharterReference, whiteSpace, invoiceLineNominal.CostType);
                        }
                        else
                        {

                            // Binding the Account Reference associated with business sector if business sector posting is configured
                            if (invoiceInformation.BusinessSectorNominalPostingPurpose == true && invoiceInformation.AccountReference != null && invoiceInformation.CostTypeCode != null)
                            {
                                accountingDocumentLine.AccountReference = invoiceInformation.AccountReference;
                                accountingDocumentLine.CostTypeCode = invoiceInformation.CostTypeCode;
                            }
                            else
                            {
                                accountingDocumentLine.AccountReference = accountingSetup.NominalCostTypeInfo.Where(x => x.CostTypeCode == accountingDocumentLine.CostTypeCode).FirstOrDefault().NominalAccountCode;
                            }

                            accountingDocumentLine.Amount = invoiceLineNominal.Type == (int)Entities.ContractType.CommercialPurchase ? invoiceLineAmount : -invoiceLineAmount;
                            accountingDocumentLine.Quantity = invoiceLineNominal.Type == (int)Entities.ContractType.CommercialPurchase ? invoiceLineNominal.Quantity : -invoiceLineNominal.Quantity;
                            accountingDocumentLine.Narrative = string.Concat(sectionInfo.ContractSectionCode, whiteSpace, sectionInfo.CharterReference, whiteSpace, accountingDocumentLine.CostTypeCode);
                        }
                    }

                    break;
                default:
                    throw new Exception("Unable to create document header and lines.");
            }

            accountingDocumentLine.Amount = Math.Round(accountingDocumentLine.Amount, CommonRules.RoundDecimals);

            decimal? amountInUSD = accountingDocumentLine.Amount;

            if (invoiceInformation.Currency != null && invoiceInformation.Currency.ToUpperInvariant() != "USD")
            {
                amountInUSD = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, accountingDocumentLine.Amount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
            }

            await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLine, amountInUSD, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);

            return accountingDocumentLine;
        }
        private static InvoiceFunction CheckInvoiceType(int invoiceType)
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
            }

            return InvoiceFunction.Commercial;
        }
    }
}
