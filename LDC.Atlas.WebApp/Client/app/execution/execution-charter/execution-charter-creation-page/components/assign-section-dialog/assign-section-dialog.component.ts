import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridAutocompleteComponent } from '../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { CellEditorDatePickerComponent } from '../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { Port } from '../../../../../shared/entities/port.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { UiService } from '../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-assign-section-dialog',
    templateUrl: './assign-section-dialog.component.html',
    styleUrls: ['./assign-section-dialog.component.scss'],
})
export class AssignSectionDialogComponent implements OnInit {
    model: Charter;
    sectionGridCols: agGrid.ColDef[];
    masterdata: any;
    filteredLocations: Port[];
    sectionsAssigned: AssignedSection[];
    listOfMasterData = [
        MasterDataProps.Ports,
    ];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridComponents = {
        atrDate: CellEditorDatePickerComponent,
        atrSelect: CellEditorSelectComponent,
    };
    sectionsGridOptions: agGrid.GridOptions = {};

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private masterDataService: MasterdataService, private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected uiService: UiService,
        public thisDialogRef: MatDialogRef<AssignSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public gridService: AgGridService) {
        this.model = data.result;
        this.filteredLocations = data.masterdata.ports;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.initContractGridColumns();
    }

    initContractGridColumns() {
        this.sectionGridCols = [
            {
                headerName: 'Contract ref',
                field: 'contractLabel',
            },
            {
                headerName: 'Counterparty',
                field: 'counterparty',
            },
            {
                headerName: 'Quantity',
                field: 'quantity',
                type: 'numericColumn',
            },
            {
                headerName: 'Vessel',
                field: 'vessel',
            },
            {
                headerName: 'Group Number',
                field: 'groupNumber',
                type: 'numericColumn',
            },
            {
                headerName: 'Loading location',
                field: 'portOrigin',
                colId: 'portOrigin',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    editable: true,
                    options: this.filteredLocations,
                    valueProperty: 'portCode',
                    codeProperty: 'portCode',
                    displayProperty: 'portCode',
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Discharge location',
                field: 'portDestination',
                colId: 'portDestination',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    editable: true,
                    options: this.filteredLocations,
                    valueProperty: 'portCode',
                    codeProperty: 'portCode',
                    displayProperty: 'portCode',
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Charter B/L date',
                field: 'blDate',
                cellEditor: 'atrDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditorParams: {
                    maxDate: this.companyManager.getCurrentCompanyDate()
                },
                editable: true,
                onCellValueChanged: this.ammendAllocatedContract.bind(this),
            },
            {
                headerName: 'BL Ref',
                field: 'blRef',
                editable: true,
            },
        ];
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onEditButtonClick() {
        this.thisDialogRef.close(this.model);
    }

    onCancelButtonClick() {
        this.thisDialogRef.close(null);
    }

    ammendAllocatedContract(params) {
        if (params) {
            this.gridApi.forEachNode((rowData) => {
                if (params.data.contractLabel === rowData.data.allocatedTo) {
                    rowData.data.blDate = params.data.blDate;
                }
            });
            this.gridApi.setRowData(this.model.assignedSections);
        }
    }
}
