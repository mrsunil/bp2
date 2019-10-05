export interface BulkEditSearchResult {

    counterpartyID: number;
    addressId: number;
    tradeStatusId: number;
    statusId: boolean;
    accountReference: string;
    accountTitle: string;
    address1: string;
    address2: string;
    main: string;
    city: string;
    country: string;
    mailEmailAddress: string;
    zipCode: string;
    ldcRegion: number;
    provinceId: number;
    province: string;
    addressType: string;
    headOfFamily: string;
    companyId: string;
    mdmId: number;
    mDMCategoryId: number;
    createdOn: Date;
    createdBy: string;
    groupAC: string;
    c2CReference: string;
    dateAmended: Date;
    amendedBy: string;
}