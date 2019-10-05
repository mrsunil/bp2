using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class ManualJournalConfiguration
    {
        public IEnumerable<ItemConfigurationPropertiesDto> FieldsConfigurations { get; set; }
    }

    public class ManualJournalDocument : ManualJournalConfiguration
    {
        public long JournalId { get; set; }

        public int? DataVersionId { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime? ValueDate { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public string CurrencyCode { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public long YearNumber { get; set; }

        public int Year { get; set; }

        public bool ToInterface { get; set; }

        public DateTime DocumentDate { get; set; }

        public int? JLTypeId { get; set; }

        public int? TATypeId { get; set; }

        public IEnumerable<ManualJournalLine> ManualJournalLines { get; set; }
    }

    public class ManualJournalLine : ManualJournalConfiguration
    {
        public override string ToString()
        {
            return "JLLine id " + JournalLineId + " for amount " + Amount;
        }

        public long? JournalLineId { get; set; }

        public int? DataVersionId { get; set; }

        public long? JournalDocumentId { get; set; }

        public long? AccountReferenceId { get; set; }

        public long? ClientAccountId { get; set; }

        public long? AssociatedAccountId { get; set; }

        public int AccountLineTypeId { get; set; }

        public long? CostTypeId { get; set; }

        public decimal? Amount { get; set; }

        public string Narrative { get; set; }

        public long? DepartmentId { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string ExternalDocumentReference { get; set; }

        public long? SectionId { get; set; }

        public long? CommodityId { get; set; }

        public decimal? Quantity { get; set; }

        public string CostCenter { get; set; }

        public int? AccrualNumber { get; set; }

        public long? CharterId { get; set; }

        public string C2CCode { get; set; }

        public bool? NominalAlternativeAccount { get; set; }

        public bool? CostAlternativeCode { get; set; }

        public bool? DepartmentAlternativeCode { get; set; }

        public string TaxInterfaceCode { get; set; }

        public long? LineNumber { get; set; }

        public string DealNumber { get; set; }

        public string SettlementCurrency { get; set; }

        public long? ProvinceId { get; set; }

        public long? BranchId { get; set; }

        public long TransactionDocumentTypeId { get; set; }

    }

    public class ManualJournalResponse
    {
        public long TransactionDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public bool NominalAlternativeAccount { get; set; }

        public bool CostAlternativeCode { get; set; }

        public bool DepartmentAlternativeCode { get; set; }

        public bool C2CCode { get; set; }

        public long ManualJournalDocumentId { get; set; }
    }

    public class ManualJournalLineReference
    {
        public long JournalLineId { get; set; }

        public long? LineNumber { get; set; }
    }

    public enum JLType
    {
        ManualRegularJournal = 1,
        Revaluation = 2,
        CounterPartyTransfer = 3
    }

    public enum TAType
    {
        ManualTemporaryAdjustment = 1,
        MonthEndTemporaryAdjustment = 2,
        ManualMarkToMarket = 3,
        FxDealMonthTemporaryAdjustment=4
    }
}
