import { Contact } from './contact.entity';
import { CounterpartyAccountType } from './counterparty-account-type.entity';
import { CounterpartyAddress } from './counterparty-address.entity';
import { CounterpartyBankAccountDetails } from './counterparty-bank-account-details.entity';
import { CounterpartyBankAccountIntermediary } from './counterparty-bank-account-intermediary.entity';
import { CounterpartyCompany } from './counterparty-company.entity';
import { CounterpartyMdmCategory } from './counterparty-mdm-category.entity';
import { CounterpartyTax } from './counterparty-tax.entity';

export class Counterparty {
    counterpartyID: number;
    counterpartyCode: string;
    counterpartyType: string;
    description: string;
    mdmId: number;
    mdmCategoryCode: string;
    isDeactivated: boolean;
    counterpartyTradeStatusId: number;
    headofFamily: number;
    countryId: number;
    countryName: string;
    provinceId: number;
    provinceName: string;
    c2CCode: string;
    vatRegistrationNumber: string;
    fiscalRegistrationNumber: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    contractTermId: number;
    acManagerId: number;
    acManagerName: string;
    displayName: string;
    accountRef: string;
    accountTitle: string;
    name: string;
    accountTypeName: string;
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    alternateMailingAddress1: string;
    alternateMailingAddress2: string;
    alternateMailingAddress3: string;
    alternateMailingAddress4: string;
    introductoryBrocker: string;

    counterpartyAddresses: CounterpartyAddress[];
    counterpartyBankAccounts: CounterpartyBankAccountDetails[];
    counterpartyBankAccountIntermediaries: CounterpartyBankAccountIntermediary[];
    counterpartyContacts: Contact[];
    counterpartyTaxes: CounterpartyTax[];
    counterpartyCompanies: CounterpartyCompany[];
    associatedCompanies: CounterpartyCompany[];
    counterpartyAccountTypes: CounterpartyAccountType[];
    counterpartyMdmCategory: CounterpartyMdmCategory[];
}