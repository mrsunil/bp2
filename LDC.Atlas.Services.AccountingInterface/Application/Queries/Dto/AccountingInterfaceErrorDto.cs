using System;

namespace LDC.Atlas.Services.AccountingInterface.Application.Queries.Dto
{
    public class AccountingInterfaceErrorDto
    {
        public string DocumentReference { get; set; }

        public long AccountingId { get; set; }

        public long TransactionDocumentId { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        // modified it to string as we are displaying date and time in particular format from SQL
        public string BoInterfaceDate { get; set; }

        public DateTime? BackInterfaceDate { get; set; }

        public string Profile { get; set; }

        public string BoDocID { get; set; }

        public string BoJournalID { get; set; }

        public int InterfaceStatusId { get; set; }

        public string AccountingInterfaceStatus { get; set; }

        public string ErrorDescription { get; set; }

        public int? AccrualNumber { get; set; }
    }
}
