import { PostingDocumentType } from '../enums/posting-document-type.enum';
import { PostingStatus } from '../enums/posting-status.enum';

export class AccountingDocumentStatus {
    accountingId: number;
    statusId: PostingStatus;
    documentType: PostingDocumentType;
}   