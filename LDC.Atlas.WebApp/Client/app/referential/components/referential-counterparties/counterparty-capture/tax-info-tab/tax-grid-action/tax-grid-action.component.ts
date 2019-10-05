import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { TaxListDisplayView } from '../tax-ag-grid-row';

@Component({
    selector: 'atlas-tax-grid-action',
    templateUrl: './tax-grid-action.component.html',
    styleUrls: ['./tax-grid-action.component.scss']
})
export class TaxGridActionComponent implements ICellRendererAngularComp {
    isFavorite: boolean = false;
    selectedFilterSet: TaxListDisplayView;
    public params: any;
    rowIndex: any;
    cellValue: any;

    agInit(params: any): void {
        this.params = params;
        this.rowIndex = params.rowIndex;
        this.cellValue = params.value;
        this.params.value ? this.isFavorite = true : this.isFavorite = false;
    }

    constructor() { }

    ngOnInit() {
    }

    setFavorite(rowIndex) {
        this.params.context.componentParent.updateAllRow(rowIndex);
    }

    refresh(params: any): boolean {
        return false;
    }

}
