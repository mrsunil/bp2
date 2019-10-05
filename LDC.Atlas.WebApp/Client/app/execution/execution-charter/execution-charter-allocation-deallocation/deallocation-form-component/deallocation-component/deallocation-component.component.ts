import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AllocatedTradeDisplayView } from '../../../../../shared/models/allocated-trade-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { UiService } from '../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-deallocation-component',
    templateUrl: './deallocation-component.component.html',
    styleUrls: ['./deallocation-component.component.scss'],
})
export class DeallocationComponentComponent implements OnInit, OnDestroy {
    @Output() readonly deallocationRowSelected = new EventEmitter();
    @Output() readonly onDeallocationRowSelected = new EventEmitter<any>();
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    deallocationGridCols: agGrid.ColDef[];
    deallocationGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    deallocationGridRows: AllocatedTradeDisplayView[];
    charterId: number;
    getPossibleDeallocationSubscription: Subscription;
    formatType: string = 'en-US';

    constructor(protected uiService: UiService,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        public gridService: AgGridService,
    ) { }

    ngOnInit() {
        this.charterId = Number(this.route.snapshot.paramMap.get('charterId'));
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.initAllocationGridCols();
        this.getcontractsForDeallocation();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        this.gridApi.onFilterChanged();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    initAllocationGridCols() {
        this.deallocationGridCols = [
            {
                colId: 'sectionId',
                hide: true,
            },
            {
                colId: 'allocatedSectionId',
                hide: true,
            },
            {
                colId: 'type',
                hide: true,
            },
            {
                headerName: 'Reference',
                headerTooltip: 'Reference',
                field: 'contractLabel',
                filter: 'agTextColumnFilter',
                colId: 'contractLabel',
                headerCheckboxSelection: false,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true,
            },
            {
                headerName: 'Department ',
                headerTooltip: 'Department ',
                field: 'departmentCode',
                colId: 'departmentCode',
            },
            {
                headerName: 'Quantity',
                headerTooltip: 'Quantity',
                field: 'quantity',
                type: 'numericColumn',
                colId: 'quantity',
                valueFormatter: this.formatValue.bind(this),
            },
            {
                headerName: 'Cmy1',
                headerTooltip: 'Cmy1',
                field: 'principalCommodity',
                colId: 'principalCommodity',
            },
            {
                headerName: 'Cmy2',
                headerTooltip: 'Cmy2',
                field: 'commodityOrigin',
                colId: 'commodityOrigin',
            },
            {
                headerName: 'Cmy3',
                headerTooltip: 'Cmy3',
                field: 'commodityGrade',
                colId: 'commodityGrade',
            },
            {
                headerName: 'Cmy4',
                headerTooltip: 'Cmy4',
                field: 'commodityLvl4',
                colId: 'commodityLvl4',
            },
            {
                headerName: 'Cmy5',
                headerTooltip: 'Cmy5',
                field: 'commodityLvl5',
                colId: 'commodityLvl5',
            },
        ];

    }
    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(param.value);
    }
    getcontractsForDeallocation() {
        this.getPossibleDeallocationSubscription = this.executionService.GetPossibleDeallocationByCharterAsync(this.charterId)
            .subscribe((data) => {
                this.deallocationGridRows = data.value.map((allocatedTrade) => {
                    return new AllocatedTradeDisplayView(allocatedTrade);
                });
                this.initAllocationGridCols();
            });
    }
    ngOnDestroy(): void {
        if (this.getPossibleDeallocationSubscription) {
            this.getPossibleDeallocationSubscription.unsubscribe();
        }
    }
    getSelectedRow() {
        return this.gridApi.getSelectedRows();
    }
    refreshDeallocationData() {
        this.gridApi.redrawRows();
    }
    onRowSelected(event) {
        if (event.node.selected === true) {
            let contractCount = 0;
            const numberOfRowsSelected = this.gridApi.getSelectedRows().length;
            if (numberOfRowsSelected < 2) {
                this.deallocationGridOptions.api.forEachNode((contract) => {
                    if (event.node.data.sectionId === contract.data.allocatedSectionId) {
                        contract.setSelected(true);
                        contractCount = contractCount + 1;
                    }
                });
            }
            if ((numberOfRowsSelected === 1 && contractCount === 0) || numberOfRowsSelected > 2) {
                this.deallocationGridOptions.api.deselectAll();
            }
            this.deallocationRowSelected.emit();
        }
        if (!event.node.selected) {
            this.deallocationGridOptions.api.deselectAll();
        }
        this.onDeallocationRowSelected.emit(event);
    }
    onSelectionChanged(event) {
    }
}
