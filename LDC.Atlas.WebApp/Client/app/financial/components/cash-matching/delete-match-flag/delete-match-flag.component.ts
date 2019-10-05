import { DatePipe } from '@angular/common';
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
import { DeleteMatchingDialogComponent } from '../cash-matching-dialog/delete-matching-dialog/delete-matching-dialog.component';
import { PaymentDocumentDateDialogComponent } from '../cash-matching-dialog/payment-document-date-dialog/payment-document-date-dialog.component';

@Component({
    selector: 'atlas-delete-match-flag',
    templateUrl: './delete-match-flag.component.html',
    styleUrls: ['./delete-match-flag.component.scss'],
    providers: [DatePipe],
})
export class DeleteMatchFlagComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('emptyStateComponent') emptyStateComponent: EmptyStateComponent;
    counterpartyCtrl = new AtlasFormControl('Counterparty');
    clientNameCtrl = new AtlasFormControl('ClientName');
    departmentsCtrl = new AtlasFormControl('Department');
    currencyCtrl = new AtlasFormControl('Currency');
    docReferenceCtrl = new AtlasFormControl('DocumentReference');
    secDocReferenceCtrl = new AtlasFormControl('SecondaryReference');
    matchFlagCtrl = new AtlasFormControl('MatchFlag');
    currentDocDateCtrl = new AtlasFormControl('CurrentDocumentDate');
    filteredCounterPartyList: Counterparty[];
    filteredDepartmentsList: Department[];
    filteredCurrencyList: Currency[];
    atlasAgGridParam: AtlasAgGridParam;
    dataLength: number = 0;
    documentMatching: DocumentMatching[];
    selectedDocumentsToMatch: DocumentMatching[];

    documentIndex: number;
    index: number = 0;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    isEdit: boolean;
    journalFieldShow: boolean = false;
    matchFlagCode: number;
    journalDocumentId: string;
    isDialogClosed: boolean = false;
    matchFlagId: number;
    documentMatchingGridOptions: agGrid.GridOptions = {};
    documentMatchingGridColumns: agGrid.ColDef[];
    documentMatchingGridRows: DocumentMatching[];
    documentReference: DocumentMatching[] = [];
    matchFlagList: DocumentMatching[] = [];
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Counterparties,
        MasterDataProps.Departments,
        MasterDataProps.Currencies];
    company: string;
    counterpartyId: number;
    departmentValue: number;
    matchType: number;
    totalBalance: number;
    filteredDocReferenceList: DocumentMatching[];
    filteredMatchFlagList: DocumentMatching[];
    documentSelectionModel: DocumentMatching;
    documentsDeleted: string[];

    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'This field is required')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');
    isSearchDisabled: boolean;
    isSave: boolean = false;
    documentReferenceValue: string;
    counterpartyValue: string;
    matchFlagValue: string;
    matchFlagSelected: string;
    totalCredit: number;
    totalDebit: number;
    isDocumentsSelected: boolean = false;
    selectedDocumentLength: number;
    companyConfiguration: Company;
    cashCurrency: string;
    cashCurrencyRate: number;
    cashCurrencyRoeType: string;
    selectedJournalValue: string;
    amountInUSD: number;
    functionalCurrencyAmount: number;
    statutoryCurrencyAmount: number;
    statutoryCurrency: string;
    functionalCurrency: string;
    statutoryCurrencyRoeType: string;
    statutoryCurrenyRate: number;
    functionalCurrencyRoeType: string;
    functionalCurrencyRate: number;
    public model: DocumentMatchingRecord;
    public paymentDocumentModel: DocumentMatchingRecord;
    paymentDocumentDate: Date;
    paymentDocumentDateString: string;
    isDataAvailable: boolean = false;
    isCompanyFrozen: boolean;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected datepipe: DatePipe,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        private router: Router,
        protected utilService: UtilService,
        protected dialog: MatDialog,
        protected uiService: UiService,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        private executionService: ExecutionService,
        private foreignExchangeService: ForeignExchangeService,
        protected companyManager: CompanyManagerService,
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
        this.matchType = MatchingType.createMatch;
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
                    this.matchFlagCtrl.enable();
                }
            }
        });
        this.filteredDepartmentsList = [];
        this.filteredDepartmentsList = this.masterData.departments;
        const departments = this.filteredDepartmentsList.filter((a) => a.departmentId === 0);
        if (departments === undefined) {
            this.filteredDepartmentsList.push({
                departmentId: 0, departmentCode: 'ALL', description: 'ALL Departments',
                profitCenterId: null, companyId: null, companyCode: null,
            });
        }

        this.departmentsCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartmentsList = this.utilService.filterListforAutocomplete(
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
            this.departmentsCtrl.setValue(selectedDepartments[0].departmentCode);
        }
        this.filteredCurrencyList = this.masterData.currencies;
        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.currencies,
                ['currencyCode', 'description'],
            );
        });
        this.executionService.getDocumentReferenceValues(this.matchType = MatchingType.deleteMatch)
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
        this.getMatchFlagList();
        this.calculateFxRate();
        this.initializeGridColumns();
        this.setValidators();
        this.bindConfiguration();
        this.isCompanyFrozen = this.companyManager.getCompany(this.company).isFrozen;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if ((this.counterpartyCtrl.dirty || this.departmentsCtrl.dirty || this.clientNameCtrl.dirty || this.secDocReferenceCtrl.dirty || this.currencyCtrl.dirty || this.docReferenceCtrl.dirty || this.matchFlagCtrl.dirty) && this.isSave === false) {
            $event.returnValue = true;
        }
    }

    canDeactivate() {
        if ((this.counterpartyCtrl.dirty || this.departmentsCtrl.dirty || this.clientNameCtrl.dirty || this.secDocReferenceCtrl.dirty || this.currencyCtrl.dirty || this.docReferenceCtrl.dirty || this.matchFlagCtrl.dirty) && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }
    getMatchFlagList() {
        this.executionService.getMatchFlag()
            .subscribe((data) => {
                if (data) {
                    data.value.forEach((item) => this.matchFlagList.push(this.populateMatchFlag(item)));
                    this.filteredMatchFlagList = this.matchFlagList;
                }
            });
        this.matchFlagCtrl.valueChanges.subscribe((input) => {
            this.filteredMatchFlagList = this.utilService.filterListforAutocomplete(
                input,
                this.matchFlagList, ['matchFlagCode'],
            );
            if (this.matchFlagCtrl.valid) {
                if (this.matchFlagCtrl.value) {
                    if (this.matchFlagCtrl.value.length === 0) {
                        this.disableSearchButton();
                    }
                }
            }
        });
    }
    calculateFxRate() {
        this.foreignExchangeService.getForeignExchangeRate
            (new Date(this.currentDocDateCtrl.value), this.functionalCurrency)
            .subscribe((data) => {
                if (data) {
                    this.functionalCurrencyRate = data.rate != null ? Number(data.rate) : null; // TODO: use AtlasNumber
                    this.functionalCurrencyRoeType = data.currencyRoeType;
                }
            });
        this.foreignExchangeService.getForeignExchangeRate
            (new Date(this.currentDocDateCtrl.value), this.statutoryCurrency)
            .subscribe((data) => {
                if (data) {
                    this.statutoryCurrenyRate = data.rate != null ? Number(data.rate) : null; // TODO: use AtlasNumber
                    this.statutoryCurrencyRoeType = data.currencyRoeType;
                }
            });
    }

    populateDocuments(value: any) {
        const documentsForMatching = new DocumentMatching();
        documentsForMatching.documentReference = value.documentReference;
        return documentsForMatching;
    }
    populateMatchFlag(value: any) {
        const matchFlagList = new DocumentMatching();
        matchFlagList.matchFlagCode = value.matchFlagCode;
        return matchFlagList;
    }
    initializeGridColumns() {
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
                headerName: 'Match Flag',
                field: 'matchFlagCode',
                colId: 'matchFlagCode',
                hide: false,
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
                headerName: 'Cost Type',
                field: 'costType',
                colId: 'costType',
                hide: false,
            },
            {
                headerName: 'Payment Document Date',
                field: 'paymentDocumentDate',
                colId: 'paymentDocumentDate',
                hide: true,
                valueFormatter: this.uiService.dateFormatter,
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
                headerName: 'TotalAmount',
                field: 'amount',
                colId: 'amount',
                type: 'numericColumn',
                hide: true,
            },
            {
                headerName: 'TransactionDirection',
                field: 'transactionDirection',
                colId: 'transactionDirection',
                hide: true,
            },
            {
                headerName: 'Match Flag',
                field: 'matchFlagCode',
                colId: 'matchFlagCode',
                hide: true,
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                },
            },
            {
                headerName: 'Debit',
                field: 'debit',
                colId: 'debit',
                hide: false,
                pinned: 'right',
                type: 'numericColumn',
                valueFormatter: this.NumberFormatterForTotalInGrid.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                },
            },
            {
                headerName: 'Credit',
                field: 'credit',
                colId: 'credit',
                hide: false,
                pinned: 'right',
                type: 'numericColumn',
                valueFormatter: this.NumberFormatterForTotalInGrid.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                },
            },

            {
                headerName: 'JournalLineId',
                field: 'lineId',
                colId: 'lineId',
                hide: true,
            },
            {
                headerName: 'DocumentAmount',
                field: 'documentAmount',
                colId: 'documentAmount',
                hide: true,
            },
            {
                headerName: 'Document Type',
                field: 'isCreditOrDebit',
                colId: 'isCreditOrDebit',
                hide: true,
            },
            {
                headerName: 'Amount in Func CCY',
                field: 'functionalCcyAmount',
                colId: 'functionalCcyAmount',
                hide: true,
                valueFormatter: this.amountFormatter.bind(this),
            },
            {
                headerName: 'Amount in Stat CCY',
                field: 'statutoryCcyAmount',
                colId: 'statutoryCcyAmount',
                hide: true,
                valueFormatter: this.amountFormatter.bind(this),
            },
            {
                headerCheckboxSelection: false,
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

    amountFormatter(param) {
        if (param.value) {
            return Number(param.value).toFixed(2);
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
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
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
        this.matchFlagCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.matchFlagList,
                    nameof<DocumentMatching>('matchFlagCode'),
                ),
            ]),
        );
        this.departmentsCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.departments,
                    nameof<Department>('departmentCode'),
                ), Validators.required,
            ]),
        );
    }
    onDeleteMatchSearchButtonClicked() {
        this.isSave = true;
        this.isLoading = true;
        this.isDialogClosed = false;
        if (this.departmentsCtrl.value === '') {
            const selectedDepartments = this.masterData.departments.filter(
                (department) => department.departmentCode === 'ALL',
            );
            if (selectedDepartments.length > 0) {
                this.departmentValue = null;
                this.departmentsCtrl.setValue(selectedDepartments[0].departmentCode);
            }
        }
        if (this.counterpartyCtrl.valid && this.currencyCtrl.valid) {
            if (this.gridApi) {
                this.isDocumentsSelected = this.gridApi.getSelectedRows().length > 0 ? true : false;
            }

            if (this.isDocumentsSelected === false) {
                this.documentIndex = 0;
                this.index = 0;
                this.getDocumentsToUnmatch();
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
    getDocumentsToUnmatch() {
        this.executionService
            .getDocumentToUnmatch
            (this.counterpartyId.toString(), this.departmentValue, this.currencyCtrl.value, this.docReferenceCtrl.value, this.matchFlagCtrl.value)
            .subscribe((data) => {
                if (data && data.value.length > 0) {
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
    getDocumentToUnmatchByDocumentReference() {
        if (this.docReferenceCtrl.valid) {
            this.executionService
                .getDocumentToUnMatchbyDocumentReference(this.docReferenceCtrl.value).subscribe((data) => {
                    if (data && data.value.length > 0) {
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
                        this.snackbarService.throwErrorSnackBar('No records are available for this search criteria.');
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
    calculateDebitCreditAmounts() {
        if (this.documentMatching[this.index].documentType === TransactionDocument.CashPayment
            || this.documentMatching[this.index].documentType === TransactionDocument.SalesInvoice
            || this.documentMatching[this.index].documentType === TransactionDocument.DebitNote
            || this.documentMatching[this.index].documentType === TransactionDocument.JournalEntry) {
            if (this.documentMatching[this.index].amount >= 0) {
                this.documentMatching[this.index].debit = this.documentMatching[this.index].amount;
            } else {
                this.documentMatching[this.index].credit = -this.documentMatching[this.index].amount;
            }
            this.documentMatching[this.index].documentAmount = this.documentMatching[this.index].amount;
        } else {
            if (this.documentMatching[this.index].amount >= 0) {
                this.documentMatching[this.index].credit = this.documentMatching[this.index].amount;
            } else {
                this.documentMatching[this.index].debit = -this.documentMatching[this.index].amount;
            }
            this.documentMatching[this.index].documentAmount = -this.documentMatching[this.index].amount;
        }
    }
    deselectNode(currentRowIndex) {
        this.documentMatchingGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                this.documentMatchingGridOptions.api.deselectNode(node);
            }
        });
    }
    onDeleteMatchRowSelected(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        const currentRowIndex = event.rowIndex;
        this.totalCredit = 0;
        this.totalDebit = 0;
        this.functionalCurrencyAmount = 0;
        this.statutoryCurrencyAmount = 0;
        selectedRows.forEach(
            (selectedDocumentRow) => {
                if (selectedDocumentRow.credit) {
                    this.totalCredit = ConvertToNumber(this.totalCredit) + ConvertToNumber(selectedDocumentRow.credit);
                }
                if (selectedDocumentRow.debit) {
                    this.totalDebit = ConvertToNumber(this.totalDebit) + ConvertToNumber(selectedDocumentRow.debit);
                }
            });
        this.totalBalance = this.totalCredit - this.totalDebit;
        this.selectedDocumentLength = selectedRows.length;
        if (!event.node.isSelected()) {
            this.isDocumentsSelected = false;
            if (event.data.matchFlagCode === this.matchFlagSelected) {
                this.selectedJournalValue = '';
                this.gridApi.forEachNode((rowData) => {
                    if (rowData.data.matchFlagCode === this.matchFlagSelected) {
                        rowData.selectThisNode(false);
                    }
                });
            }
            this.gridApi.deselectNode(event.node);
        } else {
            if (selectedRows.length === 1) {
                if (event.node.selected === true) {
                    this.isDocumentsSelected = true;
                    this.matchFlagSelected = event.data.matchFlagCode;
                    this.matchFlagId = event.data.matchFlagId;
                    if (event.data.paymentDocumentDate) {
                        this.paymentDocumentDate = event.data.paymentDocumentDate.toDateString();
                    } else {
                        this.paymentDocumentDate = event.data.documentDate.toDateString();
                    }
                }
            }
            if (selectedRows.length > 1) {
                if (event.data.documentType === TransactionDocument.JournalEntry) {
                    this.selectedJournalValue = event.data.documentReference;
                }
                if (event.data.matchFlagCode !== this.matchFlagSelected) {
                    this.snackbarService.informationSnackBar('Only one MatchFlag can be deleted at a time');
                    this.gridApi.deselectIndex(currentRowIndex);
                }
            }
            this.gridApi.forEachNode((rowData) => {
                if (rowData.data.matchFlagCode === this.matchFlagSelected) {
                    rowData.selectThisNode(true);
                }
            });
        }

        if (event.node.selected) {
            if (event.data.credit) {
                event.node.setDataValue('isCreditOrDebit', MatchingType.Credit);
                if (this.cashCurrency !== null && this.cashCurrency !== 'USD') {
                    this.amountInUSD = (this.cashCurrencyRoeType === 'M') ? (event.data.credit * this.cashCurrencyRate)
                        : (event.data.credit / this.cashCurrencyRate);
                    this.amountInUSD = (event.data.amount > 0) ? -(this.amountInUSD) : (this.amountInUSD);
                } else if (this.cashCurrency === 'USD') {
                    this.amountInUSD = event.data.credit;
                    this.amountInUSD = (event.data.amount > 0) ? -(this.amountInUSD) : (this.amountInUSD);
                }
                this.getFuncAndStatCCYValues();
            }
            if (event.data.debit) {
                event.node.setDataValue('isCreditOrDebit', MatchingType.Debit);
                if (this.cashCurrency !== null && this.cashCurrency !== 'USD') {
                    this.amountInUSD = (this.cashCurrencyRoeType === 'M') ? (event.data.debit * this.cashCurrencyRate)
                        : (event.data.debit / this.cashCurrencyRate);
                } else if (this.cashCurrency === 'USD') {
                    this.amountInUSD = event.data.debit;
                }
                this.getFuncAndStatCCYValues();
            }
            event.node.setDataValue('functionalCcyAmount', this.functionalCurrencyAmount);
            event.node.setDataValue('statutoryCcyAmount', this.statutoryCurrencyAmount);
            event.node.setDataValue('documentAmount', event.data.documentAmount);
        } else {
            event.node.setDataValue('functionalCcyAmount', null);
            event.node.setDataValue('statutoryCcyAmount', null);
            event.node.setDataValue('documentAmount', null);
        }
        this.selectedDocumentsToMatch = this.gridApi.getSelectedRows();
    }

    getFuncAndStatCCYValues() {
        if (this.statutoryCurrency !== null && this.statutoryCurrency !== 'USD') {
            this.statutoryCurrencyAmount = (this.statutoryCurrencyRoeType === 'D') ? (this.amountInUSD * this.statutoryCurrenyRate)
                : (this.amountInUSD / this.statutoryCurrenyRate);
        } else if (this.statutoryCurrency === 'USD') {
            this.statutoryCurrencyAmount = this.amountInUSD;
        }
        if (this.functionalCurrency !== null && this.functionalCurrency !== 'USD') {
            this.functionalCurrencyAmount = (this.functionalCurrencyRoeType === 'D')
                ? (this.amountInUSD * this.functionalCurrencyRate) : (this.amountInUSD / this.functionalCurrencyRate);
        } else if (this.functionalCurrency === 'USD') {
            this.functionalCurrencyAmount = this.amountInUSD;
        }
    }

    onCurrencyOptionSelected(currencyCode: string) {
        this.cashCurrency = currencyCode;
        this.foreignExchangeService.getForeignExchangeRate
            (new Date(this.currentDocDateCtrl.value), this.cashCurrency)
            .subscribe((data) => {
                if (data) {
                    this.cashCurrencyRate = data.rate != null ? Number(data.rate) : null; // TODO: use AtlasNumber
                    this.cashCurrencyRoeType = data.currencyRoeType;
                }
            });
    }
    onEditPaymentDocumentButtonClicked() {
        this.isSave = true;
        if (this.gridApi) {
            if (this.gridApi.getSelectedRows().length > 0) {
                if (this.totalBalance === 0) {
                    this.executionService.getDocumentToUnmatchByMatchFlag(this.matchFlagSelected).subscribe((data) => {
                        if (data && data.value.length > 0) {
                            this.documentMatching = data.value;
                            this.paymentDocumentDateString = this.datepipe.transform(data.value[0].paymentDocumentDate.toDateString(), 'dd/MM/yyyy');
                            if (data.value[0].paymentDocumentDate === null) {
                                this.paymentDocumentDateString = this.datepipe.transform(data.value[0].documentDate.toDateString(), 'dd/MM/yyyy');
                            }
                            const editMatchDialog = this.dialog.open(PaymentDocumentDateDialogComponent, {
                                data: {
                                    title: 'Edit Payment Document Date',
                                    txtDocMatched: 'Documents Matched with the',
                                    txtMatchFlag: 'Match Flag',
                                    txtPayDocDate: 'The Payment Document Date of the Documents are',
                                    okButton: 'Confirm',
                                    cancelButton: 'Cancel',
                                    value1: this.matchFlagSelected,
                                    value2: this.paymentDocumentDate,
                                    value3: this.paymentDocumentDateString,
                                },
                            });
                            this.subscriptions.push(editMatchDialog.afterClosed().subscribe((answer) => {
                                if (answer && answer['buttonClicked']) {
                                    this.paymentDocumentDate = answer['buttonValue'];
                                    this.editPaymentDocumentDate();
                                }
                            }));
                        }
                    });
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'Balance should be equal to zero',
                    );
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Select Documents to Edit',
                );
            }
        }
    }

    onUnmatchButtonClicked() {
        this.isSave = true;
        if (this.gridApi) {
            if (this.gridApi.getSelectedRows().length > 0) {
                if (this.totalBalance === 0) {
                    this.executionService.getDocumentToUnmatchByMatchFlag(this.matchFlagSelected).subscribe((data) => {
                        if (data && data.value.length > 0) {
                            this.paymentDocumentDate = data.value[0].paymentDocumentDate;
                            if (data.value[0].paymentDocumentDate === null) {
                                this.paymentDocumentDate = data.value[0].documentDate;
                            }
                        }
                        const unmatchDialog = this.dialog.open(DeleteMatchingDialogComponent, {
                            data: {
                                title: 'Delete Matching Dialog',
                                text: 'The system will delete the Match Flag',
                                okButton: 'PROCEED',
                                cancelButton: 'DISCARD',
                                value: this.matchFlagSelected,
                            },
                            width: '46%',
                            height: '25%',
                        });
                        this.subscriptions.push(unmatchDialog.afterClosed().subscribe((answer) => {
                            if (answer && answer['buttonClicked']) {
                                this.matchFlagSelected = answer['buttonValue'];
                                this.unmatchDocuments();
                            }
                        }));
                    });
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'Balance should be equal to zero',
                    );
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Select a document to match',
                );
            }
        }
    }

    unmatchDocuments() {
        this.model = new DocumentMatchingRecord();
        this.populateEntity();
        this.executionService.deleteMatchFlag(this.model)
            .subscribe((data) => {
                if (this.gridApi) {
                    this.gridApi.setRowData([]);
                }
                this.matchFlagCtrl.reset();
                this.isDialogClosed = true;
                if (data) {
                    this.journalDocumentId = data.reversalRevalJournalCode;
                    this.journalFieldShow = true;
                    this.gridApi.setRowData([]);
                    this.counterpartyCtrl.reset();
                    this.clientNameCtrl.patchValue(null);
                    this.currencyCtrl.setValue(this.functionalCurrency);
                    const selectedDepartments = this.masterData.departments.filter(
                        (department) => department.departmentCode === 'ALL',
                    );
                    this.departmentsCtrl.setValue(selectedDepartments[0].departmentCode);
                    this.docReferenceCtrl.patchValue(null);
                    this.secDocReferenceCtrl.patchValue(null);
                    this.currentDocDateCtrl.patchValue(null);
                    this.docReferenceCtrl.enable();
                    this.matchFlagCtrl.enable();
                }
            });
    }
    editPaymentDocumentDate() {
        this.paymentDocumentModel = new DocumentMatchingRecord();
        this.populateEditFields();
        this.executionService.updateDocumentMatching(this.paymentDocumentModel)
            .subscribe((data) => {
                this.snackbarService.informationAndCopySnackBar('Documents with Match Flag : ' + this.matchFlagSelected + ' is updated', this.matchFlagSelected);
                if (this.gridApi) {
                    this.gridApi.setRowData([]);
                }
                this.onDeleteMatchSearchButtonClicked();
            });
    }
    populateEntity() {
        this.model.matchFlagCode = this.matchFlagSelected;
        this.model.matchFlagId = this.matchFlagId;
        this.model.currencyCode = this.currencyCtrl.value;
        this.model.functionalCurrency = this.functionalCurrency;
        this.model.statutoryCurrency = this.statutoryCurrency;
        this.model.paymentDocumentDate = this.paymentDocumentDate;
        this.model.manualDocumentMatchings = this.gridApi.getSelectedRows();
        this.model.documentMatchings = this.gridApi.getSelectedRows();
        this.model.unmatchDocuments = this.gridApi.getSelectedRows();
    }
    populateEditFields() {
        this.paymentDocumentModel.matchFlagCode = this.matchFlagSelected;
        this.paymentDocumentModel.paymentDocumentDate = this.paymentDocumentDate;
        this.paymentDocumentModel.matchFlagId = this.matchFlagId;
    }
    onCloseButtonClicked() {
        this.isSave = true;
        this.isDialogClosed = false;
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
            if (!this.matchFlagCtrl.value) {
                this.matchFlagCtrl.disable();
            }
            this.disableSearchButton();
        } else {
            this.docReferenceCtrl.enable();
            this.matchFlagCtrl.enable();
        }
        this.clientNameCtrl.disable();
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
        this.documentReferenceValue = documentReference;
        this.executionService.getDocumentToUnMatchbyDocumentReference(this.documentReferenceValue)
            .subscribe((data) => {
                if (data) {
                    this.documentSelectionModel = data.value[0];
                    this.populateSearchFields(this.documentSelectionModel);
                    if (this.documentSelectionModel && this.documentSelectionModel.departmentId) {
                        const department = this.masterData.departments.filter(
                            (item) => item.departmentId === this.documentSelectionModel.departmentId,
                        );
                        if (department.length > 0) {
                            this.departmentsCtrl.setValue(department[0].departmentCode);
                            this.departmentValue = department[0].departmentId;
                        }
                    }
                }
            });
    }
    onMatchFlagOptionSelected(matchFlagCode: string) {
        this.matchFlagValue = matchFlagCode;
        this.executionService.getDocumentToUnmatchByMatchFlag(this.matchFlagValue)
            .subscribe((data) => {
                if (data) {
                    this.documentSelectionModel = data.value[0];
                    this.populateSearchFields(this.documentSelectionModel);
                }
            });
    }
    populateSearchFields(documentSelectionModel) {
        this.documentSelectionModel = documentSelectionModel;
        if (this.documentSelectionModel.counterpartyId) {
            const counterparty = this.masterData.counterparties.filter(
                (item) => item.counterpartyID === this.documentSelectionModel.counterpartyId,
            );
            if (counterparty.length > 0) {
                this.counterpartyValue = counterparty[0].counterpartyCode;
                this.counterpartyCtrl.setValue(counterparty[0]);
                this.clientNameCtrl.setValue(counterparty[0].description);
                this.disableSearchButton();
            }
        }
        if (this.documentSelectionModel.currencyCode) {
            this.onCurrencyOptionSelected(this.documentSelectionModel.currencyCode);
            this.currencyCtrl.setValue(this.documentSelectionModel.currencyCode);
        }
    }
    onGridReady(params) {
        params.columnDefs = this.documentMatchingGridColumns;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridService.sizeColumns(params);
        window.onresize = () => {
            this.gridService.sizeColumns(params);
        };
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
                this.departmentsCtrl.setValue(selectedDepartments[0].departmentCode);
                if (this.docReferenceCtrl.value) {
                    this.docReferenceCtrl.patchValue(null);
                }
                if (this.matchFlagCtrl.value) {
                    this.matchFlagCtrl.patchValue(null);
                }
                this.secDocReferenceCtrl.patchValue(null);
                this.currentDocDateCtrl.patchValue(null);
                this.gridApi.setRowData([]);
                this.docReferenceCtrl.enable();
                this.matchFlagCtrl.enable();
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
            matchFlagCtrl: this.matchFlagCtrl,
            departmentsCtrl: this.departmentsCtrl,
            currencyCtrl: this.currencyCtrl,
        });
        return super.getFormGroup();
    }

    disableSearchButton() {
        this.isSearchDisabled = ((!this.docReferenceCtrl.value) && (!this.counterpartyCtrl.value) && (!this.matchFlagCtrl.value))
            ? true : false;
    }
    onAccountingEntriesButtonClicked() {
        const allColumnIds = [];
        if (this.model.unmatchDocuments) {
            this.model.unmatchDocuments.forEach((columnDefs) => {
                allColumnIds.push(columnDefs.documentReference);
            });

            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                '/financial/accounting/entries'],
                                 {
                    queryParams:
                    {
                        documentDeleted: allColumnIds,
                    },
                });
        }

    }

    NumberFormatterForTotalInGrid(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }
}
