using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class MonthEndTADocumentDto
    {
        public long TemporaryAdjustmentId { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime? AccountingPeriod { get; set; }

        public DateTime? ValueDate { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int? JLTypeId { get; set; }

        public int? TATypeId { get; set; }

        public int? AccrualNumber { get; set; }

        public bool BusinesssectorNominalTradingOperation { get; set; }

        public bool BusinessSectorNominalPostingPurpose { get; set; }

        public string DocumentReference { get; set; }

        public IEnumerable<MonthEndTALineDto> MonthEndTALines { get; set; }
    }
}
