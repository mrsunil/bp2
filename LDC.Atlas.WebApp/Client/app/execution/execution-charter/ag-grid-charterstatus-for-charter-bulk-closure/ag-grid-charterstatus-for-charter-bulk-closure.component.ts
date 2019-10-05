import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-charterstatus-for-charter-bulk-closure',
    templateUrl: './ag-grid-charterstatus-for-charter-bulk-closure.component.html',
    styleUrls: ['./ag-grid-charterstatus-for-charter-bulk-closure.component.scss'],
})

export class AgGridCharterStatusForCharterBulkClosureComponent implements ICellRendererAngularComp {
    public params: any;
    public classApplied: string = 'contract-reference-link';
    public icon: any;
    public classAppliedIcon: string
    public disabled: boolean = false;
    constructor() {
    }

    agInit(params: any): void {
        this.params = params;
        if (this.params.data.sectionId) {
            this.disabled = true;
        }
        else {
            if (this.params.data.category === 'green') {
                this.classApplied = 'disable-url-click-green';
                this.classAppliedIcon = 'icon-click-green';
                this.icon = 'check_circle'
            }
            else if (this.params.data.category === 'orange') {
                this.classApplied = 'disable-url-click-orange';
                this.classAppliedIcon = 'icon-click-orange';
                this.icon = 'warning'
            }
            else if (this.params.data.category === 'red') {
                this.classApplied = 'disable-url-click-red';
                this.classAppliedIcon = 'icon-click-red';
                this.icon = 'remove_circle'
            }
        }
    }

    refresh(): boolean {
        return false;
    }
}
