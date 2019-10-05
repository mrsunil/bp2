import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { forkJoin, of } from 'rxjs';
import { concatMap, finalize, map } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridUserPreferencesComponent } from '../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AgContextualMenuAction } from '../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { Company } from '../../../shared/entities/company.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { ColumnConfigurationProperties } from '../../../shared/entities/grid-column-configuration.entity';
import { MasterDataDeletionResult } from '../../../shared/entities/masterdata-deletion-result.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { MasterDataOperationStatus } from '../../../shared/enums/masterdata-operation-status.entity';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { ApiCollection } from '../../../shared/services/common/models';
import { GridConfigurationProviderService } from '../../../shared/services/grid-configuration-provider.service';
import { GridActionsService } from '../../../shared/services/grid/grid-actions.service';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { MasterdataManagementService } from '../../../shared/services/masterdata-management.service';
import { UiService } from '../../../shared/services/ui.service';
import { CellEditorAtlasNumericComponent } from './../../../shared/components/cell-editor-numeric/cell-editor-atlas-numeric/cell-editor-atlas-numeric.component';
import { GenericReportViewerComponent } from './../../../shared/components/generic-report-viewer/generic-report-viewer.component';
import { ColumnException } from './../../../shared/entities/column-exception.entity';
import { PhysicalDocumentTemplate } from './../../../shared/entities/document-template.entity';
import { FieldErrors } from './../../../shared/entities/field-errors.entity';
import { FieldValidation } from './../../../shared/entities/field-validation.entity';
import { DocumentService } from './../../../shared/services/http-services/document.service';
import { GridConfigurationService } from './../../../shared/services/http-services/grid-configuration.service';
import { SnackbarService } from './../../../shared/services/snackbar.service';
import { AssignMasterdataDialogBoxComponent } from './assign-masterdata-dialog-box/assign-masterdata-dialog-box.component';
import { ReferentialMasterdataMenuActions } from './assign-masterdata-dialog-box/referential-masterdata-menu-actions.enum';

@Component({
    selector: 'atlas-referential-component',
    templateUrl: './referential-master-data-component.component.html',
    styleUrls: ['./referential-master-data-component.component.scss'],
})
export class ReferentialMasterDataComponentComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    isLoading = true;
    masterdata: MasterData;
    isReportVisible: boolean = false;
    menus: any;
    masterdataName: string;
    masterdataFriendlyName: string;
    agGridCols: agGrid.ColDef[];
    pristineColumns: agGrid.ColDef[];
    agGridRows: any[];
    pristineRows: any[];
    agGridOptions: agGrid.GridOptions = {};
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    masterDataCodeCtrl = new FormControl('');
    masterDataDescriptionCtrl = new FormControl('');
    columnConfiguration: ColumnConfigurationProperties[] = [];
    gridContextualMenuActions: AgContextualMenuAction[] = [];
    userMenuActions = ReferentialMasterdataMenuActions;
    companyConfiguration: Company;
    isEdit: boolean = false;
    menuDisable: boolean;
    validations: FieldValidation;
    isLocal: boolean;
    isGlobal: boolean;
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    viewMode: string;
    viewModeGlobal: boolean;
    tabIndex: number;
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();
    columnExceptions: ColumnException[];

    @Input() gridCode: string;
    @Input() company: string;
    @Input() pageSize: number = 10;
    @Input() isFilterSetDisplay: boolean = true;
    @Input() gridTitle: string;
    gridComponents = {
        atlasNumericCellEditor: CellEditorAtlasNumericComponent,
    };

    constructor(
        @Inject(WINDOW) private window: Window,
        private route: ActivatedRoute,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private gridConfigurationService: GridConfigurationService,
        private uiService: UiService,
        protected masterdataService: MasterdataService,
        protected masterdataManagementService: MasterdataManagementService,
        protected companyManager: CompanyManagerService,
        public gridService: AgGridService,
        public gridActions: GridActionsService,
        public dialog: MatDialog,
        protected snackbarService: SnackbarService,
        protected documentService: DocumentService,
    ) { }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterdataName = this.route.snapshot.paramMap.get('name');
        this.masterdataFriendlyName = this.uiService.getMasterDataFriendlyName(this.masterdataName);
        this.isLocal = this.masterdataManagementService.isLocalLevel(this.masterdataName);
        this.isGlobal = this.masterdataManagementService.isGlobalLevel(this.masterdataName);
        if (this.isGlobal) {
            this.viewModeGlobal = true;
        }

        const documentType = 76;
        if (this.masterdataFriendlyName.trim() === 'Vessel Information') {
            this.isReportVisible = true;
            this.documentService.getTemplates(documentType, 'Vessels').subscribe((templates) => {
                this.filteredTemplates = templates.value;
            });
        } else if (this.masterdataFriendlyName.trim() === 'Nominal Account Ledger') {
            this.isReportVisible = true;
            this.documentService.getTemplates(documentType, 'NominalAccountLedger').subscribe((templates) => {
                this.filteredTemplates = templates.value;
            });
        }
        // Resolver put all masterdata in masterdata's variable
        this.masterdata = this.route.snapshot.data.masterdata;
        this.gridCode = this.masterdataManagementService.getGridName(this.masterdataName);
        this.companyConfiguration = this.companyManager.getCurrentCompany();
        this.company = this.companyConfiguration ? this.companyConfiguration.companyId : null;
        this.validations = this.masterdataManagementService.getValidationForMasterData(this.masterdataName);

        this.gridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.userMenuActions.deleteRows,
                disabled: () => !this.isOperatorAvailable() || this.isEdit,
            },
        ];
        if (this.isLocal && this.isGlobal) {
            this.gridContextualMenuActions.push({
                icon: 'sync_alt',
                text: 'Assign',
                action: this.userMenuActions.assign,
                disabled: () => !this.isOperatorAvailable() || this.isEdit,
            });
            this.gridContextualMenuActions.push({
                icon: 'block',
                text: 'Deactivate',
                action: this.userMenuActions.deactivate,
                disabled: () => !this.isOperatorAvailable() || this.isEdit,
            });
        }

        this.loadGridConfiguration();
        this.getData();
        this.initFABActions();
    }

    onSelectedIndexChanged = (navViewMode: string): void => {
        this.viewMode = navViewMode;
        this.viewModeGlobal = navViewMode === 'global';
        this.getData();
        this.initFABActions();
    }

    onReportClick(data: any) {
        const openTradepnlReportDialog = this.dialog.open(GenericReportViewerComponent, {
            data:
            {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });
    }

    loadGridConfiguration() {
        this.isLoading = true;
        forkJoin([this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode),
        this.gridConfigurationService.getColumnExceptions(this.gridCode)])
            .subscribe(([configuration, columnExceptions]) => {
                this.columnExceptions = columnExceptions;
                this.columnConfiguration = configuration.columns;
                this.gridActions.getColumns(
                    this.columnConfiguration, this.gridCode, this.company)
                    .subscribe((columns) => {

                        // Deep copy is needed. We need a full separated copy
                        this.pristineColumns = columns.map((col) => ({ ...col }));
                        // selection column
                        columns.unshift(
                            {
                                headerName: '',
                                colId: 'selection',
                                checkboxSelection: () => this.isOperatorAvailable() && !this.isEdit,
                                minWidth: 40,
                                maxWidth: 40,
                                pinned: 'left',
                                hide: false,
                            });
                        if (this.gridContextualMenuActions && this.gridContextualMenuActions.length > 0) {
                            columns.push(
                                {
                                    colId: 'menuAction',
                                    headerName: '',
                                    cellRendererFramework: AgContextualMenuComponent,
                                    cellRendererParams: {
                                        context: {
                                            componentParent: this,
                                        },
                                        menuActions: this.gridContextualMenuActions,
                                    },
                                    cellClass: 'ag-contextual-menu',
                                    maxWidth: 80,
                                });
                        }

                        this.agGridCols = columns.map((column) => {
                            if (column.cellRendererFramework) {
                                column.cellRendererParams.disabled = () => !this.isColumnEditable(column.colId);
                                if (!column.onCellValueChanged) {
                                    // The onCellValueChanged Event defined in the html is not automatically applied on cell Renderers
                                    // We need to apply it manually
                                    column.onCellValueChanged = this.onCellValueChanged;
                                }
                                column.editable = false;
                            } else {
                                column.editable = () => this.isColumnEditable(column.colId);
                            }
                            return column;
                        });

                        // Set default order by column
                        const columnProperties = this.gridActions.getGridPropertyForMasterData(this.masterdataName);
                        if (columnProperties) {
                            const getColumn = this.agGridCols.find((column) => column.field === columnProperties.orderBy);
                            if (getColumn) {
                                getColumn.sort = 'asc';
                            }
                        }

                        if (this.agGridApi) {
                            this.agGridApi.setColumnDefs(this.agGridCols);
                        }

                        if (this.agGridOptions) {
                            this.agGridOptions.columnDefs = this.agGridCols;
                        }

                        if (this.agGridRows) { // If data and config are loaded
                            this.isLoading = false;
                        }
                    });
            });
    }

    onFirstDataRendered() {
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;

        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.gridService.sizeColumns(this.agGridOptions);
    }

    isColumnEditable(colId: string): boolean {
        const column = this.pristineColumns.find((col) => col.colId === colId);
        if (column && !this.viewModeGlobal) {
            const columnException = this.columnExceptions.find((col) => col.fieldName === column.field);
            if (columnException) {
                return this.isEdit;
            }
        }
        return column && (this.viewModeGlobal ? column.editable : false) && this.isEdit;
    }

    getData(code?: string, description?: string) {
        this.isLoading = true;
        this.masterdataService.getFullMasterData(this.masterdataName, this.company, this.viewModeGlobal, code, description)

            .subscribe((data) => {
                this.agGridRows = data[this.masterdataName];

                // Deep copy is needed. We need a full separated copy
                this.pristineRows = data[this.masterdataName].map((row) => ({ ...row }));

                if (this.agGridApi) {
                    this.agGridApi.setRowData(this.agGridRows);
                    this.agGridApi.redrawRows();
                }

                if (this.agGridCols) { // If data and config are loaded
                    this.isLoading = false;
                }
            });
    }

    onColumnVisibilityChanged(column: any) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
    }

    onDiscardButtonClick() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modifications pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.isEdit = false;
                if (this.agGridOptions) {
                    this.initFABActions();
                    // Deep copy is needed. We need a full separated copy
                    this.agGridRows = this.pristineRows.map((row) => ({ ...row }));
                    this.agGridOptions.api.refreshCells();
                }
            }
        });
    }

    onAssignActionClick(action: string, masterdatas: any[]) {
        const technicalId = this.gridActions.getGridPropertyForMasterData(this.masterdataName).id;
        const selected = masterdatas.map((row) => row[technicalId]);
        const dialogRef = this.dialog.open(AssignMasterdataDialogBoxComponent, {
            width: '600px',
            data: {
                masterdataName: this.masterdataName,
                actionType: action,
                selected,
            },
        });
        dialogRef.afterClosed().subscribe((answer) => {
            if (answer) {
                if (answer.length > 0) {
                    this.isLoading = true;
                    let saveObservable;
                    let successMessage;
                    switch (action) {
                        case this.userMenuActions.assign:
                            saveObservable = this.masterdataService.assignMasterData(this.masterdataName, answer, selected);
                            successMessage = 'Assignment successful';
                            break;
                        case this.userMenuActions.deactivate:
                            saveObservable = this.masterdataService.activateMasterData(this.masterdataName, answer, selected);
                            successMessage = 'Deactivation successful';
                            break;
                    }
                    saveObservable
                        .pipe(
                            finalize(() => {
                                this.isLoading = false;
                            }),
                        )
                        .subscribe(
                            () => {
                                this.snackbarService.informationSnackBar(successMessage);
                            },
                            (error) => {
                                if (error && error.status === 400 && error.error && error.error.detail) {
                                    this.snackbarService.throwErrorSnackBar(error.error.detail, true);
                                } else {
                                    throw error;
                                }
                            });
                } else {
                    this.snackbarService.throwErrorSnackBar('No changes detected');
                }
            }
        });
    }

    onEditMasterDataButtonClicked() {
        this.isEdit = true;
        if (this.agGridApi) {
            this.agGridApi.redrawRows();
        }
        this.initFABActions();
    }

    onAddMasterDataButtonClicked() {
        const newItem: any = {};
        newItem.isNew = true;
        this.agGridRows.push(newItem);
        this.agGridApi.updateRowData({ add: [newItem], addIndex: 0 });
    }

    onSaveButtonClick() {
        this.isLoading = true;

        const masterdataUpdate: MasterData = new MasterData();
        masterdataUpdate[this.masterdataName] = this.agGridRows.filter((line) => line.isDirty === true && line.isNew !== true);
        const masterdataCreate: MasterData = new MasterData();
        masterdataCreate[this.masterdataName] = this.agGridRows.filter((line) => line.isNew === true);

        this.agGridRows.forEach((row) => {
            row['invalid'] = []; // reset errors
        });
        const isValid = this.isDataValid(masterdataUpdate[this.masterdataName].concat(masterdataCreate[this.masterdataName]));
        if (this.agGridOptions && this.agGridOptions.api) {
            this.agGridOptions.api.refreshCells();
        }
        if (!isValid) {
            this.isLoading = false;
            return;
        }

        const updateMasterDataObservable = (masterdataUpdate[this.masterdataName] as any[]).length > 0 ?
            this.masterdataService.updateMasterData(masterdataUpdate, this.masterdataName, this.viewModeGlobal, this.company) : of(null);

        const createMasterDataObservable = (masterdataCreate[this.masterdataName] as any[]).length > 0 ?
            this.masterdataService.createMasterData(masterdataCreate, this.masterdataName, this.company) : of(null);

        updateMasterDataObservable.pipe(
            concatMap(() => createMasterDataObservable),
            finalize(() => {
                this.isLoading = false;
                this.initFABActions();
            }),
        ).subscribe(() => {
            this.isEdit = false;
            this.getData();
            if (this.agGridApi) {
                this.agGridApi.redrawRows();
            }
            this.snackbarService.informationSnackBar('Row(s) updated');
        },          (error) => {
            if (error && error.error) {
                this.snackbarService.throwErrorSnackBar(error.error.detail);
            }
        });
    }

    handleSelectedMasterdataAction(action: string) {
        const selectedMasterdata = this.agGridApi.getSelectedRows();
        if (selectedMasterdata && selectedMasterdata.length > 0) {
            this.handleActionForRows(action, selectedMasterdata);
        } else {
            this.snackbarService.informationSnackBar('Please select some rows');
        }
    }

    // contextual action menu on one row
    handleAction(action: string, masterdata: any) {
        this.handleActionForRows(action, [masterdata]);
    }

    handleActionForRows(action: string, masterdata: any[]) {
        switch (action) {
            case this.userMenuActions.deleteRows:
                this.deleteMasterData(masterdata);

                break;
            case this.userMenuActions.assign:
            case this.userMenuActions.deactivate:
                this.onAssignActionClick(action, masterdata);
                break;
            default:
                throw new Error(`Action ${action} not recognized`);
        }
    }

    deleteMasterData(masterdataItemOrArray: any[]) {
        this.isLoading = false;
        const masterdataToDelete: MasterData = new MasterData();

        masterdataToDelete[this.masterdataName] = masterdataItemOrArray;

        const technicalId = this.gridActions.getGridPropertyForMasterData(this.masterdataName).id;
        const listId = masterdataToDelete[this.masterdataName].map((val) => val[technicalId]);

        this.masterdataService.deleteMasterData(listId, this.masterdataName, this.company)
            .pipe(
                map((data: ApiCollection<MasterDataDeletionResult>) => data.value.map((result) => {
                    return new MasterDataDeletionResult(result.id, result.code, result.masterDataOperationStatus);
                }),
                ),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((masterDataDeletionResult: MasterDataDeletionResult[]) => {

                this.getData();
                this.postActionCleanUp();

                const rowsUpdatedWithSuccess = masterDataDeletionResult
                    .filter((result) => result.masterDataOperationStatus === MasterDataOperationStatus.Success);
                const rowsUpdatedWithError = masterDataDeletionResult
                    .filter((result) => result.masterDataOperationStatus !== MasterDataOperationStatus.Success);

                let snackBarMessage: string = `${rowsUpdatedWithSuccess.length} item(s) have been successfuly deleted \n`;

                if (rowsUpdatedWithError.length !== 0) {
                    snackBarMessage += `${rowsUpdatedWithError.length}  row(s) with error: \n`;
                    rowsUpdatedWithError.forEach((masterdataOperationStatus) => {
                        snackBarMessage +=
                            `Code: ${masterdataOperationStatus.code} Status: ${masterdataOperationStatus.toUserFriendlyMessage()} \n`;
                    });
                }
                this.snackbarService.informationSnackBar(snackBarMessage);
            });
    }

    isDataValid(masterDataList) {
        const errorMessage = this.getErrorMessage(masterDataList);
        const isValid = !errorMessage || errorMessage.length === 0;

        if (!isValid) {
            this.snackbarService.throwErrorSnackBar('Some data are not valid : ' + errorMessage, true);
        }
        return isValid;
    }

    postActionCleanUp() {
        this.isEdit = false;
        this.isLoading = false;
        this.initFABActions();
        if (this.agGridApi) {
            this.agGridApi.redrawRows();
        }
    }

    getErrorMessage(masterDataList) {
        const errorUnicity = this.masterdataManagementService.getUnicityValidationErrors(this.agGridRows, this.validations.unique);
        const errors = new FieldErrors();
        masterDataList.forEach((row) => {
            const rowErrors = this.masterdataManagementService.getRowValidationErrors(this.validations, row, this.masterdata);
            if (rowErrors) {
                errors.concatDistinct(rowErrors);
            }
        });
        let errorMessage = errorUnicity.map((error) => 'The ' + error.name + ' cannot have duplicated values : '
            + error.values.join(', ')).join('. ');
        if (errorMessage.length > 0) {
            errorMessage = errorMessage + '. ';
        }
        errorMessage = errorMessage + errors.toString();

        return errorMessage;
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
        }
    }

    onQuickSearchButtonClicked() {
        const code = this.masterDataCodeCtrl.value === '' ? null : this.masterDataCodeCtrl.value;
        const description = this.masterDataDescriptionCtrl.value === '' ?
            null : this.masterDataDescriptionCtrl.value;
        this.getData(code, description);
    }

    initFABActions() {
        this.fabTitle = 'Manage Master Data';
        this.fabType = FABType.MiniFAB;
        this.fabMenuActions = [];
        const isDisabled = !this.isOperatorAvailable();

        if (!this.isEdit) {
            const editMasterData: FloatingActionButtonActions = {
                icon: 'edit',
                text: 'Edit Master Data',
                action: 'editMasterData',
                disabled: false,
                index: 0,
            };
            this.fabMenuActions.push(editMasterData);
        } else {

            const saveChanges: FloatingActionButtonActions = {
                icon: 'save',
                text: 'Save Changes',
                action: 'saveChanges',
                disabled: false,
                index: 0,
            };

            const addMasterData: FloatingActionButtonActions = {
                icon: 'add',
                text: 'Add Master Data',
                action: 'addMasterData',
                disabled: isDisabled,
                index: 1,
            };

            const discardChanges: FloatingActionButtonActions = {
                icon: 'clear',
                text: 'Discard Changes',
                action: 'discardChanges',
                disabled: false,
                index: 2,
            };

            if (this.isOperatorAvailable()) {
                this.fabMenuActions.push(addMasterData);
            }
            this.fabMenuActions.push(discardChanges);
            this.fabMenuActions.push(saveChanges);
        }
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'editMasterData': {
                this.onEditMasterDataButtonClicked();
                break;
            }
            case 'saveChanges': {
                this.onSaveButtonClick();
                break;
            }
            case 'addMasterData': {
                this.onAddMasterDataButtonClicked();
                break;
            }
            case 'discardChanges': {
                this.onDiscardButtonClick();
                break;
            }
            default: {
                break;
            }
        }
    }

    isOperatorAvailable(): boolean {
        return (((this.isLocal && !this.isGlobal) && !this.viewModeGlobal) // company level (only)
        ||  ((this.isLocal && this.isGlobal) && this.viewModeGlobal) // master level
        || ((!this.isLocal && this.isGlobal) && this.viewModeGlobal)); // global level
    }

}
