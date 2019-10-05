export interface InvoiceSearchResult {

    invoiceId: number;

    createdDateTime: Date;

    invoiceCode: string;

    invoiceDate: Date;

    invoiceTypeId: number;

    invoiceTypeDescription: string;

    counterParty: string;

    clientAccount: string;

    charterReference: string;

    paymentTermsCode: string;

    dueDate: Date;

    externalInvoiceReference: string;

    externalInhouseLabel: string;

    lineQuantity: number;

    price: number;

    currencyCode: string;

    totalInvoiceValue: number;

    weightCode: string;

    companyId: string;

    postingStatus: string;

    originalInvoiceTypeId: number;

    department: string;
}
