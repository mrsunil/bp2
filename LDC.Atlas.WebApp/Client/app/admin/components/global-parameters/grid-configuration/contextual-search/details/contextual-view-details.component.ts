import { Component, OnInit } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import * as agGrid from 'ag-grid-community';
import { GridConfigurationProperties } from '../../../../../../shared/entities/grid-configuration.entity';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { ColumnConfigurationProperties } from '../../../../../../shared/entities/grid-column-configuration.entity';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { CellEditorNumericComponent } from '../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { AllNumberMask } from '../../../../../../shared/numberMask';
import { ConfigurationType } from '../../../../../../shared/enums/configuration-type.enum';

@Component({
    selector: 'atlas-contextual-view-details',
    templateUrl: './contextual-view-details.component.html',
    styleUrls: ['./contextual-view-details.component.scss']
})
export class ContextualViewDetailsComponent implements OnInit {

    createdByCtrl = new AtlasFormControl('CreatedBy');
    creationDateCtrl = new AtlasFormControl('CreationDate');
    lastAmendedByCtrl = new AtlasFormControl('LastAmendedBy');
    modifiedDateCtrl = new AtlasFormControl('ModifiedDate');
    isLoading: boolean = true;
    gridColumnApi: agGrid.ColumnApi;
    contextualViewGridColumns: agGrid.ColDef[];
    contextualViewGridOptions: agGrid.GridOptions = {};
    gridId: number;
    viewName: string;
    gridConfiguration: GridConfigurationProperties;
    gridColumnsList: ColumnConfigurationProperties[];
    gridContext = {
        gridEditable: true,
    };
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    isEditMode: boolean = false;
    pageIsValid: boolean = true;
    contextualGridRows: ColumnConfigurationProperties[];
    friendlyNameColumn: string = 'friendlyName';
    columnOrder: string = 'sortOrderIndex';
    sortOrderIndexes: number[] = [];
    isDuplicateOrder: boolean = false;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        public gridService: AgGridService,
        private configurationService: ConfigurationService,
        protected snackbarService: SnackbarService,
        protected companyManager: CompanyManagerService,
    ) { }

    ngOnInit() {
        this.gridId = Number(this.route.snapshot.paramMap.get('gridId'));

        if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[3].path.toString() === 'edit') {
            this.isEditMode = true;
        }

        this.gridContext.gridEditable = this.isEditMode ? true : false;
        this.initializeGridColumns();

        if (this.gridId === 0) {
            this.getDefaultGridColumnConfiguration();
        }
        else {
            this.getGridColumnConfiguration();
        }


        this.createdByCtrl.disable();
        this.creationDateCtrl.disable();
        this.lastAmendedByCtrl.disable();
        this.modifiedDateCtrl.disable();
    }

    initializeGridColumns() {
        this.contextualViewGridOptions = {
            context: this.gridContext,
        };
        this.contextualViewGridColumns = [
            {
                headerName: 'Field Name',
                field: 'fieldName',
                colId: 'fieldName',
                hide: false,
                sort: 'asc',
                cellStyle: { 'background-color': 'rgba(0, 0, 0, 0.10)' }
            },
            {
                headerName: 'Friendly Name',
                field: 'friendlyName',
                colId: 'friendlyName',
                hide: false,
                editable: this.isEditMode,
                cellRenderer: this.requiredCell,
            },
            {
                headerName: 'Is a Column',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.isEditMode,
                },
                colId: 'isVisible',
                field: 'isVisible',
                hide: false,
            },
            {
                headerName: 'Order',
                colId: 'sortOrderIndex',
                field: 'sortOrderIndex',
                suppressToolPanel: true,
                // lockPosition: true,
                editable: this.isEditMode,
                cellRenderer: this.requiredCell,
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: AllNumberMask(),
                },
            },
        ];
    };

    getGridColumnConfiguration() {

        this.configurationService.getGridColumnConfigurationByGridId(this.gridId)
            .subscribe((data: GridConfigurationProperties) => {
                if (data) {
                    this.gridConfiguration = data;
                    this.contextualGridRows = data.columns;
                    this.viewName = data.name;
                    this.createdByCtrl.patchValue(data.createdBy);
                    this.creationDateCtrl.patchValue(data.createdDateTime.toDateString());
                    this.lastAmendedByCtrl.patchValue(data.modifiedBy);
                    if (data.modifiedDateTime) {
                        this.modifiedDateCtrl.patchValue(data.modifiedDateTime.toDateString());
                    }
                }
                this.isLoading = false;
            });
    }

    getDefaultGridColumnConfiguration() {
        this.configurationService.getGridConfigByConfigurationTypeId(ConfigurationType.Contextual)
            .subscribe((data) => {
                const gridViewList = data.value;
                this.gridId = gridViewList[0].gridId;
                this.getGridColumnConfiguration();
            });

    }

    onGridReady(params) {
        params.columnDefs = this.contextualViewGridColumns;
        this.contextualViewGridOptions = params;
        this.gridColumnApi = this.contextualViewGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    onEditClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
            + '/admin/global-parameters/grid-configuration/contextual/edit', this.gridId]);
    }

    onSaveButtonClicked() {
        this.isDuplicateOrder = false;
        this.checkDuplicateOrder(this.gridConfiguration);
        if (!this.isDuplicateOrder) {
            if (this.pageIsValid) {
                this.configurationService.updateGridColumnConfiguration(this.gridConfiguration)
                    .subscribe(() => {
                        this.snackbarService.informationSnackBar('Configuration Updated');
                        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                            + '/admin/global-parameters/grid-configuration/contextual/display', this.gridId]);
                    },
                        (err) => {
                            throw err;
                        });

            } else {
                this.snackbarService.throwErrorSnackBar('Please resolve errors');
            }
        }
    }

    checkDuplicateOrder(gridData) {
        this.sortOrderIndexes = [];
        gridData.columns.forEach((element) => {
            const sortOrderExists = this.sortOrderIndexes.find((s) => s === element.sortOrderIndex);
            if (sortOrderExists) {
                this.isDuplicateOrder = true;
                this.snackbarService.throwErrorSnackBar('Duplicate Order Sequence');
                return;
            }
            else {
                this.sortOrderIndexes.push(element.sortOrderIndex);
            }
        });
    }

    isGridEditable(): boolean {
        if (!this.isEditMode) {
            return true;
        }
        return false;
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'document-cell-value-required\'>Required*</div>';
        }
        if (params.colDef.colId === 'amount') {
            const indexOf = params.value.toString().indexOf('.');
            if (indexOf !== -1) {
                const remainingLength = params.value.toString().length - indexOf;
                if (remainingLength > 3) {
                    return params.value.toString().substr(0, indexOf + 3);
                }
            }
            return params.value;
        }

        return params.value;
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.gridColumnApi.autoSizeAllColumns();
            if (params.colDef) {
                const columnChanged: string = params.colDef.field;
                if (columnChanged === this.friendlyNameColumn) {
                    if (params.newValue === '') {
                        this.pageIsValid = false;
                        this.snackbarService.throwErrorSnackBar('Friendly Name is required.');
                    }
                    else {
                        this.pageIsValid = true;
                    }
                }
                if (columnChanged === this.columnOrder) {
                    if (!params.newValue) {
                        this.pageIsValid = false;
                        this.snackbarService.throwErrorSnackBar('Order is required.');
                    }
                    else {
                        this.pageIsValid = true;
                    }
                }
            }
        }
    }
}