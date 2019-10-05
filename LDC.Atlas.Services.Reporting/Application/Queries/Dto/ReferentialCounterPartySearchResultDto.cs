using LDC.Atlas.Application.Core.Entities;

namespace LDC.Atlas.Services.Reporting.Application.Queries.Dto
{
    public class ReferentialCounterPartySearchResultDto : PaginatedItem
    {
        public int CounterpartyID { get; set; }

        public int CounterpartyMdmId { get; set; }

        public string CounterpartyCode { get; set; }

        public string CounterpartyType { get; set; }

        public string CounterpartyName { get; set; }

        public string TradeStatus { get; set; }

        public string CounterpartyStatus { get; set; }

        public string HeadOfFamily { get; set; }

        public string CounterpartyCountryCode { get; set; }

        public string Province { get; set; }

        public string InterfaceCode { get; set; }

        public decimal ClientAddressMdmId { get; set; }

        public string CounterpartyAddressType { get; set; }

        public string CounterpartyAddress1 { get; set; }

        public string CounterpartyAddress2 { get; set; }

        public string CounterpartyCity { get; set; }

        public string CounterpartyZipCode { get; set; }

        public string CounterpartyProvince { get; set; }

        public string CounterpartyCountry { get; set; }

        public string Mail { get; set; }

        public string PhoneNo { get; set; }

        public bool Main { get; set; }

        public bool AddressStatus { get; set; }

        public decimal? BankMdmId { get; set; }

        public long BankCountryKey { get; set; }

        public string BankKey { get; set; }

        public string BankName { get; set; }

        public string BankAddressLine1 { get; set; }

        public string BankAddressLine2 { get; set; }

        public string BankAddressLine3 { get; set; }

        public string BankAddressLine4 { get; set; }

        public string BankCity { get; set; }

        public string BankSwiftCode { get; set; }

        public string BankNcc { get; set; }

        public string BankNccType { get; set; }

        public string BankNcs { get; set; }

        public string BankBranch { get; set; }

        public string BankType { get; set; }

        public string BankZipCode { get; set; }

        public string BankAccountDescription { get; set; }

        public string AccountNumber { get; set; }

        public string AccountCcy { get; set; }

        public string AccountStatus { get; set; }

        public string FedAba { get; set; }

        public string BankACChips { get; set; }

        public string BankPhoneNumber { get; set; }

        public string BankFaxNumber { get; set; }

        public string BankTelexNumber { get; set; }

        public string BankAccountDefault { get; set; }

        public decimal? BankIntermediaryMdmId { get; set; }

        public string BankIntermediaryCountryKey { get; set; }

        public string BankIntermediaryKey { get; set; }

        public string BankIntermediaryName { get; set; }

        public string IntermediaryAddressLine1 { get; set; }

        public string IntermediaryAddressLine2 { get; set; }

        public string IntermediaryAddressLine3 { get; set; }

        public string IntermediaryAddressLine4 { get; set; }

        public string BankIntermediaryCity { get; set; }

        public string BankIntermediarySwiftCode { get; set; }

        public string IntermediaryNcc { get; set; }

        public string IntermediaryNccType { get; set; }

        public string IntermediaryNcs { get; set; }

        public string BankIntermediaryBranch { get; set; }

        public string BankIntermediaryType { get; set; }

        public string BankIntermediaryZipCode { get; set; }

        public string IntermediaryAccountDescription { get; set; }

        public string IntermediaryAccountNumber { get; set; }

        public string IntermediaryAccountCcy { get; set; }

        public string IntermediaryAccountStatus { get; set; }

        public string IntermediaryFedAba { get; set; }

        public string IntermediaryChips { get; set; }

        public string C2CCode { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
