export interface TransactionDocumentSearchResult {
    accountingId: number;
    docRef: string;
    accRef: string;
    currency: string;
    accPeriod: Date;
    amount: number;
    contractNumber: string;
    department: string;
    docDate: Date;
    status: string;
    associatedAcc: string;
    authorizedOn: Date;
    authorizedAt: string;
    authorizedBy: string;
}
