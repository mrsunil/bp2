export interface CounterpartyBankAccountIntermediary {
    randomId: number;
    bankAccountId: number;
    bankKey: string;
    bankAccountIntermediaryId: number;
    intermediaryId: number;
    bankAccountDesc: string;
    bankAddressLine1: string;
    bankAddressLine2: string;
    bankAddressLine3: string;
    bankAddressLine4: string;
    bankZIPCode: string;
    bankName: string;
    bankCountryKey: number;
    bankCity: string;
    bankSwiftCode: string;
    accountNo: string;
    accountCCY: string;
    externalReference: string;
    bankTypeID: number;
    bankAccountStatusID: number;
    mdmID: number;
    counterpartyId: number;
    bankAccountDefault: boolean;
    bankAccountIntermediary: boolean;
    ncc: string;
    ncs: string;
    bankBranch: string;
    fedaba: string;
    chips: string;
    parentBankAccountId: number;
    order: number;
    intermediaryInterfaceCode: string;
    bankNccType: string;
    isDeactivated: boolean;
    isDeleted: boolean;
    tempParentBankAccountId: number;
}