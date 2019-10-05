import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { inDropdownListValidator } from '../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { Currency } from '../../../../shared/entities/currency.entity';
import { Department } from '../../../../shared/entities/department.entity';
import { MasterDataProps } from '../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { MatchingType } from '../../../../shared/enums/matching-type.enum';
import { TransactionDocument } from '../../../../shared/enums/transaction-document.enum';
import { ConvertToNumber, CustomNumberMask } from '../../../../shared/numberMask';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { DocumentMatching } from '../../../../shared/services/execution/dtos/document-matching';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { ForeignExchangeService } from '../../../../shared/services/http-services/foreign-exchange.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { DocumentMatchingRecord } from '../../../../shared/services/preaccounting/dtos/document-matching-record';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UiService } from '../../../../shared/services/ui.service';
import { nameof, UtilService } from '../../../../shared/services/util.service';
import { CashMatchingDialogComponent } from '../cash-matching-dialog/cash-matching-dialog/cash-matching-dialog.component';

@Component({
    selector: 'atlas-create-match-flag',
    templateUrl: './create-match-flag.component.html',
    styleUrls: ['./create-match-flag.component.scss'],
})
export class CreateMatchFlagComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('emptyStateComponent') emptyStateComponent: EmptyStateComponent;
    counterpartyCtrl = new AtlasFormControl('Counterparty');
    clientNameCtrl = new AtlasFormControl('ClientName');
    departmentCtrl = new AtlasFormControl('Department');
    currencyCtrl = new AtlasFormControl('Currency');
    docReferenceCtrl = new AtlasFormControl('DocumentReference');
    secDocReferenceCtrl = new AtlasFormControl('SecondaryReference');
    currentDocDateCtrl = new AtlasFormControl('CurrentDocumentDate');
    private formComponents: BaseFormComponent[] = [];
    cashMatchingDialog: CashMatchingDialogComponent;
    filteredCounterPartyList: Counterparty[];
    filteredDepartment: Department[];
    allDepartment: Department[];
    filteredCurrencyList: Currency[];
    filteredCompanies: Company[];
    atlasAgGridParam: AtlasAgGridParam;
    dataLength: number = 0;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    isDialogClosed: boolean;
    matchFlagId: string;
    matchFlagCode: number;
    journalFieldShow: boolean = false;
    journalDocumentId: string;
    isDocumentsSelected: boolean = false;
    isSave: boolean = false;
    documentMatchingGridOptions: agGrid.GridOptions = {};
    documentMatchingGridColumns: agGrid.ColDef[];
    documentMatchingGridRows: DocumentMatching[];
    selectedDocumentsToMatch: DocumentMatching[];
    documentMatching: DocumentMatching[];
    filteredDocReferenceList: DocumentMatching[];
    documentReference: DocumentMatching[] = [];
    documentSelectionModel: DocumentMatching;
    masterData: MasterData;
    index: number = 0;
    masterdataList: string[] = [
        MasterDataProps.Counterparties,
        MasterDataProps.Departments,
        MasterDataProps.Currencies,
        MasterDataProps.Companies];
    company: string;
    documentIndex: number;
    isEdit: boolean;
    counterpartyId: number;
    departmentValue: number;
    transactionDocument: TransactionDocument;
    totalCredit: number;
    totalDebit: number;
    totalBalance: number;
    documentDate: string;
    currentDocumentDate: Date;
    selectedDocumentLength: number;
    functionalCurrencyAmount: number;
    statutoryCurrencyAmount: number;
    cashCurrency: string;
    functionalCurrency: string;
    statutoryCurrency: string;
    cashCurrencyRoeType: string;
    functionalCurrencyRoeType: string;
    statutoryCurrencyRoeType: string;
    cashCurrencyRate: number;
    functionalCurrencyRate: number;
    statutoryCurrenyRate: number;
    companyConfiguration: Company;
    paymentDocumentDate: Date;
    public model: DocumentMatchingRecord;
    amountInUSD: number;
    matchType: number;
    gridContext = {
        component: this,
    };
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'This field is required')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');
    counterpartyValue: string;
    matchCodeSelected: string;
    transactionDocumentId: number;
    isSearchDisabled: boolean;
    decimalOptionValue: number = 2;
    formatType: string = 'en-US';
    formattedInput: string;
    isDataAvailable: boolean = false;
    isCompanyFrozen: boolean;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private router: Router,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected uiService: UiService,
        protected dialog: MatDialog,
        private foreignExchangeService: ForeignExchangeService,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        protected companyManager: CompanyManagerService,
        private executionService: ExecutionService,
        public gridService: AgGridService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }
    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.masterData = this.route.snapshot.data.masterdata;
        this.currentDocDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.functionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.statutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.filteredCounterPartyList = this.masterData.counterparties;
        this.currencyCtrl.setValue(this.functionalCurrency);
        this.isSearchDisabled = true;
        this.counterpartyCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.counterparties,
                ['counterpartyCode', 'description', 'counterpartyID'],
            );
            if (this.counterpartyCtrl.valid) {
                this.onCounterpartyIdSelected(this.counterpartyCtrl.value);
            } else {
                if (this.counterpartyCtrl.value !== null && this.counterpartyCtrl.value.length === 0) {
                    this.docReferenceCtrl.enable();
                    this.disableSearchButton();
                }
            }
        });

        this.filteredDepartment = [];
        this.filteredDepartment = this.masterData.departments;
        const departments = this.filteredDepartment.filter((a) => a.departmentId === 0);
        if (departments.length === 0 || departments === undefined) {
            this.filteredDepartment.push({
                departmentId: 0, departmentCode: 'ALL', description: 'ALL Departments',
                profitCenterId: null, companyId: null, companyCode: null,
            });
        }
        this.departmentCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartment = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.departments,
                ['departmentCode', 'description'],
            );
        });
        const selectedDepartments = this.masterData.departments.filter(
            (department) => department.departmentCode === 'ALL',
        );
        if (selectedDepartments.length > 0) {
            this.departmentValue = null;
            this.departmentCtrl.setValue(selectedDepartments[0].departmentCode);
        }
        this.filteredCurrencyList = this.masterData.currencies;
        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.currencies,
                ['currencyCode', 'description'],
            );
        });
        this.executionService.getDocumentReferenceValues(this.matchType = MatchingType.createMatch)
            .subscribe((data) => {
                data.value.forEach((item) => this.documentReference.push(this.populateDocuments(item)));
                this.filteredDocReferenceList = this.documentReference;
            });
        this.docReferenceCtrl.valueChanges.subscribe((input) => {
            this.filteredDocReferenceList = this.utilService.filterListforAutocomplete(
                input,
                this.documentReference, ['documentReference'],
            );
            if (this.docReferenceCtrl.valid) {
                if (this.docReferenceCtrl.value) {
                    if (this.docReferenceCtrl.value.length === 0) {
                        this.disableSearchButton();
                    }
                }
            }
        });
        this.initializeGridColumns();
        this.setValidators();
        this.bindConfiguration();
        this.isCompanyFrozen = this.companyManager.getCompany(this.company).isFrozen;
    }

    canDeactivate() {
        if ((this.counterpartyCtrl.dirty || this.departmentCtrl.dirty || this.clientNameCtrl.dirty ||
            this.secDocReferenceCtrl.dirty || this.currencyCtrl.dirty || this.docReferenceCtrl.dirty) && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    populateDocuments(value: any) {
        const documentsForMatching = new DocumentMatching();
        documentsForMatching.documentReference = value.documentReference;
        return documentsForMatching;
    }
    initializeGridColumns() {
        this.documentMatchingGridOptions = {
            context: this.gridContext,
        };
        this.documentMatchingGridColumns = [
            {
                headerName: 'Transaction Document Id',
                field: 'transactionDocumentId',
                colId: 'transactionDocumentId',
                hide: true,
            },
            {
                headerName: 'Document Reference',
                field: 'documentReference',
                colId: 'documentReference',
                hide: false,
            },
            {
                headerName: 'Secondary Document Reference',
                field: 'secondaryRef',
                colId: 'secondaryRef',
                hide: false,
            },
            {
                headerName: 'DepartmentId',
                field: 'departmentId',
                colId: 'departmentId',
                hide: true,

            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                hide: false,
            },
            {
                headerName: 'TransactionDirectionId',
                field: 'transactionDirectionId',
                colId: 'transactionDirectionId',
                hide: true,
            },
            {
                headerName: 'Marking',
                field: 'marking',
                colId: 'marking',
                hide: false,
            },
            {
                headerName: 'Marking',
                field: 'matchFlagCode',
                colId: 'matchFlagCode',
                hide: true,
            },
            {
                headerName: 'Document Date',
                field: 'documentDate',
                colId: 'documentDate',
                hide: false,
                valueFormatter: this.uiService.dateFormatter,
            },
            {
                headerName: 'Value Date',
                field: 'valueDate',
                colId: 'valueDate',
                hide: false,
                valueFormatter: this.uiService.dateFormatter,
            },
            {
                headerName: 'DocumentAmount',
                field: 'documentAmount',
                colId: 'documentAmount',
                hide: true,
            },
            {
                headerName: 'Cost Type',
                field: 'costType',
                colId: 'costType',
                hide: false,
            },
            {
                headerName: 'Expense Code',
                field: 'expenseCode',
                colId: 'expenseCode',
                hide: true,
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
            },
            {
                headerName: 'Document Type',
                field: 'documentType',
                colId: 'documentType',
                hide: true,
            },
            {
                headerName: 'JournalLineId',
                field: 'lineId',
                colId: 'lineId',
                hide: true,
            },
            {
                headerName: 'TotalAmount',
                field: 'amount',
                colId: 'amount',
                type: 'numericColumn',
                hide: true,
            },
            {
                headerName: 'Debit',
                field: 'debit',
                colId: 'debit',
                hide: false,
                pinned: 'right',
                editable: this.isDebitFieldEditable,
                onCellValueChanged: this.onDebitValueChanged,
                valueFormatter: this.amountFormatter.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: true,
                },
                type: 'numericColumn',
            },
            {
                headerName: 'Credit',
                field: 'credit',
                colId: 'credit',
                hide: false,
                pinned: 'right',
                editable: this.isCreditFieldEditable,
                onCellValueChanged: this.onCreditValueChanged,
                valueFormatter: this.amountFormatter.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: true,
                },
                type: 'numericColumn',
            },
            {
                headerName: 'Document Type',
                field: 'isCreditOrDebit',
                colId: 'isCreditOrDebit',
                hide: true,
            },
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                width: 40,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'right',
            },
        ];
    }

    onCellValueChanged(params) {
        if ((params.column.colId === 'credit' || params.column.colId === 'debit') && !params.value) {
            params.node.setDataValue(params.column.colId, params.oldValue);
        }
    }

    isCreditFieldEditable(params) {
        if (params.data.credit) {
            params.node.setSelected(true);
            return true;
        } else {
            return false;
        }
    }
    isDebitFieldEditable(params) {
        if (params.data.debit) {
            params.node.setSelected(true);
            return true;
        } else {
            return false;
        }
    }
    setValidators() {
        this.counterpartyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.counterparties,
                    nameof<Counterparty>('counterpartyCode'),
                ), Validators.required,
            ]),
        );
        this.docReferenceCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.documentReference,
                    nameof<DocumentMatching>('documentReference'),
                ),
            ]),
        );
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                ), Validators.required,
            ]));
        this.departmentCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.departments,
                    nameof<Department>('departmentCode'),
                ), Validators.required,
            ]));
    }
    onCreateMatchSearchButtonClicked() {
        this.isLoading = true;
        this.isDialogClosed = false;
        if (this.departmentCtrl.value === '') {
            const selectedDepartments = this.masterData.departments.filter(
                (department) => department.departmentCode === 'ALL',
            );
            if (selectedDepartments.length > 0) {
                this.departmentValue = null;
                this.departmentCtrl.setValue(selectedDepartments[0].departmentCode);
            }
        } else if (!this.departmentCtrl.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            this.isLoading = false;
            return;
        }
        if (this.counterpartyCtrl.valid && this.currencyCtrl.valid) {
            if (this.gridApi) {
                this.isDocumentsSelected = this.gridApi.getSelectedRows().length > 0 ? true : false;
            }
            if (this.isDocumentsSelected === false) {
                this.documentIndex = 0;
                this.index = 0;
                if (this.docReferenceCtrl.value === '' || this.docReferenceCtrl.value === null) {
                    this.getDocumentsToMatch();
                } else {
                    this.getDocumentToMatchByDocumentReference();
                    this.isLoading = false;
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Cannot Search when document is selected',
                );
                this.isLoading = false;
            }
        } else {
            this.isLoading = false;
        }
        this.disableSearchButton();
    }
    getDocumentsToMatch() {
        this.executionService
            .getDocumentsToMatch(
                this.counterpartyId.toString(), this.departmentValue, this.currencyCtrl.value, this.isEdit, this.matchFlagCode)
            .subscribe((data) => {
                if (data && data.value.length > 0) {
                    if (this.gridApi) {
                        this.gridApi.setRowData([]);
                    }
                    this.documentMatching = data.value;
                    this.initializeGridColumns();
                    for (this.documentIndex = 0; this.documentIndex < data.value['length']; this.documentIndex++) {
                        this.documentMatching[this.index].amount = data.value[this.index].amount;
                        this.calculateDebitCreditAmounts();
                        this.getDepartmentCodeValue();
                        this.index++;
                    }
                    this.documentMatchingGridRows = this.documentMatching;
                    this.isLoading = false;
                    this.isDataAvailable = true;
                    this.dataLength = this.documentMatchingGridRows.length;
                } else {
                    if (this.gridApi) {
                        this.gridApi.setRowData([]);
                    }
                    this.isLoading = false;
                    this.isDataAvailable = false;
                }
            });
    }
    getDocumentToMatchByDocumentReference() {
        if (this.docReferenceCtrl.valid) {
            this.executionService
                .getDocumentToMatchByDocumentReference(this.docReferenceCtrl.value).subscribe((data) => {
                    if (data && data.value.length > 0) {
                        if (this.gridApi) {
                            this.gridApi.setRowData([]);
                        }
                        this.documentMatching = data.value;
                        this.initializeGridColumns();
                        for (this.documentIndex = 0; this.documentIndex < data.value['length']; this.documentIndex++) {
                            this.documentMatching[this.index].amount = data.value[this.index].amount;
                            this.calculateDebitCreditAmounts();
                            this.getDepartmentCodeValue();
                            this.index++;
                        }
                        this.documentMatchingGridRows = this.documentMatching;
                        this.isLoading = false;
                        this.isDataAvailable = true;
                        this.dataLength = this.documentMatchingGridRows.length;
                    } else {
                        if (this.gridApi) {
                            this.gridApi.setRowData([]);
                        }
                        this.isLoading = false;
                        this.isDataAvailable = false;
                    }
                });
        }
    }
    getDepartmentCodeValue() {
        const selectedDepartments = this.masterData.departments.filter(
            (department) => department.departmentId === this.documentMatching[this.index].departmentId,
        );
        if (selectedDepartments.length > 0) {
            this.documentMatching[this.index].departmentCode = selectedDepartments[0].departmentCode;
        }
    }
    amountFormatter(param) {
        if (param.value) {
            return param.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    }
    onCreditValueChanged(params) {
        params.data.totalAmount = (params.data.amount > 0) ? (params.data.amount) : ((-1) * params.data.amount);
        if (ConvertToNumber(params.data.credit) > params.data.totalAmount) {
            params.node.setDataValue('credit', -(params.data.amount));
            params.node.setDataValue('documentAmount', params.data.amount);
            params.node.setSelected(false);
        } else {
            if (params.node.selected !== false) {
                params.node.setSelected(true);
                params.data.documentAmount = (-1) * params.data.credit;
                params.node.setDataValue('documentAmount', params.data.documentAmount);
                params.context.component.totalCredit = 0;
                const selectedRows = params.context.component.gridApi.getSelectedRows();
                selectedRows.forEach(
                    (selectedDocumentRow) => {
                        params.context.component.totalCredit += ConvertToNumber(selectedDocumentRow.credit);
                    },
                );
                params.context.component.totalBalance =
                    params.context.component.totalCredit - params.context.component.totalDebit;
                params.context.component.formattedInput = params.context.component.totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            }
        }
    }
    calculateDebitCreditAmounts() {
        if (this.documentMatching[this.index].documentType === TransactionDocument.CashPayment
            || this.documentMatching[this.index].documentType === TransactionDocument.SalesInvoice
            || this.documentMatching[this.index].documentType === TransactionDocument.DebitNote
            || this.documentMatching[this.index].documentType === TransactionDocument.JournalEntry) {
            if (this.documentMatching[this.index].amount > 0) {
                this.documentMatching[this.index].debit = this.documentMatching[this.index].amount;
            } else {
                this.documentMatching[this.index].credit = -this.documentMatching[this.index].amount;
            }
            this.documentMatching[this.index].documentAmount = this.documentMatching[this.index].amount;
        } else {
            if (this.documentMatching[this.index].amount > 0) {
                this.documentMatching[this.index].credit = this.documentMatching[this.index].amount;
            } else {
                this.documentMatching[this.index].debit = -this.documentMatching[this.index].amount;
            }
            this.documentMatching[this.index].documentAmount = -this.documentMatching[this.index].amount;
        }
    }
    onDebitValueChanged(params) {
        if (ConvertToNumber(params.data.debit) > params.data.amount) {
            params.node.setDataValue('debit', params.data.amount);
            params.node.setDataValue('documentAmount', params.data.amount);
            params.node.setSelected(false);
        } else {
            if (params.node.selected !== false) {
                params.node.setSelected(true);

                params.node.setDataValue('documentAmount', params.data.debit);
                params.context.component.totalDebit = 0;
                const selectedRows = params.context.component.gridApi.getSelectedRows();
                selectedRows.forEach(
                    (selectedDocumentRow) => {
                        params.context.component.totalDebit += ConvertToNumber(selectedDocumentRow.debit);
                    },
                );
                params.context.component.totalBalance =
                    params.context.component.totalCredit - params.context.component.totalDebit;
                params.context.component.formattedInput = params.context.component.totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            } else {
                params.node.setDataValue('debit', params.data.amount);
                params.node.setDataValue('documentAmount', params.data.amount);
            }
        }
    }
    deselectNode(currentRowIndex) {
        this.documentMatchingGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                this.documentMatchingGridOptions.api.deselectNode(node);
            }
        });
    }
    onCreateMatchRowSelected(event) {
        this.functionalCurrencyAmount = 0;
        this.statutoryCurrencyAmount = 0;
        const currentRowIndex = event.rowIndex;
        if (event.node.selected === false) {
            this.isDocumentsSelected = false;

            // Restoration of the initial value of the cell, in the case the user edited it
            if (event.data.credit) {
                event.node.setDataValue('credit', Math.abs(event.data.amount));
            }
            if (event.data.debit) {
                event.node.setDataValue('debit', Math.abs(event.data.amount));
            }
        }
        if (event.node.selected) {
            this.isDocumentsSelected = true;
            if (event.data.matchFlagCode) {
                this.snackbarService.informationSnackBar('Document is preliminary marked and cannot be selected');
                this.gridApi.deselectIndex(currentRowIndex);
            }
            if (event.data.credit) {
                event.node.setDataValue('isCreditOrDebit', MatchingType.Credit);
            }
            if (event.data.debit) {
                event.node.setDataValue('isCreditOrDebit', MatchingType.Debit);
            }
        }
        this.totalCredit = 0;
        this.totalDebit = 0;
        const selectedRows = this.gridApi.getSelectedRows();
        selectedRows.forEach(
            (selectedDocumentRow) => {
                if (selectedDocumentRow.credit) {
                    this.totalCredit = ConvertToNumber(this.totalCredit) + ConvertToNumber(selectedDocumentRow.credit);
                }
                if (selectedDocumentRow.debit) {
                    this.totalDebit = ConvertToNumber(this.totalDebit) + ConvertToNumber(selectedDocumentRow.debit);
                }
                this.selectedDocumentLength = selectedRows.length;
                this.documentDate = selectedDocumentRow.documentDate.toDateString();
            });
        this.totalBalance = this.totalCredit - this.totalDebit;
        this.formattedInput = this.totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        this.selectedDocumentsToMatch = this.gridApi.getSelectedRows();
    }

    onMatchSelectedButtonClicked() {
        this.isSave = true;
        if (this.gridApi) {
            if (this.gridApi.getSelectedRows().length > 0) {
                if (this.totalBalance === 0) {
                    const matchDateDialog = this.dialog.open(CashMatchingDialogComponent, {
                        data: {
                            title: 'Cash Matching Dialog',
                            text: 'Revaluation Document Date / Payment Document Date',
                            okButton: 'Confirm',
                            cancelButton: 'Cancel',
                            value: this.documentDate,
                        },
                    });
                    this.subscriptions.push(matchDateDialog.afterClosed().subscribe((answer) => {
                        if (answer && answer['buttonClicked']) {
                            this.paymentDocumentDate = answer['buttonValue'];
                            this.matchDocuments();
                        }
                    }));
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'Selected Items do not balance',
                    );
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Select a document to match',
                );
            }
        }
    }

    matchDocuments() {
        this.model = new DocumentMatchingRecord();
        this.populateEntity();
        this.executionService.createMatchFlag(this.model)
            .subscribe((data) => {
                this.isDialogClosed = true;
                this.matchCodeSelected = data.matchFlagCode as string;
                if (data) {
                    this.journalDocumentId = data.journalId;
                    this.transactionDocumentId = data.transactionDocumentId;
                    this.journalFieldShow = (data.journalId) ? true : false;
                    this.gridApi.setRowData([]);
                    this.counterpartyCtrl.reset();
                    this.clientNameCtrl.patchValue(null);
                    this.currencyCtrl.setValue(this.functionalCurrency);
                    const selectedDepartments = this.masterData.departments.filter(
                        (department) => department.departmentCode === 'ALL',
                    );
                    this.departmentCtrl.setValue(selectedDepartments[0].departmentCode);
                    this.docReferenceCtrl.patchValue(null);
                    this.secDocReferenceCtrl.patchValue(null);
                    this.currentDocDateCtrl.patchValue(null);
                    this.docReferenceCtrl.enable(); // ReversalRevalJournalCode
                    let informationMessage: string = 'The match ' + data.matchFlagCode + ' has been created.';
                    if (data.reversalRevalJournalCode) {
                        informationMessage = informationMessage + '\nThe Reval ' + data.reversalRevalJournalCode + ' has been created.';
                    }
                    this.snackbarService.informationAndCopySnackBar(informationMessage, informationMessage);
                }
                if (this.gridApi) {
                    this.gridApi.setRowData([]);
                }
            },
                (error) => {
                    this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                },
                () => {
                });
    }
    populateEntity() {
        this.model.counterpartyId = this.counterpartyId;
        this.model.currencyCode = this.currencyCtrl.value;
        this.model.functionalCurrency = this.functionalCurrency;
        this.model.statutoryCurrency = this.statutoryCurrency;
        this.model.paymentDocumentDate = this.paymentDocumentDate;
        this.model.totalAmount = this.totalBalance;
        this.model.documentMatchings = this.getDocumentMatching();
        this.model.manualDocumentMatchings = this.getDocumentMatching();
    }

    getDocumentMatching() {
        // The sign of amount and document amount should be the same
        // If you want to change this line, please check with Dorine Boutten or Michael Durand
        const documentMatchings: DocumentMatching[] = this.gridApi.getSelectedRows();
        documentMatchings.forEach((doc) => {
            if (Math.sign(doc.amount) !== Math.sign(doc.documentAmount)) {
                doc.documentAmount = -doc.documentAmount;
            }
        });
        return documentMatchings;
    }
    onCloseButtonClicked() {
        this.isDialogClosed = false;
    }
    onGridReady(params) {
        params.columnApi.autoSizeColumns();
        params.columnDefs = this.documentMatchingGridColumns;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridService.sizeColumns(params);
        window.onresize = () => {
            this.gridService.sizeColumns(params);

        };
    }
    onCounterpartyIdSelected(value: Counterparty) {
        const counterparty = this.masterData.counterparties.filter(
            (item) => item.counterpartyCode === value.counterpartyCode,
        );
        if (counterparty.length > 0) {
            this.counterpartyId = counterparty[0].counterpartyID;
            this.clientNameCtrl.patchValue(counterparty[0].description);
            if (!this.docReferenceCtrl.value) {
                this.docReferenceCtrl.disable();
            }
            this.disableSearchButton();
        } else {
            this.docReferenceCtrl.enable();
        }
        this.clientNameCtrl.disable();

    }

    clearDropdownControls() {
        this.docReferenceCtrl.reset();
    }

    onDepartmentCodeSelected(departmentCode: string) {
        const selectedDepartments = this.masterData.departments.filter(
            (department) => department.departmentCode === departmentCode,
        );
        if (selectedDepartments.length > 0) {
            this.departmentValue = selectedDepartments[0].departmentCode !== 'ALL' ?
                selectedDepartments[0].departmentId : null;
        }
    }
    onDocumentReferenceOptionSelected(documentReference: string) {
        this.executionService.getDocumentToMatchByDocumentReference(documentReference)
            .subscribe((data) => {
                if (data && data.value) {
                    let distinctCounterparty;
                    let isDifferentCounterParties: boolean = false;
                    data.value.forEach((row) => {
                        if (!isDifferentCounterParties) {
                            if (distinctCounterparty && distinctCounterparty !== row.counterpartyId) {
                                isDifferentCounterParties = true;
                                this.counterpartyCtrl.patchValue('');
                                this.documentMatchingGridRows = null;
                                this.snackbarService.throwErrorSnackBar('This Document has different Counterparties');
                            } else {
                                distinctCounterparty = row.counterpartyId;
                            }
                        }
                    });
                    if (!isDifferentCounterParties) {
                        this.documentSelectionModel = data.value[0];
                        if (this.documentSelectionModel && this.documentSelectionModel.counterpartyId) {
                            const counterparty = this.masterData.counterparties.filter(
                                (item) => item.counterpartyID === this.documentSelectionModel.counterpartyId,
                            );
                            if (counterparty.length > 0) {
                                this.counterpartyValue = counterparty[0].counterpartyCode;
                                this.counterpartyCtrl.patchValue(counterparty[0]);
                                this.clientNameCtrl.setValue(counterparty[0].description);
                                this.disableSearchButton();
                            }
                        }
                        if (this.documentSelectionModel && this.documentSelectionModel.departmentId) {
                            const department = this.masterData.departments.filter(
                                (item) => item.departmentId === this.documentSelectionModel.departmentId,
                            );
                            if (department.length > 0) {
                                this.departmentCtrl.setValue(department[0].departmentCode);
                                this.departmentValue = department[0].departmentId;
                            }
                        }
                        if (this.documentSelectionModel && this.documentSelectionModel.currencyCode) {
                            this.currencyCtrl.setValue(this.documentSelectionModel.currencyCode);
                        }
                    }
                }
            });
    }

    onDiscardButtonClicked() {
        this.isSave = true;
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.counterpartyCtrl.reset();
                this.clientNameCtrl.patchValue(null);
                this.currencyCtrl.setValue(this.functionalCurrency);
                const selectedDepartments = this.masterData.departments.filter(
                    (department) => department.departmentCode === 'ALL',
                );
                this.departmentCtrl.setValue(selectedDepartments[0].departmentCode);
                if (this.docReferenceCtrl.value) {
                    this.docReferenceCtrl.patchValue(null);
                }
                this.secDocReferenceCtrl.patchValue(null);
                this.currentDocDateCtrl.patchValue(null);
                this.gridApi.setRowData([]);
                this.docReferenceCtrl.enable();
                this.totalBalance = null;
                this.isDialogClosed = false;
            }
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            counterpartyCtrl: this.counterpartyCtrl,
            clientNameCtrl: this.clientNameCtrl,
            docReferenceCtrl: this.docReferenceCtrl,
            secDocReferenceCtrl: this.secDocReferenceCtrl,
            departmentCtrl: this.departmentCtrl,
            currencyCtrl: this.currencyCtrl,
        });
        return super.getFormGroup();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if ((this.counterpartyCtrl.dirty || this.departmentCtrl.dirty || this.clientNameCtrl.dirty ||
            this.secDocReferenceCtrl.dirty || this.currencyCtrl.dirty || this.docReferenceCtrl.dirty) && this.isSave === false) {
            $event.returnValue = true;
        }
    }

    disableSearchButton() {
        this.isSearchDisabled = ((!this.docReferenceCtrl.value) && (!this.counterpartyCtrl.value)) ? true : false;
    }
    onAccountingEntriesButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/financial/accounting/entries'],
            {
                queryParams:
                {
                    matchFlag: this.matchCodeSelected,
                },
            });
    }
}
