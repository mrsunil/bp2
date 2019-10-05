import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AccountingFieldSetup } from '../../../../../../shared/entities/accounting-field-setup.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { MasterRowApplyComponent } from '../../../master-row-apply/master-row-apply.component';

@Component({
    selector: 'atlas-main-accounting',
    templateUrl: './main-accounting.component.html',
    styleUrls: ['./main-accounting.component.scss'],
})
export class MainAccountingComponent extends BaseFormComponent implements OnInit {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    authorizeForPostingCtrl = new AtlasFormControl('authorizeForPostingSelection');
    mandatoryColumnDefs: agGrid.ColDef[];
    agGridCols: agGrid.ColDef[];
    atlasAgGridParam: AtlasAgGridParam;
    mandatoryAccountingGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    columnDefs: agGrid.ColDef[];
    gridColumnApi: agGrid.ColumnApi;
    masterdata: MasterData;
    checkEdit: boolean = false;
    company: string;
    mainAccountingData: AccountingFieldSetup[] = [];
    mainAccountingRowData: AccountingFieldSetup[];
    pinnedTopRowData: any;
    columnName: string;
    masterEditField: string = 'Master Row';
    gridContext = {
        gridEditable: true,
        componentParent: this,
    };
    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
    };
    currentCompany: string;
    companyId: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        public gridService: AgGridService,
        protected configurationService: ConfigurationService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.masterdata = this.route.snapshot.data.masterdata;
        if (!this.companyId) {
            this.authorizeForPostingCtrl.setValue(false);
            this.checkEdit = true;
            this.getMainAccountingSetup();
            this.initializeGridColumns();
        }
    }

    getMainAccountingSetup() {
        this.configurationService.getMainAccountingSetup()
            .subscribe((mainAccountingData: AccountingFieldSetup[]) => {
                if (mainAccountingData && mainAccountingData.length > 0) {
                    this.mainAccountingData = mainAccountingData;
                }
            });
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.authorizeForPostingCtrl.setValue(companyConfigurationRecord.invoiceSetup.authorizedForPosting);
        this.mainAccountingData = companyConfigurationRecord.mainAccountingSetup;
        this.checkEdit = isEdit;
        this.initializeGridColumns();
        return companyConfigurationRecord;
    }

    onGridReady(params) {
        params.columnDefs = this.mandatoryColumnDefs;
        this.columnDefs = params.columnDefs;
        this.mandatoryAccountingGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    loadAccountingMandatoryFieldSetUpEditor() {
        const mandatoryDataList = this.mainAccountingData;
        this.mainAccountingRowData = mandatoryDataList.map((filter) => {
            return {
                mainAccountingSetupId: filter.mainAccountingSetupId,
                tableId: filter.tableId,
                fieldId: filter.fieldId,
                fieldName: filter.fieldName,
                friendlyName: filter.friendlyName,
                isMandatory: filter.isMandatory,
                isEditable: filter.isEditable,
            };
        });
        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
    }

    initializeGridColumns() {
        this.mandatoryAccountingGridOptions = {
            context: this.gridContext,
        };
        this.mandatoryColumnDefs = [
            {
                headerName: 'mainAccountingSetupId',
                colId: 'mainAccountingSetupId',
                field: 'mainAccountingSetupId',
                hide: true,
            },
            {
                headerName: 'tableId',
                colId: 'tableId',
                field: 'tableId',
                hide: true,
            },
            {
                headerName: 'fieldId',
                colId: 'fieldId',
                field: 'fieldId',
                hide: true,
            },
            {
                headerName: 'Field Name',
                colId: 'fieldName',
                field: 'fieldName',
                hide: true,
                pinnedRowCellRendererFramework: MasterRowApplyComponent,
            },
            {
                headerName: 'Friendly Name',
                colId: 'friendlyName',
                field: 'friendlyName',
                width: 75,
                cellClass: (params) => {
                    if (params.node.rowPinned) {
                        return 'pinnedRow';
                    }
                },
            },
            {
                headerName: 'Mandatory',
                colId: 'isMandatory',
                field: 'isMandatory',
                width: 50,
                pinnedRowCellRendererFramework: AgGridCheckboxComponent,
                pinnedRowCellRendererParams: {
                    disabled: !this.checkEdit,
                },
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: (params) => {
                    return {
                        disabled: (params.data.isMandatory === null) || !this.checkEdit,
                    };
                },
                cellClass: (params) => {
                    if (params.node.rowPinned) {
                        return 'pinnedRow';
                    }
                },
                onCellValueChanged: (params) => {
                    if (params.node.rowPinned) {
                        this.updateAllRowAsMandatory(params.data);
                    }
                },
            },
            {
                headerName: 'Editable',
                colId: 'isEditable',
                field: 'isEditable',
                width: 50,
                pinnedRowCellRendererFramework: AgGridCheckboxComponent,
                pinnedRowCellRendererParams: {
                    disabled: !this.checkEdit,
                },
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: (params) => {
                    return {
                        disabled: (params.data.isEditable === null) || !this.checkEdit,
                    };
                },
                cellClass: (params) => {
                    if (params.node.rowPinned) {
                        return 'pinnedRow';
                    }
                },
                onCellValueChanged: (params) => {
                    if (params.node.rowPinned) {
                        this.updateAllRowAsEditable(params.data);
                    }
                },
            },
        ];
        this.pinnedTopRowData = this.getPinnedTopData();
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'MainAccountingComponent' });
    }

    onSaveButtonClicked() {
        this.mainAccountingData = [];
        this.gridApi.forEachNode((rowdata: agGrid.RowNode) => {
            const mandatoryFieldSetUpRow = new AccountingFieldSetup();
            mandatoryFieldSetUpRow.tableId = rowdata.data.tableId;
            mandatoryFieldSetUpRow.mainAccountingSetupId = rowdata.data.mainAccountingSetupId;
            mandatoryFieldSetUpRow.fieldId = rowdata.data.fieldId;
            mandatoryFieldSetUpRow.fieldName = rowdata.data.fieldName;
            mandatoryFieldSetUpRow.friendlyName = rowdata.data.friendlyName;
            mandatoryFieldSetUpRow.isMandatory = rowdata.data.isMandatory;
            mandatoryFieldSetUpRow.isEditable = rowdata.data.isEditable;
            this.mainAccountingData.push(mandatoryFieldSetUpRow);
        });
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        if (this.mainAccountingData && this.mainAccountingData.length > 0) {
            companyConfiguration.mainAccountingFieldSetup = this.mainAccountingData;
        }
        companyConfiguration.invoiceSetup.authorizedForPosting = this.authorizeForPostingCtrl.value;
        return companyConfiguration;
    }

    getPinnedTopData() {
        return [
            {
                mainAccountingSetupId: '',
                tableId: '',
                fieldId: '',
                fieldName: '',
                friendlyName: 'Master Row',
                isMandatory: '',
                isEditable: '',
            },
        ];
    }

    updateAllRowAsMandatory(rowData) {
        this.mandatoryColumnDefs.forEach((x) => {
            this.columnName = x.field;
            if (this.columnName === 'isMandatory') {
                if (rowData[this.columnName] !== this.masterEditField) {
                    this.gridApi.forEachNode((rowNode) => {
                        if (rowNode.data.isMandatory !== null) {
                            rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                        }
                    });
                }
                this.gridColumnApi.resetColumnState();
                this.gridColumnApi.autoSizeAllColumns();
            }
        });
    }

    updateAllRowAsEditable(rowData) {
        this.mandatoryColumnDefs.forEach((x) => {
            this.columnName = x.field;
            if (this.columnName === 'isEditable') {
                if (rowData[this.columnName] !== this.masterEditField) {
                    this.gridApi.forEachNode((rowNode) => {
                        if (rowNode.data.isEditable !== null) {
                            rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                        }
                    });
                }
                this.gridColumnApi.resetColumnState();
                this.gridColumnApi.autoSizeAllColumns();
            }
        });
    }
}
