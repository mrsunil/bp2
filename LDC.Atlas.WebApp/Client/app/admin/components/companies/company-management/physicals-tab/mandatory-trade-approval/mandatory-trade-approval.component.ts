import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MandatoryTradeApprovalImageSetup } from '../../../../../../shared/entities/mandatory-trade-fields';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { FormConfigurationProviderService } from './../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-mandatory-trade-approval',
    templateUrl: './mandatory-trade-approval.component.html',
    styleUrls: ['./mandatory-trade-approval.component.scss'],
})
export class MandatoryTradeApprovalComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    mandatoryTradeGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    mandatoryRowData: MandatoryTradeApprovalImageSetup[];
    mandatoryColumnDefs: agGrid.ColDef[];
    model: CompanyConfigurationRecord;
    modifiedMandatorySetUpData: MandatoryTradeApprovalImageSetup[] = [];
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly businessSectorMandatory = new EventEmitter();
    checkEdit: boolean;
    currentCompany: string;
    companyId: string;
    departmentId: string = 'DepartmentId';
    traderId: string = 'TraderId';

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        public gridService: AgGridService,
        protected route: ActivatedRoute,
        protected configurationService: ConfigurationService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        if (!this.companyId) {
            this.checkEdit = true;
            this.getAllFieldsForCreation();
            this.initializeGridColumns();
        }
    }

    getAllFieldsForCreation() {
        this.configurationService.getMandatoryFieldsSetUp()
            .subscribe((mandatoryFieldsData) => {
                if (mandatoryFieldsData && mandatoryFieldsData.length > 0) {
                    this.modifiedMandatorySetUpData = mandatoryFieldsData;
                }
            });
    }

    initializeGridColumns() {
        this.mandatoryColumnDefs = [
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
                headerName: 'fieldName',
                colId: 'fieldName',
                field: 'fieldName',
                hide: true,
            },
            {
                headerName: 'Header CardField ',
                colId: 'friendlyName',
                field: 'friendlyName',
                width: 75,
            },
            {
                headerName: 'Mandatory',
                colId: 'mandatory',
                field: 'mandatory',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: (params) => {
                    return {
                        disabled: (params.data.fieldName === this.departmentId) || (params.data.fieldName === this.traderId) || !this.checkEdit,
                    };
                },
                width: 50,
            },
            {
                headerName: 'Unapprove trade upon editing',
                colId: 'unApproval',
                field: 'unApproval',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.checkEdit,
                },
                width: 50,
            },
            {
                headerName: 'Copy at image',
                colId: 'isCopy',
                field: 'isCopy',
                cellRendererFramework: AgGridCheckboxComponent,
                cellRendererParams: {
                    disabled: !this.checkEdit,
                },
                width: 50,
            },

        ];
    }

    onGridReady(params) {
        params.columnDefs = this.mandatoryColumnDefs;
        this.mandatoryTradeGridOptions = params;
        this.gridApi = this.mandatoryTradeGridOptions.api;
        this.gridColumnApi = this.mandatoryTradeGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

    }

    readyMandatoryFieldSetUpEditor() {
        const mandatoryDataList = this.modifiedMandatorySetUpData;
        this.mandatoryRowData = mandatoryDataList.map((filter) => {
            return {
                tradeSetupId: filter.tradeSetupId,
                fieldId: filter.fieldId,
                fieldName: filter.fieldName,
                mandatory: filter.mandatory,
                unApproval: filter.unApproval,
                isCopy: filter.isCopy,
                friendlyName: filter.friendlyName,
            };
        });
        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.modifiedMandatorySetUpData = companyConfigurationRecord.mandatoryTradeApprovalImageSetup;
        this.checkEdit = isEdit;
        this.initializeGridColumns();
        return companyConfigurationRecord;
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'MandatoryTradeApprovalComponent' });
    }

    onSaveButtonClicked() {
        this.modifiedMandatorySetUpData = [];
        let checkBusinessSector = false;
        this.gridApi.forEachNode((rowdata) => {
            const mandatoryFieldSetUpRow = new MandatoryTradeApprovalImageSetup();
            mandatoryFieldSetUpRow.tradeSetupId = rowdata.data.tradeSetupId;
            mandatoryFieldSetUpRow.fieldId = rowdata.data.fieldId;
            mandatoryFieldSetUpRow.fieldName = rowdata.data.fieldName;
            mandatoryFieldSetUpRow.friendlyName = rowdata.data.friendlyName;
            mandatoryFieldSetUpRow.mandatory = rowdata.data.mandatory;
            mandatoryFieldSetUpRow.unApproval = rowdata.data.unApproval;
            mandatoryFieldSetUpRow.isCopy = rowdata.data.isCopy;
            this.modifiedMandatorySetUpData.push(mandatoryFieldSetUpRow);

            if (rowdata.data.friendlyName === 'Business Sector' && rowdata.data.mandatory) {
               checkBusinessSector = true;
            }
        });
        this.isSideNavOpened.emit(false);
        this.businessSectorMandatory.emit(checkBusinessSector);
        this.saveMandatory.emit();
    }

    populateEntity(entity: any): CompanyConfiguration {
        const companyConfiguration = entity as CompanyConfiguration;
        if (this.modifiedMandatorySetUpData && this.modifiedMandatorySetUpData.length > 0) {
            companyConfiguration.mandatoryTradeApprovalImageSetup = this.modifiedMandatorySetUpData;
        }
        return companyConfiguration;
    }
}
