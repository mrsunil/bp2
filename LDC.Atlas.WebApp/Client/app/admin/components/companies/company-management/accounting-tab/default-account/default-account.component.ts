import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridContextualSearchComponent } from '../../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AccountingSetupFields } from '../../../../../../shared/entities/accounting-setup-fields.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { DefaultAccountingSetupResult } from '../../../../../../shared/entities/default-accounting-setup-result.entity';
import { DefaultAccountingSetup } from '../../../../../../shared/entities/default-accounting-setup.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../../shared/entities/nominal-account.entity';
import { AccountingFields } from '../../../../../../shared/enums/accounting-fields.enum';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-default-account',
    templateUrl: './default-account.component.html',
    styleUrls: ['./default-account.component.scss'],
})
export class DefaultAccountComponent extends BaseFormComponent implements OnInit {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    addNewLineCtrl = new AtlasFormControl('');
    defaultAccountColumnDefs: agGrid.ColDef[];
    defaultAccountingGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    checkEdit: boolean = false;
    defaultBankId: string = 'defaultBankAccountId';
    dealId: string = 'dealId';
    settlementId: string = 'settlementId';
    nominalAccountSetupData: AccountingSetupFields[];
    defaultAccountRowData: AccountingSetupFields[];
    defaultAccountingSetup: DefaultAccountingSetup;
    accountingSetupResult: DefaultAccountingSetupResult;
    filteredNominalAccountList: NominalAccount[];
    filteredNominalAccountList1: NominalAccount[];
    nominalAccountList: NominalAccount[];
    masterdata: MasterData;
    currentCompany: string;
    companyId: string;
    isCreate: boolean;
    accountingSetupId: number;

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
        this.filteredNominalAccountList = this.masterdata.nominalAccounts.map(
            (nominal) => {
                nominal.accountNumber = nominal.accountNumber;
                nominal.mainAccountTitle = nominal.shortDescription;
                return nominal;
            });
        this.filteredNominalAccountList1 = this.filteredNominalAccountList.filter((x) => x.bankAccount === true);
        if (!this.companyId) {
            this.isCreate = true;
            this.checkEdit = true;
            this.getNominalAccountFields();
            this.initializeGridColumns();
        }
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.defaultAccountingSetup = companyConfigurationRecord.defaultAccountingSetup;
        this.accountingSetupId = this.defaultAccountingSetup.accountingSetupId;
        this.getNominalAccountFields();
        this.checkEdit = isEdit;
        this.initializeGridColumns();
        this.defaultAccountRowData = this.nominalAccountSetupData;
        return companyConfigurationRecord;
    }

    onGridReady(params) {
        params.columnDefs = this.defaultAccountColumnDefs;
        this.defaultAccountingGridOptions = params;
        this.gridApi = this.defaultAccountingGridOptions.api;
        this.gridColumnApi = this.defaultAccountingGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    loadDefaultAccountFieldSetUpEditor() {
        const defaultAccountDataList = this.nominalAccountSetupData;
        this.defaultAccountRowData = [];
        this.defaultAccountRowData = defaultAccountDataList.map((filter) => {
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

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'DefaultAccountComponent' });
    }

    getNominalAccountFields() {
        this.nominalAccountSetupData = [];
        this.nominalAccountSetupData.push(
            {
                id: 'defaultBankAccountId',
                label: 'Default Bank Account',
                value: (!this.isCreate) ? this.defaultAccountingSetup.defaultBankAccount : null,
                result: null,
            },
            {
                id: 'salesLedgerControlClientDebtorsId',
                label: 'Sales Ledger Control/Client Debtors',
                value: (!this.isCreate) ? this.defaultAccountingSetup.salesLedgerControlClientDebtors : null,
                result: null,
            },
            {
                id: 'purchaseLedgerControlClientCreditorsId',
                label: 'Purchase Ledger Control/Client Debtors',
                value: (!this.isCreate) ? this.defaultAccountingSetup.purchaseLedgerControlClientCreditors : null,
                result: null,
            },
            {
                id: 'vatAccountInputs',
                label: 'VAT Account Inputs',
                value: (!this.isCreate) ? this.defaultAccountingSetup.vatAccountInputs : null,
                result: null,
            },
            {
                id: 'vatAccountOutputs',
                label: 'VAT Account Outputs',
                value: (!this.isCreate) ? this.defaultAccountingSetup.vatAccountOutputs : null,
                result: null,
            },
            {
                id: 'fxRevalaccountId',
                label: 'FX Reval Account',
                value: (!this.isCreate) ? this.defaultAccountingSetup.fxRevalaccount : null,
                result: null,
            },
            {
                id: 'fxAccountGain',
                label: 'FX P&L accounts Gains',
                value: (!this.isCreate) ? this.defaultAccountingSetup.fxAccountGain : null,
                result: null,
            },
            {
                id: 'fxAccountLoss',
                label: 'FX P&L accounts Loss',
                value: (!this.isCreate) ? this.defaultAccountingSetup.fxAccountLoss : null,
                result: null,
            },
            {
                id: 'suspenseAccountforWashoutSuspenseId',
                label: 'Washout Suspense Account',
                value: (!this.isCreate) ? this.defaultAccountingSetup.suspenseAccountforWashoutSuspense : null,
                result: null,
            },
            {
                id: 'realisedPhysicalsPayableId',
                label: 'Realised Physicals Payable',
                value: (!this.isCreate) ? this.defaultAccountingSetup.realisedPhysicalsPayable : null,
                result: null,
            },
            {
                id: 'realisedPhysicalsReceivableId',
                label: 'Realised Physicals Receivable',
                value: (!this.isCreate) ? this.defaultAccountingSetup.realisedPhysicalsReceivable : null,
                result: null,
            },
            {
                id: 'plClearanceYepAccountId',
                label: 'Nominal Account for P&L Clearance',
                value: (!this.isCreate) ? this.defaultAccountingSetup.plClearanceYepAccount : null,
                result: null,
            },
            {
                id: 'balanceSheetClearanceYepAccountId',
                label: 'Nominal Account for Balance Sheet Clearance',
                value: (!this.isCreate) ? this.defaultAccountingSetup.balanceSheetClearanceYepAccount : null,
                result: null,
            },
            {
                id: 'bsReserveYepAccountId',
                label: 'B/S Reserve Account for YEP',
                value: (!this.isCreate) ? this.defaultAccountingSetup.bsReserveYepAccount : null,
                result: null,
            },
            {
                id: 'dealId',
                label: 'Nominal Account Deal',
                value: (!this.isCreate) ? this.defaultAccountingSetup.dealNominalAccount : null,
                result: null,
            },
            {
                id: 'settlementId',
                label: 'Nominal Account Settlement',
                value: (!this.isCreate) ? this.defaultAccountingSetup.settlementNominalAccount : null,
                result: null,
            },
        );
        this.nominalAccountSetupData = this.nominalAccountSetupData.map((filter) => {
            const nominalAccount = this.masterdata.nominalAccounts.find((e) => e.accountNumber === (filter.value));
            return {
                id: filter.id,
                label: filter.label,
                value: filter.value,
                result: (nominalAccount) ? nominalAccount.nominalAccountId : null,
            };
        });
    }

    initializeGridColumns() {
        this.defaultAccountColumnDefs = [
            {
                headerName: 'Nominated Accounts',
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
                headerName: 'Nominal Account',
                colId: 'value',
                field: 'value',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.checkEdit,
                        },
                        gridId: 'nominalAccountsGrid',
                        options: this.nominalAccountList = params.data.id === this.defaultBankId
                            || params.data.id === this.dealId
                            || params.data.id === this.settlementId ?
                            this.filteredNominalAccountList1 : this.filteredNominalAccountList,
                        displayProperty: 'accountNumber',
                        codeProperty: 'accountNumber',
                        descriptionProperty: 'detailedDescription',
                        valueProperty: 'accountNumber',
                        lightBoxTitle: 'Results for Nominal Accounts',
                        showContextualSearchIcon: this.checkEdit,
                        isRequired: true,
                    };
                },
                onCellValueChanged: (params) => {
                    if (params.node.data.value && params.node.data.value !== params.value) {
                        const nominalAccount = this.masterdata.nominalAccounts.find((a) =>
                            a.accountNumber === params.node.data.value);
                        if (nominalAccount) {
                            params.node.setDataValue('accountTitle', nominalAccount.detailedDescription);
                            params.node.setDataValue('result', nominalAccount.nominalAccountId);
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
                headerName: 'Detail Account Title',
                colId: 'accountTitle',
                field: 'accountTitle',
                cellRenderer: this.accountTitleFormatter.bind(this),
            },
        ];
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

    accountTitleFormatter(params) {
        if (params.node.data.value) {
            const selectedAccount = this.masterdata.nominalAccounts.find((account) =>
                account.accountNumber === params.node.data.value);
            params.node.data.accountTitle = (selectedAccount ? selectedAccount.detailedDescription : '');
        }
        return params.node.data.accountTitle;
    }

    onSaveButtonClicked() {
        if (!this.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Default Account GridData is invalid. Please resolve the errors',
            );
            return;
        }
        this.nominalAccountSetupData = [];
        this.gridApi.forEachNode((rowdata) => {
            const nominalAccountData = new AccountingSetupFields();
            nominalAccountData.id = rowdata.data.id;
            nominalAccountData.label = rowdata.data.label;
            nominalAccountData.value = rowdata.data.value;
            nominalAccountData.result = rowdata.data.result;
            this.nominalAccountSetupData.push(nominalAccountData);
        });
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    getNominalAccountValuesForSave(): DefaultAccountingSetupResult {
        const defaultBankAccount = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.DefaultBankAccountId);
        const salesLedgerContrl = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.SalesLedgerControlClientDebtorsId);
        const purchaseLedgerContrl = this.nominalAccountSetupData.find(
            (e) => e.id === AccountingFields.PurchaseLedgerControlClientCreditorsId);
        const vatInput = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.VATAccountInputs);
        const vatOutput = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.VATAccountOutputs);
        const fxRevalAccount = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.FXRevalaccountId);
        const fxAccountGain = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.FXAccountGain);
        const fxAccountLoss = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.FXAccountLoss);
        const suspenceWashoutAccount = this.nominalAccountSetupData.find(
            (e) => e.id === AccountingFields.SuspenseAccountforWashoutSuspenseId);
        const realizedPayable = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.RealisedPhysicalsPayableId);
        const realizedReceivable = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.RealisedPhysicalsReceivableId);
        const nominalAccountPLClearance = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.PLClearanceYepAccountId);
        const nominalAccountBalanceSheet = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.BalanceSheetClearanceYepAccountId);
        const nominalAccountBSReserveAccount = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.BSReserveYepAccountId);
        const deal = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.DealId);
        const settlement = this.nominalAccountSetupData.find((e) => e.id === AccountingFields.SettlementId);

        this.accountingSetupResult = new DefaultAccountingSetupResult();
        this.accountingSetupResult.defaultBankAccountId = (defaultBankAccount) ? defaultBankAccount.result : null;
        this.accountingSetupResult.salesLedgerControlClientDebtorsId = (salesLedgerContrl) ? salesLedgerContrl.result : null;
        this.accountingSetupResult.purchaseLedgerControlClientCreditorsId = (purchaseLedgerContrl) ? purchaseLedgerContrl.result : null;
        this.accountingSetupResult.vatAccountInputsId = (vatInput) ? vatInput.result : null;
        this.accountingSetupResult.vatAccountOutputsId = (vatOutput) ? vatOutput.result : null;
        this.accountingSetupResult.fxRevalaccountId = (fxRevalAccount) ? fxRevalAccount.result : null;
        this.accountingSetupResult.fxAccountGainId = (fxAccountGain) ? fxAccountGain.result : null;
        this.accountingSetupResult.fxAccountLossId = (fxAccountLoss) ? fxAccountLoss.result : null;
        this.accountingSetupResult.suspenseAccountforWashoutSuspenseId = (suspenceWashoutAccount) ? suspenceWashoutAccount.result : null;
        this.accountingSetupResult.realisedPhysicalsPayableId = (realizedPayable) ? realizedPayable.result : null;
        this.accountingSetupResult.realisedPhysicalsReceivableId = (realizedReceivable) ? realizedReceivable.result : null;
        this.accountingSetupResult.plClearanceYepAccountId = (nominalAccountPLClearance) ? nominalAccountPLClearance.result : null;
        this.accountingSetupResult.balanceSheetClearanceYepAccountId = (nominalAccountBalanceSheet) ? nominalAccountBalanceSheet.result : null;
        this.accountingSetupResult.bsReserveYepAccountId = (nominalAccountBSReserveAccount) ? nominalAccountBSReserveAccount.result : null;

        this.accountingSetupResult.dealNominalAccountId = (deal) ? deal.result : null;
        this.accountingSetupResult.settlementNominalAccountId = (settlement) ? settlement.result : null;
        return this.accountingSetupResult;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        if (this.nominalAccountSetupData && this.nominalAccountSetupData.length > 0) {
            this.getNominalAccountValuesForSave();
            companyConfiguration.defaultAccountingSetup = this.accountingSetupResult;
            companyConfiguration.defaultAccountingSetup.accountingSetupId = this.accountingSetupId ? this.accountingSetupId : null;
        }
        return companyConfiguration;
    }
}
