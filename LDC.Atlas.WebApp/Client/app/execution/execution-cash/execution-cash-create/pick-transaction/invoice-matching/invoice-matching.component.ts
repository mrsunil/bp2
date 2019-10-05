import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CashTypes } from '../../../../../shared/entities/cash-type.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { TransactionDocument } from '../../../../../shared/enums/transaction-document.enum';
import { CharterDisplayView } from '../../../../../shared/models/charter-display-view';
import { ConvertToNumber, CustomNumberMask } from '../../../../../shared/numberMask';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { CashMatching } from '../../../../../shared/services/execution/dtos/cash-matching';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { CashSummaryGrid } from '../../../../../shared/services/execution/dtos/cash-summary-grid-record';
import { InvoiceForCashMatching } from '../../../../../shared/services/execution/dtos/invoice-for-cash';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { ForeignExchangeService } from '../../../../../shared/services/http-services/foreign-exchange.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';
const moment = _moment;

@Component({
    selector: 'atlas-invoice-matching',
    templateUrl: './invoice-matching.component.html',
    styleUrls: ['./invoice-matching.component.scss'],
})
export class InvoiceMatchingComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly totalBalanceValue = new EventEmitter<any>();
    @Output() readonly invoiceSearchValues = new EventEmitter<any>();
    @Output() readonly selectedInvoiceReferences = new EventEmitter<any>();
    @Output() readonly invoiceSelected = new EventEmitter<boolean>();
    @Output() readonly setNarrative = new EventEmitter<any>();
    @Output() readonly invoiceAmountValue = new EventEmitter<any>();
    @Output() readonly currencySelected = new EventEmitter<any>();
    @Output() readonly AmountEnterOrInvoiceSelection = new EventEmitter<any>();
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    counterpartyCtrl = new AtlasFormControl('Counterparty');
    clientNameCtrl = new AtlasFormControl('Payer');
    currencyCtrl = new AtlasFormControl('Currency');
    departmentsCtrl = new AtlasFormControl('Departments');
    docReferenceCtrl = new AtlasFormControl('DocumentReference');
    secDocReferenceCtrl = new AtlasFormControl('SecondDocumentReference');
    bankCurrencyCtrl = new AtlasFormControl('BankCurrency');
    fxRateCtrl = new AtlasFormControl('FXRate');
    divideMultiplyCtrl = new AtlasFormControl('DivideMultiply');
    company: string;
    filteredCounterPartyList: Counterparty[];
    filteredCurrencyList: Currency[];
    filteredBankCurrencylist: Currency[];
    filteredDepartments: Department[];
    filteredCashTypes: CashTypes[];
    filteredDocReferenceList: InvoiceForCashMatching[];
    documentReferenceList: InvoiceForCashMatching[] = [];
    searchForm: FormGroup;
    cashMatchingModel: CashMatching = new CashMatching();
    invoiceMatchingGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    invoiceMatchingGridColumns: agGrid.ColDef[];
    invoiceMatchingGridRows: CashMatching[];
    counterpartyValue: string;
    roeType: string;
    currencyFrom: string;
    currencyTo: string;
    fxRateValue: number;
    bankCurrencyValue: string;
    documentTypePI: string = 'PI';
    documentTypeSI: string = 'SI';
    departmentValue: number;
    isFxRateValid: boolean = true;
    invoiceAmount: number;
    clientNameValue: string;
    currencyValue: string;
    isInvoiceSelected: boolean;
    selectedInvoices: CashMatching[];
    totalBalance: number = 0;
    docReferenceValue: string;
    cashMatching: CashMatching[];
    selectedInvoiceToMatch: CashSummaryGrid[];
    dataLength: number = 0;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    cashSelectionModel: CashMatching;
    filteredClientRefCurrency: CashMatching;
    model: InvoiceForCashMatching;
    selectedValue: number;
    cashTypeId: number;
    cashTransactionId: number;
    totalAmount: number;
    tolarence: number;
    currencyRoeType: string;
    maxFxRateValue: number;
    minFxRateValue: number;
    actualFxrateValue: number;
    cashOption: boolean;
    hasMaximumTolarence = false;
    hasMinimumTolarence = false;
    cashSelectionType = CashSelectionType;
    cashType = CashType;
    invoiceForCashMatchingModel: InvoiceForCashMatching = new InvoiceForCashMatching();
    private getInvoiceForMatchSubscription: Subscription;
    private getInvoiceByDocumentReferenceSubscription: Subscription;
    masterData: MasterData;
    gridContext = {
        component: this,
    };
    isEdit = false;
    matchFlagId: number;
    departmentId: string;
    cashAmount: number;
    charters: CharterDisplayView[];
    cashCurrencyCode: string;
    cashCurrencyRoeType: string;
    cashCurrencyRate: number;
    companyConfiguration: Company;
    isFXratesAvailableForCashCurrency: boolean;
    isValidFxRateForFunctionalStatutoruCurrency: boolean;
    isValueBindedFromCurrencyComponent: boolean;

    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };
    decimalOptionValue: number = 2;
    formatType: string = 'en-US';
    formattedBalance: any;
    formattedInvoiceAmount: any;

    // These properties are added to retain invoice selection in cash receipt .
    // when user selects invoices in step 3 and clicks on "previous" button that comes
    // to step 2 i.e. cash details page and again when user clicks on next button
    // without changing ant values the previously selected invoices should be
    // retained. If user changes Counterparty and currency than invoice selection should
    // get cleared.
    previousCounterpartyCode: string;
    previousCurrencyCode: string;  // this also matching currency in case of cash by different currency
    previousAmount: number;
    isAmountValueIsChanged: boolean;
    previousPaymentCurrency: string;
    previousFxRateValue: number;
    clientNameWidth: string;
    secDocReferenceWidth: string;
    formInvalidMessage = 'Form is invalid. Please resolve the errors.';

    counterpartyErrorMap: Map<string, string> = new Map();
    currencyErrorMap: Map<string, string> = new Map();
    bankCurrencyErrorMap: Map<string, string> = new Map();
    fxRateErrorMap: Map<string, string> = new Map();
    isSearchApplied = false;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        private executionService: ExecutionService,
        private snackbarService: SnackbarService,
        protected uiService: UiService,
        private formatDate: FormatDatePipe,
        private route: ActivatedRoute,
        private preAccountingService: PreaccountingService,
        private companyManager: CompanyManagerService,
        private foreignExchangeService: ForeignExchangeService,
        public gridService: AgGridService,

    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.searchForm = this.formBuilder.group({
            counterpartyCtrl: ['', Validators.required],
            currencyCtrl: ['', Validators.required],
            bankCurrencyCtrl: ['', Validators.required],
            fxRateCtrl: ['', Validators.required],
        });
        this.counterpartyErrorMap.set('required', ' Required *');
        this.currencyErrorMap.set('required', ' Required *');
        this.bankCurrencyErrorMap.set('required', ' Required *');
        this.fxRateErrorMap.set('required', ' Required *');
    }
    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.cashTypeId = Number(this.route.snapshot.paramMap.get('cashTypeId'));
        this.cashOption = (this.cashTypeId === CashType.CashPayment ? true : false);
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.filteredCounterPartyList = this.masterData.counterparties;
        this.counterpartyCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.counterparties,
                ['counterpartyCode', 'description'],
            );
            if (this.counterpartyCtrl.valid) {
                this.onClientReferenceChange();
            } else {
                if (this.counterpartyCtrl.value) {
                    // this.counterpartyCtrl.reset();
                }
            }
        });
        this.filteredDepartments = this.masterData.departments;
        this.departmentsCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartments = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.departments,
                ['departmentCode', 'description'],
            );
            if (this.departmentsCtrl.valid) {
                this.onDepartmentChange();
            } else {
                this.docReferenceCtrl.reset();
            }
        });
        this.executionService.getDocumentReferenceList()
            .subscribe((data) => {
                data.value.forEach((item) => this.documentReferenceList.push(this.populateInvoices(item)));
                this.filteredDocReferenceList = this.documentReferenceList;
            });
        this.docReferenceCtrl.valueChanges.subscribe((input) => {
            this.filteredDocReferenceList = this.utilService.filterListforAutocomplete(
                input,
                this.documentReferenceList, ['invoiceDocumentReference'],
            );
        });
        this.filterBankCurrencies();
        this.initializeGridColumns();
        this.setValidators();
        this.bindConfiguration();
        this.isValueBindedFromCurrencyComponent = false;
    }

    onClientReferenceChange() {
        if (this.filteredClientRefCurrency) {
            const documentRefrence = this.filteredClientRefCurrency.documentReference;
            const counterpartyCode = this.masterData.counterparties.find((a) =>
                a.counterpartyID === this.filteredClientRefCurrency.counterPartyId).counterpartyCode;

            if (this.counterpartyCtrl.value && (this.counterpartyCtrl.value as Counterparty).counterpartyCode !== counterpartyCode) {
                this.docReferenceCtrl.reset();
            }
        }
    }

    onDepartmentChange() {
        if (this.filteredClientRefCurrency) {
            const documentRefrence = this.filteredClientRefCurrency.documentReference;
            const department = this.masterData.departments.find((a) =>
                a.departmentId === this.filteredClientRefCurrency.departmentId);

            if (department && this.departmentsCtrl.value &&
                (this.departmentsCtrl.value as Department).departmentCode !== department.departmentCode) {
                this.docReferenceCtrl.reset();
            }
        }
    }

    onCurrencyChange() {
        if (this.filteredClientRefCurrency) {
            const documentRefrence = this.filteredClientRefCurrency.documentReference;
            const currency = this.filteredClientRefCurrency.currencyCode;

            if (this.currencyCtrl.value && (this.currencyCtrl.value as Currency).currencyCode !== currency) {
                this.docReferenceCtrl.reset();
            }
        }
    }

    onGridReady(params) {
        this.invoiceMatchingGridOptions.columnDefs = this.invoiceMatchingGridColumns;
        this.gridApi = this.invoiceMatchingGridOptions.api;
        this.gridColumnApi = this.invoiceMatchingGridOptions.columnApi;

        this.autosizeColumns();

        this.gridApi.showNoRowsOverlay();
        if (this.gridColumnApi) {
            if (this.selectedValue === CashSelectionType.ReceiptDifferentCurrency
                || this.selectedValue === CashSelectionType.PaymentDifferentCurrency) {
                this.gridColumnApi.setColumnVisible('amountPaidInDiffCcy', true);
            } else {
                this.gridColumnApi.setColumnVisible('amountPaidInDiffCcy', false);
            }
        }
        this.gridService.sizeColumns(params);
    }

    autosizeColumns() {
        if (this.invoiceMatchingGridOptions) {
            this.gridService.sizeColumns(this.invoiceMatchingGridOptions);
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
        this.bankCurrencyCtrl.setValidators(Validators.compose
            ([Validators.required]),
        );
        this.fxRateCtrl.setValidators(Validators.compose
            ([Validators.required]),
        );
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                ), Validators.required,
            ]),
        );

        this.departmentsCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.departments,
                    nameof<Department>('departmentCode'),
                ),
            ]),
        );
        this.docReferenceCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.documentReferenceList,
                    nameof<InvoiceForCashMatching>('invoiceDocumentReference'),
                ),
            ]),
        );

    }

    onFXRateValueChanged(fxRateInput) {
        const result = this.calculateFxrateTolarenceValue();
        if (!result) {
            this.isFxRateValid = false;
            this.snackbarService.throwErrorSnackBar(
                'FX Rate difference should be within 10% threshold.',
            );
        } else {
            this.isFxRateValid = true;
        }
    }
    onSearchButtonClicked() {
        this.clearInvoiceSelection();
        // get the fxrate for the selected currency for conversion to fucntionalcurrency and statutorycurrency

        // validate controls before making service call.
        // if search by Document reference
        if (this.docReferenceCtrl.value && !this.docReferenceCtrl.valid
            && this.cashTypeId === CashType.CashPayment) {
            this.snackbarService.throwErrorSnackBar(this.formInvalidMessage);
            return;
        } else { // if search by counterparty,currency and department
            if ((!this.counterpartyCtrl.valid || !this.currencyCtrl.valid ||
                (this.departmentsCtrl.value && !this.departmentsCtrl.valid))
                && this.cashTypeId === CashType.CashPayment) {
                this.snackbarService.throwErrorSnackBar(this.formInvalidMessage);
                return;
            }
        }

        if ((this.currencyCtrl.value as Currency).currencyCode !== this.companyConfiguration.functionalCurrencyCode) {
            // If functional currency is USD and Cash Currency is AED than fetch fxrates.
            this.foreignExchangeService.getForeignExchangeRate(this.companyConfiguration.companyDate.toDate(), (this.currencyCtrl.value as Currency).currencyCode)
                .subscribe((data) => {
                    if (data) {
                        this.isValidFxRateForFunctionalStatutoruCurrency = true;
                        this.cashCurrencyRate = ConvertToNumber(data.rate);
                        this.cashCurrencyRoeType = data.currencyRoeType;
                        this.cashCurrencyCode = (this.currencyCtrl.value as Currency).currencyCode;
                    } else {
                        this.isValidFxRateForFunctionalStatutoruCurrency = false;
                        this.isLoading = false;
                        this.snackbarService.throwErrorSnackBar('FXrates are not avialable for the selected Currency');
                        return;
                    }
                });
        } else {
            this.isValidFxRateForFunctionalStatutoruCurrency = true;
            this.cashCurrencyRate = 1;
            this.cashCurrencyRoeType = 'M';
            this.cashCurrencyCode = (this.currencyCtrl.value as Currency).currencyCode;
        }

        // incase of different ccy , check whether the fx rates are avialable or not.

        // This is only for cash receipts.
        // assign the counterparty , currency and amount to properties which is used to
        // maintain/ clear the invoice selection while going to previous screen and coming back
        this.previousCounterpartyCode = (this.counterpartyCtrl.value as Counterparty).counterpartyCode;
        this.previousCurrencyCode = (this.currencyCtrl.value as Currency).currencyCode;
        this.previousAmount = this.totalAmount;

        if ((this.selectedValue === CashSelectionType.PaymentDifferentCurrency ||
            this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) && !this.isFXratesAvailableForCashCurrency) {
            this.snackbarService.throwErrorSnackBar('Selected currency doesnot have Valid Fxrate details');
            return;
        }
        // emit select currency for additional cost component
        // if its diff ccy then emit the payable currency

        if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency ||
            this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
            this.currencySelected.emit((this.bankCurrencyCtrl.value as Currency).currencyCode);
            this.previousPaymentCurrency = (this.bankCurrencyCtrl.value as Currency).currencyCode;
            this.previousFxRateValue = this.fxRateCtrl.value;

            // validate whether both currency are USD or atleast one currency should be USD
            if ((this.currencyCtrl.value as Currency).currencyCode === (this.bankCurrencyCtrl.value as Currency).currencyCode) {
                this.snackbarService.throwErrorSnackBar('Both the currencies cannot be same');
                this.bankCurrencyCtrl.reset();
                this.fxRateCtrl.reset();
                return;
            } else if ((this.currencyCtrl.value as Currency).currencyCode !== 'USD' && (this.bankCurrencyCtrl.value as Currency).currencyCode !== 'USD') {
                this.snackbarService.throwErrorSnackBar('One of the currency Must be USD');
                this.bankCurrencyCtrl.reset();
                this.fxRateCtrl.reset();
                return;
            }

            const result = this.calculateFxrateTolarenceValue();
            if (!result) {
                this.isFxRateValid = false;
                this.snackbarService.throwErrorSnackBar(
                    'FX Rate difference should be within 10% threshold.',
                );
                return;
            } else {
                this.isFxRateValid = true;
            }

        } else {
            this.currencySelected.emit((this.currencyCtrl.value as Currency).currencyCode);
        }

        this.isLoading = true;
        if (this.selectedValue === CashSelectionType.PaymentFullPartialTransaction
            || this.selectedValue === CashSelectionType.PaymentDifferentClient) {
            if (this.counterpartyCtrl.valid && this.currencyCtrl.valid) {
                if (!this.isInvoiceSelected) {
                    this.currencyValue = (this.currencyCtrl.value as Currency).currencyCode;
                    this.clientNameValue = this.clientNameCtrl.value;
                    this.docReferenceValue = this.docReferenceCtrl.value ?
                        (this.docReferenceCtrl.value as InvoiceForCashMatching).invoiceDocumentReference : null;
                    this.invoiceSearchValues.emit({
                        counterparty: this.counterpartyValue,
                        department: this.departmentsCtrl.value !== null ?
                            (this.departmentsCtrl.value as Department).departmentCode : this.departmentsCtrl.value,
                        currency: this.currencyValue,
                        clientName: this.clientNameValue,
                    });

                    this.getInvoiceToMatch();
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'Cannot Search when invoice is selected',
                    );
                    this.isLoading = false;
                }
            }
        } else if (this.selectedValue === CashSelectionType.ReceiptFullPartialTransaction
            || this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
            if (!this.isInvoiceSelected) {
                this.currencyValue = (this.currencyCtrl.value as Currency).currencyCode;
                this.clientNameValue = this.clientNameCtrl.value;
                this.docReferenceValue = this.docReferenceCtrl.value ?
                    (this.docReferenceCtrl.value as InvoiceForCashMatching).invoiceDocumentReference : null;
                if (this.totalAmount) {
                    this.invoiceAmount = ConvertToNumber(this.totalAmount);
                }
                this.getInvoiceToMatch();
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Cannot Search when invoice is selected',
                );
                this.isLoading = false;
            }
        } else if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency) {
            if ((this.currencyCtrl.value as Currency).currencyCode !== (this.bankCurrencyCtrl.value as Currency).currencyCode) {
                if (this.counterpartyCtrl.valid && this.currencyCtrl.valid && this.bankCurrencyCtrl.valid
                    && this.isFxRateValid) {
                    if (!this.isInvoiceSelected) {
                        this.counterpartyValue = (this.counterpartyCtrl.value as Counterparty).counterpartyCode;
                        this.currencyValue = (this.currencyCtrl.value as Currency).currencyCode;
                        this.clientNameValue = this.clientNameCtrl.value;
                        this.docReferenceValue = this.docReferenceCtrl.value ?
                            (this.docReferenceCtrl.value as InvoiceForCashMatching).invoiceDocumentReference : null;
                        this.invoiceSearchValues.emit({
                            counterparty: this.counterpartyValue,
                            department: this.departmentsCtrl.value !== null ?
                                (this.departmentsCtrl.value as Department).departmentCode : this.departmentsCtrl.value,
                            currency: this.currencyValue,
                            clientName: this.clientNameValue,
                            bankCurrency: (this.bankCurrencyCtrl.value as Currency).currencyCode,
                            fxRate: this.fxRateCtrl.value,
                            roeType: this.roeType,
                        });
                        this.getInvoiceToMatch();
                    } else {
                        this.snackbarService.throwErrorSnackBar(
                            'Cannot Search when invoice is selected',
                        );
                        this.isLoading = false;
                    }
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'only one currency can be USD',
                );
            }
        }
        this.isSearchApplied = true;
    }
    getInvoiceToMatch() {
        const counterparty = this.getCounterpartyDetails(this.masterData, (this.counterpartyCtrl.value as Counterparty).counterpartyCode, false);
        let counterPartyId: number;
        if (counterparty && counterparty.length > 0) {
            counterPartyId = counterparty[0].counterpartyID;
        }
        if (!this.departmentsCtrl.value) {
            this.departmentValue = null;
        }

        this.getInvoiceForMatchSubscription = this.executionService
            .getInvoiceToMatch(counterPartyId.toString(),
                this.departmentValue, (this.currencyCtrl.value as Currency).currencyCode,
                this.isEdit, this.matchFlagId,
                this.docReferenceValue)
            .subscribe((data) => {
                if (data && data.value.length > 0) {
                    this.cashMatching = this.populateData(data.value);
                    this.initializeGridColumns();
                    this.invoiceMatchingGridRows = this.cashMatching;
                    this.isLoading = false;
                    this.dataLength = this.invoiceMatchingGridRows.length;
                    this.gridApi.setRowData(this.invoiceMatchingGridRows);
                    const selectedRows: any[] = [];
                    this.invoiceMatchingGridRows.forEach((item) => {
                        // in Edit mode , bind ischecked=true for prematched documents
                        if (item.amountToBePaid && item.amountToBePaid !== 0) {
                            item.isChecked = true;
                        }

                        if (item.isChecked === true) {
                            // check for diff ccy
                            if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency
                                || this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
                                if (this.roeType) {
                                    item.amountPaidInDiffCcy =
                                        this.roeType === 'M' ? item.amount * this.fxRateCtrl.value :
                                            item.amount / this.fxRateCtrl.value;
                                }
                            }
                            selectedRows.push(item);
                        }
                    });
                    this.calculateAmountOrBalanceForInvoiceSelected(selectedRows);
                    this.selectedInvoiceToMatch = selectedRows;
                    this.isInvoiceSelected = selectedRows.length > 0;
                    this.AmountEnterOrInvoiceSelection.emit();
                    this.invoiceSelected.emit(this.isInvoiceSelected);

                } else {
                    this.snackbarService.throwErrorSnackBar('No records are available for this search criteria.');
                    this.isLoading = false;
                }
            });
    }
    ngOnDestroy(): void {
        if (this.getInvoiceForMatchSubscription) {
            this.getInvoiceForMatchSubscription.unsubscribe();
        }
        if (this.getInvoiceByDocumentReferenceSubscription) {
            this.getInvoiceByDocumentReferenceSubscription.unsubscribe();
        }
    }
    getInvoiceByDocumentReference() {
        this.getInvoiceByDocumentReferenceSubscription = this.executionService.getInvoiceToMatchByDocumentReference(this.docReferenceValue)
            .subscribe((data) => {
                if (data && data.value.length > 0) {
                    this.cashMatching = this.populateData(data.value);
                    this.initializeGridColumns();
                    this.invoiceMatchingGridRows = this.cashMatching;
                    this.dataLength = this.invoiceMatchingGridRows.length;
                } else {
                    this.snackbarService.throwErrorSnackBar('No records are available for this search criteria.');
                }
                this.isLoading = false;
            });
    }
    initializeGridColumns() {
        this.invoiceMatchingGridColumns = [
            {
                headerName: 'Document Reference',
                field: 'documentReference',
                colId: 'documentReference',
                hide: false,
                pinned: 'left',
            },
            {
                headerName: 'TransactionDocumentId',
                field: 'transactionDocumentId',
                colId: 'transactionDocumentId',
                hide: true,
            },
            {
                headerName: 'Transaction Direction ID',
                field: 'transactionDirectionID',
                colId: 'transactionDirectionID',
                hide: true,
            },
            {
                headerName: 'DepartmentId',
                field: 'departmentId',
                colId: 'departmentId',
                hide: true,
            },
            {
                headerName: 'Secondary Document Reference',
                field: 'secondaryDocumentReference',
                colId: 'secondaryDocumentReference',
                hide: false,
            },
            {
                headerName: 'Document Date',
                field: 'documentDate',
                colId: 'documentDate',
                hide: false,
                valueFormatter: this.dateFormatter.bind(this),
            },
            {
                headerName: 'Value Date',
                field: 'valueDate',
                colId: 'valueDate',
                hide: false,
                valueFormatter: this.dateFormatter.bind(this),
            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                hide: false,
            },
            {
                headerName: 'External Reference',
                field: 'externalReference',
                colId: 'externalReference',
                hide: false,
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
            },
            {
                headerName: 'Charter',
                field: 'charterCode',
                colId: 'charterCode',
                hide: false,
            }, {
                headerName: 'Invoice Type',
                field: 'documentType',
                colId: 'documentType',
                hide: true,
            },
            {
                headerName: 'Account Line Type Id',
                field: 'accountLineTypeId',
                colId: 'accountLineTypeId',
                hide: true,
            },
            {
                headerName: 'Transaction Direction ID',
                field: 'transactionDirectionId',
                colId: 'transactionDirectionId',
                hide: true,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                type: 'numericColumn',
                colId: 'amount',
                valueGetter: this.getAmountValue,
                hide: this.cashOption === false,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },
            {
                headerName: 'Amount',
                field: 'amount',
                type: 'numericColumn',
                colId: 'amount',
                valueGetter: this.getAmountValueForReceipts,
                hide: this.cashOption === true,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },
            {
                headerName: 'Amount To Be Paid',
                field: 'amountToBePaid',
                type: 'numericColumn',
                colId: 'amountToBePaid',
                editable: this.isAmountToBePaidEditable.bind(this),
                onCellValueChanged: this.onAmountToBePaidChange.bind(this),
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
            },

            {
                headerName: 'Amount Paid(different CCY)',
                field: 'amountPaidInDiffCcy',
                type: 'numericColumn',
                hide: true,
                colId: 'amountPaidInDiffCcy',
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
            },
            {
                headerName: 'Document Reference',
                field: 'documentReference',
                colId: 'documentReference',
                pinned: 'right',
                hide: false,
            },
            {
                headerName: '',
                field: 'isChecked',
                colId: 'isChecked',
                width: 40,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'right',
                checkboxSelection: true,
                headerCheckboxSelection: true,
            },
            {
                headerName: 'Invoice GLDate',
                field: 'invoiceGLDate',
                colId: 'invoiceGLDate',
                valueFormatter: this.dateFormatter.bind(this),
                hide: true,
            },
        ];
    }

    filterCurrencies() {
        let currencyList: Currency[] = [];
        this.filteredCurrencyList = this.masterData.currencies;
        currencyList = this.filteredCurrencyList;
        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                currencyList,
                ['currencyCode', 'description'],
            );
            if (this.currencyCtrl.valid) {
                this.onCurrencyChange();
            } else {
                this.docReferenceCtrl.reset();
            }
        });
    }
    filterBankCurrencies() {
        let bankCurrencyList: Currency[] = [];
        if (this.currencyCtrl.valid && this.currencyCtrl.value) {
            this.filteredBankCurrencylist = this.masterData.currencies.filter(
                (item) => item.currencyCode !== this.currencyCtrl.value,
            );
        } else {
            this.filteredBankCurrencylist = this.masterData.currencies;
        }
        bankCurrencyList = this.filteredBankCurrencylist;
        this.bankCurrencyCtrl.valueChanges.subscribe((input) => {
            this.filteredBankCurrencylist = this.utilService.filterListforAutocomplete(
                input,
                bankCurrencyList,
                ['currencyCode', 'description'],
            );
            if (this.bankCurrencyCtrl.valid) {
                this.onCurrencyChange();
            } else {
                this.docReferenceCtrl.reset();
            }
        });
    }
    isAmountToBePaidEditable(params) {
        if ((this.selectedValue === CashSelectionType.ReceiptFullPartialTransaction)
            || (this.selectedValue === CashSelectionType.PaymentFullPartialTransaction)
            || (this.selectedValue === CashSelectionType.PaymentDifferentClient)) {
            return params.node.selected ? true : false;
        } else {
            return false;
        }
    }

    onAmountToBePaidChange(params) {
        const list: any[] = [];
        let amountPrev: number = 0;
        // check for zero and -Ve numbers

        if (params.data.amountToBePaid < 0) {
            const amount = params.data.amount;
            params.node.setDataValue('amountToBePaid', amount);
            this.snackbarService.throwErrorSnackBar(
                'Amount to be paid can not be negative or zero.',
            );

        } else if (params.data.amountToBePaid > Math.abs(params.data.amount)) {
            params.node.setDataValue('amountToBePaid', '');
            params.node.setSelected(false);
            this.snackbarService.throwErrorSnackBar(
                'Amount to be paid must be less than or equal to absolute value of Amount.',
            );
        } else if (ConvertToNumber(params.data.amountToBePaid) < Math.abs(params.data.amount)) {
            const selectedRows: any[] = [];

            if (this.gridApi) {
                this.gridApi.forEachNode((item) => {
                    if (item.data.isChecked === true) {
                        selectedRows.push(item.data);
                    }
                });
            }

            selectedRows.forEach(
                (selectedInvoiceRow) => {
                    const amountToBePaid = selectedInvoiceRow.amountToBePaid ? selectedInvoiceRow.amountToBePaid : 0;

                    if (this.selectedValue === CashSelectionType.PaymentFullPartialTransaction
                        || this.selectedValue === CashSelectionType.PaymentDifferentClient) {

                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            this.totalBalance = this.totalBalance
                                - ConvertToNumber(amountToBePaid);
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            this.totalBalance = this.totalBalance
                                + ConvertToNumber(amountToBePaid);
                        } else {
                            // 20190506 - JEL - We are in JL  : Quickfix
                            if (amountToBePaid !== 0) {
                                this.totalBalance = this.totalBalance
                                    + ConvertToNumber(amountToBePaid) * Math.sign(selectedInvoiceRow.amount);
                            }
                        }

                        this.totalBalanceValue.emit({ value: this.totalBalance });

                    } else if (this.selectedValue === CashSelectionType.ReceiptFullPartialTransaction) {
                        amountPrev = this.totalAmount;

                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            list.push(ConvertToNumber(amountToBePaid));
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            amountPrev = this.totalAmount;
                            list.push(-ConvertToNumber(amountToBePaid));
                        } else {
                            // 20190506 - JEL - We are in JL  : Quickfix
                            // should take opposite sign of JL, but as the subsequent operation is substraction (-), it is already taken
                            if (amountToBePaid !== 0) {
                                list.push(+ ConvertToNumber(amountToBePaid) * Math.sign(selectedInvoiceRow.amount) * -1);
                            }
                        }
                    } else if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency) {
                        // We do nothing here, see invoice-matching.component.ts --> calculateBalanceWithCost() where the calculation is completed

                    } else if (this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
                        amountPrev = this.totalAmount;

                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            list.push(ConvertToNumber(selectedInvoiceRow.amountPaidInDiffCcy));
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            amountPrev = this.totalAmount;
                            list.push(-ConvertToNumber(selectedInvoiceRow.amountPaidInDiffCcy));
                        }
                    }
                });
            if (this.selectedValue === CashSelectionType.ReceiptFullPartialTransaction) {

                this.invoiceAmount = (list && list.length > 0) ?
                    amountPrev + list.map((a) => a).reduce((sum, current) => sum + current)
                    : this.totalAmount;

                this.invoiceAmountValue.emit({ value: this.invoiceAmount });
            }
        }
        // params.context.component.AmountEnterOrInvoiceSelection.emit();
    }

    getSelectedInvoices() {

        const selectedGridRows: any[] = [];
        if (this.gridApi) {
            this.gridApi.forEachNode((item) => {
                if (item.data.isChecked === true) {
                    selectedGridRows.push(item.data);
                }
            },
            );

            let invoiceStringBuilder: string = '';
            selectedGridRows.forEach(
                (selectedInvoiceRow) => {
                    invoiceStringBuilder += selectedInvoiceRow.externalReference + ' //';
                });
            invoiceStringBuilder = invoiceStringBuilder.slice(0, -3);
            this.setNarrative.emit(invoiceStringBuilder);
        }
    }

    invoiceForSearch() {
        if (this.invoiceForCashMatchingModel) {
            this.currencyCtrl.patchValue(this.invoiceForCashMatchingModel.currency);
            this.departmentsCtrl.patchValue(this.invoiceForCashMatchingModel.departmentCode);
        }
    }
    bindCounterpartyValues() {
        const selectedCounterparty = this.masterData.counterparties.filter(
            (counterparty) => counterparty.counterpartyCode === this.counterpartyValue,
        );
        this.counterpartyCtrl.patchValue(selectedCounterparty[0]);
        this.clientNameCtrl.patchValue(this.clientNameValue);
        this.counterpartyCtrl.disable();
        this.clientNameCtrl.disable();
    }
    bindCurrencyCardValues() {
        const selectedCurrency = this.masterData.currencies.filter(
            (currency) => currency.currencyCode === this.bankCurrencyValue,
        );
        this.bankCurrencyCtrl.patchValue(selectedCurrency[0]);
        this.fxRateCtrl.patchValue(this.fxRateValue);
        this.bankCurrencyCtrl.disable();
        this.fxRateCtrl.disable();
        this.divideMultiplyCtrl.patchValue(this.roeType);
        this.divideMultiplyCtrl.disable();
        this.isFXratesAvailableForCashCurrency = true;
        this.isValueBindedFromCurrencyComponent = true;
    }
    bindCurrencyValue(currencyValue) {
        const selectedCurrency = this.masterData.currencies.filter(
            (currency) => currency.currencyCode === currencyValue,
        );
        this.currencyCtrl.patchValue(selectedCurrency[0]);
        this.currencyCtrl.disable();
    }
    bindDepartmentValue() {
        const selectedDepartment = this.masterData.departments.filter(
            (department) => department.departmentId.toString() === this.departmentId,
        );
        this.departmentsCtrl.patchValue(selectedDepartment[0]);
        this.departmentsCtrl.disable();
        const selectedDepartments = this.departmentsCtrl;
        if (selectedDepartments) {
            this.departmentValue = selectedDepartments.value;
        }
    }
    getAmountValue(params) {
        const commonMethods = new CommonMethods();
        return params.data.amount *
            commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                (params.data.documentType, CashType.CashPayment, params.data, true);
    }
    getAmountValueForReceipts(params) {
        const commonMethods = new CommonMethods();
        return params.data.amount *
            commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                (params.data.documentType, CashType.CashReceipt, params.data, true);
    }
    dateFormatter(param) {
        if (param.value) { return this.formatDate.transform(param.value); }
    }

    amountFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value);
        }
    }

    onSelectionChanged(event) {
        event.data.isChecked = event.node.selected;
        if (event.node.selected) {
            if (event.data.amountToBePaid === 0) {
                event.node.setDataValue('amountToBePaid', Math.abs(event.data.amount));
            } else {
                event.node.setDataValue('amountToBePaid', event.data.amountToBePaid);

            }
        } else {
            event.node.setDataValue('amountToBePaid', 0);
        }
        if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency
            || this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
            if (event.node.selected) {
                if (this.roeType === 'D') {
                    event.data.amountPaidInDiffCcy =
                        (event.data.amountToBePaid / ConvertToNumber(this.fxRateCtrl.value)).toFixed(2);
                } else if (this.roeType === 'M') {
                    event.data.amountPaidInDiffCcy =
                        (event.data.amountToBePaid * ConvertToNumber(this.fxRateCtrl.value)).toFixed(2);
                }
                event.node.setDataValue('amountPaidInDiffCcy', event.data.amountPaidInDiffCcy);
            } else {
                event.node.setDataValue('amountPaidInDiffCcy', '');
            }
        }
        this.totalBalance = 0;
        this.formattedBalance = 0;

        if (this.selectedValue === CashSelectionType.ReceiptFullPartialTransaction
            || this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
            this.invoiceAmount = ConvertToNumber(this.totalAmount.toFixed(2));
        }

        const selectedRows: any[] = [];
        if (this.gridApi) {
            this.gridApi.forEachNode((item) => {
                if (item.data.isChecked === true) {
                    selectedRows.push(item.data);
                }
            });
        }
        if (this.calculateAmountOrBalanceForInvoiceSelected) {
            this.calculateAmountOrBalanceForInvoiceSelected(selectedRows);
        }
        this.isInvoiceSelected = selectedRows.length > 0;
        this.invoiceSelected.emit(this.isInvoiceSelected);
        this.selectedInvoiceToMatch = selectedRows;
        // this.AmountEnterOrInvoiceSelection.emit();
    }

    populateEntity(entity: any): any {
        const cashRecord = entity as CashRecord;
        cashRecord.matchFlagId = this.matchFlagId;

        const selectedRows: any[] = [];

        this.gridApi.forEachNode((item) => {
            if (item.data.isChecked === true) {
                selectedRows.push(item.data);
            }
        },
        );
        cashRecord.documentMatchings = selectedRows;
        this.selectedInvoiceToMatch = selectedRows;

        // NOTE: As currently we have fxrates convertion for only USD=>other ccy (i.e. EUR or AED)

        if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency ||
            this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
            cashRecord.currencyCode = (this.bankCurrencyCtrl.value as Currency).currencyCode;
            cashRecord.matchingRate = this.fxRateCtrl.value;
            cashRecord.matchingRateType = this.roeType;

            cashRecord.cashCurrencyRate = this.fxRateCtrl.value;
            cashRecord.cashCurrencyRoeType = this.roeType;
            cashRecord.cashCurrencyCode = (this.bankCurrencyCtrl.value as Currency).currencyCode;
        } else {
            cashRecord.cashCurrencyRate = this.cashCurrencyRate;
            cashRecord.cashCurrencyRoeType = this.cashCurrencyRoeType === 'M' ? 'D' : 'M';
            cashRecord.cashCurrencyCode = this.cashCurrencyCode;
        }
        return cashRecord;
    }
    onCounterpartySelected(counterpartySelected: Counterparty) {
        if (counterpartySelected) {
            this.clientNameCtrl.patchValue(
                counterpartySelected.description,
            );
            this.counterpartyValue = counterpartySelected.counterpartyCode;
        }
        this.clientNameCtrl.disable();
    }

    onDocumentReferenceSelection() {
        this.setDetailsOndocumentReferenceSelection();
    }

    onKeydown(event) {
        this.setDetailsOndocumentReferenceSelection();
    }

    setDetailsOndocumentReferenceSelection() {
        this.clearInvoiceSelection();

        if (!this.docReferenceCtrl.valid) {
            return;
        }

        this.isLoading = true;
        const documentReference = (this.docReferenceCtrl.value as InvoiceForCashMatching).invoiceDocumentReference;
        if (documentReference) {
            this.getInvoiceByDocumentReferenceSubscription = this.executionService.getInvoiceToMatchByDocumentReference(documentReference)
                .subscribe((data) => {
                    if (data && data.value.length > 0) {
                        this.cashSelectionModel = data.value[0];
                        this.filteredClientRefCurrency = data.value[0];
                        this.bindDropdownListsFromEntity(
                            this.cashSelectionModel.counterPartyId,
                            this.cashSelectionModel.currencyCode,
                            this.cashSelectionModel.departmentId);
                        this.onSearchButtonClicked();
                    }
                    this.isLoading = false;
                });
        } else {
            this.isLoading = false;
        }
    }

    onDocumentReferenceSelected(documentReference: string) {
        this.setDetailsOndocumentReferenceSelection();
    }
    onBankCurrencyEntered(bankCurrency: Currency) {
        this.currencyFrom = (this.currencyCtrl.value as Currency).currencyCode;
        this.currencyTo = bankCurrency.currencyCode;
        if (!this.isValueBindedFromCurrencyComponent) {
            this.isLoading = true;
            this.executionService.getForeignExchangeRateByCurrency(this.currencyFrom, this.currencyTo).subscribe((data) => {
                if (data) {
                    this.cashSelectionModel = data;

                    this.fxRateCtrl.setValue(this.cashSelectionModel.rate);
                    this.actualFxrateValue = ConvertToNumber(this.fxRateCtrl.value);
                    this.tolarence = this.fxRateCtrl.value * 0.1;
                    this.divideMultiplyCtrl.patchValue(this.cashSelectionModel.roeType);
                    this.roeType = this.cashSelectionModel.roeType;
                    this.isFXratesAvailableForCashCurrency = true;
                } else {

                    this.fxRateCtrl.reset();
                    this.divideMultiplyCtrl.reset();
                    this.snackbarService.throwErrorSnackBar('FX Rate details not available for these currencies.');
                    this.isFXratesAvailableForCashCurrency = false;
                }
                this.isLoading = false;

            });
        }
    }
    onCurrencyOptionSelected(currencyValue: Currency) {
        this.clearInvoiceSelection();
        this.currencyRoeType = currencyValue.roeType;
        this.fxRateCtrl.reset();
        this.bankCurrencyCtrl.reset();
        this.currencySelected.emit(currencyValue.currencyCode);
        // bind bank currency except selected matching currency
        this.filterBankCurrencies();

    }
    onDivideOptionSelected() {
        if (this.roeType === 'D') {
            return true;
        } else { return false; }
    }
    onMultiplyOptionSelected() {
        if (this.roeType === 'M') {
            return true;
        } else {
            return false;
        }
    }
    onDivideMultiplyToggleChanges(type) {

    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            counterpartyCtrl: this.counterpartyCtrl,
            clientNameCtrl: this.clientNameCtrl,
            currencyCtrl: this.currencyCtrl,
            departmentCodeCtrl: this.departmentsCtrl,
            docReferenceCtrl: this.docReferenceCtrl,
            secDocReferenceCtrl: this.secDocReferenceCtrl,
        });
        return super.getFormGroup();
    }
    populateInvoices(value: any) {
        const invoicesForMatching = new InvoiceForCashMatching();
        invoicesForMatching.invoiceDocumentReference = value.invoiceDocumentReference;
        return invoicesForMatching;
    }
    bindDropdownListsFromEntity(
        counterpartyId: number, currencyCode: string, departmentId: number) {
        if (counterpartyId) {
            const counterparty = this.masterData.counterparties.filter(
                (item) => item.counterpartyID === counterpartyId,
            );
            if (counterparty.length > 0) {
                this.counterpartyCtrl.setValue(counterparty[0]);
                this.clientNameCtrl.setValue(counterparty[0].description);
                this.counterpartyValue = counterparty[0].counterpartyCode;
            }
        }

        if (currencyCode) {
            const currency = this.masterData.currencies.filter(
                (item) => item.currencyCode === currencyCode,
            );
            this.currencyCtrl.setValue(currency[0]);
            this.currencyValue = currencyCode;
            this.currencySelected.emit(this.currencyValue);
            this.filterBankCurrencies();
        }

        if (departmentId) {
            const department = this.masterData.departments.filter(
                (item) => item.departmentId === departmentId,
            );
            if (department.length > 0) {
                this.departmentsCtrl.setValue(department[0]);
            }
        }
    }

    populateData(values: CashMatching[]) {
        if (values && values.length > 0) {

            values.forEach((item) => {
                item.paymentTermCode = this.getPaymentTermCode(item);
                item.departmentCode = this.bindDepartmentDetails(item.departmentId);
            });

            // fetch charter details
            this.executionService.getCharters()
                .subscribe((charterdata) => {
                    if (charterdata.value) {
                        this.charters = charterdata.value.map((charter) =>
                            new CharterDisplayView(charter));
                        values.forEach((item) => {
                            item.charterCode = this.getCharterReference(item);
                        });
                    }
                });

        }
        return values;
    }

    getCharterReference(entity: CashMatching) {
        if (entity.charterId && this.charters && this.charters.length > 0) {
            const filteredCharter = this.charters.filter((item) => item.charterId === entity.charterId);
            if (filteredCharter.length > 0) {
                return filteredCharter[0].charterCode;
            }
        }
        return '';
    }

    getPaymentTermCode(entity: CashMatching): string {
        if (entity && entity.paymentTermId) {
            const paymentTerm = this.masterData.paymentTerms.filter(
                (item) => item.paymentTermsId === entity.paymentTermId,
            );
            entity.paymentTermCode = paymentTerm.length > 0 ? paymentTerm[0].paymentTermCode : '';
        }
        return entity.paymentTermCode;
    }
    initForm(entity: CashRecord, isEdit: boolean): any {
        if (entity.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
            entity.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
            this.bindDropdownListsFromEntity(
                entity.counterPartyId, entity.matchingCurrency, entity.departmentId);
        } else {
            this.bindDropdownListsFromEntity(
                entity.counterPartyId, entity.currencyCode, entity.departmentId);
        }

        if (entity.documentMatchings && entity.documentMatchings.length > 0) {
            this.selectedValue = entity.cashTypeId;
            this.isEdit = isEdit ? true : false;
            this.matchFlagId = entity.matchFlagId;

            // if the cashtype is for diff CCY
            if (entity.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
                entity.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {

                this.bankCurrencyCtrl.patchValue(entity.currencyCode);
                this.fxRateCtrl.patchValue(entity.matchingRate);
                this.divideMultiplyCtrl.patchValue(entity.matchingRateType);
                this.roeType = entity.matchingRateType;
                // assign total amount value
                this.totalAmount = entity.amount;
                this.isFXratesAvailableForCashCurrency = true;
                this.currencySelected.emit(entity.currencyCode);
            } else if (entity.cashTypeId === CashSelectionType.ReceiptFullPartialTransaction) {
                this.totalAmount = entity.amount;
                this.currencySelected.emit((this.currencyCtrl.value as Currency).currencyCode);
            }
            this.onSearchButtonClicked();
        }
        return entity;
    }

    getCounterpartyDetails(masterData: MasterData, value: any, isFilterBasedOnCounterpartyId: boolean) {
        const counterparty = masterData.counterparties.filter((item) =>
            isFilterBasedOnCounterpartyId ?
                item.counterpartyID === value
                : item.counterpartyCode === value);

        if (counterparty.length > 0) {
            return counterparty;
        }
    }

    onDepartmentCodeSelected(departmentCode: string) {
        this.clearInvoiceSelection();

        const selectedDepartments = this.masterData.departments.find(
            (department) => department.departmentCode === departmentCode,
        );
        this.departmentValue = (selectedDepartments) ?
            selectedDepartments.departmentId : this.departmentValue = null;
    }

    getDepartment(departmentCode: string, departmentId: number) {
        const department = this.masterData.departments.filter(
            (item) => (departmentCode && departmentCode !== null) ? item.departmentCode === departmentCode :
                item.departmentId === departmentId,
        );
        if (department.length > 0) {
            return department;
        }
    }

    bindDepartmentDetails(departmentId: number) {
        const department = this.getDepartment(null, departmentId);

        return (department && department.length > 0) ? department[0].departmentCode + ' | ' + department[0].description : null;

    }

    clearDropdownControls() {
        this.counterpartyCtrl.reset();
        this.departmentsCtrl.reset();
        this.currencyCtrl.reset();
        this.clientNameCtrl.reset();
    }

    // clear invoice list if any searchable control values changes
    clearInvoiceSelection() {
        this.clearInvoiceGrid();
        if (this.cashTypeId === CashType.CashPayment) {
            this.totalAmount = 0;
            this.totalBalance = 0;
        }
    }

    clearAllControls() {
        this.clearDropdownControls();
        this.clearInvoiceSelection();
        this.docReferenceCtrl.reset();
        this.secDocReferenceCtrl.reset();
        this.bankCurrencyCtrl.reset();
        this.fxRateCtrl.reset();
        this.divideMultiplyCtrl.reset();
    }

    calculateFxrateTolarenceValue(): boolean {

        const modifiedFxRate = this.fxRateCtrl.value;
        this.maxFxRateValue = this.actualFxrateValue * 1.1;
        this.minFxRateValue = this.actualFxrateValue * 0.9;
        if ((modifiedFxRate > this.maxFxRateValue) || (modifiedFxRate < this.minFxRateValue)) {
            return false;
        } else {
            return true;
        }
    }

    isDocumentTypePurchaseInvoiceOrCreditNote(documentType: string): boolean {
        if (documentType) {
            return documentType === TransactionDocument.PurchaseInvoice ||
                documentType === TransactionDocument.CreditNote
                ? true : false;
        }
    }

    isDocumentTypeSalesInvoiceOrDebitNote(documentType: string): boolean {
        if (documentType) {
            return documentType === TransactionDocument.SalesInvoice ||
                documentType === TransactionDocument.DebitNote
                ? true : false;
        }
    }

    // this method is used to calculate totalamount or totalbalance when invoices are selected.
    calculateAmountOrBalanceForInvoiceSelected(selectedRows: any[]) {
        if (selectedRows && selectedRows.length > 0) {
            selectedRows.forEach(
                (selectedInvoiceRow) => {
                    const amountToBePaid = selectedInvoiceRow.amountToBePaid ? selectedInvoiceRow.amountToBePaid : 0;
                    if (this.selectedValue === CashSelectionType.PaymentFullPartialTransaction
                        || this.selectedValue === CashSelectionType.PaymentDifferentClient) {
                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            this.totalBalance -= amountToBePaid;
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            this.totalBalance += amountToBePaid;
                        } else {
                            // 20190506 - JEL - We are in JL  : Quickfix
                            if (amountToBePaid !== 0) {
                                this.totalBalance = this.totalBalance
                                    + ConvertToNumber(amountToBePaid) * Math.sign(selectedInvoiceRow.amount);
                            }
                        }
                    } else if (this.selectedValue === CashSelectionType.ReceiptFullPartialTransaction) {
                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            this.invoiceAmount += ConvertToNumber(amountToBePaid);
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            this.invoiceAmount -= ConvertToNumber(amountToBePaid);
                        } else {
                            // 20190506 - JEL - We are in JL  : Quickfix
                            if (amountToBePaid !== 0) {
                                this.invoiceAmount = this.invoiceAmount
                                    + ConvertToNumber(amountToBePaid) * Math.sign(selectedInvoiceRow.amount) * -1;
                            }
                        }
                    } else if (this.selectedValue === CashSelectionType.PaymentDifferentCurrency) {
                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            this.totalBalance -= ConvertToNumber(selectedInvoiceRow.amountPaidInDiffCcy);
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            this.totalBalance += selectedInvoiceRow.amountPaidInDiffCcy;
                        }
                    } else if (this.selectedValue === CashSelectionType.ReceiptDifferentCurrency) {
                        if (this.isDocumentTypePurchaseInvoiceOrCreditNote(selectedInvoiceRow.documentType)) {
                            this.invoiceAmount += ConvertToNumber(selectedInvoiceRow.amountPaidInDiffCcy);
                        } else if (this.isDocumentTypeSalesInvoiceOrDebitNote(selectedInvoiceRow.documentType)) {
                            this.invoiceAmount -= ConvertToNumber(selectedInvoiceRow.amountPaidInDiffCcy);
                        }
                    }

                });
            this.totalBalance = ConvertToNumber(Number(this.totalBalance).toFixed(2));
            this.invoiceAmount = ConvertToNumber(Number(this.invoiceAmount).toFixed(2));

            this.totalBalanceValue.emit({ value: this.totalBalance });
            this.invoiceAmountValue.emit({ value: this.invoiceAmount });
        }
    }

    clearInvoiceGrid() {
        this.invoiceSelected.emit(false);
        this.isInvoiceSelected = false;
        if (this.gridApi) {
            this.gridApi.setRowData([]);
        }
    }

    // when amount is changed in details page after invoice selection
    reCalculateTotalAmountBasedonUpdatedAmountValue() {
        this.AmountEnterOrInvoiceSelection.emit();
    }

    setSearchFieldsSize() {
        if (this.selectedValue === CashSelectionType.ReceiptDifferentCurrency
            || this.selectedValue === CashSelectionType.PaymentDifferentCurrency) {
            this.clientNameWidth = '25%';
            this.secDocReferenceWidth = '14%';
        } else {
            this.clientNameWidth = '30%';
            this.secDocReferenceWidth = '18%';
        }
    }

    isSearchRequired(): boolean {
        return (!this.isSearchApplied
            || !this.selectedInvoiceToMatch
            || (this.selectedInvoiceToMatch && this.selectedInvoiceToMatch.length === 0));
    }
}
