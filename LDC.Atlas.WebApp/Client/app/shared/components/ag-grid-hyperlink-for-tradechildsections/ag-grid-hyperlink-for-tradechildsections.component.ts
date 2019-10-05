import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-hyperlink-for-tradechildsections',
    templateUrl: './ag-grid-hyperlink-for-tradechildsections.component.html',
    styleUrls: ['./ag-grid-hyperlink-for-tradechildsections.component.scss']
})
export class AgGridHyperlinkForTradechildsectionsComponent implements ICellRendererAngularComp {

    public params: any;
    public gridId: any;
    public columnId: String;
    constructor() { }
    agInit(params: any): void {
        this.params = params;
        this.gridId = params.gridId;
        this.columnId = params.columnId;
    }

    public invokeParentMethod() {
        if (this.gridId === "tradeChildSectionListGrid") {
            this.params.context.componentParent.hyperlinkClickedforTradeChildSections(this.params.data, this.columnId);
        }
    }

    refresh(): boolean {
        return false;
    }

}
