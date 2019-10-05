import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-accrual-number',
    templateUrl: './ag-grid-accrual-number.component.html',
    styleUrls: ['./ag-grid-accrual-number.component.scss'],
})
export class AgGridAccrualNumberComponent implements AgRendererComponent {

    headerName: string;
    dataLoader: any;
    params: any;

    constructor() { }

    agInit(params: any): void {
        this.headerName = params.headerName;
        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }

    onIconClicked(event) {
        let subAmountTotal: number = 0;
        let accrualNumber: number = 0;
        this.params.api.forEachNode((rowData) => {
            if (rowData.data.isDirty && rowData.data.amount) {
                if (subAmountTotal !== 0) {
                    rowData.setDataValue('accrualNumber', accrualNumber);
                    subAmountTotal = subAmountTotal + rowData.data.amount;
                } else {
                    accrualNumber++;
                    rowData.setDataValue('accrualNumber', accrualNumber);
                    subAmountTotal = rowData.data.amount;
                }
            }
        });
    }

}
