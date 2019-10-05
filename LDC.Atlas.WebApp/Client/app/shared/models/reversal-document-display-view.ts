import { AccountingEntriesSearchResult } from '../dtos/accountingEntries-search-result';
import { ReversalAccountingDocument } from '../entities/reversal-accounting-document.entity';

export class ReversalDocumentDisplayView {
    accountingId: number;
    accountingDocumentLines: AccountingEntriesSearchResult[];

    constructor(reversalDocument: ReversalAccountingDocument) {
        if (reversalDocument) {
            this.accountingId = reversalDocument.accountingId;

            this.accountingDocumentLines = reversalDocument.accountingDocumentLines;

        }
    }
}
