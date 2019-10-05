import { Component } from '@angular/core';

@Component({
    selector: 'atlas-list-search-dialog',
    templateUrl: 'ux-dialog-list-search.component.html',
})
export class ListSearchDialogComponent {
    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 },
    ];

    columnDefs = [
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' },
        { checkboxSelection: true },
    ];

    constructor() { }

}
