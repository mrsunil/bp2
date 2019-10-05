import { ManualJournalLine } from './manual-journal-document-line.entity';

export class ManualJournalDocument {
    journalId: number;
    dataVersionId: number;
    transactionDocumentId: number;
    valueDate: Date;
    accountingPeriod: Date;
    currencyCode: string;
    transactionDocumentTypeId: number;
    taTypeId: number;
    authorizedForPosting: boolean;
    physicalDocumentId: number;
    documentReference: string;
    yearNumber: number;
    year: number;
    documentDate: Date;
    toInterface: boolean;
    manualJournalLines: ManualJournalLine[];
    c2CCode: string;
    nominalAlternativeAccount: string;
    costAlternativeCode: string;
    departmentAlternativeCode: string;
    taxInterfaceCode: string;

    constructor(manualJournalLines: ManualJournalLine[] = null) {
        this.manualJournalLines = manualJournalLines;
    }
}
