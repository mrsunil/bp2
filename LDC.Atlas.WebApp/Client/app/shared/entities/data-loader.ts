import { Observable } from 'rxjs';
import { PagingOptions } from './http-services/paging-options';

export interface MasterDataLoader {
    getData(searchTerm: string,
        pagingOptions: PagingOptions): Observable<any>;
}
