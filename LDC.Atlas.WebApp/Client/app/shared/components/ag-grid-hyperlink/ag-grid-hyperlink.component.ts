import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-hyperlink',
    templateUrl: './ag-grid-hyperlink.component.html',
    styleUrls: ['./ag-grid-hyperlink.component.scss'],
})

export class AgGridHyperlinkComponent implements ICellRendererAngularComp {
    public params: any;
    classApplied: string = 'contract-reference-link'
    icon: any;
    classAppliedIcon: string
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;

        if (this.params.value == 'Contracts available for closure') {
            this.classApplied = 'disable-url-click-green';
        }
        else if (this.params.value == 'Contracts risky for closure') {
            this.classApplied = 'disable-url-click-orange';
        }
        else if (this.params.value == 'Contracts unavailable for closure') {
            this.classApplied = 'disable-url-click-red';
        }
    }
    isImageCellRendererLoaded() {

        if (this.params.value == 'Contracts available for closure') {
            this.classAppliedIcon = 'icon-click-green';
            this.icon = 'check_circle'
            return true;
        }
        else if (this.params.value == 'Contracts risky for closure') {
            this.classAppliedIcon = 'icon-click-orange';
            this.icon = 'warning'
            return true;
        }
        else if (this.params.value == 'Contracts unavailable for closure') {
            this.classAppliedIcon = 'icon-click-red';
            this.icon = 'remove_circle'
            return true;
        }
        else { return false; }
    }

    public invokeParentMethod(event) {
        this.params.context.componentParent.hyperlinkClicked(this.params.data, event);
        event.preventDefault();
    }

    refresh(): boolean {
        return false;
    }
}
