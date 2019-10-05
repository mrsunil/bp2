import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { DataLoader } from '../../entities/list-and-search/list-and-search-data-loader.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { DocumentService } from '../http-services/document.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TradeDocumentDataLoader implements DataLoader {
    constructor(private documentService: DocumentService,
        private route: ActivatedRoute, ) { }

    recordId = Number(this.route.snapshot.paramMap.get('recordId'));
    getData(filters: ListAndSearchFilter[],
        dataVersionId?: number,
        offset?: number,
        limit?: number): Observable<any> {

        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
            dataVersionId,
        };

        const list = this.documentService.getGeneratedDocuments(request)
            .pipe(
                map((data) => {
                    if (this.recordId) {
                        const result = data.value.find((record) => record.recordId === this.recordId)
                        return result;
                    }
                    return data.value;
                }),
            );

        return list;
    }
}
