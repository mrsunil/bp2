import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AllocationSetUp } from '../../../../../../shared/entities/allocation-set-up-entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-allocation-set-up',
    templateUrl: './allocation-set-up.component.html',
    styleUrls: ['./allocation-set-up.component.scss'],
})

export class AllocationSetUpComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    allocationGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    allocationRowData: AllocationSetUp[];
    allocationColumnDefs: agGrid.ColDef[];
    model: CompanyConfigurationRecord;
    modifiedAllocationSetUpData: AllocationSetUp[] = [];
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveAllocation = new EventEmitter();
    checkEdit: boolean;
    private readonly bothBlockingWarningEnabledMessage = 'Both Difference Warning and Difference Blocking can not be true';
    currentCompany: string;
    companyId: string;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        public gridService: AgGridService,
        protected configurationService: ConfigurationService,
        protected route: ActivatedRoute,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        if (!this.companyId) {
            this.checkEdit = true;
            this.getAllAllocationFieldsForCreation();
            this.initializeGridColumns();
        }
    }

    getAllAllocationFieldsForCreation() {
        this.configurationService.getAllocationSetUp()
            .subscribe((allocationSetupData) => {
                if (allocationSetupData && allocationSetupData.length > 0) {
                    this.modifiedAllocationSetUpData = allocationSetupData;
                }
            });
    }

    initializeGridColumns() {
        this.allocationColumnDefs = [
            {
                headerName: 'allocationFieldSetupId',
                colId: 'allocationFieldSetupId',
                field: 'allocationFieldSetupId',
                hide: true,
            },
            {
                headerName: 'tradeSetupId',
                colId: 'tradeSetupId',
                field: 'tradeSetupId',
                hide: true,
            },
            {
                headerName: 'fieldId',
                colId: 'fieldId',
                field: 'fieldId',
                hide: true,
            },
            {
                headerName: 'Field',
                colId: 'friendlyName',
                field: 'friendlyName',
                width: 75,
            },
            {
                headerName: 'Field name',
                colId: 'fieldName',
                field: 'fieldName',
                hide: true,
            },
            {
                headerName: 'Difference Blocking',
                colId: 'differenceBlocking',
                field: 'differenceBlocking',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.checkEdit,
                },
                width: 50,
                onCellValueChanged: (params) => {
                    if (params.data.differenceWarning === true &&
                        params.data.differenceBlocking === true) {
                        params.node.setDataValue('differenceBlocking', false);
                        this.snackbarService.throwErrorSnackBar(this.bothBlockingWarningEnabledMessage);
                    }
                },
            },
            {
                headerName: 'Difference Warning',
                colId: 'differenceWarning',
                field: 'differenceWarning',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.checkEdit,
                },
                width: 50,
                onCellValueChanged: (params) => {
                    if (params.data.differenceWarning === true &&
                        params.data.differenceBlocking === true) {
                        params.node.setDataValue('differenceWarning', false);
                        this.snackbarService.throwErrorSnackBar(this.bothBlockingWarningEnabledMessage);
                    }
                },
            },
        ];
    }

    onGridReady(params) {
        params.columnDefs = this.allocationColumnDefs;
        this.allocationGridOptions = params;
        this.gridApi = this.allocationGridOptions.api;
        this.gridColumnApi = this.allocationGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

    }

    readyAllocationSetUpEditor() {
        const allocationDataList = this.modifiedAllocationSetUpData;
        this.allocationRowData = allocationDataList.map((filter) => {
            return {
                allocationFieldSetupId: filter.allocationFieldSetupId,
                tradeSetupId: filter.tradeSetupId,
                fieldId: filter.fieldId,
                fieldName: filter.fieldName,
                differenceBlocking: filter.differenceBlocking,
                differenceWarning: filter.differenceWarning,
                friendlyName: filter.friendlyName,
            };
        });
        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.modifiedAllocationSetUpData = companyConfigurationRecord.allocationSetUp;
        this.checkEdit = isEdit;
        this.initializeGridColumns();
        return companyConfigurationRecord;
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'AllocationSetUpComponent' });
    }

    onSaveButtonClicked() {
        this.modifiedAllocationSetUpData = [];
        this.gridApi.forEachNode((rowdata) => {
            const allocationSetUpRow = new AllocationSetUp();
            allocationSetUpRow.allocationFieldSetupId = rowdata.data.allocationFieldSetupId;
            allocationSetUpRow.tradeSetupId = rowdata.data.tradeSetupId;
            allocationSetUpRow.fieldId = rowdata.data.fieldId;
            allocationSetUpRow.fieldName = rowdata.data.fieldName;
            allocationSetUpRow.friendlyName = rowdata.data.friendlyName;
            allocationSetUpRow.differenceBlocking = rowdata.data.differenceBlocking;
            allocationSetUpRow.differenceWarning = rowdata.data.differenceWarning;
            this.modifiedAllocationSetUpData.push(allocationSetUpRow);
        });
        this.isSideNavOpened.emit(false);
        this.saveAllocation.emit();
    }

    populateEntity(entity: any): CompanyConfiguration {
        const companyConfiguration = entity as CompanyConfiguration;
        if (this.modifiedAllocationSetUpData && this.modifiedAllocationSetUpData.length > 0) {
            companyConfiguration.allocationSetUp = this.modifiedAllocationSetUpData;
        }
        return companyConfiguration;
    }
}
