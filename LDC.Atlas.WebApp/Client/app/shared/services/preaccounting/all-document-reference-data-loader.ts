import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentReferenceSearchResult } from '../../dtos/list-and-search/document-reference-search-result';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { MasterDataLoader } from '../../entities/data-loader';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { AccountingDocumentService } from '../http-services/accounting-document.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

@Injectable()
export class AllDocumentReferenceDataLoader implements MasterDataLoader {
    constructor(private accountingDocumentService: AccountingDocumentService) { }

    getData(): Observable<DocumentReferenceSearchResult[]> {
        const filtersForColumns: ListAndSearchFilterDto[] = [];
        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
        };
        const list = this.accountingDocumentService.documentReferenceContexuaSearch(request, false)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );
        return list;
    }
}
