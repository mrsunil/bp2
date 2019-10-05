import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';

export class ListAndSearchFilterDto {
    fieldId?: number;
    gridColumnId?: number;
    groupName?: string;
    fieldName?: string;
    fieldFriendlyName?: string;
    operator?: string;
    value1?: string;
    value2?: string;
    isActive?: boolean = true;
    clauses?: ListAndSearchFilterDto[];
    logicalOperator?: string;

    constructor(filter?: ListAndSearchFilter) {
        if (filter) {
            this.fieldId = filter.fieldId;
            this.gridColumnId = filter.gridColumnId;
            this.fieldName = filter.fieldName;
            this.fieldFriendlyName = filter.fieldFriendlyName;
            this.operator = filter.predicate.operator;
            this.value1 = filter.predicate.value1;
            this.value2 = filter.predicate.value2;
            this.groupName = filter.groupName;
            this.clauses = (filter.clauses) ? filter.clauses.map((clause) => {
                return new ListAndSearchFilterDto(clause);
            }) : null;
            this.logicalOperator = filter.logicalOperator;
        }
    }
}
