import { AccountingEntriesSearchResult } from '../../shared/dtos/accountingEntries-search-result';

export interface ReversalAccountingDocument {
    accountingId: number;
    accountingDocumentLines: AccountingEntriesSearchResult[];
}
