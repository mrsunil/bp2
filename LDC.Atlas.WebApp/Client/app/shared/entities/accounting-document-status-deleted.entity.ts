import { AccountingDocumentStatus } from './accounting-document-status.entity';

export class AccountingDocumentStatusToDeletedCommand {
    accountingDocuments: AccountingDocumentStatus[];
}