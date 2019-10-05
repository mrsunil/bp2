import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ParentCostsToAdjust } from '../../../../../../../shared/entities/parent-costs-to-adjust.entity';
import { ParentCostsUpdateOptions } from '../../../../../../../shared/entities/ParentCostsUpdateOptions.entity';
import { RateType } from '../../../../../../../shared/entities/rate-type.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { RateTypes } from '../../../../../../../shared/enums/rate-type.enum';
import { YesNoConfirmation } from '../../../../../../../shared/enums/yes-no-confirmation.enum';
import { CustomNumberMask } from '../../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';

@Component({
    selector: 'atlas-parent-costs',
    templateUrl: './parent-costs.component.html',
    styleUrls: ['./parent-costs.component.scss'],
})
export class ParentCostsComponent extends BaseFormComponent implements OnInit {

    @Output() readonly listOfCostTypes = new EventEmitter<any>();

    gridContext = {
        gridEditable: true,
        componentParent: this,
        editPrivileges: true,
    };

    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
    };

    transferCostGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    transferCostGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    componentId: string = 'ParentCostsGrid';
    hasGridSharing: boolean = false;
    masterdata: MasterData;
    rateTypes: RateType[];
    costDirections: CostDirection[];
    isProRata: boolean = false;
    confirmationOptions: ParentCostsUpdateOptions[];
    sectionId: number;
    parentCostsGridRows: ParentCostsToAdjust[];
    dataVersionId: number;
    costTypesList: string[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        public gridService: AgGridService,
        protected tradingService: TradingService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.sectionId = this.route.snapshot.params.sectionId;
        this.getCosts(this.sectionId);
        this.initializeGridColumns();
        this.rateTypes = [
            {
                code: RateTypes[RateTypes.Rate],
                description: '',
            },
            {
                code: RateTypes[RateTypes.Amount],
                description: '',
            },
            {
                code: RateTypes[RateTypes.Percent],
                description: '',
            },
        ];

        this.costDirections = [
            {
                costDirectionId: CostDirections.Payable,
                costDirection: 'Pay',
            },
            {
                costDirectionId: CostDirections.Receivable,
                costDirection: 'Receive',
            },
        ];
        this.confirmationOptions = [
            {
                option: YesNoConfirmation[YesNoConfirmation.Yes],
            },
            {
                option: YesNoConfirmation[YesNoConfirmation.No],
            },
        ];
    }

    isGridEditable(params): boolean {
        return params.context.gridEditable;
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.transferCostGridColumns;
        this.transferCostGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

        this.gridApi.showNoRowsOverlay();
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi !== undefined) {
            const allColumnIds = [];
            if (this.transferCostGridColumns) {
                this.transferCostGridColumns.forEach((columnDefs) => {
                    allColumnIds.push(columnDefs.field);
                });
            }
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    initializeGridColumns() {
        this.transferCostGridOptions = {
            context: this.gridContext,
        };
        this.transferCostGridColumns = [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
            },
            {
                headerName: 'Cost Code*',
                field: 'costTypeCode',
                colId: 'costTypeCode',
            },
            {
                headerName: 'Supplier',
                field: 'supplierCode',
                width: 120,
            },
            {
                headerName: 'CCY*',
                field: 'currencyCode',
                colId: 'currencyCode',
                width: 120,
            },
            {
                headerName: 'Rate Type*',
                field: 'rateTypeCode',
                width: 120,
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
                width: 120,
            },
            {
                headerName: 'Pay/Rec*',
                field: 'costDirection',
                width: 120,
            },
            {
                headerName: 'Rate/Amount',
                field: 'rate',
                type: 'numberColumn',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
                width: 120,
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                cellEditorParams: {
                    maxLength: 100,
                    rows: 3,
                    cols: 50,
                },
                width: 120,
            },
            {
                headerName: 'Pro Rata',
                field: 'isProRated',
                colId: 'isProRated',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: (params) => {
                    return {
                        disabled: this.isProRataEditable(params),
                        params: this.gridContext,
                    };
                },

            },
        ];

    }

    isProRataEditable(params): boolean {
        if (params.data.rateTypeCode === RateTypes[RateTypes.Amount]) {
            return false;
        } else {
            return true;
        }
    }

    getCosts(sectionId: number) {
        const getCostsSubscription = this.tradingService.getParentCostsToAdjust(sectionId, this.dataVersionId).subscribe((data) => {
            data.value.forEach((cost) => {
                cost.rateTypeCode = this.getRateCodeFromId(cost.rateTypeId);
                cost.priceCode = this.getPriceCodeFromId(cost.priceUnitId);
                cost.costDirection = this.getCostDirectionCodeFromId(cost.costDirectionId, this.costDirections);
            });
            this.parentCostsGridRows = data.value;
            this.costTypesList = data.value.map((costs) => costs.costTypeCode);
            this.listOfCostTypes.emit({
                costTypes: this.costTypesList,
            });
        });

        this.subscriptions.push(getCostsSubscription);

    }

    getCostTypeCodeFromId(id: number): string {
        const costTypeCode = this.masterdata.costTypes.find(
            (e) => e.costTypeId === id);
        return costTypeCode ? costTypeCode.costTypeCode : null;
    }

    getSupplierCodeFromId(id: number) {
        const counterparty = this.masterdata.counterparties.find((e) => e.counterpartyID === id);
        return counterparty ? counterparty.counterpartyCode : null;
    }

    getRateCodeFromId(id: number) {
        const rateCode = RateTypes[id];
        return rateCode;
    }

    getPriceCodeFromId(id: number) {
        const priceCode = this.masterdata.priceUnits.find(
            (e) => e.priceUnitId === id);
        return priceCode ? priceCode.priceCode : '';
    }

    getCostDirectionCodeFromId(id, costDirections: CostDirection[]) {
        const costDirection = costDirections.find(
            (e) => e.costDirectionId === id);
        return costDirection ? costDirection.costDirection : '';
    }

    getGridData(): ParentCostsToAdjust[] {
        const costs: ParentCostsToAdjust[] = this.gridApi.getSelectedRows();
        if (costs && costs.length > 0) {
            return costs;
        }
    }

}
