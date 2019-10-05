import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
    selector: 'atlas-master-row-apply',
    templateUrl: './master-row-apply.component.html',
    styleUrls: ['./master-row-apply.component.scss'],
})
export class MasterRowApplyComponent implements ICellRendererAngularComp {
    public params: any;
    rowIndex: any;
    pinnedRowData: any;

    agInit(params: any): void {
        this.params = params;
        this.rowIndex = params.rowIndex;
        this.pinnedRowData = params.data;
    }

    constructor() { }

    ngOnInit() {
    }

    refresh(params: any): boolean {
        return false;
    }
}
