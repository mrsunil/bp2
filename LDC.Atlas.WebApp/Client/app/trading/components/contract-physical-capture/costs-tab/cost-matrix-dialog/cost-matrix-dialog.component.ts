import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Gaps } from '../../../../../shared/enums/gaps.enum';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FeatureFlagService } from '../../../../../shared/services/http-services/feature-flag.service';
import { Costmatrix } from '../../../../../shared/services/trading/dtos/costmatrix';
import { UiService } from '../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-cost-matrix-dialog',
    templateUrl: './cost-matrix-dialog.component.html',
    styleUrls: ['./cost-matrix-dialog.component.scss'],
})
export class CostMatrixDialogComponent extends BaseFormComponent implements OnInit {
    costMatrixGridOptions: agGrid.GridOptions = {};
    costMatrixGridColumnDefs: agGrid.ColDef[];
    costMatrixGridColumnDefsGap003: agGrid.ColDef[];
    costMatrixGridRows: Costmatrix[];
    costMatrix: Costmatrix[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gaps = Gaps;
    atlasAgGridParam: AtlasAgGridParam;
    dialogData: {
        matrixData: Costmatrix[];
    };
    selectedCostId: number;
    constructor(public thisDialogRef: MatDialogRef<CostMatrixDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { matrixData: Costmatrix[] },
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        public gridService: AgGridService,
        protected featureFlagService: FeatureFlagService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.dialogData = data;
    }

    ngOnInit() {
        this.initializeGridColumns();
        this.costMatrixGridRows = this.dialogData.matrixData;
    }
    initializeGridColumns() {

        this.featureFlagService.getFlagInfo(Gaps.gap003).subscribe(
            (flagAuth) => {
                if (flagAuth.active === true) {
                    this.costMatrixGridColumnDefs = [
                        {
                            headerName: ' ',
                            hide: false,
                            headerCheckboxSelection: false,
                            checkboxSelection: true,
                            width: 70,
                        },
                        {
                            headerName: 'Best Match',
                            colId: 'bestMatch',
                            field: 'bestMatch',
                            hide: false,
                            cellRenderer: (params) => {
                                if (params.value > 0) {
                                    return '<mat-chip-list><mat-chip class="status-flag-chip-bm">BM</mat-chip></mat-chip-list>';
                                }
                                return '';
                            },
                        },
                        {
                            headerName: ' Cost Matrix Name',
                            colId: 'name',
                            field: 'name',
                            hide: false,
                        },
                        {
                            headerName: 'Description',
                            colId: 'description',
                            field: 'description',
                            hide: false,
                        },
                        {
                            headerName: 'Parameters',
                            colId: 'paramters',
                            field: 'tagsFormatted',
                            hide: false,
                        },
                    ];
                } else {
                    this.costMatrixGridColumnDefs = [
                        {
                            headerName: ' ',
                            hide: false,
                            headerCheckboxSelection: false,
                            checkboxSelection: true,
                            width: 70,
                        },
                        {
                            headerName: ' Cost Matrix Name',
                            colId: 'name',
                            field: 'name',
                            hide: false,
                        },
                        {
                            headerName: 'Description',
                            colId: 'description',
                            field: 'description',
                            hide: false,
                        },
                    ];
                }
            },
        );
    }

    onGridReady(params) {
        params.columnDefs = this.costMatrixGridColumnDefs;
        this.costMatrixGridOptions = params;
        this.gridColumnApi = params.columnApi;
        this.gridApi = params.api;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onSelectionChanged(event) {
        const selectedRows: Costmatrix[] = this.gridApi.getSelectedRows();
        selectedRows.forEach((costs) => {
            this.selectedCostId = costs.costMatrixId;
        });
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close(true);
    }

    onAddButtonClicked() {
        this.thisDialogRef.close(this.selectedCostId);
    }
}
