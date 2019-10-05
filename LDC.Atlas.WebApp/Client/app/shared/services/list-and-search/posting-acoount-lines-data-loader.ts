import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { DataLoader } from '../../entities/list-and-search/list-and-search-data-loader.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { PreaccountingService } from '../http-services/preaccounting.service';
import { ApiPaginatedCollection } from '../common/models';

@Injectable()
export class PostingAccountLinesDataLoader implements DataLoader {

    constructor(private preaccountingService: PreaccountingService
    ) { }

    getData(filters: ListAndSearchFilter[],
        dataVersionId?: number,
        offset?: number,
        limit?: number): Observable<ApiPaginatedCollection<any>> {

        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
        };
        const list = this.preaccountingService.getAccoutingDocumentDataList(request)
            .pipe(
                map((data) => {
                    return data;
                }),
            );

        return list;
    }
}
