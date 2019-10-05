import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BulkEditSearchResult } from '../../../../../shared/dtos/bulkEdit-search-result';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ActivatedRoute } from '@angular/router';
import { Country } from '../../../../../shared/entities/country.entity';
import { Province } from '../../../../../shared/entities/province.entity';
import { AddressType } from '../../../../../shared/entities/address-type.entity';

@Component({
    selector: 'atlas-counterparty-apply-button',
    templateUrl: './counterparty-apply-button.component.html',
    styleUrls: ['./counterparty-apply-button.component.scss']
})
export class CounterpartyApplyButtonComponent implements ICellRendererAngularComp {
    public params: any;
    rowIndex: any;
    pinnedRowData: BulkEditSearchResult;
    masterdata: MasterData;
    filteredCountry: Country[];
    filteredprovinces: Province[];
    filteredaddressTypes: AddressType[];

    agInit(params: any): void {
        this.params = params;
        this.rowIndex = params.rowIndex;
        this.pinnedRowData = params.data;
    }

    constructor(private route: ActivatedRoute, ) { }

    ngOnInit() {
    }

    refresh(params: any): boolean {
        return false;
    }

    onDetailsPreviousButtonClicked() {
        this.params.context.componentParent.updateAllRow(this.pinnedRowData)
    }
}

