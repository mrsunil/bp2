import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { BulkEditSearchResult } from '../../../../shared/dtos/bulkEdit-search-result';
import { ReferentialCounterpartiesSearchResult } from '../../../../shared/dtos/referential-Counterparties-search-result';
import { CounterpartyTradeStatus } from '../../../../shared/entities/counterparty-trade-status.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { LdcRegion } from '../../../../shared/entities/ldc-region.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
@Component({
    selector: 'atlas-counterparty-summary-component',
    templateUrl: './counterparty-summary-component.component.html',
    styleUrls: ['./counterparty-summary-component.component.scss'],
})
export class CounterpartySummaryComponentComponent implements OnInit {

    columnDefs: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    summaryCounterpartyDocumentLines: BulkEditSearchResult[];
    countryList = new Array<string>();
    mainAddress: string = 'Main Address'
    masterdata: MasterData;
    filteredCounterPartyList: Counterparty[];
    filteredLdcRegion: LdcRegion[];
    counterpartyTradeStatusList: CounterpartyTradeStatus[] = [];
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.initializeGridColumns();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.counterpartyTradeStatusList = this.masterdata.tradeStatus;
        this.filteredLdcRegion = this.masterdata.regions;
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
    }

    summaryContractToBeSelected(contracts: BulkEditSearchResult[]) {
        this.summaryCounterpartyDocumentLines = contracts;
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.agGridColumnApi.autoSizeAllColumns();
            params.node.setDataValue('rowStatus', 'S');
        }
    }

    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Status',
                colId: 'rowStatus',
                field: 'rowStatus',
                editable: false,
                pinned: 'left',
                cellRenderer: (params) => {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">' + params.value +
                            '</mat-chip></mat-chip-list>';
                    }

                    return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">S</mat-chip></mat-chip-list>';
                },
            },
            {
                headerName: 'Account Reference',
                colId: 'accountReference',
                field: 'accountReference',
            },
            {
                headerName: 'Trade Status',
                colId: 'tradeStatusId',
                field: 'tradeStatusId',
                valueFormatter: this.setTradeStatusValueCell.bind(this),
            },
            {
                headerName: 'Status',
                colId: 'statusId',
                field: 'statusId',
                valueFormatter: this.setStatusValueCell.bind(this),
            },
            {
                headerName: 'Account title',
                colId: 'accountTitle',
                field: 'accountTitle',
            },
            {
                headerName: 'Address 1',
                colId: 'address1',
                field: 'address1',

            },
            {
                headerName: 'Address 2',
                colId: 'address2',
                field: 'address2',
            },
            {
                headerName: 'Main',
                colId: 'main',
                field: 'main',
                valueFormatter: this.mainValueFormatter.bind(this),
            },
            {
                headerName: 'City',
                colId: 'city',
                field: 'city',
                editable: true,
            },
            {
                headerName: 'Country Code',
                field: 'country',
                colId: 'country',
            },
            {
                headerName: 'Zip code',
                colId: 'zipCode',
                field: 'zipCode',
                editable: true,
            },
            {
                headerName: 'Main Email Address',
                colId: 'mailEmailAddress',
                field: 'mailEmailAddress',
            },
            {
                headerName: 'LDC Region',
                colId: 'ldcRegion',
                field: 'ldcRegion',
                valueFormatter: this.ldcValueFormatter.bind(this),
            },
            {
                headerName: 'Provinces',
                colId: 'province',
                field: 'province',

            },
            {
                headerName: 'Address Type',
                colId: 'addressType',
                field: 'addressType',
            },
            {
                headerName: 'Head of Family',
                colId: 'headOfFamily',
                field: 'headOfFamily',
            },
            {
                headerName: 'Associated Companies',
                colId: 'companyId',
                field: 'companyId',
            },
            {
                headerName: 'MDM ID',
                colId: 'mdmId',
                field: 'mdmId',
            },
            {
                headerName: 'MDM Category Code',
                colId: 'MDMCategoryId',
                field: 'MDMCategoryId',
            },
        ];
    }
    setTradeStatusValueCell(params) {
        const tradeStatus = this.counterpartyTradeStatusList.find((status) => status.enumEntityId === params.value);
        return tradeStatus ? tradeStatus.enumEntityValue : '';
    }

    setStatusValueCell(params) {
        if (params.value) {
            return true;
        } else {
            return false;
        }
    }
    mainValueFormatter(params) {
        if (params.value) {
            return this.mainAddress;
        }
        return null;
    }
    ldcValueFormatter(params) {
        const ldcValue = this.filteredLdcRegion.find((value) => value.ldcRegionId === params.value);
        return ldcValue ? ldcValue.description : '';
    }
}

