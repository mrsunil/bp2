import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { ListAndSearchFieldsOrder } from './list-and-search-fields-order.entity';

export class ListAndSearchRequest {
    clauses: ListAndSearchFilterDto;
    sortColumns?: ListAndSearchFieldsOrder[];
    offset?: number;
    limit?: number;
    dataVersionId?: number;
    additionalParameters?: any;
    gridViewId?: number;
}
