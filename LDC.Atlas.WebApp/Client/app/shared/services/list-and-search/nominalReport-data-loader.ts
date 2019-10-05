import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { DataLoader } from '../../entities/list-and-search/list-and-search-data-loader.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { AccountingDocumentService } from '../http-services/accounting-document.service';
import { ApiPaginatedCollection } from '../common/models';

@Injectable()
export class NominalReportDataLoader implements DataLoader {

    constructor(private accountingDocumentService: AccountingDocumentService) {
    }

    getData(filters: ListAndSearchFilter[],
        dataVersionId?: number,
        offset?: number,
        limit?: number,
        additionalParameters?: any): Observable<ApiPaginatedCollection<any>> {

        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
            additionalParameters,
        };
        const list = this.accountingDocumentService.searchNominalReport(request)
            .pipe(
                map((data) => {
                    return data;
                }),
            );

        return list;
    }

}
