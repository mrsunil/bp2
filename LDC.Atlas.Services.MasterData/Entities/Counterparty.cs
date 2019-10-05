using LDC.Atlas.DataAccess.DapperMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Counterparty
    {
        [JsonProperty("counterpartyID")]
        public int? CounterpartyID { get; set; }

        [JsonProperty("counterpartyCode")]
        public string CounterpartyCode { get; set; }

        public string DisplayName => CounterpartyCode;

        [Column(Name = "Description")]
        [JsonProperty("description")]
        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? ModifiedDateTime { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ModifiedBy { get; set; }

        public string CounterpartyType { get; set; }

        public decimal? MDMId { get; set; }

        public string MDMCategoryCode { get; set; }

        public bool IsDeactivated { get; set; }

        public short? CounterpartyTradeStatusId { get; set; }

        public long? HeadofFamily { get; set; }

        public long? CountryId { get; set; }

        public long? ProvinceId { get; set; }

        public string C2CCode { get; set; }

        public string VATRegistrationNumber { get; set; }

        public string FiscalRegistrationNumber { get; set; }

        public long? ContractTermId { get; set; }

        public long? ACManagerId { get; set; }

        public long? DepartmentId { get; set; }

        public string AlternateMailingAddress1 { get; set; }

        public string AlternateMailingAddress2 { get; set; }

        public string AlternateMailingAddress3 { get; set; }

        public string AlternateMailingAddress4 { get; set; }

        public string IntroductoryBrocker { get; set; }

        public bool IsLDCGroupCompany { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyAccountType> CounterpartyAccountTypes { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyMdmCategory> CounterpartyMdmCategory { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyAddress> CounterpartyAddresses { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterPartyBankAccount> CounterpartyBankAccounts { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyBankAccountIntermediary> CounterpartyBankAccountIntermediaries { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyContact> CounterpartyContacts { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyCompany> CounterpartyCompanies { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CounterpartyTax> CounterpartyTaxes { get; set; }
    }
}
