using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class CounterpartyInformationDto
    {
        public short? JournalTypeId { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public DateTime? ValueDate { get; set; }

        public int? JLTypeId { get; set; }

        public int CostTypeId { get; set; }

        public long? CharterId { get; set; }

        public string CostTypeCode { get; set; }

        public decimal? FunctionalCcyAmount { get; set; }

        public decimal? StatutoryCcyAmount { get; set; }

        public long DepartmentId { get; set; }

        public int TransactionDirectionId { get; set; }

        public long OtherCounterpartyId { get; set; }

        public string DocumentReference { get; set; }

        public string SecondaryReference { get; set; }

        public IEnumerable<DocumentMatchingDto> DocumentMatchings { get; set; }

        public IEnumerable<ManualDocumentMatchingDto> ManualDocumentMatching { get; set; }
    }
}
