import { Injectable } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { RowSelectionButton } from '../shared/components/row-selection-button/row-selection-button.component';
@Injectable({
    providedIn: 'root',
})
export class MockDataProviderService {
    columnDefs: agGrid.ColDef[] = [
        {
            headerName: 'Make',
            field: 'make',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            suppressMovable: true,
            colId: 'make',
            hide: false,
        },
        {
            headerName: 'Model',
            field: 'model',
            suppressMovable: true,
            colId: 'model',
            hide: false,
        },
        {
            headerName: 'Price',
            field: 'price',
            suppressMovable: true,
            colId: 'price',
            hide: false,
        },
        {
            headerName: '',
            cellRendererFramework: RowSelectionButton,
            cellRendererParams: {
                context: {
                    componentParent: this,
                },
            },
            maxWidth: 80,
            hide: false,
        },
    ];

    constructor() { }

    getColumnDef(): agGrid.ColDef[] {
        return this.columnDefs;
    }
}
