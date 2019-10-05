using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CounterpartyRepository : BaseRepository, ICounterpartyRepository
    {
        public CounterpartyRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Counterparty),
                       new ColumnAttributeTypeMapper<Counterparty>());
        }

        public async Task<IEnumerable<Counterparty>> GetAllAsync(string company, string counterpartyCode, int? offset, int? limit, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@CounterpartyCode", counterpartyCode);
            queryParameters.Add("@Description", description);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var counterparties = await ExecuteQueryAsync<Counterparty>(
                StoredProcedureNames.GetCounterparties,
                queryParameters);

            return counterparties;
        }

        public async Task<IEnumerable<Counterparty>> GetByPricingMethodAndDealTypeAsync(string company, PricingMethod pricingMethod, DealType dealType)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Company", company);
            queryParameters.Add("@PricingMethod", pricingMethod);
            queryParameters.Add("@DealType", dealType);

            var counterparties = await ExecuteQueryAsync<Counterparty>(
                StoredProcedureNames.GetCounterpartiesByPricingMethodAndDealType,
                queryParameters);

            return counterparties;
        }

        public async Task DeleteCounterpartyDetailsAsync(IEnumerable<Counterparty> counterparties, string company)
        {
            List<long> addressIdsToDelete = new List<long>();
            List<long> bankAccountIdsToDelete = new List<long>();
            List<long> bankAccountIntermediaryIdsToDelete = new List<long>();
            List<long> contactIdsToDelete = new List<long>();
            List<long> taxIdsToDelete = new List<long>();
            List<int> companyIdsToDelete = new List<int>();
            List<int> accountTypeIdsToDelete = new List<int>();

            foreach (var counterparty in counterparties)
            {
                if (counterparty.CounterpartyBankAccounts != null)
                {
                    bankAccountIdsToDelete.AddRange(counterparty.CounterpartyBankAccounts.
                        Where(x => x.IsDeleted && x.BankAccountId != null).
                        Select(x => (long)x.BankAccountId));
                }

                if (counterparty.CounterpartyContacts != null)
                {
                    contactIdsToDelete.AddRange(counterparty.CounterpartyContacts.
                        Where(x => x.IsDeactivated && x.ContactId != null).
                        Select(x => (long)x.ContactId));
                }

                if (counterparty.CounterpartyCompanies != null)
                {
                    companyIdsToDelete.AddRange(counterparty.CounterpartyCompanies.
                        Where(x => x.IsDeactivated).
                        Select(x => x.CompanyId));
                }

                if (counterparty.CounterpartyTaxes != null)
                {
                    taxIdsToDelete.AddRange(counterparty.CounterpartyTaxes.
                        Where(x => x.IsDeactivated && x.CounterpartyTaxId != null).
                        Select(x => (long)x.CounterpartyTaxId));
                }

                if (counterparty.CounterpartyAddresses != null)
                {
                    addressIdsToDelete.AddRange(counterparty.CounterpartyAddresses.
                        Where(x => x.IsDeactivated && x.AddressId != null).
                        Select(x => (long)x.AddressId));
                }

                if (counterparty.CounterpartyAccountTypes != null)
                {
                    accountTypeIdsToDelete.AddRange(counterparty.CounterpartyAccountTypes.
                        Where(x => x.IsDeactivated && x.CounterPartyAccountTypeId != null).
                        Select(x => (int)x.CounterPartyAccountTypeId));
                }

                DynamicParameters queryParameters = new DynamicParameters();

                queryParameters.Add("@CounterpartyId", counterparty.CounterpartyID);
                queryParameters.Add("@Addresses", ToArrayTvp(addressIdsToDelete));
                queryParameters.Add("@BankAccounts", ToArrayTvp(bankAccountIdsToDelete));
                queryParameters.Add("@BankAccountsIntermediary", ToArrayTvp(bankAccountIntermediaryIdsToDelete));
                queryParameters.Add("@Contacts", ToArrayTvp(contactIdsToDelete));
                queryParameters.Add("@Taxes", ToArrayTvp(taxIdsToDelete));
                queryParameters.Add("@CompanyId", ToArrayTvp(companyIdsToDelete));
                queryParameters.Add("@CounterpartyAccountTypes", ToArrayTvp(accountTypeIdsToDelete));

                await ExecuteQueryAsync<Counterparty>(StoredProcedureNames.DeleteCounterpartyDetails, queryParameters, true);
            }
        }

        public async Task<IEnumerable<int>> AddUpdateCounterpartyAsync(IEnumerable<Counterparty> counterparties, string company)
        {
            List<CounterpartyAddress> counterpartyAddresses = new List<CounterpartyAddress>();
            List<CounterPartyBankAccount> counterPartyBankAccounts = new List<CounterPartyBankAccount>();
            List<CounterpartyBankAccountIntermediary> counterpartyBankAccountIntermediaries = new List<CounterpartyBankAccountIntermediary>();
            List<CounterpartyContact> counterpartyContacts = new List<CounterpartyContact>();
            List<CounterpartyCompany> counterpartyCompanies = new List<CounterpartyCompany>();
            List<CounterpartyAccountType> counterpartyAccountTypes = new List<CounterpartyAccountType>();
            List<CounterpartyMdmCategory> counterpartyMdmCategories = new List<CounterpartyMdmCategory>();
            List<CounterpartyTax> counterpartyTaxes = new List<CounterpartyTax>();

            foreach (var counterparty in counterparties)
            {
                if (counterparty.CounterpartyAddresses != null)
                {
                    counterpartyAddresses.AddRange(counterparty.CounterpartyAddresses);
                }

                if (counterparty.CounterpartyBankAccounts != null)
                {
                    counterPartyBankAccounts.AddRange(counterparty.CounterpartyBankAccounts.Where(bank => !bank.IsDeleted));
                }

                if (counterparty.CounterpartyBankAccountIntermediaries != null)
                {
                    counterpartyBankAccountIntermediaries.AddRange(counterparty.CounterpartyBankAccountIntermediaries.
                        Where(intermediary => intermediary != null && !intermediary.IsDeleted));
                }

                if (counterparty.CounterpartyContacts != null)
                {
                    counterpartyContacts.AddRange(counterparty.CounterpartyContacts);
                }

                if (counterparty.CounterpartyCompanies != null)
                {
                    counterpartyCompanies.AddRange(counterparty.CounterpartyCompanies);
                }

                if (counterparty.CounterpartyTaxes != null)
                {
                    counterpartyTaxes.AddRange(counterparty.CounterpartyTaxes);
                }

                if (counterparty.CounterpartyAccountTypes != null)
                {
                    counterpartyAccountTypes.AddRange(counterparty.CounterpartyAccountTypes);
                }

                if (counterparty.CounterpartyMdmCategory != null)
                {
                    counterpartyMdmCategories.AddRange(counterparty.CounterpartyMdmCategory);
                }
            }

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Counterparty", CounterpartyTVP(counterparties));
            queryParameters.Add("@CounterpartyCompany", CounterpartyCompanyTVP(counterpartyCompanies));
            queryParameters.Add("@CounterpartyAccountTypes", CounterpartyAccountTypeTVP(counterpartyAccountTypes));
            queryParameters.Add("@CounterpartyMdmCategories", CounterpartyMdmCategoryTVP(counterpartyMdmCategories));
            queryParameters.Add("@Addresses", CounterpartyAddressTVP(counterpartyAddresses));
            queryParameters.Add("@BankAccounts", CounterpartyBankAccountTVP(counterPartyBankAccounts));
            queryParameters.Add("@BankAccountIntermediarys", CounterpartyBankAccountIntermediariesTVP(counterpartyBankAccountIntermediaries));
            queryParameters.Add("@Contacts", CounterpartyContactTVP(counterpartyContacts));
            queryParameters.Add("@CounterpartyTaxes", CounterpartyTaxTVP(counterpartyTaxes));

            var sec = await ExecuteQueryAsync<int>(StoredProcedureNames.AddUpdateCounterparty, queryParameters, true);
            return sec;
        }

        public async Task<IEnumerable<int>> BulkUpdateCounterpartyAsync(IEnumerable<Counterparty> counterparties, string company)
        {
            List<CounterpartyAddress> counterpartyAddresses = new List<CounterpartyAddress>();
            List<CounterpartyCompany> counterpartyCompanies = new List<CounterpartyCompany>();

            foreach (var counterparty in counterparties)
            {
                if (counterparty.CounterpartyAddresses != null)
                {
                    counterpartyAddresses.AddRange(counterparty.CounterpartyAddresses);
                }

                if (counterparty.CounterpartyCompanies != null)
                {
                    counterpartyCompanies.AddRange(counterparty.CounterpartyCompanies);
                }
            }

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Counterparty", CounterpartyTVP(counterparties));
            queryParameters.Add("@CounterpartyCompany", CounterpartyCompanyTVP(counterpartyCompanies));
            queryParameters.Add("@Addresses", CounterpartyAddressTVP(counterpartyAddresses));

            var sec = await ExecuteQueryAsync<int>(StoredProcedureNames.BulkUpdateCounterparty, queryParameters, true);
            return sec;
        }

        private static DataTable ToArrayTvp(IEnumerable<long> values)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var sectionId = new DataColumn("Value", typeof(long));
            table.Columns.Add(sectionId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static DataTable ToArrayTvp(IEnumerable<int> values)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var sectionId = new DataColumn("Value", typeof(int));
            table.Columns.Add(sectionId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private DataTable CounterpartyAddressTVP(List<CounterpartyAddress> counterpartyAddresses)
        {
            DataTable tableCounterpartyAddress = new DataTable();
            tableCounterpartyAddress.SetTypeName("[MasterData].[UDTT_Address]");

            DataColumn addressId = new DataColumn("[AddressId]", typeof(long));
            tableCounterpartyAddress.Columns.Add(addressId);

            DataColumn addressTypeID = new DataColumn("[AddressTypeID]", typeof(long));
            tableCounterpartyAddress.Columns.Add(addressTypeID);

            DataColumn address1 = new DataColumn("[Address1]", typeof(string));
            tableCounterpartyAddress.Columns.Add(address1);

            DataColumn address2 = new DataColumn("[Address2]", typeof(string));
            tableCounterpartyAddress.Columns.Add(address2);

            DataColumn city = new DataColumn("[City]", typeof(string));
            tableCounterpartyAddress.Columns.Add(city);

            DataColumn zipCode = new DataColumn("[ZIPCode]", typeof(string));
            tableCounterpartyAddress.Columns.Add(zipCode);

            DataColumn provinceID = new DataColumn("[ProvinceID]", typeof(long));
            tableCounterpartyAddress.Columns.Add(provinceID);

            DataColumn countryID = new DataColumn("[CountryID]", typeof(long));
            tableCounterpartyAddress.Columns.Add(countryID);

            DataColumn mail = new DataColumn("[Mail]", typeof(string));
            tableCounterpartyAddress.Columns.Add(mail);

            DataColumn phoneNo = new DataColumn("[PhoneNo]", typeof(string));
            tableCounterpartyAddress.Columns.Add(phoneNo);

            DataColumn faxNo = new DataColumn("[FaxNo]", typeof(string));
            tableCounterpartyAddress.Columns.Add(faxNo);

            DataColumn isDeactivated = new DataColumn("[IsDeactivated]", typeof(bool));
            tableCounterpartyAddress.Columns.Add(isDeactivated);

            DataColumn mdmId = new DataColumn("[MDMId]", typeof(long));
            tableCounterpartyAddress.Columns.Add(mdmId);

            DataColumn counterpartyID = new DataColumn("[CounterpartyID]", typeof(long));
            tableCounterpartyAddress.Columns.Add(counterpartyID);

            DataColumn main = new DataColumn("[Main]", typeof(bool));
            tableCounterpartyAddress.Columns.Add(main);

            DataColumn ldcRegionId = new DataColumn("[LdcRegionId]", typeof(long));
            tableCounterpartyAddress.Columns.Add(ldcRegionId);

            foreach (var item in counterpartyAddresses)
            {
                var counterpartyAddressRow = tableCounterpartyAddress.NewRow();

                counterpartyAddressRow[addressId] = (item.AddressId == null) ? (object)DBNull.Value : item.AddressId;
                counterpartyAddressRow[addressTypeID] = (item.AddressTypeID == null) ? (object)DBNull.Value : item.AddressTypeID;
                counterpartyAddressRow[address1] = item.Address1;
                counterpartyAddressRow[address2] = item.Address2;
                counterpartyAddressRow[city] = item.City;
                counterpartyAddressRow[zipCode] = item.ZIPCode;
                counterpartyAddressRow[provinceID] = (item.ProvinceID == null) ? (object)DBNull.Value : item.ProvinceID;
                counterpartyAddressRow[countryID] = (item.CountryID == null) ? (object)DBNull.Value : item.CountryID;
                counterpartyAddressRow[mail] = item.Mail;
                counterpartyAddressRow[phoneNo] = item.PhoneNo;
                counterpartyAddressRow[faxNo] = item.FaxNo;
                counterpartyAddressRow[isDeactivated] = item.IsDeactivated;
                counterpartyAddressRow[mdmId] = (item.MDMId == null) ? (object)DBNull.Value : item.MDMId;
                counterpartyAddressRow[counterpartyID] = (item.CounterpartyID == null) ? (object)DBNull.Value : item.CounterpartyID;
                counterpartyAddressRow[main] = (item.Main == null) ? false : item.Main;
                counterpartyAddressRow[ldcRegionId] = (item.LDCRegionId == null) ? (object)DBNull.Value : item.LDCRegionId;

                tableCounterpartyAddress.Rows.Add(counterpartyAddressRow);
            }

            return tableCounterpartyAddress;
        }

        private DataTable CounterpartyBankAccountTVP(List<CounterPartyBankAccount> counterPartyBankAccounts)
        {
            DataTable tablecounterpartyBankAccounts = new DataTable();
            tablecounterpartyBankAccounts.SetTypeName("[MasterData].[UDTT_BankAccount]");

            DataColumn bankAccountId = new DataColumn("[BankAccountId]", typeof(long));
            tablecounterpartyBankAccounts.Columns.Add(bankAccountId);

            DataColumn bankKey = new DataColumn("[BankKey]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankKey);

            DataColumn bankName = new DataColumn("[BankName]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankName);

            DataColumn bankCountryKey = new DataColumn("[BankCountryKey]", typeof(long));
            tablecounterpartyBankAccounts.Columns.Add(bankCountryKey);

            DataColumn bankCity = new DataColumn("[BankCity]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankCity);

            DataColumn bankSwiftCode = new DataColumn("[BankSwiftCode]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankSwiftCode);

            DataColumn ncc = new DataColumn("[NCC]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(ncc);

            DataColumn ncs = new DataColumn("[NCS]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(ncs);

            DataColumn bankBranch = new DataColumn("[BankBranch]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankBranch);

            DataColumn bankZIPCode = new DataColumn("[BankZIPCode]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankZIPCode);

            DataColumn bankAccountDesc = new DataColumn("[BankAccountDesc]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankAccountDesc);

            DataColumn accountNo = new DataColumn("[AccountNo]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(accountNo);

            DataColumn accountCCY = new DataColumn("[AccountCCY]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(accountCCY);

            DataColumn fedaba = new DataColumn("[FEDABA]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(fedaba);

            DataColumn chips = new DataColumn("[Chips]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(chips);

            DataColumn bankPhoneNo = new DataColumn("[BankPhoneNo]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankPhoneNo);

            DataColumn bankFaxNo = new DataColumn("[BankFaxNo]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankFaxNo);

            DataColumn bankTelexNo = new DataColumn("[BankTelexNo]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankTelexNo);

            DataColumn externalReference = new DataColumn("[ExternalReference]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(externalReference);

            DataColumn bankTypeID = new DataColumn("[BankTypeID]", typeof(short));
            tablecounterpartyBankAccounts.Columns.Add(bankTypeID);

            DataColumn bankAccountStatusID = new DataColumn("[BankAccountStatusID]", typeof(short));
            tablecounterpartyBankAccounts.Columns.Add(bankAccountStatusID);

            DataColumn mdmId = new DataColumn("[MDMId]", typeof(decimal));
            tablecounterpartyBankAccounts.Columns.Add(mdmId);

            DataColumn counterPartyId = new DataColumn("[CounterPartyId]", typeof(long));
            tablecounterpartyBankAccounts.Columns.Add(counterPartyId);

            DataColumn bankAccountDefault = new DataColumn("[BankAccountDefault]", typeof(bool));
            tablecounterpartyBankAccounts.Columns.Add(bankAccountDefault);

            DataColumn bankAccountIntermediary = new DataColumn("[BankAccountIntermediary]", typeof(bool));
            tablecounterpartyBankAccounts.Columns.Add(bankAccountIntermediary);

            DataColumn bankAccountDescription = new DataColumn("[BankAccountDescription]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankAccountDescription);

            DataColumn bankAddressLine1 = new DataColumn("[BankAddressLine1]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankAddressLine1);

            DataColumn bankAddressLine2 = new DataColumn("[BankAddressLine2]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankAddressLine2);

            DataColumn bankAddressLine3 = new DataColumn("[BankAddressLine3]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankAddressLine3);

            DataColumn bankAddressLine4 = new DataColumn("[BankAddressLine4]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankAddressLine4);

            DataColumn isDeactivated = new DataColumn("[IsDeactivated]", typeof(bool));
            tablecounterpartyBankAccounts.Columns.Add(isDeactivated);

            //DataColumn isDeleted = new DataColumn("[IsDeleted]", typeof(bool));
            //tablecounterpartyBankAccounts.Columns.Add(isDeleted);

            DataColumn interfaceCode = new DataColumn("[InterfaceCode]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(interfaceCode);

            DataColumn bankNccType = new DataColumn("[BankNccType]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(bankNccType);

            DataColumn tempBankAccountId = new DataColumn("[TempBankAccountId]", typeof(string));
            tablecounterpartyBankAccounts.Columns.Add(tempBankAccountId);

            foreach (var item in counterPartyBankAccounts)
            {
                // add counterpartyBankAccount details
                var counterpartyBankAccountRow = tablecounterpartyBankAccounts.NewRow();

                counterpartyBankAccountRow[bankAccountId] = (item.BankAccountId == null) ? (object)DBNull.Value : item.BankAccountId;
                counterpartyBankAccountRow[bankKey] = (item.BankKey == null) ? (object)DBNull.Value : item.BankKey;
                counterpartyBankAccountRow[bankName] = item.BankName;
                counterpartyBankAccountRow[bankCountryKey] = (item.BankCountryKey == null) ? (object)DBNull.Value : item.BankCountryKey;
                counterpartyBankAccountRow[bankCity] = item.BankCity;
                counterpartyBankAccountRow[bankSwiftCode] = item.BankSwiftCode;
                counterpartyBankAccountRow[ncc] = item.NCC;
                counterpartyBankAccountRow[ncs] = item.NCS;
                counterpartyBankAccountRow[bankBranch] = item.BankBranch;
                counterpartyBankAccountRow[bankZIPCode] = item.BankZIPCode;
                counterpartyBankAccountRow[bankAccountDesc] = item.BankAccountDesc;
                counterpartyBankAccountRow[accountNo] = item.AccountNo;
                counterpartyBankAccountRow[accountCCY] = item.AccountCCY;
                counterpartyBankAccountRow[fedaba] = item.FEDABA;
                counterpartyBankAccountRow[chips] = item.Chips;
                counterpartyBankAccountRow[bankPhoneNo] = item.BankPhoneNo;
                counterpartyBankAccountRow[bankFaxNo] = item.BankFaxNo;
                counterpartyBankAccountRow[bankTelexNo] = item.BankTelexNo;
                counterpartyBankAccountRow[externalReference] = item.ExternalReference;
                counterpartyBankAccountRow[bankTypeID] = item.BankTypeID;
                counterpartyBankAccountRow[bankAccountStatusID] = item.BankAccountStatusID;
                counterpartyBankAccountRow[mdmId] = (item.MDMId == null) ? (object)DBNull.Value : item.MDMId;
                counterpartyBankAccountRow[counterPartyId] = (item.CounterpartyId == null) ? (object)DBNull.Value : item.CounterpartyId;
                counterpartyBankAccountRow[bankAccountDefault] = (item.BankAccountDefault == null) ? (object)DBNull.Value : item.BankAccountDefault;
                counterpartyBankAccountRow[bankAccountIntermediary] = (item.BankAccountIntermediary == null) ? (object)DBNull.Value : item.BankAccountIntermediary;
                counterpartyBankAccountRow[bankAccountDescription] = (item.BankAccountDescription == null) ? string.Empty : item.BankAccountDescription;
                counterpartyBankAccountRow[bankAddressLine1] = (item.BankAddressLine1 == null) ? string.Empty : item.BankAddressLine1;
                counterpartyBankAccountRow[bankAddressLine2] = item.BankAddressLine2;
                counterpartyBankAccountRow[bankAddressLine3] = item.BankAddressLine3;
                counterpartyBankAccountRow[bankAddressLine4] = item.BankAddressLine4;
                counterpartyBankAccountRow[isDeactivated] = item.IsDeactivated;
                // counterpartyBankAccountRow[isDeleted] = item.IsDeleted;
                counterpartyBankAccountRow[interfaceCode] = item.InterfaceCode;
                counterpartyBankAccountRow[bankNccType] = (item.BankNccType == null) ? (object)DBNull.Value : item.BankNccType;
                counterpartyBankAccountRow[tempBankAccountId] = (item.TempBankAccountId == null) ? (object)DBNull.Value : item.TempBankAccountId;

                tablecounterpartyBankAccounts.Rows.Add(counterpartyBankAccountRow);
            }

            return tablecounterpartyBankAccounts;
        }

        private DataTable CounterpartyBankAccountIntermediariesTVP(List<CounterpartyBankAccountIntermediary> counterpartyBankAccountIntermediaries)
        {
            DataTable tableBankAccountIntermediaries = new DataTable();
            tableBankAccountIntermediaries.SetTypeName("[MasterData].[UDTT_BankAccountIntermediary]");

            DataColumn bankAccountIntermediaryId = new DataColumn("[BankAccountIntermediaryId]", typeof(long));
            tableBankAccountIntermediaries.Columns.Add(bankAccountIntermediaryId);

            DataColumn bankAccountId = new DataColumn("[BankAccountId]", typeof(long));
            tableBankAccountIntermediaries.Columns.Add(bankAccountId);

            DataColumn bankKey = new DataColumn("[BankKey]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankKey);

            DataColumn bankName = new DataColumn("[BankName]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankName);

            DataColumn bankCountryKey = new DataColumn("[BankCountryKey]", typeof(long));
            tableBankAccountIntermediaries.Columns.Add(bankCountryKey);

            DataColumn bankCity = new DataColumn("[BankCity]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankCity);

            DataColumn bankSwiftCode = new DataColumn("[BankSwiftCode]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankSwiftCode);

            DataColumn ncc = new DataColumn("[NCC]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(ncc);

            DataColumn ncs = new DataColumn("[NCS]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(ncs);

            DataColumn bankBranch = new DataColumn("[BankBranch]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankBranch);

            DataColumn bankZIPCode = new DataColumn("[BankZIPCode]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankZIPCode);

            DataColumn bankAccountDesc = new DataColumn("[BankAccountDesc]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankAccountDesc);

            DataColumn accountNo = new DataColumn("[AccountNo]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(accountNo);

            DataColumn accountCCY = new DataColumn("[AccountCCY]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(accountCCY);

            DataColumn fedaba = new DataColumn("[FEDABA]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(fedaba);

            DataColumn chips = new DataColumn("[Chips]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(chips);

            DataColumn bankPhoneNo = new DataColumn("[BankPhoneNo]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankPhoneNo);

            DataColumn bankFaxNo = new DataColumn("[BankFaxNo]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankFaxNo);

            DataColumn bankTelexNo = new DataColumn("[BankTelexNo]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankTelexNo);

            DataColumn externalReference = new DataColumn("[ExternalReference]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(externalReference);

            DataColumn bankTypeID = new DataColumn("[BankTypeID]", typeof(short));
            tableBankAccountIntermediaries.Columns.Add(bankTypeID);

            DataColumn bankAccountStatusID = new DataColumn("[BankAccountStatusID]", typeof(short));
            tableBankAccountIntermediaries.Columns.Add(bankAccountStatusID);

            DataColumn mdmId = new DataColumn("[MDMId]", typeof(decimal));
            tableBankAccountIntermediaries.Columns.Add(mdmId);

            DataColumn counterPartyId = new DataColumn("[CounterPartyId]", typeof(long));
            tableBankAccountIntermediaries.Columns.Add(counterPartyId);

            DataColumn bankAccountDefault = new DataColumn("[BankAccountDefault]", typeof(bool));
            tableBankAccountIntermediaries.Columns.Add(bankAccountDefault);

            DataColumn bankAccountIntermediary = new DataColumn("[BankAccountIntermediary]", typeof(bool));
            tableBankAccountIntermediaries.Columns.Add(bankAccountIntermediary);

            DataColumn bankAccountDescription = new DataColumn("[BankAccountDescription]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankAccountDescription);

            DataColumn bankAddressLine1 = new DataColumn("[BankAddressLine1]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankAddressLine1);

            DataColumn bankAddressLine2 = new DataColumn("[BankAddressLine2]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankAddressLine2);

            DataColumn bankAddressLine3 = new DataColumn("[BankAddressLine3]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankAddressLine3);

            DataColumn bankAddressLine4 = new DataColumn("[BankAddressLine4]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankAddressLine4);

            DataColumn isDeactivated = new DataColumn("[IsDeactivated]", typeof(bool));
            tableBankAccountIntermediaries.Columns.Add(isDeactivated);

            DataColumn isDeleted = new DataColumn("[IsDeleted]", typeof(bool));
            tableBankAccountIntermediaries.Columns.Add(isDeleted);

            DataColumn parentBankAccountId = new DataColumn("[ParentBankAccountId]", typeof(long));
            tableBankAccountIntermediaries.Columns.Add(parentBankAccountId);

            DataColumn order = new DataColumn("[Order]", typeof(int));
            tableBankAccountIntermediaries.Columns.Add(order);

            DataColumn interfaceCode = new DataColumn("[InterfaceCode]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(interfaceCode);

            DataColumn bankNccType = new DataColumn("[BankNccType]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(bankNccType);

            DataColumn tempParentBankAccountId = new DataColumn("[TempParentBankAccountId]", typeof(string));
            tableBankAccountIntermediaries.Columns.Add(tempParentBankAccountId);

            foreach (var item in counterpartyBankAccountIntermediaries)
            {
                if (!string.IsNullOrWhiteSpace(item.BankName) && !string.IsNullOrWhiteSpace(item.AccountNo))
                {
                    // add counterpartyBankAccountIntermediaries details
                    var counterpartyBankAccountIntermediaryRow = tableBankAccountIntermediaries.NewRow();

                    counterpartyBankAccountIntermediaryRow[bankAccountIntermediaryId] = (item.BankAccountIntermediaryId == null) ? (object)DBNull.Value : item.BankAccountIntermediaryId;
                    counterpartyBankAccountIntermediaryRow[bankAccountId] = (item.BankAccountId == null) ? (object)DBNull.Value : item.BankAccountId;
                    counterpartyBankAccountIntermediaryRow[bankKey] = (item.BankKey == null) ? (object)DBNull.Value : item.BankKey;
                    counterpartyBankAccountIntermediaryRow[bankName] = item.BankName;
                    counterpartyBankAccountIntermediaryRow[bankCountryKey] = (item.BankCountryKey == null) ? (object)DBNull.Value : item.BankCountryKey;
                    counterpartyBankAccountIntermediaryRow[bankCity] = item.BankCity;
                    counterpartyBankAccountIntermediaryRow[bankSwiftCode] = item.BankSwiftCode;
                    counterpartyBankAccountIntermediaryRow[ncc] = item.NCC;
                    counterpartyBankAccountIntermediaryRow[ncs] = item.NCS;
                    counterpartyBankAccountIntermediaryRow[bankBranch] = item.BankBranch;
                    counterpartyBankAccountIntermediaryRow[bankZIPCode] = item.BankZIPCode;
                    counterpartyBankAccountIntermediaryRow[bankAccountDesc] = item.BankAccountDesc;
                    counterpartyBankAccountIntermediaryRow[accountNo] = item.AccountNo;
                    counterpartyBankAccountIntermediaryRow[accountCCY] = item.AccountCCY;
                    counterpartyBankAccountIntermediaryRow[fedaba] = item.FEDABA;
                    counterpartyBankAccountIntermediaryRow[chips] = item.Chips;
                    counterpartyBankAccountIntermediaryRow[bankPhoneNo] = item.BankPhoneNo;
                    counterpartyBankAccountIntermediaryRow[bankFaxNo] = item.BankFaxNo;
                    counterpartyBankAccountIntermediaryRow[bankTelexNo] = item.BankTelexNo;
                    counterpartyBankAccountIntermediaryRow[externalReference] = item.ExternalReference;
                    counterpartyBankAccountIntermediaryRow[bankTypeID] = (item.BankTypeID == null) ? (object)DBNull.Value : item.BankTypeID;
                    counterpartyBankAccountIntermediaryRow[bankAccountStatusID] = (item.BankAccountStatusID == null) ? (object)DBNull.Value : item.BankAccountStatusID;
                    counterpartyBankAccountIntermediaryRow[mdmId] = (item.MDMId == null) ? (object)DBNull.Value : item.MDMId;
                    counterpartyBankAccountIntermediaryRow[counterPartyId] = (item.CounterPartyId == null) ? (object)DBNull.Value : item.CounterPartyId;
                    counterpartyBankAccountIntermediaryRow[bankAccountDefault] = (item.BankAccountDefault == null) ? (object)DBNull.Value : item.BankAccountDefault;
                    counterpartyBankAccountIntermediaryRow[bankAccountIntermediary] = (item.BankAccountIntermediary == null) ? (object)DBNull.Value : item.BankAccountIntermediary;
                    counterpartyBankAccountIntermediaryRow[bankAccountDescription] = (item.BankAccountDescription == null) ? string.Empty : item.BankAccountDescription;
                    counterpartyBankAccountIntermediaryRow[bankAddressLine1] = item.BankAddressLine1;
                    counterpartyBankAccountIntermediaryRow[bankAddressLine2] = item.BankAddressLine2;
                    counterpartyBankAccountIntermediaryRow[bankAddressLine3] = item.BankAddressLine3;
                    counterpartyBankAccountIntermediaryRow[bankAddressLine4] = item.BankAddressLine4;
                    counterpartyBankAccountIntermediaryRow[isDeactivated] = item.IsDeactivated;
                    counterpartyBankAccountIntermediaryRow[isDeleted] = item.IsDeleted;
                    counterpartyBankAccountIntermediaryRow[parentBankAccountId] = (item.ParentBankAccountId == null) ? (object)DBNull.Value : item.ParentBankAccountId;
                    counterpartyBankAccountIntermediaryRow[order] = (item.Order == null) ? (object)DBNull.Value : item.Order;
                    counterpartyBankAccountIntermediaryRow[interfaceCode] = item.InterfaceCode;
                    counterpartyBankAccountIntermediaryRow[bankNccType] = (item.BankNccType == null) ? (object)DBNull.Value : item.BankNccType;
                    counterpartyBankAccountIntermediaryRow[tempParentBankAccountId] = (item.TempParentBankAccountId == null) ? (object)DBNull.Value : item.TempParentBankAccountId;

                    tableBankAccountIntermediaries.Rows.Add(counterpartyBankAccountIntermediaryRow);
                }
            }

            return tableBankAccountIntermediaries;
        }

        private DataTable CounterpartyContactTVP(List<CounterpartyContact> counterpartyContacts)
        {
            DataTable tablecounterpartyContacts = new DataTable();
            tablecounterpartyContacts.SetTypeName("[MasterData].[UDTT_Contact]");

            DataColumn contactId = new DataColumn("[ContactId]", typeof(long));
            tablecounterpartyContacts.Columns.Add(contactId);

            DataColumn title = new DataColumn("[Title]", typeof(short));
            tablecounterpartyContacts.Columns.Add(title);

            DataColumn contactName = new DataColumn("[ContactName]", typeof(string));
            tablecounterpartyContacts.Columns.Add(contactName);

            DataColumn surname = new DataColumn("[Surname]", typeof(string));
            tablecounterpartyContacts.Columns.Add(surname);

            DataColumn firstName = new DataColumn("[FirstName]", typeof(string));
            tablecounterpartyContacts.Columns.Add(firstName);

            DataColumn extraInitials = new DataColumn("[ExtraInitials]", typeof(string));
            tablecounterpartyContacts.Columns.Add(extraInitials);

            DataColumn jobRole = new DataColumn("[JobRole]", typeof(string));
            tablecounterpartyContacts.Columns.Add(jobRole);

            DataColumn domain = new DataColumn("[Domain]", typeof(string));
            tablecounterpartyContacts.Columns.Add(domain);

            DataColumn address1 = new DataColumn("[Address1]", typeof(string));
            tablecounterpartyContacts.Columns.Add(address1);

            DataColumn address2 = new DataColumn("[Address2]", typeof(string));
            tablecounterpartyContacts.Columns.Add(address2);

            DataColumn zipCode = new DataColumn("[ZipCode]", typeof(string));
            tablecounterpartyContacts.Columns.Add(zipCode);

            DataColumn city = new DataColumn("[City]", typeof(string));
            tablecounterpartyContacts.Columns.Add(city);

            DataColumn countryId = new DataColumn("[CountryId]", typeof(long));
            tablecounterpartyContacts.Columns.Add(countryId);

            DataColumn email = new DataColumn("[Email]", typeof(string));
            tablecounterpartyContacts.Columns.Add(email);

            DataColumn phoneNo = new DataColumn("[PhoneNo]", typeof(string));
            tablecounterpartyContacts.Columns.Add(phoneNo);

            DataColumn mobilePhoneNo = new DataColumn("[MobilePhoneNo]", typeof(string));
            tablecounterpartyContacts.Columns.Add(mobilePhoneNo);

            DataColumn privatePhoneNo = new DataColumn("[PrivatePhoneNo]", typeof(string));
            tablecounterpartyContacts.Columns.Add(privatePhoneNo);

            DataColumn communications = new DataColumn("[Communications]", typeof(string));
            tablecounterpartyContacts.Columns.Add(communications);

            DataColumn counterpartyId = new DataColumn("[CounterpartyId]", typeof(long));
            tablecounterpartyContacts.Columns.Add(counterpartyId);

            DataColumn main = new DataColumn("[Main]", typeof(bool));
            tablecounterpartyContacts.Columns.Add(main);

            foreach (var item in counterpartyContacts)
            {
                // add counterparty contact details
                var counterpartyContactRow = tablecounterpartyContacts.NewRow();

                counterpartyContactRow[contactId] = (item.ContactId == null) ? (object)DBNull.Value : item.ContactId;
                counterpartyContactRow[title] = (item.Title == null) ? (object)DBNull.Value : item.Title;
                counterpartyContactRow[contactName] = item.ContactName;
                counterpartyContactRow[surname] = item.Surname;
                counterpartyContactRow[firstName] = item.FirstName;
                counterpartyContactRow[extraInitials] = item.ExtraInitials;
                counterpartyContactRow[jobRole] = item.JobRole;
                counterpartyContactRow[domain] = item.Domain;
                counterpartyContactRow[address1] = item.Address1;
                counterpartyContactRow[address2] = item.Address2;
                counterpartyContactRow[zipCode] = item.ZipCode;
                counterpartyContactRow[city] = item.City;
                counterpartyContactRow[countryId] = item.CountryId;
                counterpartyContactRow[email] = item.Email;
                counterpartyContactRow[phoneNo] = item.PhoneNo;
                counterpartyContactRow[mobilePhoneNo] = item.MobilePhoneNo;
                counterpartyContactRow[privatePhoneNo] = item.PrivatePhoneNo;
                counterpartyContactRow[communications] = item.Communications;
                counterpartyContactRow[counterpartyId] = (item.CounterpartyId == null) ? (object)DBNull.Value : item.CounterpartyId;
                counterpartyContactRow[main] = item.Main;

                tablecounterpartyContacts.Rows.Add(counterpartyContactRow);
            }

            return tablecounterpartyContacts;
        }

        private DataTable CounterpartyCompanyTVP(IEnumerable<CounterpartyCompany> counterpartyCompanies)
        {
            DataTable tablecounterpartyCompanies = new DataTable();
            tablecounterpartyCompanies.SetTypeName("[MasterData].[UDTT_CounterpartyCompany]");

            DataColumn counterpartyID = new DataColumn("[CounterpartyID]", typeof(long));
            tablecounterpartyCompanies.Columns.Add(counterpartyID);

            DataColumn isDeactivated = new DataColumn("[IsDeactivated]", typeof(bool));
            tablecounterpartyCompanies.Columns.Add(isDeactivated);

            DataColumn c2cCode = new DataColumn("[C2CCode]", typeof(string));
            tablecounterpartyCompanies.Columns.Add(c2cCode);

            DataColumn companyId = new DataColumn("[CompanyId]", typeof(long));
            tablecounterpartyCompanies.Columns.Add(companyId);

            DataColumn departmentId = new DataColumn("[DepartmentId]", typeof(long));
            tablecounterpartyCompanies.Columns.Add(departmentId);

            foreach (var item in counterpartyCompanies)
            {
                // add counterpartyCompanies details
                var counterpartyCompanyRow = tablecounterpartyCompanies.NewRow();

                counterpartyCompanyRow[counterpartyID] = (item.CounterpartyID == null) ? (object)DBNull.Value : item.CounterpartyID;
                counterpartyCompanyRow[isDeactivated] = item.IsDeactivated;
                counterpartyCompanyRow[c2cCode] = item.C2CCode;
                counterpartyCompanyRow[companyId] = item.CompanyId;
                counterpartyCompanyRow[departmentId] = (item.DepartmentId == null) ? (object)DBNull.Value : item.DepartmentId;

                tablecounterpartyCompanies.Rows.Add(counterpartyCompanyRow);
            }

            return tablecounterpartyCompanies;

        }

        private DataTable CounterpartyAccountTypeTVP(IEnumerable<CounterpartyAccountType> counterpartyAccountType)
        {
            DataTable tablecounterpartyAccountTypes = new DataTable();
            tablecounterpartyAccountTypes.SetTypeName("[MasterData].[UDTT_CounterpartyAccountType]");

            DataColumn counterpartyID = new DataColumn("[CounterpartyId]", typeof(long));
            tablecounterpartyAccountTypes.Columns.Add(counterpartyID);

            DataColumn counterPartyAccountTypeId = new DataColumn("[CounterPartyAccountTypeId]", typeof(long));
            tablecounterpartyAccountTypes.Columns.Add(counterPartyAccountTypeId);

            DataColumn accountTypeId = new DataColumn("[AccountTypeId]", typeof(long));
            tablecounterpartyAccountTypes.Columns.Add(accountTypeId);

            foreach (var item in counterpartyAccountType)
            {
                // add counterpartyAccountType details
                var counterpartyAccountTypeRow = tablecounterpartyAccountTypes.NewRow();
                item.CounterPartyAccountTypeId = (item.CounterpartyID == null || item.CounterpartyID == 0) ? null : item.CounterPartyAccountTypeId;

                counterpartyAccountTypeRow[counterpartyID] = (item.CounterpartyID == null) ? (object)DBNull.Value : item.CounterpartyID;
                counterpartyAccountTypeRow[counterPartyAccountTypeId] = (item.CounterPartyAccountTypeId == null) ? (object)DBNull.Value : item.CounterPartyAccountTypeId;
                counterpartyAccountTypeRow[accountTypeId] = (item.AccountTypeId == null) ? (object)DBNull.Value : item.AccountTypeId;

                tablecounterpartyAccountTypes.Rows.Add(counterpartyAccountTypeRow);
            }

            return tablecounterpartyAccountTypes;

        }


        private DataTable CounterpartyMdmCategoryTVP(IEnumerable<CounterpartyMdmCategory> counterpartyMdmCategory)
        {
            DataTable tablecounterpartyMdmCategory = new DataTable();
            tablecounterpartyMdmCategory.SetTypeName("[MasterData].[UDTT_CounterpartyMDMCategory]");

            DataColumn counterPartyMDMCategoryId = new DataColumn("[CounterPartyMDMCategoryId]", typeof(long));
            tablecounterpartyMdmCategory.Columns.Add(counterPartyMDMCategoryId);


            DataColumn counterPartyID = new DataColumn("[CounterPartyID]", typeof(long));
            tablecounterpartyMdmCategory.Columns.Add(counterPartyID);

            DataColumn MDMCategoryID = new DataColumn("[MDMCategoryID]", typeof(long));
            tablecounterpartyMdmCategory.Columns.Add(MDMCategoryID);

            foreach (var item in counterpartyMdmCategory)
            {
                // add counterpartyAccountType details
                var counterpartyMdmCategoryRow = tablecounterpartyMdmCategory.NewRow();
                item.CounterPartyMDMCategoryId = (item.CounterPartyID == null || item.CounterPartyID == 0) ? null : item.CounterPartyMDMCategoryId;

                counterpartyMdmCategoryRow[counterPartyID] = (item.CounterPartyID == null) ? (object)DBNull.Value : item.CounterPartyID;
                counterpartyMdmCategoryRow[counterPartyMDMCategoryId] = (item.CounterPartyMDMCategoryId == null) ? (object)DBNull.Value : item.CounterPartyMDMCategoryId;
                counterpartyMdmCategoryRow[MDMCategoryID] = (item.MdmCategoryID == null) ? (object)DBNull.Value : item.MdmCategoryID;

                tablecounterpartyMdmCategory.Rows.Add(counterpartyMdmCategoryRow);
            }

            return tablecounterpartyMdmCategory;

        }

        private DataTable CounterpartyTaxTVP(IEnumerable<CounterpartyTax> counterpartyTaxes)
        {
            DataTable tablecounterpartyTaxes = new DataTable();
            tablecounterpartyTaxes.SetTypeName("[MasterData].[UDTT_CounterpartyTax]");

            DataColumn counterpartyTaxId = new DataColumn("[CounterpartyTaxId]", typeof(long));
            tablecounterpartyTaxes.Columns.Add(counterpartyTaxId);

            DataColumn counterpartyID = new DataColumn("[CounterpartyID]", typeof(long));
            tablecounterpartyTaxes.Columns.Add(counterpartyID);

            DataColumn countryId = new DataColumn("[CountryId]", typeof(long));
            tablecounterpartyTaxes.Columns.Add(countryId);

            DataColumn vatRegistrationNumber = new DataColumn("[VATRegistrationNumber]", typeof(string));
            tablecounterpartyTaxes.Columns.Add(vatRegistrationNumber);

            DataColumn main = new DataColumn("[Main]", typeof(bool));
            tablecounterpartyTaxes.Columns.Add(main);

            DataColumn isDeactivated = new DataColumn("[IsDeactivated]", typeof(bool));
            tablecounterpartyTaxes.Columns.Add(isDeactivated);

            foreach (var item in counterpartyTaxes)
            {

                // add counterpartyTaxes details
                var counterpartyTaxRow = tablecounterpartyTaxes.NewRow();
                item.CounterpartyTaxId = (item.CounterpartyId == null || item.CounterpartyId == 0) ? null : item.CounterpartyTaxId;

                counterpartyTaxRow[counterpartyTaxId] = (item.CounterpartyTaxId == null) ? (object)DBNull.Value : item.CounterpartyTaxId;
                counterpartyTaxRow[counterpartyID] = (item.CounterpartyId == null) ? (object)DBNull.Value : item.CounterpartyId;
                counterpartyTaxRow[countryId] = item.CountryId;
                counterpartyTaxRow[vatRegistrationNumber] = item.VATRegistrationNumber;
                counterpartyTaxRow[main] = item.Main;
                counterpartyTaxRow[isDeactivated] = item.IsDeactivated;

                tablecounterpartyTaxes.Rows.Add(counterpartyTaxRow);
            }

            return tablecounterpartyTaxes;
        }

        private DataTable CounterpartyTVP(IEnumerable<Counterparty> counterparties)
        {
            DataTable tablecounterparties = new DataTable();
            tablecounterparties.SetTypeName("[MasterData].[UDTT_Counterparty]");

            DataColumn counterpartyID = new DataColumn("[CounterpartyID]", typeof(long));
            tablecounterparties.Columns.Add(counterpartyID);

            DataColumn counterpartyCode = new DataColumn("[CounterpartyCode]", typeof(string));
            tablecounterparties.Columns.Add(counterpartyCode);

            DataColumn counterpartyType = new DataColumn("[CounterpartyType]", typeof(string));
            tablecounterparties.Columns.Add(counterpartyType);

            DataColumn description = new DataColumn("[Description]", typeof(string));
            tablecounterparties.Columns.Add(description);

            DataColumn mdmId = new DataColumn("[MDMId]", typeof(decimal));
            tablecounterparties.Columns.Add(mdmId);

            DataColumn isDeactivated = new DataColumn("[IsDeactivated]", typeof(bool));
            tablecounterparties.Columns.Add(isDeactivated);

            DataColumn counterpartyTradeStatusId = new DataColumn("[CounterpartyTradeStatusId]", typeof(int));
            tablecounterparties.Columns.Add(counterpartyTradeStatusId);

            DataColumn headofFamily = new DataColumn("[HeadofFamily]", typeof(long));
            tablecounterparties.Columns.Add(headofFamily);

            DataColumn countryId = new DataColumn("[CountryId]", typeof(long));
            tablecounterparties.Columns.Add(countryId);

            DataColumn provinceId = new DataColumn("[ProvinceId]", typeof(long));
            tablecounterparties.Columns.Add(provinceId);

            DataColumn c2cCode = new DataColumn("[C2CCode]", typeof(string));
            tablecounterparties.Columns.Add(c2cCode);

            DataColumn vatRegistrationNumber = new DataColumn("[VATRegistrationNumber]", typeof(string));
            tablecounterparties.Columns.Add(vatRegistrationNumber);

            DataColumn fiscalRegistrationNumber = new DataColumn("[FiscalRegistrationNumber]", typeof(string));
            tablecounterparties.Columns.Add(fiscalRegistrationNumber);

            DataColumn contractTermId = new DataColumn("[ContractTermId]", typeof(long));
            tablecounterparties.Columns.Add(contractTermId);

            DataColumn acManagerId = new DataColumn("[ACManagerId]", typeof(long));
            tablecounterparties.Columns.Add(acManagerId);

            DataColumn departmentId = new DataColumn("[DepartmentId]", typeof(long));
            tablecounterparties.Columns.Add(departmentId);

            DataColumn alternateMailingAddress1 = new DataColumn("[AlternateMailingAddress1]", typeof(string));
            tablecounterparties.Columns.Add(alternateMailingAddress1);

            DataColumn alternateMailingAddress2 = new DataColumn("[AlternateMailingAddress2]", typeof(string));
            tablecounterparties.Columns.Add(alternateMailingAddress2);

            DataColumn alternateMailingAddress3 = new DataColumn("[AlternateMailingAddress3]", typeof(string));
            tablecounterparties.Columns.Add(alternateMailingAddress3);

            DataColumn alternateMailingAddress4 = new DataColumn("[AlternateMailingAddress4]", typeof(string));
            tablecounterparties.Columns.Add(alternateMailingAddress4);

            DataColumn introductoryBrocker = new DataColumn("[IntroductoryBrocker]", typeof(string));
            tablecounterparties.Columns.Add(introductoryBrocker);

            foreach (var item in counterparties)
            {
                // add counterparty details
                var counterpartyRow = tablecounterparties.NewRow();

                counterpartyRow[counterpartyID] = (item.CounterpartyID == null) ? (object)DBNull.Value : item.CounterpartyID;
                counterpartyRow[counterpartyCode] = item.CounterpartyCode;
                counterpartyRow[counterpartyType] = item.CounterpartyType;
                counterpartyRow[description] = item.Description;
                counterpartyRow[mdmId] = (item.MDMId == null) ? (object)DBNull.Value : item.MDMId;
                counterpartyRow[isDeactivated] = item.IsDeactivated;
                counterpartyRow[counterpartyTradeStatusId] = (item.CounterpartyTradeStatusId == null) ? (object)DBNull.Value : item.CounterpartyTradeStatusId;
                counterpartyRow[headofFamily] = (item.HeadofFamily == null) ? (object)DBNull.Value : item.HeadofFamily;
                counterpartyRow[countryId] = (item.CountryId == null) ? (object)DBNull.Value : item.CountryId;
                counterpartyRow[provinceId] = (item.ProvinceId == null) ? (object)DBNull.Value : item.ProvinceId;
                counterpartyRow[c2cCode] = item.C2CCode;
                counterpartyRow[vatRegistrationNumber] = item.VATRegistrationNumber;
                counterpartyRow[fiscalRegistrationNumber] = item.FiscalRegistrationNumber;
                counterpartyRow[contractTermId] = (item.ContractTermId == null) ? (object)DBNull.Value : item.ContractTermId;
                counterpartyRow[acManagerId] = (item.ACManagerId == null) ? (object)DBNull.Value : item.ACManagerId;
                counterpartyRow[departmentId] = (item.DepartmentId == null) ? (object)DBNull.Value : item.DepartmentId;
                counterpartyRow[alternateMailingAddress1] = item.AlternateMailingAddress1;
                counterpartyRow[alternateMailingAddress2] = item.AlternateMailingAddress2;
                counterpartyRow[alternateMailingAddress3] = item.AlternateMailingAddress3;
                counterpartyRow[alternateMailingAddress4] = item.AlternateMailingAddress4;
                counterpartyRow[introductoryBrocker] = item.IntroductoryBrocker;

                tablecounterparties.Rows.Add(counterpartyRow);
            }
            return tablecounterparties;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCounterparties = "[Masterdata].[usp_ListCounterparties]";
            internal const string GetCounterpartiesByPricingMethodAndDealType = "[MasterData].[usp_ListCounterpartiesByPricingMethodAndDealType]";
            internal const string AddUpdateCounterparty = "[MasterData].[usp_AddUpdateCounterpartyDetails]";
            internal const string BulkUpdateCounterparty = "[MasterData].[usp_BulkUpdateCounterpartyDetails]";
            internal const string DeleteCounterpartyDetails = "[MasterData].[usp_DeleteCounterpartyDetails]";
        }
    }
}
