
import { ListAndSearchFilterType } from '../../enums/list-and-search-filter-type.enum';

export interface FilterSetEditorRowData {
    gridColumnId: number;
    fieldId: number;
    fieldName: string;
    value: string;
    isActive: boolean;
    filterType: ListAndSearchFilterType;
    isValid: boolean;
}
