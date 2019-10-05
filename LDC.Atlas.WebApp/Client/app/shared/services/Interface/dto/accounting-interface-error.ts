export class AccountingInterfaceError {
    documentReference: string;
    transactionDocumentId: number;
    accountingId: number;
    transactionDocumentTypeId: number;
    boInterfaceDate: string;
    backInterfaceDate: Date;
    profile: string;
    boDocID: string;
    boJournalID: string;
    interfaceStatusId: number;
    accountingInterfaceStatus: string;
    errorDescription: string;
    accrualNumber: number;
}
