import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-hyperlink-for-charter-bulk-closure',
    templateUrl: './ag-grid-hyperlink-for-charter-bulk-closure.component.html',
    styleUrls: ['./ag-grid-hyperlink-for-charter-bulk-closure.component.scss']
})
export class AgGridHyperlinkForCharterBulkClosureComponent implements ICellRendererAngularComp {

    data: any;
    params: any;


    constructor() { }

    ngOnInit() {
    }

    agInit(params: any): void {
        this.params = params;
        this.data = params.value;
    }

    refresh(params: any): boolean {
        return false;
    }

    onExploreClicked() {
        let link: string;

        if (this.params.data) {
            if (this.params.data.message === 'Cargo Accrual' || this.params.data.message === 'Invoices not cash matched'
                || this.params.data.message === 'Invoices not posted') {
                link = `${this.params.context.componentParent.companyManager.getCurrentCompanyId()}/trades/display/${this.params.data.sectionId}/5`;
                window.open(link, '_blank');
            }
            if (this.params.data.message === 'Cost Accrual') {
                link = `${this.params.context.componentParent.companyManager.getCurrentCompanyId()}/trades/display/${this.params.data.sectionId}/1`;

            }
        }

    }

    ispopUpcellRendererLoaded() {
        if (this.params.data.sectionId) {
            if (this.params.data.category !== 'green' && this.data !== undefined && this.data !== '') {
                return true;
            }
        }
        return false;
    }
}
