import { ListAndSearchFilter } from '../list-and-search-filter.entity';

export interface ListAndSearchExport {
    export(
        gridCode: string,
        filters: ListAndSearchFilter[],
        dataVersionId?: number,
        gridViewId?: number): void;
}
