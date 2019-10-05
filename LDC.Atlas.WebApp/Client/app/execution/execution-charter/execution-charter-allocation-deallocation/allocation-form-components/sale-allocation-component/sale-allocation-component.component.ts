import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { AllocatedTradeDisplayView } from '../../../../../shared/models/allocated-trade-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { AllocateSectionCommand } from '../../../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { UiService } from '../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-sale-allocation-component',
    templateUrl: './sale-allocation-component.component.html',
    styleUrls: ['./sale-allocation-component.component.scss'],
})
export class SaleAllocationComponentComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly saleRowSelected = new EventEmitter();
    @Output() readonly saleRowUnChecked = new EventEmitter();
    @Output() readonly onSaleRowSelectedChange = new EventEmitter<any>();
    @Output() readonly isSaleRowDataUpdated = new EventEmitter();
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    saleAllocationGridCols: agGrid.ColDef[];
    saleAllocationGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    saleAllocationGridRows: AllocatedTradeDisplayView[];
    charterId: number;
    getPossibleAllocationForSale: Subscription;
    formatType: string = 'en-US';

    constructor(protected uiService: UiService,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        public gridService: AgGridService,
        protected formConfigurationProvider: FormConfigurationProviderService) { super(formConfigurationProvider); }

    ngOnInit() {
        this.charterId = Number(this.route.snapshot.paramMap.get('charterId'));
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.initAllocationGridCols();
        this.getSaleTradesForAllocation();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.gridApi.onFilterChanged();
    }

    initAllocationGridCols() {
        this.saleAllocationGridOptions = {
            enableSorting: true,
            enableFilter: true,
            rowDeselection: false,
        };
        this.saleAllocationGridCols = [
            {
                colId: 'sectionId',
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
    getSaleTradesForAllocation() {
        this.getPossibleAllocationForSale = this.executionService.GetPossibleAllocationByCharterAsync(this.charterId)
            .subscribe((data) => {
                this.isSaleRowDataUpdated.emit({ salesDataUpdated: true, purchaseDataUpdated: false });
                this.saleAllocationGridRows = data.value.map((allocatedTrade) => {
                    return new AllocatedTradeDisplayView(allocatedTrade);
                });
                this.saleAllocationGridRows = this.saleAllocationGridRows.filter((contract) =>
                    contract.type === ContractTypes.Sale.toString(),
                );
                this.initAllocationGridCols();
            });
    }
    ngOnDestroy(): void {
        if (this.getPossibleAllocationForSale) {
            this.getPossibleAllocationForSale.unsubscribe();
        }
    }
    onRowSelected(event) {
        if (event.node.selected === true) {
            this.saleRowSelected.emit();
        } else {
            this.saleRowUnChecked.emit();
        }
        this.onSaleRowSelectedChange.emit(event);
    }
    getSelectedRow() {
        return this.gridApi.getSelectedRows()[0];
    }
    populateEntity(command: any) {
        const allocateSection = command as AllocateSectionCommand;
        const selectedRow = this.gridApi.getSelectedRows()[0];
        if (selectedRow) {
            allocateSection.allocatedSectionId = selectedRow.sectionId;
            allocateSection.targetQuantity = selectedRow.quantity;
            allocateSection.allocatedSectionReference = selectedRow.contractLabel;
        }
        return allocateSection;
    }
}
