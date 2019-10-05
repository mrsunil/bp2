export interface InvoiceMarkingDetails {
    invoiceCode: string;
    invoicePercent: number;
    quantity: number;
    invoiceDate: Date;
    weightCode: string;
    createdDateTime: Date;
    sectionId: number;
    transactionDocumentId: number;
    documentReference: string;
    externalInhouse: number;
    transactionDocumentTypeId: number;
    invoiceId: number;
}
