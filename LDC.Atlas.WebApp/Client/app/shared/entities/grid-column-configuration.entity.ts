import { ListAndSearchFilterType } from '../enums/list-and-search-filter-type.enum';
import { ListAndSearchOrder } from '../enums/list-and-search-order.enum';

export class ColumnConfigurationProperties {
    fieldId: number;
    gridColumnId: number;
    fieldName: string;
    friendlyName: string;
    filterType: ListAndSearchFilterType;
    gridType: string;
    optionSet: string;
    isVisible: boolean;
    isEditable: boolean;
    isFilterable: boolean;
    isSortable: boolean;
    sortOrder: ListAndSearchOrder;
    sortOrderIndex: number;
    groupName: string;
    isGroup: boolean;
    size?: number;
    isResult: boolean;
}
