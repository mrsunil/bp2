import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridContextualSearchComponent } from '../../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AccountingSetupFields } from '../../../../../../shared/entities/accounting-setup-fields.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { DefaultAccountingSetupResult } from '../../../../../../shared/entities/default-accounting-setup-result.entity';
import { DefaultAccountingSetup } from '../../../../../../shared/entities/default-accounting-setup.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { AccountingFields } from '../../../../../../shared/enums/accounting-fields.enum';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-default-cost-type',
    templateUrl: './default-cost-type.component.html',
    styleUrls: ['./default-cost-type.component.scss'],
})
export class DefaultCostTypeComponent extends BaseFormComponent implements OnInit {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    defaultCostTypeColumnDefs: agGrid.ColDef[];
    defaultCostTypeGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    checkEdit: boolean = false;
    defaultCostTypeRowData: AccountingSetupFields[] = [];
    costTypeSetupData: AccountingSetupFields[];
    defaultAccountingSetup: DefaultAccountingSetup;
    accountingSetupResult: DefaultAccountingSetupResult;
    masterdata: MasterData;
    currentCompany: string;
    companyId: string;
    isCreate: boolean;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        public gridService: AgGridService,
        private snackbarService: SnackbarService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.isCreate = false;
        if (!this.companyId) {
            this.isCreate = true;
            this.checkEdit = true;
            this.getCostTypeFields();
            this.initializeGridColumns();
        }
    }

    getCostTypeFields() {
        this.costTypeSetupData = [];
        this.costTypeSetupData.push(
            {
                id: 'cashReceivedCostTypeId',
                label: 'Cash Received',
                value: (!this.isCreate) ? this.defaultAccountingSetup.cashReceived : null,
                result: null,
            },
            {
                id: 'cashPaidCostTypeId',
                label: 'Cash Paid',
                value: (!this.isCreate) ? this.defaultAccountingSetup.cashPaid : null,
                result: null,
            },
            {
                id: 'purchaseInvoiceCostTypeId',
                label: 'Purchase Invoice',
                value: (!this.isCreate) ? this.defaultAccountingSetup.purchaseInvoice : null,
                result: null,
            },
            {
                id: 'salesInvoiceCostTypeId',
                label: 'Sales Invoice',
                value: (!this.isCreate) ? this.defaultAccountingSetup.salesInvoice : null,
                result: null,
            },
            {
                id: 'washoutInvoiceGainsCostTypeId',
                label: 'Washout Invoice (Gain)',
                value: (!this.isCreate) ? this.defaultAccountingSetup.washoutInvoiceGains : null,
                result: null,
            },
            {
                id: 'washoutInvoiceLossCostTypeId',
                label: 'Washout Invoice (Loss)',
                value: (!this.isCreate) ? this.defaultAccountingSetup.washoutInvoiceLoss : null,
                result: null,
            },
            {
                id: 'fxRevalCostTypeId',
                label: 'FX Real',
                value: (!this.isCreate) ? this.defaultAccountingSetup.fxReval : null,
                result: null,
            },
            {
                id: 'cancellationGainCostTypeId',
                label: 'Cancellation (Gain)',
                value: (!this.isCreate) ? this.defaultAccountingSetup.cancellationGain : null,
                result: null,
            },
            {
                id: 'cancellationLossCostTypeId',
                label: 'Cancellation (Loss)',
                value: (!this.isCreate) ? this.defaultAccountingSetup.cancellationLoss : null,
                result: null,
            },
            {
                id: 'yepCostTypeId',
                label: 'Cost Type for YEP',
                value: (!this.isCreate) ? this.defaultAccountingSetup.yepCostType : null,
                result: null,
            },
        );
        this.costTypeSetupData = this.costTypeSetupData.map((filter) => {
            const costType = this.masterdata.costTypes.find((e) => e.costTypeCode === (filter.value));
            return {
                id: filter.id,
                label: filter.label,
                value: filter.value,
                result: (costType) ? costType.costTypeId : null,
            };
        });
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.defaultAccountingSetup = companyConfigurationRecord.defaultAccountingSetup;
        this.getCostTypeFields();
        this.checkEdit = isEdit;
        this.initializeGridColumns();
        this.defaultCostTypeRowData = this.costTypeSetupData;
        return companyConfigurationRecord;
    }

    onGridReady(params) {
        params.columnDefs = this.defaultCostTypeColumnDefs;
        this.defaultCostTypeGridOptions = params;
        this.gridApi = this.defaultCostTypeGridOptions.api;
        this.gridColumnApi = this.defaultCostTypeGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

    }

    initializeGridColumns() {
        this.defaultCostTypeColumnDefs = [
            {
                headerName: 'Cost Type Field',
                colId: 'label',
                field: 'label',
            },
            {
                headerName: 'id',
                colId: 'id',
                field: 'id',
                hide: true,
            },
            {
                headerName: 'Cost types',
                colId: 'value',
                field: 'value',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.checkEdit,
                        },
                        gridId: 'costTypesGrid',
                        options: this.masterdata.costTypes,
                        displayProperty: 'costTypeCode',
                        codeProperty: 'costTypeCode',
                        descriptionProperty: 'name',
                        valueProperty: 'costTypeCode',
                        lightBoxTitle: 'Results for Cost',
                        showContextualSearchIcon: this.checkEdit,
                        isRequired: true,
                    };
                },
                onCellValueChanged: (params) => {
                    if (params.node.data.value && params.node.data.value !== params.value) {
                        const costType = this.masterdata.costTypes.find((a) =>
                            a.costTypeCode === params.node.data.value);
                        if (costType) {
                            params.node.setDataValue('costTypeName', costType.name);
                            params.node.setDataValue('result', costType.costTypeId);
                        }
                    }
                },
            },
            {
                headerName: 'result',
                colId: 'result',
                field: 'result',
                hide: true,
            },
            {
                headerName: 'Cost Type Name',
                colId: 'costTypeName',
                field: 'costTypeName',
                cellRenderer: this.costTypeFormatter.bind(this),
            },
        ];
    }

    costTypeFormatter(params) {
        if (params.node.data.value) {
            const selectedCostType = this.masterdata.costTypes.find((costType) =>
                costType.costTypeCode === params.node.data.value);
            params.node.data.costTypeName = (selectedCostType ? selectedCostType.name : '');
        }
        return params.node.data.costTypeName;
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'DefaultCostTypeComponent' });
    }

    loadDefaultCostTypeFieldSetUpEditor() {
        const defaultCostType = this.costTypeSetupData;
        this.defaultCostTypeRowData = [];
        this.defaultCostTypeRowData = defaultCostType.map((filter) => {
            return {
                id: filter.id,
                label: filter.label,
                value: filter.value,
                result: filter.result,
            };
        });
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    validate(): boolean {
        let isValid = true;
        this.gridApi.forEachNode((rowData) => {
            if (!(rowData.data.value && rowData.data.label)) {
                isValid = false;
            }
        });
        return isValid;
    }

    onSaveButtonClicked() {
        if (!this.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Default Costtype GridData is invalid. Please resolve the errors',
            );
            return;
        }
        this.costTypeSetupData = [];
        this.gridApi.forEachNode((rowdata) => {
            const costTypeData = new AccountingSetupFields();
            costTypeData.id = rowdata.data.id;
            costTypeData.label = rowdata.data.label;
            costTypeData.value = rowdata.data.value;
            const costType = this.masterdata.costTypes.find(
                (e) => e.costTypeCode === (rowdata.data.value));
            costTypeData.result = (costType) ? costType.costTypeId : null;
            this.costTypeSetupData.push(costTypeData);
        });
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    getCostTypeValuesForSave(): DefaultAccountingSetupResult {
        const cashReceived = this.costTypeSetupData.find((e) => e.id === AccountingFields.CashReceivedCostTypeId);
        const cashPaid = this.costTypeSetupData.find((e) => e.id === AccountingFields.CashPaidCostTypeId);
        const purchaseInvoice = this.costTypeSetupData.find(
            (e) => e.id === AccountingFields.PurchaseInvoiceCostTypeId);
        const salesInvoice = this.costTypeSetupData.find((e) => e.id === AccountingFields.SalesInvoiceCostTypeId);
        const washoutGain = this.costTypeSetupData.find((e) => e.id === AccountingFields.WashoutInvoiceGainsCostTypeId);
        const washoutLoss = this.costTypeSetupData.find((e) => e.id === AccountingFields.WashoutInvoiceLossCostTypeId);
        const fxReval = this.costTypeSetupData.find((e) => e.id === AccountingFields.FXRevalCostTypeId);
        const yepCostType = this.costTypeSetupData.find((e) => e.id === AccountingFields.YepCostTypeId);
        const cancellationGain = this.costTypeSetupData.find((e) => e.id === AccountingFields.CancellationGainCostTypeId);
        const cancellationLoss = this.costTypeSetupData.find((e) => e.id === AccountingFields.CancellationLossCostTypeId);

        this.accountingSetupResult = new DefaultAccountingSetupResult();
        this.accountingSetupResult.cashReceivedCostTypeId = (cashReceived) ? cashReceived.result : null;
        this.accountingSetupResult.cashPaidCostTypeId = (cashPaid) ? cashPaid.result : null;
        this.accountingSetupResult.purchaseInvoiceCostTypeId = (purchaseInvoice) ? purchaseInvoice.result : null;
        this.accountingSetupResult.salesInvoiceCostTypeId = (salesInvoice) ? salesInvoice.result : null;
        this.accountingSetupResult.washoutInvoiceGainsCostTypeId = (washoutGain) ? washoutGain.result : null;
        this.accountingSetupResult.washoutInvoiceLossCostTypeId = (washoutLoss) ? washoutLoss.result : null;
        this.accountingSetupResult.fxRevalCostTypeId = (fxReval) ? fxReval.result : null;
        this.accountingSetupResult.yepCostTypeId = (yepCostType) ? yepCostType.result : null;
        this.accountingSetupResult.cancellationGainCostTypeId = (cancellationGain) ? cancellationGain.result : null;
        this.accountingSetupResult.cancellationLossCostTypeId = (cancellationLoss) ? cancellationLoss.result : null;
        return this.accountingSetupResult;

    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        if (this.costTypeSetupData && this.costTypeSetupData.length > 0) {
            this.getCostTypeValuesForSave();
            companyConfiguration.defaultAccountingSetup = this.accountingSetupResult;
        }
        return companyConfiguration;
    }
}
