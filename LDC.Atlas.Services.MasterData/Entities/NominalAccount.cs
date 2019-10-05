using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class NominalAccount
    {
        public string AccountNumber { get; set; }

        public string NominalAccountNumberFormated { get; set; }

        public string ShortDescription { get; set; }

        public string DetailedDescription { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int NominalAccountId { get; set; }

        public string MDMId { get; set; }

        public string MainAccountTitle { get; set; }

        public string AlternativeAccount { get; set; }

        public string OtherAlternativeAccount { get; set; }

        public bool RevalxRequired { get; set; }

        public bool IncInCcyexp { get; set; }

        public string InterfaceBankCode { get; set; }

        public DateTime DateLastPosted { get; set; }

        public bool IsDeactivated { get; set; }

        public string DetailAccountTitle { get; set; }

        public bool BankAccount { get; set; }

        public string AlternativeDescription { get; set; }

        public bool ClientAccountMandatory { get; set; }

        public string AccountType { get; set; }

        public string CustomerVendor { get; set; }

        public string DisplayName => AccountNumber;

    }
}
