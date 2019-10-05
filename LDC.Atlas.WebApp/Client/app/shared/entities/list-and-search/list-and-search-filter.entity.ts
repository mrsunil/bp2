import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { ListAndSearchFilterPredicate } from './list-and-search-filter-predicate.entity';

export class ListAndSearchFilter {
    gridColumnId: number;
    fieldId: number;
    fieldName: string;
    fieldFriendlyName: string;
    predicate: ListAndSearchFilterPredicate;
    isActive: boolean = false;
    groupName: string;
    clauses?: ListAndSearchFilter[];
    logicalOperator?: string;

    constructor(filter?: ListAndSearchFilterDto) {
        this.predicate = new ListAndSearchFilterPredicate();
        if (filter) {
            this.fieldId = filter.fieldId;
            this.gridColumnId = filter.gridColumnId;
            this.fieldName = filter.fieldName;
            this.predicate.operator = filter.operator;
            this.predicate.value1 = filter.value1;
            this.predicate.value2 = filter.value2;
            this.isActive = filter.isActive;
            this.fieldFriendlyName = filter.fieldFriendlyName;
            this.clauses = (filter.clauses) ? filter.clauses.map((clause) => {
                return new ListAndSearchFilter(clause);
            }) : null;
            this.logicalOperator = filter.logicalOperator;
        }
    }
}
