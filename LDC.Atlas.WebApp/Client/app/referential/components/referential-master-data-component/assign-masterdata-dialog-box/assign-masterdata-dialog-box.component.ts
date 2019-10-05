import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyActivation } from '../../../../shared/entities/company-activation.entity';
import { Company } from '../../../../shared/entities/company.entity';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { AgGridCheckboxTriStateComponent } from './../../../../shared/components/ag-grid/checkbox-tri-state/ag-grid-checkbox-tri-state.component';
import { CompanyAssignment } from './../../../../shared/entities/company-assignment.entity';
import { ReferentialMasterdataMenuActions } from './referential-masterdata-menu-actions.enum';

@Component({
    selector: 'atlas-assign-masterdata-dialog-box',
    templateUrl: './assign-masterdata-dialog-box.component.html',
    styleUrls: ['./assign-masterdata-dialog-box.component.scss'],
})
export class AssignMasterdataDialogBoxComponent implements OnInit {
    atlasAgGridParam: AtlasAgGridParam;
    agGridOptions: agGrid.GridOptions = {};
    agGridApi: agGrid.GridApi;
    columnAPI: agGrid.ColumnApi;
    companyGridCols: agGrid.ColDef[] = [];
    agGridRows: any[];
    dialogData: {
        masterdataName: string,
        actionType: string,
        selected: any[],
    };
    popupTitle: string;
    companies: Company[];
    company: string;

    constructor(
        protected companyManager: CompanyManagerService,
        private agGridService: AgGridService,
        public thisDialogRef: MatDialogRef<AssignMasterdataDialogBoxComponent>,
        protected masterDataService: MasterdataService,
        @Inject(MAT_DIALOG_DATA) public data: {
            masterdataName: string,
            actionType: string,
            selected: number[],
        },
    ) {
        this.company = this.companyManager.getCurrentCompanyId();
        this.dialogData = data;
        this.popupTitle = this.dialogData.actionType === 'assign' ? 'Assign' : 'Deactivate';
    }

    ngOnInit() {
        this.atlasAgGridParam = this.agGridService.getAgGridParam();
        this.initCompanyGridCols();
        this.getData();
    }

    getData() {
        switch (this.dialogData.actionType) {
            case ReferentialMasterdataMenuActions.assign:
                this.masterDataService.getMasterDataAssignments(this.data.masterdataName, this.data.selected).subscribe(
                    (companyAssignments: CompanyAssignment[]) => {
                        this.agGridRows = companyAssignments;
                        this.agGridRows.forEach((row) => {
                            row.originalAssignmentState = row.assignmentState;
                            row.isTouched = false;
                        });
                    });
                break;
            case ReferentialMasterdataMenuActions.deactivate:
                this.masterDataService.getMasterDataActivated(this.data.masterdataName, this.data.selected).subscribe(
                    (companyActivations: CompanyActivation[]) => {
                        this.agGridRows = companyActivations;
                        this.agGridRows.forEach((row) => {
                            row.originalActivationState = row.activationState;
                            row.isTouched = false;
                        });
                    });
                break;
        }
    }

    onGridReady(params) {
        this.agGridOptions = params;
        params.columnDefs = this.companyGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.columnAPI = this.agGridOptions.columnApi;
        this.agGridService.sizeColumns(this.agGridOptions);
    }

    onSaveButtonClicked() {
        this.thisDialogRef.close(this.agGridRows.filter((row) => row.isTouched));
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close(false);
    }

    initCompanyGridCols() {
        let fieldState;
        let originalFieldState;
        let headerName = '';
        let fixWidth;
        switch (this.dialogData.actionType) {
            case ReferentialMasterdataMenuActions.assign:
                fieldState = 'assignmentState';
                originalFieldState = 'originalAssignmentState';
                fixWidth = 60;
                break;
            case ReferentialMasterdataMenuActions.deactivate:
                fieldState = 'activationState';
                originalFieldState = 'originalActivationState';
                headerName = 'Is Active';
                fixWidth = 120;
                break;
        }
        this.companyGridCols = [
            {
                headerName,
                colId: 'selection',
                field: fieldState,
                cellRendererFramework: AgGridCheckboxTriStateComponent,
                cellRendererParams: {
                    disabled: false,
                    originalCheckStatusField: originalFieldState,
                    onCellValueChanged: (params) => { params.data.isTouched = true; },
                },
                minWidth: fixWidth,
                maxWidth: fixWidth,
                pinned: 'left',
            },
            {
                headerName: 'Company',
                colId: 'companyCode',
                field: 'companyCode',
            },
        ];
    }
}
