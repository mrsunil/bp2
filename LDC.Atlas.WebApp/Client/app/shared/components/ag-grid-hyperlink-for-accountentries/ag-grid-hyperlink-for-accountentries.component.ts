import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
    selector: 'atlas-ag-grid-hyperlink-for-accountentries',
    templateUrl: './ag-grid-hyperlink-for-accountentries.component.html',
    styleUrls: ['./ag-grid-hyperlink-for-accountentries.component.scss'],
})
export class AgGridHyperlinkForAccountentriesComponent implements ICellRendererAngularComp {

    public params: any;
    public gridId: any;
    public columnId: String;
    public hyperLinkRequired: boolean = true;
    constructor() { }
    agInit(params: any): void {
        this.params = params;
        this.gridId = params.gridId;
        this.columnId = params.columnId;
        if (this.params.data.documentType === 'Accruals' || this.params.data.documentType === 'Revaluation') {
            this.hyperLinkRequired = false;
        }
    }

    public invokeParentMethod() {
        if (this.gridId === 'accountingEntriesGrid') {
            this.params.context.componentParent.hyperlinkClickedforAccounting(this.params.data, this.columnId);
        }
    }

    refresh(): boolean {
        return false;
    }
}
