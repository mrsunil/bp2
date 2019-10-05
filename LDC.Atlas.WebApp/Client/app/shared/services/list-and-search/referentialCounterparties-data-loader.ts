import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { DataLoader } from '../../entities/list-and-search/list-and-search-data-loader.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { ReferentialCounterpartiesService } from '../http-services/referential-counterparties.service';
@Injectable()
export class ReferentialCounterpartiesDataLoader implements DataLoader {

    constructor(private referentialCounterpartiesService: ReferentialCounterpartiesService) { }

    getData(filters: ListAndSearchFilter[],
        dataVersionId?: number,
        offset?: number,
        limit?: number,
        showDuplicateCounterpartyData: boolean = false): Observable<any[]> {

        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
        };

        const list = this.referentialCounterpartiesService.search(request, showDuplicateCounterpartyData)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

}
