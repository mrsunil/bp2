import { ListAndSearchFilterType } from '../../enums/list-and-search-filter-type.enum';

export class ListAndSearchFilterPredicate {
    filterType: ListAndSearchFilterType;
    operator: string;
    value1: string;
    value2?: string;

}
