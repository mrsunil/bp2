import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { ShippingType } from '../../../../../shared/enums/shipping-type-enum';
import { AllocatedTradeDisplayView } from '../../../../../shared/models/allocated-trade-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { AllocateSectionCommand } from '../../../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { UiService } from '../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-purchase-allocation-component',
    templateUrl: './purchase-allocation-component.component.html',
    styleUrls: ['./purchase-allocation-component.component.scss'],
})
export class PurchaseAllocationComponentComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly purchaseRowSelected = new EventEmitter();
    @Output() readonly isPurchaseRowDataUpdated = new EventEmitter();
    @Output() readonly onPurchaseRowSelectedChange = new EventEmitter<any>();
    @Output() readonly purchaseRowUnChecked = new EventEmitter<any>();
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    purchaseAllocationGridCols: agGrid.ColDef[];
    purchaseAllocationGridOptions: agGrid.GridOptions = {};
    purchaseAllocationGridRows: AllocatedTradeDisplayView[];
    atlasAgGridParam: AtlasAgGridParam;
    charterId: number;
    getPossibleAllocationForPurchase: Subscription;
    formatType: string = 'en-US';

    constructor(protected uiService: UiService,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.charterId = Number(this.route.snapshot.paramMap.get('charterId'));
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.initAllocationGridCols();
        this.getPurchaseTradesForAllocation();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.gridApi.onFilterChanged();
    }

    initAllocationGridCols() {
        this.purchaseAllocationGridOptions = {
            enableSorting: true,
            enableFilter: true,
            rowDeselection: false,
        };
        this.purchaseAllocationGridCols = [
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
    getPurchaseTradesForAllocation() {
        this.getPossibleAllocationForPurchase = this.executionService.GetPossibleAllocationByCharterAsync(this.charterId)
            .subscribe((data) => {
                this.isPurchaseRowDataUpdated.emit({ salesDataUpdated: false, purchaseDataUpdated: true });
                this.purchaseAllocationGridRows = data.value.map((allocatedTrade) => {
                    return new AllocatedTradeDisplayView(allocatedTrade);
                });
                this.purchaseAllocationGridRows = this.purchaseAllocationGridRows.filter((contract) =>
                    contract.type === ContractTypes.Purchase.toString(),
                );
                this.initAllocationGridCols();
            });
    }
    ngOnDestroy(): void {
        if (this.getPossibleAllocationForPurchase) {
            this.getPossibleAllocationForPurchase.unsubscribe();
        }
    }
    onRowSelected(event) {
        if (event.node.selected === true) {
            this.purchaseRowSelected.emit();
        } else {
            this.purchaseRowUnChecked.emit();
        }
        this.onPurchaseRowSelectedChange.emit(event);
    }
    getSelectedRow() {
        return this.gridApi.getSelectedRows()[0];
    }
    populateEntity(command: any) {
        const allocateSection = command as AllocateSectionCommand;
        const selectedRow = this.gridApi.getSelectedRows()[0];
        if (selectedRow) {
            allocateSection.sourceQuantity = selectedRow.quantity;
            allocateSection.sectionReference = selectedRow.contractLabel;
            allocateSection.sectionId = selectedRow.sectionId;
            allocateSection.shippingType = ShippingType.PurchaseToSale;
        }
        return allocateSection;
    }
}
