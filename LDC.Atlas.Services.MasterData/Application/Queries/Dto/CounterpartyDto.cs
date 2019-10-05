using LDC.Atlas.DataAccess.DapperMapper;
using System;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;

namespace LDC.Atlas.Services.MasterData.Application.Queries.Dto
{
    public class CounterpartyDto
    {
        public int CounterpartyID { get; set; }

        public string CounterpartyCode { get; set; }

        public string CounterpartyType { get; set; }

        public string Description { get; set; }

        public decimal? MDMId { get; set; }

        public string MDMCategoryCode { get; set; }

        public bool? IsDeactivated { get; set; }

        public short CounterpartyTradeStatusId { get; set; }

        public long? HeadofFamily { get; set; }

        public long CountryId { get; set; }

        public long? ProvinceId { get; set; }

        public string C2CCode { get; set; }

        public string VATRegistrationNumber { get; set; }

        public string FiscalRegistrationNumber { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public long? ContractTermId { get; set; }

        public long? ACManagerId { get; set; }

        public long? DepartmentId { get; set; }

        public string AlternateMailingAddress1 { get; set; }

        public string AlternateMailingAddress2 { get; set; }

        public string AlternateMailingAddress3 { get; set; }

        public string AlternateMailingAddress4 { get; set; }

        public string IntroductoryBrocker { get; set; }

        public IEnumerable<CounterpartyAccountType> CounterpartyAccountTypes { get; set; }

        public IEnumerable<CounterpartyMdmCategory> CounterpartyMdmCategory { get; set; }

        public IEnumerable<CounterpartyAddress> CounterpartyAddresses { get; set; }

        public IEnumerable<CounterPartyBankAccount> CounterpartyBankAccounts { get; set; }

        public IEnumerable<CounterpartyBankAccountIntermediary> CounterpartyBankAccountIntermediaries { get; set; }

        public IEnumerable<CounterpartyContact> CounterpartyContacts { get; set; }

        public IEnumerable<CounterpartyCompany> CounterpartyCompanies { get; set; }

        public IEnumerable<CounterpartyTax> CounterpartyTaxes { get; set; }

    }
}
