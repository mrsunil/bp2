import { CounterpartyBankAccountIntermediary } from "./counterparty-bank-account-intermediary.entity";

export interface CounterpartyBankAccountDetails {
    randomId: number;
    bankAccountId: number;
    bankKey: string;
    bankName: string;
    bankCountryKey: number;
    bankCity: string;
    bankSwiftCode: string;
    ncc: string;
    ncs: string;
    bankBranch: string;
    bankZIPCode: string;
    bankAccountDesc: string;
    accountNo: string;
    accountCCY: string;
    fedaba: string;
    chips: string;
    bankPhoneNo: string;
    bankFaxNo: string;
    bankTelexNo: string;
    externalReference: string;
    bankTypeID: number;
    bankAccountStatusID: number;
    mdmID: number;
    counterpartyId: number;
    bankAccountDefault: boolean;
    bankAccountIntermediary: boolean;
    bankAddressLine1: string;
    bankAddressLine2: string;
    bankAddressLine3: string;
    bankAddressLine4: string;
    interfaceCode: string;
    bankNccType: string;
    evalue: string;
    stausValue: string;
    isDeactivated: boolean;
    isDeleted: boolean;
    tempBankAccountId: number;

    bankAccountIntermediary1: CounterpartyBankAccountIntermediary;
    bankAccountIntermediary2: CounterpartyBankAccountIntermediary;
}
