import { Observable } from 'rxjs';
import { ListAndSearchFilter } from './list-and-search-filter.entity';

export interface DataLoader {
    getData(filters: ListAndSearchFilter[],
        dataVersionId?: number,
        offset?: number,
        limit?: number,
        additionalParameters?: any): Observable<any>;
}
