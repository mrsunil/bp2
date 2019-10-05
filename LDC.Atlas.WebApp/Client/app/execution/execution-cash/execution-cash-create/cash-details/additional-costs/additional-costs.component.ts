import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridAutocompleteComponent } from '../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AdditionalCost } from '../../../../../shared/entities/additional-cost.entity';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CostDirection } from '../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';
import { AdditionalCostListDisplayView } from './additional-cost-list-display-view';

@Component({
    selector: 'atlas-additional-costs',
    templateUrl: './additional-costs.component.html',
    styleUrls: ['./additional-costs.component.scss'],
    providers: [DatePipe],
})
export class AdditionalCostsFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly proceedClickedCashReceipt = new EventEmitter<any>();
    @Output() readonly calculateBalanceOnCostAmountEnter = new EventEmitter<any>();
    @Output() readonly calculateCashAmountWithoutCost = new EventEmitter<any>();

    additionalCostsGridContextualMenuActions: AgContextualMenuAction[];
    addNewLineCtrl = new AtlasFormControl('');
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    additionalCostsGridOptions: agGrid.GridOptions = {};
    additionalCostsGridCols: agGrid.ColDef[];
    masterdata: MasterData;
    costDirections: CostDirection[];
    additionalCostsGridRows: AdditionalCost[] = [];
    costListAfterDeletion = new Array<AdditionalCost>();
    additionalCostsOrg = new Array<AdditionalCost>();
    nominalAccClientAcc = new Array<string>();
    isNominalAccount: boolean;
    isBankAccount: boolean;
    isClientAccount: boolean;
    atlasAgGridParam: AtlasAgGridParam;
    mask = CustomNumberMask(12, 10, false);
    cashCurrency: string;
    company: string;
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    isAddorEdit = true;
    gridContext = {
        gridEditable: true,
    };
    cashTypeId: number;
    selectionValue: number;
    isPanelExpanded = false;
    cashTransactionId: number;
    userActiveDirectoryName: string;
    showGrid = true;
    counterpartyList = new Array<string>();
    isClientAccountRequired: boolean;
    isCounterpartyRequired: boolean;

    additionalCostsGridRowsInEditMode: AdditionalCostListDisplayView[] = [];
    isEditMode: boolean;
    nominalAccountList: NominalAccount[];

    gridCode: string = 'additionalCosts';
    gridPreferencesParameters: UserGridPreferencesParameters;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        private uiService: UiService,
        protected dialog: MatDialog,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        protected companyManager: CompanyManagerService,
        public gridService: AgGridService,

    ) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
        this.company = this.companyManager.getCurrentCompanyId();
    }

    additionalCostsMenuActions: { [key: string]: string } = {
        deleteUser: 'delete',
    };

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.init();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.nominalAccountList = this.masterdata.nominalAccounts;
        this.costDirections = [
            {
                costDirectionId: CostDirections.Payable,
                costDirection: CostDirections[CostDirections.Payable],
            },
            {
                costDirectionId: CostDirections.Receivable,
                costDirection: CostDirections[CostDirections.Receivable],
            },
        ];
        this.masterdata.nominalAccounts.forEach((element) => {
            this.nominalAccClientAcc.push(element.accountNumber);
        });

        this.masterdata.counterparties.forEach((element) => {
            this.counterpartyList.push(element.counterpartyCode);
        });

        this.initAdditionalCostsGridColumns();
        this.isClientAccountRequired = false;
        this.isCounterpartyRequired = false;
    }

    init() {
        this.additionalCostsGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.additionalCostsMenuActions.deleteCost,
                disabled: this.isDeleteDisabledWithPrivileges,
            },
        ];

        this.gridPreferencesParameters = {
            company: this.company,
            gridId: this.gridCode,
            gridOptions: null,
            savingEnabled: false,
            sharingEnabled: false,
            showExport: true,
            hasColumnHandling: false,
        };
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.addNewLineCtrl.dirty) {
            $event.returnValue = true;
        }
    }

    isDeleteDisabledWithPrivileges(params) {
        let deleteDisable = true;
        if (params.context.actionContext.gridEditable) {
            deleteDisable = false;
        }
        return deleteDisable;
    }

    currencySelected(currency: any) {
        this.cashCurrency = currency;
    }
    onGridReady(params) {
        this.additionalCostsGridOptions.columnDefs = this.additionalCostsGridCols;
        this.gridApi = this.additionalCostsGridOptions.api;
        this.gridColumnApi = this.additionalCostsGridOptions.columnApi;
        this.gridService.sizeColumns(this.additionalCostsGridOptions);

        // bind the additonal cost rows while editing.
        if (this.additionalCostsGridRowsInEditMode && this.additionalCostsGridRowsInEditMode.length > 0
            && this.isEditMode && this.gridApi) {
            this.gridApi.setRowData([]);
            this.gridApi.updateRowData({ add: this.additionalCostsGridRowsInEditMode });
        }
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
        });
        return super.getFormGroup();
    }
    onProceedButtonClicked() {
        const lines = this.addNewLineCtrl.value;
        if (this.cashTypeId === CashType.CashReceipt && !lines &&
            (this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction
                || this.selectionValue === CashSelectionType.ReceiptDifferentCurrency)) {
            this.proceedClickedCashReceipt.emit();
        } else {
            for (let count = 1; count <= lines; count++) {
                const newItem = this.createNewRowData();
                const res = this.gridApi.updateRowData({ add: [newItem] });
            }
            this.addNewLineCtrl.setValue('');
        }
    }
    createNewRowData() {
        const newCostRow = new AdditionalCostListDisplayView();
        newCostRow.isDirty = true;
        newCostRow.costDirection = 'Payable';
        newCostRow.currencyCode = this.cashCurrency;
        return newCostRow;
    }
    initAdditionalCostsGridColumns() {
        this.additionalCostsGridOptions = {
            context: this.gridContext,
            stopEditingWhenGridLosesFocus: true,
        };
        this.additionalCostsGridCols = [
            {
                colId: 'costDirection',
                headerName: 'Pay/rec*',
                field: 'costDirection',
                editable: this.isGridEditable,
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.costDirections.map((costDirection) => costDirection.costDirection),
                    displayPropertyName: 'costDirection',
                    valuePropertyName: 'costDirection',
                    displayFormat: 'costDirection',
                },
                onCellValueChanged: (params) => {
                    if (params.node.data['amount']) {
                        this.updateBalance();
                    }
                },
            },
            {
                headerName: 'Cost Type*',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.costTypes,
                    valueProperty: 'costTypeCode',
                    codeProperty: 'costTypeCode',
                    displayProperty: 'name',
                    isRequired: true,
                },
                onCellValueChanged: (params) => {
                    const filteredCostType = this.masterdata.costTypes.find(
                        (e) => e.costTypeCode === params.data.costTypeCode);

                    if (filteredCostType) {
                        const nominalAccount = filteredCostType.nominalAccountCode;
                        params.node.setDataValue('accountCode', nominalAccount);
                        params.node.setDataValue('nominalAccountNumber', nominalAccount);
                    }

                },
            },
            {
                headerName: 'Nom. Account*',
                field: 'nominalAccountNumber',
                colId: 'nominalAccountNumber',
                type: 'numericColumn',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                        },
                        options: this.nominalAccountList = (params.data.costTypeCode && !params.data.nominalAccountNumber) ? this.masterdata.nominalAccounts.filter
                            ((e) => e.accountType !== 'P') : this.masterdata.nominalAccounts,
                        valueProperty: 'accountNumber',
                        codeProperty: 'accountNumber',
                        displayProperty: 'detailedDescription',
                        isRequired: true,
                    };
                },
                onCellValueChanged: (params) => {
                    const filteredNominalAccount = this.nominalAccountList.find(
                        (e) => e.accountNumber === params.data.nominalAccountNumber);

                    if (filteredNominalAccount) {
                        this.isBankAccount = filteredNominalAccount.bankAccount;

                        params.node.setDataValue('customerVendor', filteredNominalAccount.customerVendor);
                        params.node.setDataValue('accountCode', filteredNominalAccount.accountNumber);
                        params.node.setDataValue('accountLineType', 'L');

                        this.isCounterpartyRequired = (filteredNominalAccount.clientAccountMandatory === 1) ? true : false;
                        params.node.setDataValue('clientAccountMandatory', this.isCounterpartyRequired);

                        if (this.isCounterpartyRequired) {
                            params.node.setDataValue('accountLineType', null);
                        }
                        if (this.isBankAccount) {
                            params.node.setDataValue('accountLineType', 'B');
                        }
                    }
                    if (this.gridApi && filteredNominalAccount) {
                        this.gridApi.refreshCells({
                            rowNodes: [params.node],
                            force: true,
                        });
                    }
                },
            },
            {
                headerName: 'Client Account*',
                field: 'counterpartyCode',
                colId: 'counterpartyCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },

                    options: this.masterdata.counterparties,
                    valueProperty: 'counterpartyCode',
                    codeProperty: 'counterpartyCode',
                    displayProperty: 'description',
                    isRequired: (params) => {
                        return this.isCounterpartyRequired ? true : false;
                    },
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                colId: 'accountLineType',
                headerName: 'Account Line Type*',
                field: 'accountLineType',
                editable: true,
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: (params) => {
                    const filteredNominalAccount = this.masterdata.nominalAccounts.filter(
                        (e) => e.accountNumber === params.data.nominalAccountNumber);

                    let accountLineTypeList = [];

                    if (filteredNominalAccount.length > 0 && filteredNominalAccount[0].bankAccount) {
                        accountLineTypeList = ['B'];
                    } else if (filteredNominalAccount.length > 0) {
                        accountLineTypeList = !filteredNominalAccount[0].clientAccountMandatory ? ['L']
                            : ['C', 'V'];
                    }
                    return {
                        values: accountLineTypeList,
                    };
                },
            },
            {
                headerName: 'Currency*',
                field: 'currencyCode',
                colId: 'currencyCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                        },
                        options: this.masterdata.currencies,
                        valueProperty: 'currencyCode',
                        codeProperty: 'currencyCode',
                        displayProperty: 'description',
                        isRequired: true,
                        filterContextualSearchFunction: this.filterCurrency.bind(this),
                    };
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                colId: 'amount',
                headerName: 'Amount*',
                type: 'numericColumn',
                field: 'amount',
                editable: this.isGridEditable,
                cellRenderer: this.requiredCell,
                cellEditor: 'atlasNumeric',
                valueFormatter: this.amountFormatter.bind(this),
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: true,

                },
                onCellValueChanged: (params) => {
                    if (params.newValue !== 0) {
                        this.updateBalance();
                    } else {
                        params.node.setDataValue('amount', '');
                    }
                },
            },

            {
                colId: 'narrative',
                headerName: 'Narrative',
                field: 'narrative',
                editable: this.isGridEditable,
            },
            {
                headerName: 'CustomerVendor',
                field: 'customerVendor',
                colId: 'customerVendor',
                hide: true,
            },
            {
                headerName: 'clientAccountMandatory',
                field: 'clientAccountMandatory',
                colId: 'clientAccountMandatory',
                hide: true,
            },
            {
                colId: 'contextualMenu',
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.additionalCostsGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    updateBalance() {
        this.calculateBalanceOnCostAmountEnter.emit();
    }

    onCostTypeSelect(params) {
        const filteredCostType = params.colDef.cellEditorParams.context.costTypes.filter(
            (e) => e.costTypeCode === params.data.costType);

        if (filteredCostType.length > 0) {
            const nominalAccount = filteredCostType[0].nominalAccountCode;

            params.node.setDataValue('accountCode', nominalAccount);
        }
    }

    onAccountSelect(params) {
        const filteredNominalAccount = params.colDef.cellEditorParams.context.nominalAccounts.filter(
            (e) => e.accountNumber === params.data.accountCode);

        this.isNominalAccount = filteredNominalAccount.length > 0;

        this.isBankAccount = filteredNominalAccount.length > 0 && filteredNominalAccount[0].bankAccount;
        if (filteredNominalAccount.length > 0) {
            params.node.setDataValue('customerVendor', filteredNominalAccount[0].customerVendor);

        }
        if (this.isNominalAccount) {
            params.node.setDataValue('accountLineType', 'L');
        } else if (this.isBankAccount) {
            params.node.setDataValue('accountLineType', 'B');
        }

    }

    requiredCell(params) {
        if (params.colDef.headerName === 'Pay/rec') {
            if (params.data.costDirectionId === 1 && !(params.value)) {
                params.value = 'Payable';
            } else if (params.data.costDirectionId === 2 && !(params.value)) {
                params.value = 'Receivable';
            }
        }
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        if (params.colDef.headerName === 'Amount*') {
            if (params.value) {
                params.value = params.valueFormatted;
            }
        }
        return params.value;
    }

    isClientRequiredCell(params) {
        return (params.data.customerVendor === 'V' || params.data.customerVendor === 'C') ? true : false;
    }

    populateEntity(entity: any) {
        const cashRecord = entity as CashRecord;
        cashRecord.additionalCostDetails = this.getGridData();
        return cashRecord;
    }

    isAdditionalCostValid(): boolean {
        let isValid = true;
        this.isClientAccountRequired = false;
        if (this.gridColumnApi) {
            const isAccountLineTypeVisible = this.gridColumnApi.getColumn('accountLineType').isVisible();
            this.gridApi.forEachNode((rowData) => {
                if (rowData.data.isDirty) {
                    rowData.data.accountCode = rowData.data.nominalAccountNumber;

                    const hasCustomerVendorValueForNominalAccount = (rowData.data.customerVendor
                        && (rowData.data.customerVendor === 'V' || rowData.data.customerVendor === 'C')) ? true : false;
                    const clientAccountMandatory = rowData.data.clientAccountMandatory;
                    if (clientAccountMandatory) {
                        if (!(rowData.data.costDirection && rowData.data.costTypeCode && rowData.data.accountCode
                            && rowData.data.counterpartyCode && (isAccountLineTypeVisible ? rowData.data.accountLineType : true)
                            && rowData.data.currencyCode && rowData.data.amount)) {
                            this.isClientAccountRequired = true;
                            isValid = false;
                        }
                    } else {
                        if (!(rowData.data.costDirection && rowData.data.costTypeCode && rowData.data.accountCode
                            && (isAccountLineTypeVisible ? rowData.data.accountLineType : true)
                            && rowData.data.currencyCode && rowData.data.amount)) {
                            isValid = false;
                        }

                    }
                    if (rowData.data.currencyCode !== this.cashCurrency) {
                        isValid = false;
                        rowData.data.currencyCode = null;
                        this.gridApi.updateRowData({ update: [rowData.data] });
                    }
                }
            });
        }
        return isValid;
    }

    getGridData(): AdditionalCost[] {
        const costs = new Array<AdditionalCost>();
        const masterdata = this.masterdata;
        const costDirections = this.costDirections;
        if (this.gridApi) {
            this.gridApi.forEachNode((rowData) => {
                costs.push(rowData.data.getAdditionalCost(masterdata, costDirections));
            });
        }
        return costs;
    }

    handleAction(action: string, cost: AdditionalCostListDisplayView) {
        switch (action) {
            case this.additionalCostsMenuActions.deleteCost:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Cost Deletion',
                        text: 'Are you sure you want to delete this cost?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.gridApi.updateRowData({ remove: [cost] });
                        this.calculateBalanceOnCostAmountEnter.emit();
                    }
                });
                this.subscriptions.push(confirmationSubscription);
                break;
            default: this.assertUnreachable(action);
        }
    }

    assertUnreachable(x): never {
        throw new Error('Unknown action');
    }

    onCellValueChanged(params) {
        if (params.column.colId === 'amount' && params.value === 0) {
            params.value = '';
        }
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
        }
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        if (entity.additionalCostDetails && entity.additionalCostDetails.length > 0) {
            this.selectionValue = entity.cashTypeId;
            this.gridContext.gridEditable = isEdit ? true : false;
            if (!isEdit) {
                this.isAddorEdit = isEdit;
            }
            entity.additionalCostDetails.forEach((element) => {
                if (element.accountId && !element.accountCode && this.masterdata.nominalAccounts) {
                    const nominalAccountObject = this.masterdata.nominalAccounts.find((account) => account.nominalAccountId === element.accountId);
                    if (nominalAccountObject) {
                        element.accountCode = nominalAccountObject.accountNumber;
                    }

                }
                const displayCostRow = new AdditionalCostListDisplayView(element, this.masterdata, this.costDirections);
                this.additionalCostsGridRowsInEditMode.push(displayCostRow);

                if (this.gridApi) {
                    this.gridApi.updateRowData({ add: [displayCostRow] });
                }
            });

            if (entity.cashTypeId === CashSelectionType.SimpleCashReceipt ||
                entity.cashTypeId === CashSelectionType.SimpleCashPayment) {
                this.calculateCashAmountWithoutCost.emit();
            }
        } else {
            this.showGrid = isEdit ? true : false;
        }
        // bind curency value to cashCurrency property.
        this.cashCurrency = entity.currencyCode;

        this.isPanelExpanded = isEdit ? true : false;
        this.isEditMode = isEdit;
        return entity;
    }
    isGridEditable(params) {
        return params.context.gridEditable;
    }

    bindSelectedTransactionValue(value: number) {
        this.cashTransactionId = value;
        return value;
    }

    clearAdditonalCostGrid() {
        if (this.gridApi) {
            this.gridApi.setRowData([]);
            this.addNewLineCtrl.reset();
        }
    }

    amountFormatter(param) {
        if (param && param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value);
        }
    }

    filterCurrency(value: any, options: any[], rowData: any): any[] {
        let currencyList = [];
        currencyList = options;
        if (this.cashCurrency) {
            currencyList = this.masterdata.currencies.filter((currency) =>
                currency.currencyCode === this.cashCurrency);
        }
        options = currencyList;
        return options;
    }
}
