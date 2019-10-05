import { ListAndSearchFilterDto } from './../../../../shared/dtos/list-and-search/list-and-search-filter-dto.dto';

export class ReportCriteriasRequest {
    gridName: string;
    clauses: ListAndSearchFilterDto;
}
