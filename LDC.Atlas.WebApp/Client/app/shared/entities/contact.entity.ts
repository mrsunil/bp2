export interface Contact {
    randomId: number;
    contactId: number;
    title: number;
    contactName: string;
    surname: string;
    firstName: string;
    extraInitials: string;
    jobRole: string;
    domain: string;
    address1: string;
    address2: string;
    zipCode: string
    city: string;
    countryId: number;
    email: string;
    phoneNo: string;
    mobilePhoneNo: string;
    privatePhoneNo: string;
    communications: string;
    counterpartyId: number;
    main: boolean;
    titleValue: string;
    isFavorite: boolean;
    isDeleted: boolean;
    isDeactivated: boolean;
}