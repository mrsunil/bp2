namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterPartyBankAccount
    {
        public long? BankAccountId { get; set; }

        public string BankKey { get; set; }

        public string BankName { get; set; }

        public long? BankCountryKey { get; set; }

        public string BankCity { get; set; }

        public string BankSwiftCode { get; set; }

        public string NCC { get; set; }

        public string NCS { get; set; }

        public string BankBranch { get; set; }

        public string BankZIPCode { get; set; }

        public string BankAccountDesc { get; set; }

        public string AccountNo { get; set; }

        public string AccountCCY { get; set; }

        public string FEDABA { get; set; }

        public string Chips { get; set; }

        public string BankPhoneNo { get; set; }

        public string BankFaxNo { get; set; }

        public string BankTelexNo { get; set; }

        public string ExternalReference { get; set; }

        public short BankTypeID { get; set; }

        public short BankAccountStatusID { get; set; }

        public bool IsBankAccountDefault { get; set; }

        public decimal? MDMId { get; set; }

        public long? CounterpartyId { get; set; }

        public bool? BankAccountDefault { get; set; }

        public bool? BankAccountIntermediary { get; set; }

        public string BankAccountDescription { get; set; }

        public string BankAddressLine1 { get; set; }

        public string BankAddressLine2 { get; set; }

        public string BankAddressLine3 { get; set; }

        public string BankAddressLine4 { get; set; }

        public bool IsDeactivated { get; set; }

        public string BankNccType { get; set; }

        public string InterfaceCode { get; set; }

        public bool IsDeleted { get; set; }

        public int TempBankAccountId { get; set; }
    }
}
