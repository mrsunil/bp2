import { AgGridSelect } from '../../shared/components/ag-grid-select/interfaces/ag-grid-select.entity';

export class TagField {
    label: string;
    typeName: string;
    value: string;
    selected: boolean;
    options: AgGridSelect[];
}
