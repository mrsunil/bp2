import { DocumentMatching } from '../../execution/dtos/document-matching';
import { ManualDocumentUnmatchingRecord } from '../../execution/dtos/manual-unmatch-record';

export class DocumentMatchingRecord {
    counterpartyId: number;
    counterpartyCode: string;
    currencyCode: string;
    departmentCode: string;
    documentMatchings: DocumentMatching[] = [];
    manualDocumentMatchings: DocumentMatching[] = [];
    paymentDocumentDate: Date;
    journalId: string;
    matchFlagId: number;
    functionalCurrency: string;
    statutoryCurrency: string;
    transactionDocumentId: number;
    reversalRevalJournalCode: string;
    matchFlagCode: string;
    totalAmount: number;
    unmatchDocuments: ManualDocumentUnmatchingRecord[] = [];
}
