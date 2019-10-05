using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class DocumentsRateUpdateInformation
    {
        public TransactionDocumentInfoForRateUpdate TransactionDocumentInfoForRateUpdate { get; set; }

        public InvoiceInfoForRateUpdate InvoiceInfoForRateUpdate { get; set; }

        public IEnumerable<InvoiceLineInfoForRateUpdate> InvoiceLinesInfoForRateUpdate { get; set; }

        public IEnumerable<CashLineInfoForRateUpdate> CashLinesInfoForRateUpdate { get; set; }

        public IEnumerable<CashAdditionalCostInfoForRateUpdate> CashAdditionalCostsInfoForRateUpdate { get; set; }

        public IEnumerable<JournalLineInfoForRateUpdate> JournalLinesInfoForRateUpdate { get; set; }

        public IEnumerable<AccountingDocumentLineInfoForRateUpdate> AccountingDocumentLinesInfoForRateUpdate { get; set; }

        public IEnumerable<DocumentMatchingInfoForRateUpdate> DocumentMatchingInfoForRateUpdate { get; set; }

        public IEnumerable<DocumentMatchingInfoForRateUpdate> DocumentMatchingOfCounterpartyTransferForRateUpdate { get; set; }
    }

    public class TransactionDocumentInfoForRateUpdate
    {
        public long TransactionDocumentTypeId { get; set; }

        public MasterDocumentType TransactionDocumentTypeEnum { get { return (MasterDocumentType)TransactionDocumentTypeId; } }

        public long? CashTypeId { get; set; }

        public CashSelectionType CashTypeEnum { get { return (CashSelectionType)CashTypeId; } }

        public long? InvoiceTypeId { get; set; }

        public InvoiceType InvoiceTypeEnum { get { return (InvoiceType)InvoiceTypeId; } }

        public decimal RoeFromDocumentCCYToStatutoryCCY { get; set; }

        public decimal RoeFromDocumentCCYToFunctionalCCY { get; set; }

        public string RoeConversionDirection { get; set; }

        public string DocumentReference { get; set; }

        public bool IsReversal { get; set; }

        // Fields in the case of a cash by picking in different ccy
        public long? CbpMultiCCY_CashTransactionDocumentId { get; set; }

        public bool IsCashByPickingMultiCurrency { get { return CbpMultiCCY_CashTransactionDocumentId != null; } }

        public string CbpMultiCCY_CashCurrencyCode { get; set; }

        public decimal CbpMultiCCY_MatchingRoe { get; set; }

        public string CbpMultiCCY_matchingRoeType { get; set; }
    }

    public class InvoiceInfoForRateUpdate
    {
        public long InvoiceId { get; set; }

        public decimal TotalInvoiceValue { get; set; }
    }

    public class InvoiceLineInfoForRateUpdate
    {
        public long InvoiceId { get; set; }

        public long InvoiceLineId { get; set; }

        public decimal LineAmount { get; set; }

        public decimal VATAmount { get; set; }

        public long? VATId { get; set; }

        public long? ContractTypeId { get; set; }

        public ContractType ContractTypeEnum { get { return (ContractType)ContractTypeId; } }

        public long? CostDirectionId { get; set; }

        public CostDirectionType? CostDirectionTypeEnum { get { return (CostDirectionType?)CostDirectionId; } }
    }

    public class CashLineInfoForRateUpdate
    {
        public long CashLineId { get; set; }

        public decimal Amount { get; set; }
    }

    public class CashAdditionalCostInfoForRateUpdate
    {
        public long CashAdditionalCostId { get; set; }

        public decimal Amount { get; set; }

        public long CostDirectionId { get; set; }

        public CostDirectionType? CostDirectionTypeEnum { get { return (CostDirectionType?)CostDirectionId; } }
    }
    public class JournalLineInfoForRateUpdate
    {
        public long JournalLineId { get; set; }

        public decimal Amount { get; set; }
    }

    public class AccountingDocumentLineInfoForRateUpdate
    {
        public long AccountingDocumentLineId{ get; set; }

        public  long? SourceCashLineId{ get; set; }

        public long? SourceCostLineId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceInvoiceLineId { get; set; }

        public long? SourceJournalLineId { get; set; }

        public decimal Amount { get; set; }

        public long? AccountLineTypeId { get; set; }

        public AccountingDocumentLineTypeTheRealOne? AccountingDocumentLineTypeEnum { get { return (AccountingDocumentLineTypeTheRealOne?)AccountLineTypeId; } }
    }

    public class DocumentMatchingInfoForRateUpdate
    {
        public long DocumentMatchingId { get; set; }

        public long SourceCashLineId { get; set; }

        public long SourceJournalLineId { get; set; }

        public decimal Amount { get; set; }
    }
}
