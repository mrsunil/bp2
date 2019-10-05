import { Component, OnInit } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import * as agGrid from 'ag-grid-community';
import { GridConfigurationProperties } from '../../../../../../shared/entities/grid-configuration.entity';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { ColumnConfigurationProperties } from '../../../../../../shared/entities/grid-column-configuration.entity';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { ConfigurationType } from '../../../../../../shared/enums/configuration-type.enum';

@Component({
    selector: 'atlas-list-view-details',
    templateUrl: './list-view-details.component.html',
    styleUrls: ['./list-view-details.component.scss']
})
export class ListViewDetailsComponent extends BaseFormComponent implements OnInit {

    createdByCtrl = new AtlasFormControl('CreatedBy');
    creationDateCtrl = new AtlasFormControl('CreationDate');
    lastAmendedByCtrl = new AtlasFormControl('LastAmendedBy');
    modifiedDateCtrl = new AtlasFormControl('ModifiedDate');
    isLoading: boolean = true;
    gridColumnApi: agGrid.ColumnApi;
    gridId: number;
    viewName: string;
    gridContext = {
        gridEditable: true,
    };
    gridConfiguration: GridConfigurationProperties;
    isEditMode: boolean = false;
    pageIsValid: boolean = true;
    listViewGridColumns: agGrid.ColDef[];
    listViewGridOptions: agGrid.GridOptions = {};
    listGridRows: ColumnConfigurationProperties[];
    friendlyNameColumn: string = 'friendlyName';

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected router: Router,
        public gridService: AgGridService,
        private configurationService: ConfigurationService,
        protected companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService,
    ) { super(formConfigurationProvider); }

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
        this.listViewGridOptions = {
            context: this.gridContext,
        };
        this.listViewGridColumns = [
            {
                headerName: 'Field Name',
                field: 'fieldName',
                colId: 'fieldName',
                hide: false,
                sort: 'asc',
                cellStyle: { 'background-color': 'rgba(0, 0, 0, 0.10)' }
            },
            {
                headerName: 'Data Type',
                field: 'filterType',
                colId: 'filterType',
                hide: false,
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
                headerName: 'Data Size',
                field: 'size',
                colId: 'size',
                hide: false,
                cellStyle: { 'background-color': 'rgba(0, 0, 0, 0.10)' }
            },
            {
                headerName: 'Linked Table',
                field: 'groupName',
                colId: 'groupName',
                hide: false,
                cellStyle: { 'background-color': 'rgba(0, 0, 0, 0.10)' }
            },
            {
                headerName: 'Is a Filter',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.isEditMode,
                },
                field: 'isFilterable',
                colId: 'isFilterable',
                hide: false,
            },
            {
                headerName: 'Is a Result',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.isEditMode,
                },
                colId: 'isResult',
                field: 'isResult',
                hide: false,
            },
        ];
    };


    getGridColumnConfiguration() {
        this.configurationService.getGridColumnConfigurationByGridId(this.gridId)
            .subscribe((data: GridConfigurationProperties) => {
                if (data) {
                    this.gridConfiguration = data;
                    this.listGridRows = data.columns;
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
        this.configurationService.getGridConfigByConfigurationTypeId(ConfigurationType.List)
            .subscribe((data) => {
                const gridViewList = data.value;
                this.gridId = gridViewList[0].gridId;
                this.getGridColumnConfiguration();
            });

    }

    onGridReady(params) {
        params.columnDefs = this.listViewGridColumns;
        this.listViewGridOptions = params;
        this.gridColumnApi = this.listViewGridOptions.columnApi;
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
            + '/admin/global-parameters/grid-configuration/list/edit', this.gridId]);
    }

    onSaveButtonClicked() {

        if (this.pageIsValid) {

            this.configurationService.updateGridColumnConfiguration(this.gridConfiguration).subscribe(
                () => {
                    this.snackbarService.informationSnackBar('Configuration Updated');
                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                        + '/admin/global-parameters/grid-configuration/list/display', this.gridId]);
                },
                (err) => {
                    throw err;
                });
        } else {
            this.snackbarService.throwErrorSnackBar('Please resolve errors');
        }
    }

    isGridEditable(params) {
        return params.context.gridEditable;
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
            }

        }
    }


}
