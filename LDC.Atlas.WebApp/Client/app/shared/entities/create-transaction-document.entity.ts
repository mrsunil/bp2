export class CreateTransactionDocument {
    company: string;
    transactionDocumentTypeId: number;
    transactionDocumentId: number;
    documentDate: Date;
    currencyCode: string;
    authorizedForPosting: boolean;
    physicalDocumentId: number;
    toInterface: boolean;
}
