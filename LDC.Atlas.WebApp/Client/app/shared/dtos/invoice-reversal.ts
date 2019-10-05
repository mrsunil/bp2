import { InvoiceTypes } from '../enums/invoice-type.enum';

export interface InvoiceReversalSearchResult {
    invoiceReference: string;
    contractReference: string;
    customerRef: string;
    documentDate: Date;
    charterReference: string;
    currencyCode: string;
    quantity: number;
    totalInvoiceValue: number;
    costAmount: number;
    contractUnApproved: boolean;
    invoiceMatched: boolean;
    invoiceId: number;
    transactionDocumentId: number;
    documentId: number;
    transactionDocumentTypeId: number;
    invoiceTypeId: InvoiceTypes;
    hasPhysicalDocument: boolean;
}
