using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class AccountingDocumentImport
    {
        public long AccountingDocumentId { get; set; }

        public long? AccountingDocumentLineId { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string PaymentTermCode { get; set; }

        public long? PaymentTermId { get; set; }

        public string PhysicalContractCode { get; set; }

        public string ContractSectionCode { get; set; }

        public long PostingLineId { get; set; }

        public decimal? Quantity { get; set; }

        public decimal? VATTurnover { get; set; }

        public string AccountReference { get; set; }

        public string CommodityId { get; set; }

        public string VATCode { get; set; }

        public string ClientReference { get; set; }

        public string Narrative { get; set; }

        public int AccountLineTypeId { get; set; }

        public long? CharterId { get; set; }

        public string CostTypeCode { get; set; }

        public long? CostTypeId { get; set; }

        public decimal Amount { get; set; }

        public long? DepartmentId { get; set; }

        public string CompanyId { get; set; }

        public int AccountingCategoryId { get; set; }

        public long? SectionId { get; set; }

        public decimal? FunctionalCurrency { get; set; }

        public decimal? StatutoryCurrency { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string CostCenter { get; set; }

        public int? AccrualNumber { get; set; }

        public long? AccountReferenceId { get; set; }

        public long? ClientAccountId { get; set; }

        public long? AssociatedAccountId { get; set; }

        public long? VatId { get; set; }

        public string ClientAccount { get; set; }

        public string ClientAccountCode { get; set; }

        public long? JournalLineId { get; set; }

        public long? SourceJournalLineId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceInvoiceLineId { get; set; }

        public long? SourceCostLineId { get; set; }

        public long? SourceCashLineId { get; set; }

        public long? TransactionDocumentId { get; set; }

        public int? GroupId { get; set; }

    }
    public class AccountingCsvLine
    {
        public int LineNumber { get; set; }
        public string AccountingDocumentId { get; set; }

        public string AccountingDocumentLineId { get; set; }

        public string AssociatedAccountCode { get; set; }

        public string PaymentTermCode { get; set; }

        public string PaymentTermId { get; set; }

        public string PhysicalContractCode { get; set; }

        public string ContractSectionCode { get; set; }

        public string PostingLineId { get; set; }

        public string Quantity { get; set; }

        public string VATTurnover { get; set; }

        public string AccountReference { get; set; }

        public string CommodityId { get; set; }

        public string VATCode { get; set; }

        public string ClientReference { get; set; }

        public string Narrative { get; set; }

        public string AccountLineTypeId { get; set; }

        public string CharterId { get; set; }

        public string CostTypeCode { get; set; }

        public string CostTypeId { get; set; }

        public string Amount { get; set; }

        public string DepartmentId { get; set; }

        public string CompanyId { get; set; }

        public string AccountingCategoryId { get; set; }

        public string SectionId { get; set; }

        public string FunctionalCurrency { get; set; }

        public string StatutoryCurrency { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string CostCenter { get; set; }

        public string AccrualNumber { get; set; }

        public string AccountReferenceId { get; set; }

        public string ClientAccountId { get; set; }

        public string AssociatedAccountId { get; set; }

        public string VatId { get; set; }

        public string ClientAccount { get; set; }

        public string ClientAccountCode { get; set; }

        public string JournalLineId { get; set; }

        public string SourceJournalLineId { get; set; }

        public string SourceInvoiceId { get; set; }

        public string SourceInvoiceLineId { get; set; }

        public string SourceCostLineId { get; set; }

        public string SourceCashLineId { get; set; }

        public string TransactionDocumentId { get; set; }

        public string GroupId { get; set; }

        public string DealNumber { get; set; }
    
        public string ExternalDocumentReference { get; set; }

        public string SettlementCurrency { get; set; }

        public string ProvinceId { get; set; }

        public static AccountingCsvLine ParseFromCsv(string csvLine, int lineNumber, bool IsAccuralSelected, bool IsMTMSelected)
        {
            string[] values = csvLine.Split(",");

            AccountingCsvLine accountingToImport = new AccountingCsvLine();
            if (IsAccuralSelected)
            {
                accountingToImport.LineNumber = lineNumber;
                if (values.Length == 16)
                {
                    accountingToImport.AccountReferenceId = values[0].Replace("\"", string.Empty).Trim();
                    accountingToImport.ClientAccountId = values[1].Replace("\"", string.Empty).Trim();
                    accountingToImport.AssociatedAccountId = values[2].Replace("\"", string.Empty).Trim();
                    accountingToImport.AccountLineTypeId = values[3].Replace("\"", string.Empty).Trim();
                    accountingToImport.CostTypeId = values[4].Replace("\"", string.Empty).Trim();
                    accountingToImport.Amount = values[5].Replace("\"", string.Empty).Trim();
                    accountingToImport.Narrative = values[6].Replace("\"", string.Empty).Trim();
                    accountingToImport.DepartmentId = values[7].Replace("\"", string.Empty);
                    accountingToImport.SecondaryDocumentReference = values[8].Replace("\"", string.Empty).Trim();
                    accountingToImport.ExternalDocumentReference = values[9].Replace("\"", string.Empty).Trim();
                    accountingToImport.SectionId = values[10].Replace("\"", string.Empty).Trim();
                    accountingToImport.CommodityId = values[11].Replace("\"", string.Empty).Trim();
                    accountingToImport.Quantity = values[12].Replace("\"", string.Empty).Trim();
                    accountingToImport.CharterId = values[13].Replace("\"", string.Empty).Trim();
                    accountingToImport.CostCenter = values[14].Replace("\"", string.Empty).Trim();
                    accountingToImport.AccrualNumber = values[15].Replace("\"", string.Empty).Trim();
                }

            }
            else if (IsMTMSelected)
            {

                accountingToImport.LineNumber = lineNumber;
                if (values.Length == 15)
                {
                    accountingToImport.AccountReferenceId = values[0].Replace("\"", string.Empty).Trim();
                    accountingToImport.AssociatedAccountId = values[1].Replace("\"", string.Empty).Trim();
                    accountingToImport.AccountLineTypeId = values[2].Replace("\"", string.Empty).Trim();
                    accountingToImport.CostTypeId = values[3].Replace("\"", string.Empty).Trim();
                    accountingToImport.Amount = values[4].Replace("\"", string.Empty).Trim();
                    accountingToImport.Narrative = values[5].Replace("\"", string.Empty).Trim();
                    accountingToImport.DepartmentId = values[6].Replace("\"", string.Empty).Trim();
                    accountingToImport.SectionId = values[7].Replace("\"", string.Empty).Trim();
                    accountingToImport.DealNumber = values[8].Replace("\"", string.Empty).Trim();
                    accountingToImport.SettlementCurrency = values[9].Replace("\"", string.Empty).Trim();
                    accountingToImport.ProvinceId = values[10].Replace("\"", string.Empty).Trim();
                    accountingToImport.CommodityId = values[11].Replace("\"", string.Empty).Trim();
                    accountingToImport.Quantity = values[12].Replace("\"", string.Empty).Trim();
                    accountingToImport.CharterId = values[13].Replace("\"", string.Empty).Trim();
                    accountingToImport.AccrualNumber = values[14].Replace("\"", string.Empty).Trim();
                }
            }
            else
            {
                accountingToImport.LineNumber = lineNumber;
                if (values.Length == 15)
                {
                    accountingToImport.AccountReferenceId = values[0].Replace("\"", string.Empty).Trim();
                    accountingToImport.ClientAccountId = values[1].Replace("\"", string.Empty).Trim();
                    accountingToImport.AssociatedAccountId = values[2].Replace("\"", string.Empty).Trim();
                    accountingToImport.AccountLineTypeId = values[3].Replace("\"", string.Empty).Trim();
                    accountingToImport.CostTypeId = values[4].Replace("\"", string.Empty).Trim();
                    accountingToImport.Amount = values[5].Replace("\"", string.Empty).Trim();
                    accountingToImport.Narrative = values[6].Replace("\"", string.Empty).Trim();
                    accountingToImport.DepartmentId = values[7].Replace("\"", string.Empty);
                    accountingToImport.SecondaryDocumentReference = values[8].Replace("\"", string.Empty).Trim();
                    accountingToImport.ExternalDocumentReference = values[9].Replace("\"", string.Empty).Trim();
                    accountingToImport.SectionId = values[10].Replace("\"", string.Empty).Trim();
                    accountingToImport.CommodityId = values[11].Replace("\"", string.Empty).Trim();
                    accountingToImport.Quantity = values[12].Replace("\"", string.Empty).Trim();
                    accountingToImport.CharterId = values[13].Replace("\"", string.Empty).Trim();
                    accountingToImport.CostCenter = values[14].Replace("\"", string.Empty).Trim();
                }
             
            }
            return accountingToImport;

        }
    }
    public class ValidatedAccountingImport
    {
        public List<AccountingImportReportData> BlockerData { get; set; }

        public AccountingImportReportData GoodData { get; set; }

        public List<AccountingCsvLine> GoodDataList { get; set; }
    }

    public class AccountingImportReportData
    {
        public string ErrorCode { get; set; }

        public string ErrorMessage { get; set; }
        public List<int> LineNumber { get; set; }



    }

}
