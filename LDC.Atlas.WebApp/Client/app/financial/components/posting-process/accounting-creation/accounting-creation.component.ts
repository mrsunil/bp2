import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgGridContextualSearchComponent } from '../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { CellEditorNumericComponent } from '../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GridEnlargementComponent } from '../../../../shared/components/grid-enlargement/grid-enlargement.component';
import { inDropdownListValidator } from '../../../../shared/directives/autocomplete-dropdown.directive';
import { SectionSearchResult } from '../../../../shared/dtos/section-search-result';
import { TransactionDocumentSearchResult } from '../../../../shared/dtos/transaction-document-search-result';
import { AccountLineType } from '../../../../shared/entities/account-line-type.entity';
import { AccountingSetup } from '../../../../shared/entities/accounting-setup.entity';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { AtlasNumber } from '../../../../shared/entities/atlas-number.entity';
import { Charter } from '../../../../shared/entities/charter.entity';
import { Commodity } from '../../../../shared/entities/commodity.entity';
import { CostType } from '../../../../shared/entities/cost-type.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { Currency } from '../../../../shared/entities/currency.entity';
import { Department } from '../../../../shared/entities/department.entity';
import { ListAndSearchFilter } from '../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ManualJournalLine } from '../../../../shared/entities/manual-journal-document-line.entity';
import { ManualJournalDocument } from '../../../../shared/entities/manual-journal-document.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { UserGridPreferencesParameters } from '../../../../shared/entities/user-grid-preferences-parameters.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { PostingDocumentType } from '../../../../shared/enums/posting-document-type.enum';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../shared/services/authorization/dtos/user-company-privilege';
import { CharterDataLoader } from '../../../../shared/services/execution/charter-data-loader';
import { ManualJournalResponse } from '../../../../shared/services/execution/dtos/manual-journal-response';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { TradeDataLoader } from '../../../../shared/services/list-and-search/trade-data-loader';
import { TransactionDocumentDataLoader } from '../../../../shared/services/preaccounting/transaction-document-data-loader';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UiService } from '../../../../shared/services/ui.service';
import { nameof, UtilService } from '../../../../shared/services/util.service';
import { isDateTwoBeforeDateOne } from '../../../../shared/validators/date-validators.validator';
import { AccountingFileUploadDialogBoxComponent } from '../accounting-file-upload/accounting-file-upload-dialog-box/accounting-file-upload-dialog-box.component';
import { ItemConfigurationProperties } from './../../../..//shared/entities/form-configuration.entity';
import { AgContextualMenuComponent } from './../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridAccrualNumberComponent } from './../../../../shared/components/ag-grid-accrual-number/ag-grid-accrual-number.component';
import { FxDealSearchResult } from './../../../../shared/dtos/fxDeal-search-result';
import { AccountingImportReport } from './../../../../shared/entities/accountingImportReport.entity';
import { Branch } from './../../../../shared/entities/branch.entity';
import { Company } from './../../../../shared/entities/company.entity';
import { NominalAccount } from './../../../../shared/entities/nominal-account.entity';
import { Province } from './../../../../shared/entities/province.entity';
import { AllNumberMask, CustomNumberMask } from './../../../../shared/numberMask';
import { AccountingDocumentService } from './../../../../shared/services/http-services/accounting-document.service';
import { FormConfigurationService } from './../../../../shared/services/http-services/form-configuration.service';
import { FxDealDataLoader } from './../../../../shared/services/list-and-search/fxDeal-data-loader';
import { AccountingEditBaseComponent } from './../accounting-edit-base/accounting-edit-base.component';
import { AccountingWarningErrorMsgDialogComponent } from './accounting-warning-error-msg-dialog/accounting-warning-error-msg-dialog.component';
const moment = _moment;

@Component({
    selector: 'atlas-accounting-creation',
    templateUrl: './accounting-creation.component.html',
    styleUrls: ['./accounting-creation.component.scss'],
    providers: [TradeDataLoader, CharterDataLoader, TransactionDocumentDataLoader, FxDealDataLoader, DatePipe],
})
export class AccountingCreationComponent extends AccountingEditBaseComponent implements OnInit, OnDestroy {
    @ViewChild('accountingFileUploadDialogBoxComponent') accountingFileUploadDialogBoxComponent: AccountingFileUploadDialogBoxComponent;
    @ViewChild('gridZoom') gridEnlargementComponent: GridEnlargementComponent;
    accountingEntryTypeCtrl = new AtlasFormControl('accountingEntryTypeCtrl');
    docDateFormCtrl = new AtlasFormControl('docDateFormCtrl');
    valueDateFormCtrl = new AtlasFormControl('valueDateFormCtrl');
    accPeriodFormCtrl = new AtlasFormControl('accPeriodFormCtrl');
    currencyCtrl = new AtlasFormControl('currencyCtrl');
    addNewLineCtrl = new AtlasFormControl('addNewLineCtrl');
    interfaceCtrl = new AtlasFormControl('interfaceCtrl');
    authForCtrl = new AtlasFormControl('authForCtrl');
    createDocumentFormGroup: FormGroup;

    createAccountingDocumentLines: ManualJournalLine[] = [];
    manualJournalDocument: ManualJournalDocument;
    accountingDocTypeSelected: string = 'regularJournal';
    accrualDocTypeSelected: string = 'accrual';
    accrualNumberColumn: string = 'accrualNumber';
    dealNumberColumn: string = 'dealNumber';
    settlementCurrencyColumn: string = 'settlementCurrency';
    clientAccountColumn: string = 'clientAccountId';
    secondaryDocumentReferenceColumn: string = 'secondaryDocumentReference';
    externalDocumentReferenceColumn: string = 'externalDocumentReference';
    costCenterColumn: string = 'costCenter';
    provinceColumn: string = 'provinceId';
    branchColumn: string = 'branchId';
    amountColumn: string = 'amount';
    quantityColumn: string = 'quantity';
    requiredString: string = 'Required*';
    nominalAccount: string = 'accountReferenceId';
    isAccrualSelected: boolean = false;
    isMtmSelected: boolean = false;
    isSave: boolean = false;
    noErrorMessage: string = 'noError';
    createLineMenu: string = 'createLineMenu';
    isLoadingassign: boolean = false;
    screenName: string = 'ManualDocumentCreation';
    userActiveDirectoryName: string;

    filteredNominalAccountList: NominalAccount[];
    filteredCurrencyList: Currency[];
    filteredSettlementCurrencyList: Currency[];
    filteredDepartmentList: Department[];
    filteredCommodityList: Commodity[];
    filteredCostTypeList: CostType[];
    filteredCounterpartyList: Counterparty[];
    filteredCharterList: Charter[];
    filteredProvinceList: Province[];
    filteredBranchList: Branch[];
    filteredDocuments: TransactionDocumentSearchResult[];
    filteredContracts: SectionSearchResult[];
    filteredFxDeals: FxDealSearchResult[];
    filteredCharter: Charter[];
    nominalAccountFound: NominalAccount;
    filteredAccountLineType: AccountLineType[];
    filteredAccountLineTypeForMtm: AccountLineType[] = [];
    mappingFields = new Array();
    isLoadingassignOnLoad: boolean = true;
    accountLineTypes: AccountLineType[];
    accountingSetupModel: AccountingSetup;
    accountLineTypesForMandatoryClientAccount: AccountLineType[];
    createAccountingDocumentGridContextualMenuActions: AgContextualMenuAction[];
    masterdata: MasterData;
    atlasAgGridParam: AtlasAgGridParam;
    defaultLines: number = 20;
    accountingDate: Date;
    totalAmount: number = 0;
    operationsLastMonthClosed: Date;
    lastMonthClosed: Date;
    monthNameForlastMonthClosed: string;
    monthNameForoperationsLastMonthClosed: string;
    documentDateSelected: Date;
    isSummaryView: boolean = false;
    accountCreationConfiguration: ItemConfigurationProperties[] = new Array<ItemConfigurationProperties>();
    selectedAccountingDate: _moment.Moment = this.companyManager.getCurrentCompanyDate();
    postOpClosedPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'POSTOPCLOSED',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'POSTINGMGT',
    };
    monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    currencyErrorMap: Map<string, string> = new Map()
        .set('required', 'This field is required')
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');

    createDocumentMenuActions: { [key: string]: string } = {
        copyDocumentLine: 'copy',
        deleteDocumentLine: 'delete',
    };

    subscription: Subscription[] = [];
    agGridOptions: agGrid.GridOptions = {};
    columnDefs: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    company: string;
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };
    companyConfiguration: Company;
    selectedDocType = '.csv';
    selectedFile: File;
    progressbar: boolean;
    objectKeys = Object.keys;
    disableConfirmImport: boolean = false;
    gridPreferencesParameters: UserGridPreferencesParameters;

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected companyManager: CompanyManagerService,
        private uiService: UiService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public tradeDataLoader: TradeDataLoader,
        public fxDealLoader: FxDealDataLoader,
        public charterDataLoader: CharterDataLoader,
        public transactionDocumentDataLoader: TransactionDocumentDataLoader,
        private snackbarService: SnackbarService,
        private executionService: ExecutionService,
        private preaccountingService: PreaccountingService,
        protected dialog: MatDialog,
        private router: Router,
        private location: Location,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        private formConfigurationService: FormConfigurationService,
        public gridService: AgGridService,
        private titleService: TitleService,
        private accountingDocumentService: AccountingDocumentService,

    ) {
        super(formConfigurationProvider);
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;

    }

    ngOnInit() {

        this.formConfigurationService.getMandatoryFieldsConfigurationForFinancial().subscribe((templates) => {
            this.accountCreationConfiguration = templates.value;
          

        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.accountingEntryTypeCtrl.patchValue(this.accountingDocTypeSelected);
        this.docDateFormCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.accPeriodFormCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.interfaceCtrl.patchValue(true);
        this.authForCtrl.patchValue(false);
        this.addNewLineCtrl.patchValue(1);
        this.filteredNominalAccountList = this.masterdata.nominalAccounts.map(
            (nominal) => {
                nominal.accountNumber = nominal.accountNumber;
                nominal.mainAccountTitle = nominal.shortDescription;
                return nominal;
            });
        this.filteredCurrencyList = this.masterdata.currencies;
        this.filteredSettlementCurrencyList = this.filteredCurrencyList;
        this.filteredDepartmentList = this.masterdata.departments;
        this.filteredCommodityList = this.masterdata.commodities;
        this.filteredCostTypeList = this.masterdata.costTypes;
        this.filteredCounterpartyList = this.masterdata.counterparties;
        this.filteredAccountLineType = this.masterdata.accountLineTypes;
        this.filteredProvinceList = this.masterdata.provinces;
        this.filteredBranchList = this.masterdata.branches;
        this.transactionDocumentDataLoader.getData().subscribe((documents) => {
            this.filteredDocuments = documents;
        });
        this.charterDataLoader.getData().subscribe((charter) => {
            this.filteredCharter = charter;
        });

        const filterList: ListAndSearchFilter[] = [];
        this.tradeDataLoader.getData(filterList).subscribe((trade) => {
            this.filteredContracts = trade.value;
        });
        this.fxDealLoader.getData(filterList).subscribe((fxDeal) => {
            this.filteredFxDeals = fxDeal.value;
        });
        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.currencies,
                ['currencyCode', 'description'],
            );
        });

        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
                if (this.accountingSetupModel) {
                    this.operationsLastMonthClosed = moment(this.accountingSetupModel.lastMonthClosedForOperation).toDate();
                    this.lastMonthClosed = moment(this.accountingSetupModel.lastMonthClosed).toDate();
                    this.monthNameForlastMonthClosed = this.monthNames[this.lastMonthClosed.getMonth()];
                    this.monthNameForoperationsLastMonthClosed = this.monthNames[this.operationsLastMonthClosed.getMonth()];
                }
            }));

        this.init();
        this.initializeGridColumns();
        this.setValidators();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        const defaultCurrency = this.masterdata.currencies.find(
            (fb) => fb.currencyCode === this.companyConfiguration.functionalCurrencyCode,
        );
        this.currencyCtrl.setValue(
            defaultCurrency,
        );
        this.getFormGroup();
        
        });
    }

    init() {
        this.createAccountingDocumentGridContextualMenuActions = [
            {
                icon: 'content_copy',
                text: 'Copy Line',
                action: this.createDocumentMenuActions.copyDocumentLine,
            },
            {
                icon: 'delete',
                text: 'Delete Line',
                action: this.createDocumentMenuActions.deleteDocumentLine,
            },
        ];

        this.gridPreferencesParameters = {
            company: null,
            gridId: null,
            gridOptions: null,
            savingEnabled: false,
            sharingEnabled: false,
            showExport: false,
        };
    }

    canDeactivate() {
        if (this.createDocumentFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty && !this.isSummaryView) {
                return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
            }
        });
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.createDocumentFormGroup.dirty) {
            $event.returnValue = true;
        }
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty && !this.isSummaryView) {
                $event.returnValue = true;
            }
        });
    }

    getFormGroup() {
        this.createDocumentFormGroup = this.formBuilder.group({
            currencyCtrl: this.currencyCtrl,
            docDateFormCtrl: this.docDateFormCtrl,
            valueDateFormCtrl: this.valueDateFormCtrl,
            accPeriodFormCtrl: this.accPeriodFormCtrl,
        });
        return super.getFormGroup();
    }

    documentDateChanged(event) {
        this.documentDateSelected = (event.value as _moment.Moment).toDate();
        const accPeriodDate = (this.accPeriodFormCtrl.value as _moment.Moment).toDate();
        if (accPeriodDate.getFullYear() < this.documentDateSelected.getFullYear()
            || (accPeriodDate.getFullYear() <= this.documentDateSelected.getFullYear()
                && accPeriodDate.getMonth() < this.documentDateSelected.getMonth())) {
            this.snackbarService.throwErrorSnackBar('A/c period should not be before doc. Date');
        } else {
            let throwErrorNotOpenMonth = false;
            let throwErrorAccountingPeriod = false;
            const isSameMonthAndYearThanOperationsLastMonthClosed = event.value.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.value.month() === this.operationsLastMonthClosed.getMonth();
            const isLessOrEqualToLastMonthClosed = (event.value.year() === this.lastMonthClosed.getFullYear()
                && event.value.month() <= this.lastMonthClosed.getMonth())
                || (event.value.year() < this.lastMonthClosed.getFullYear());
            const isSameYearLessMonthThanOperationsLastMonthClosed = event.value.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.value.month() < this.operationsLastMonthClosed.getMonth();
            const isAccountingAndOperationMonthSame = this.operationsLastMonthClosed.getFullYear() === this.lastMonthClosed.getFullYear()
                && this.operationsLastMonthClosed.getMonth() === this.lastMonthClosed.getMonth();
            // Regular Journal Rules
            if (!this.isAccrualSelected && !this.isMtmSelected) {
                // Date within a closed period
                if (isLessOrEqualToLastMonthClosed) {
                    throwErrorAccountingPeriod = true;
                    if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                        if (isAccountingAndOperationMonthSame) {
                            this.accPeriodFormCtrl.patchValue(moment(new Date(new Date(this.operationsLastMonthClosed).
                                setMonth(this.operationsLastMonthClosed.getMonth() + 1))));
                        } else {
                            this.accPeriodFormCtrl.patchValue(moment(this.accountingSetupModel.lastMonthClosedForOperation));
                        }
                    } else {
                        this.accPeriodFormCtrl.patchValue(this.companyManager.getCurrentCompanyDate());
                    } // Date within the last month closed for operation
                } else if (isSameMonthAndYearThanOperationsLastMonthClosed) {
                    if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                        this.accPeriodFormCtrl.patchValue(moment(this.accountingSetupModel.lastMonthClosedForOperation));
                    } else {
                        throwErrorAccountingPeriod = true;
                        this.accPeriodFormCtrl.patchValue(moment(new Date(new Date(this.operationsLastMonthClosed).
                            setMonth(this.operationsLastMonthClosed.getMonth() + 1))));
                    }  // Date between last closed accounting period – last month closed for operation
                } else if (this.checkIfBetweenLastClosedAndOperations(event.value)) {
                    if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                        this.accPeriodFormCtrl.patchValue(event.value);
                    } else {
                        this.accPeriodFormCtrl.patchValue(moment(new Date(new Date(this.operationsLastMonthClosed).
                            setMonth(this.operationsLastMonthClosed.getMonth() + 1))));
                    }
                } else if (!this.checkIfBetweenLastClosedAndOperations(event.value) &&
                    isSameYearLessMonthThanOperationsLastMonthClosed) {
                    throwErrorNotOpenMonth = true;
                } // Accrual Document date Rules
            } else {
                const todayDate = this.companyManager.getCurrentCompanyDate();
                if (isLessOrEqualToLastMonthClosed) {
                    this.snackbarService.informationSnackBar('Document date cannot be in a closed period');
                    this.docDateFormCtrl.patchValue('');
                } else if ((event.value <= this.companyManager.getCurrentCompanyDate() || event.value.month() === todayDate.month()) &&
                    !(event.value.date() === new Date(event.value.year(), event.value.month() + 1, 0).getDate())) {
                    this.snackbarService.throwErrorSnackBar('Document date must be a last month day');
                    this.docDateFormCtrl.patchValue('');
                } else if (event.value.year() === todayDate.year() && event.value.month() > todayDate.month()) {
                    this.snackbarService.throwErrorSnackBar('Document date cannot be in the future');
                    this.docDateFormCtrl.patchValue('');
                } else if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
                    this.checkIfBetweenLastClosedAndOperations(event.value)) {
                    throwErrorAccountingPeriod = true;
                    this.accPeriodFormCtrl.patchValue(event.value);
                } else if (!this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
                    isSameMonthAndYearThanOperationsLastMonthClosed) {
                    throwErrorNotOpenMonth = true;
                    this.docDateFormCtrl.patchValue('');
                } else if (!this.checkIfBetweenLastClosedAndOperations(event.value) &&
                    isSameYearLessMonthThanOperationsLastMonthClosed) {
                    this.docDateFormCtrl.patchValue('');
                    this.accPeriodFormCtrl.patchValue('');
                    throwErrorNotOpenMonth = true;
                } else {
                    this.accPeriodFormCtrl.patchValue(event.value);
                }
            }
            if (throwErrorNotOpenMonth) {
                this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
            }
            if (throwErrorAccountingPeriod) {
                this.snackbarService.informationSnackBar('Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + ' ; please check the accounting period');
            }
        }
    }

    checkIfBetweenLastClosedAndOperations(date: _moment.Moment): boolean {
        let matchingMonthFound: boolean = false;
        for (let i = 1; i <= this.accountingSetupModel.numberOfOpenPeriod; i++) {
            if (!matchingMonthFound) {
                if (date.year() === this.lastMonthClosed.getFullYear() &&
                    this.lastMonthClosed.getMonth() + i < 12 && date.month() === this.lastMonthClosed.getMonth() + i) {
                    matchingMonthFound = true;
                } else if (date.year() === this.lastMonthClosed.getFullYear() + 1 &&
                    this.lastMonthClosed.getMonth() + i >= 12 && date.month() === this.lastMonthClosed.getMonth() + i - 12) {
                    matchingMonthFound = true;
                }
            }
        }
        return matchingMonthFound;
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto): boolean {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel === userCompanyPrivilege.permission) {
                return true;
            }
            return false;
        }
    }

    accountPeriodChanged(event) {
        const docDate = (this.docDateFormCtrl.value as _moment.Moment).toDate();
        const accPeriodDate = (event as _moment.Moment).toDate();
        if (accPeriodDate.getFullYear() < docDate.getFullYear()
            || (accPeriodDate.getFullYear() <= docDate.getFullYear()
                && accPeriodDate.getMonth() < docDate.getMonth())) {
            this.snackbarService.throwErrorSnackBar('A/c period should not be before doc. Date');
        } else {

            const lastDateOfMonth = this.companyManager.getCurrentCompanyDate();
            let throwErrorClosedMonth = false;
            let throwErrorAccountingPeriod = false;
            const isSameMonthAndYearThanOperationLastClosedMonth = event.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.month() === this.operationsLastMonthClosed.getMonth();
            const isBeforeOperationLastClosedMonth = event.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.month() < this.operationsLastMonthClosed.getMonth();
            const isLessOrEqualToLastMonthClosed = (event.year() === this.lastMonthClosed.getFullYear()
                && event.month() <= this.lastMonthClosed.getMonth())
                || event.year() < this.lastMonthClosed.getFullYear();
            // Acounting Period Rules for Regular Journal
            if (!this.isAccrualSelected && !this.isMtmSelected) {
                if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                    if (isLessOrEqualToLastMonthClosed) {
                        throwErrorAccountingPeriod = true;
                    } else if (isSameMonthAndYearThanOperationLastClosedMonth) {
                        this.snackbarService.informationSnackBar('Please check document date and accounting period');
                    } else if ((!this.checkIfBetweenLastClosedAndOperations(event)) && isBeforeOperationLastClosedMonth) {
                        throwErrorClosedMonth = true;
                    }
                } else {
                    if (isSameMonthAndYearThanOperationLastClosedMonth || isLessOrEqualToLastMonthClosed) {
                        throwErrorAccountingPeriod = true;
                    } else if ((!this.checkIfBetweenLastClosedAndOperations(event)) && isBeforeOperationLastClosedMonth) {
                        throwErrorClosedMonth = true;
                    }
                } // Acounting Period Rules for Accrual

            } else {
                if (isLessOrEqualToLastMonthClosed) {
                    throwErrorClosedMonth = true;
                } else {
                    if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                        if (!((event.year() === lastDateOfMonth.year() && event.month() === lastDateOfMonth.month()) ||
                            (isSameMonthAndYearThanOperationLastClosedMonth) ||
                            (this.checkIfBetweenLastClosedAndOperations(event)))) {
                            throwErrorClosedMonth = true;
                        }
                    } else if (!this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                        if (isSameMonthAndYearThanOperationLastClosedMonth || isLessOrEqualToLastMonthClosed) {
                            throwErrorClosedMonth = true;
                        }
                        if (!this.checkIfBetweenLastClosedAndOperations(event) && isBeforeOperationLastClosedMonth) {
                            throwErrorClosedMonth = true;
                        }
                    }
                }
            }
            if (throwErrorClosedMonth) {
                this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
                this.accPeriodFormCtrl.patchValue('');
            }
            if (throwErrorAccountingPeriod) {
                this.snackbarService.informationSnackBar('Not allowed: Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; please check the accounting period');
                this.accPeriodFormCtrl.patchValue('');
            }
        }

    }

    onGridReady(params) {
        this.agGridOptions.columnDefs = this.columnDefs;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.createAccountingDocumentLines = [];
        this.agGridApi.setRowData([]);
        this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, false);
        this.agGridColumnApi.setColumnVisible(this.dealNumberColumn, false);
        this.agGridColumnApi.setColumnVisible(this.settlementCurrencyColumn, false);
        this.agGridColumnApi.setColumnVisible(this.provinceColumn, this.companyConfiguration.isProvinceEnable);
        this.agGridColumnApi.setColumnVisible(this.branchColumn, this.companyConfiguration.isProvinceEnable);
        this.onAddAccountingLineButtonClicked(this.defaultLines);

        this.gridService.sizeColumns(this.agGridOptions);
        this.isLoadingassignOnLoad = false;
    }

    processCellForClipboard(params) {
        if (!params.value || !params.column.colDef.cellRendererParams) {
            return params.value;
        }
        let value = params.value;
        const cellRenderedParams = params.column.colDef.cellRendererParams(null);
        const object = cellRenderedParams.valueProperty ? cellRenderedParams.options
            .find((option) => option[cellRenderedParams.valueProperty] === value) : null;
        value = typeof value !== 'string' && cellRenderedParams.displayProperty ? value[cellRenderedParams.displayProperty] : value;
        if (object && cellRenderedParams.displayCode && cellRenderedParams.codeProperty) {
            return object[cellRenderedParams.codeProperty];
        }
        return cellRenderedParams.displayProperty && object ? object[cellRenderedParams.displayProperty] : value;
    }

    accountingEntryTypeChanged(event) {        
        this.filteredAccountLineTypeForMtm = [];
        if (event.value === this.accountingDocTypeSelected) {
            this.isAccrualSelected = false;
            this.isMtmSelected = false;
            this.docDateFormCtrl.setValue(this.companyManager.getCurrentCompanyDate());
            this.accPeriodFormCtrl.setValue(this.companyManager.getCurrentCompanyDate());
            this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, false);
            this.agGridColumnApi.setColumnVisible(this.clientAccountColumn, true);
            this.agGridColumnApi.setColumnVisible(this.secondaryDocumentReferenceColumn, true);
            this.agGridColumnApi.setColumnVisible(this.externalDocumentReferenceColumn, true);
            this.agGridColumnApi.setColumnVisible(this.costCenterColumn, true);
            this.agGridColumnApi.setColumnVisible(this.dealNumberColumn, false);
            this.agGridColumnApi.setColumnVisible(this.settlementCurrencyColumn, false);
        } else if (event.value === this.accrualDocTypeSelected) {
            this.isAccrualSelected = true;
            this.isMtmSelected = false;
            const lastDateOfMonth = this.companyManager.getCurrentCompanyDate();
            const previousMonth = lastDateOfMonth.subtract(1, 'months');
            this.docDateFormCtrl.patchValue(previousMonth.endOf('month'));
            this.accPeriodFormCtrl.patchValue(lastDateOfMonth);
            this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, true);
            this.agGridColumnApi.setColumnVisible(this.clientAccountColumn, true);
            this.agGridColumnApi.setColumnVisible(this.secondaryDocumentReferenceColumn, true);
            this.agGridColumnApi.setColumnVisible(this.externalDocumentReferenceColumn, true);
            this.agGridColumnApi.setColumnVisible(this.costCenterColumn, true);
            this.agGridColumnApi.setColumnVisible(this.dealNumberColumn, false);
            this.agGridColumnApi.setColumnVisible(this.settlementCurrencyColumn, false);
        } else {
            const lastDateOfMonth = this.companyManager.getCurrentCompanyDate();
            this.isMtmSelected = true;
            this.isAccrualSelected = false;
            const previousMonth = lastDateOfMonth.subtract(1, 'months');
            this.docDateFormCtrl.patchValue(previousMonth.endOf('month'));
            this.accPeriodFormCtrl.patchValue(lastDateOfMonth);
            this.agGridColumnApi.setColumnVisible(this.dealNumberColumn, true);
            this.agGridColumnApi.setColumnVisible(this.settlementCurrencyColumn, true);
            this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, true);
            this.agGridColumnApi.setColumnVisible(this.clientAccountColumn, false);
            this.agGridColumnApi.setColumnVisible(this.secondaryDocumentReferenceColumn, false);
            this.agGridColumnApi.setColumnVisible(this.externalDocumentReferenceColumn, false);
            this.agGridColumnApi.setColumnVisible(this.costCenterColumn, false);
            if (this.filteredAccountLineType && this.filteredAccountLineType.length > 0) {
                this.filteredAccountLineType.forEach((account) => {
                    if (account.accountLineTypeCode === 'L' || account.accountLineTypeCode == 'B') {
                        this.filteredAccountLineTypeForMtm.push(account);
                    }
                });
            }

        }
        this.agGridColumnApi.setColumnVisible(this.provinceColumn, this.companyConfiguration.isProvinceEnable);
        this.agGridColumnApi.setColumnVisible(this.branchColumn, this.companyConfiguration.isProvinceEnable);
        this.initializeGridColumns();
    }

    onAddAccountingLineButtonClicked(numberOfLines: number) {
        for (let count = 1; count <= numberOfLines; count++) {
            const newItem = new ManualJournalLine();
            this.createAccountingDocumentLines.push(newItem);
            this.agGridApi.updateRowData({ add: [newItem] });
        }
    }

    onSaveButtonClicked() {
        this.isSave = true;
        this.agGridApi.stopEditing();
        if (this.createDocumentFormGroup.valid) {
            const errorMessage = this.validateGridData();
            if (errorMessage === this.noErrorMessage) {
                this.checkAccrualNumber();
            } else if (errorMessage === '') {
                this.snackbarService.throwErrorSnackBar('Please fill atleast one grid row');
            } else {
                this.snackbarService.throwErrorSnackBar(errorMessage);
            }
        } else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
        }
    }

     validateGridData(): string {
        let isAnyRowDirty: boolean;
        let isRowDataValid: boolean = true;
        let isNotValid: boolean;
        let errorMessage: string = this.noErrorMessage;
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty && isRowDataValid) {
                isAnyRowDirty = true;
                isRowDataValid = true;
                let columnList = this.accountCreationConfiguration.filter((x) => x.isMandatory);                        
                columnList.forEach((column) => {
                    if (isRowDataValid) 
                    {                          
                        isRowDataValid = this.validateEmpty(column.id, rowData);

                        if (rowData.data.quantity && rowData.data.quantity < 0) {
                            errorMessage = 'The Quantity cannot be negative.';
                        } else if ((this.isAccrualSelected || this.isMtmSelected) && (!rowData.data.accrualNumber)) {
                            errorMessage = 'Accrual numbers are mandatory';
                        } else if (this.authForCtrl.value && this.totalAmount !== 0) {
                            errorMessage = 'Total amount should be zero';
                        } 
                        else if (!isRowDataValid) {                           
                                errorMessage = 'Grid data is invalid. Please resolve the errors.';                            
                        }
                    

                        if (this.companyConfiguration && this.companyConfiguration.isProvinceEnable) {
                            if (this.isNullEmptyOrRequiredString(rowData.data.provinceId)
                                || this.isNullEmptyOrRequiredString(rowData.data.branchId)) {
                                errorMessage = 'Grid data is invalid. Please resolve the errors.';
                            }   
                               
                        }
                    }
                     
                    
                });
            }
                       
        });
        return isAnyRowDirty? errorMessage:'';
    }    

    isNullEmptyOrRequiredString(value) {

        return value === null || value === '' || value === this.requiredString;
    }

    
    checkAccrualNumber() {
        if (!this.authForCtrl.value) {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Warning Message',
                    text: 'The document is not authorized for posting : Continue with Save ?',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.afterValidationChecksPassed();
                }
            });
        } else {
            const groupByAccrual = [];
            let isValid: boolean = true;

            this.agGridApi.forEachNode((document) => {
                groupByAccrual[document.data.accrualNumber] = groupByAccrual[document.data.accrualNumber] || [];
                groupByAccrual[document.data.accrualNumber].push({ amount: !document.data.fullAmount ? Number(document.data.amount) : document.data.fullAmount });
            });
            groupByAccrual.forEach((array) => {
                if (isValid) {
                    let totalSubAmount: number = 0;
                    array.forEach((element) => { totalSubAmount = totalSubAmount + element.amount; });
                    if (totalSubAmount !== 0) {
                        isValid = false;
                        this.snackbarService.throwErrorSnackBar(
                            'Accrual numbers : Invalid format. Rows flagged with the same accrual numbers must be balanced (Amount=0.00)');
                    }
                }
            });
            if (isValid) {
                this.afterValidationChecksPassed();
            }
        }
    }

    afterValidationChecksPassed() {
        this.createAccountingDocumentLines = this.getGridData();
        if (this.createAccountingDocumentLines) {
            this.createAccountingDocumentLines.forEach((docLine) => {
                if (docLine.accountReferenceId && typeof docLine.accountReferenceId !== 'number') {
                    const accountReferenceId = this.masterdata.nominalAccounts.find((c) => c.accountNumber === docLine.accountReferenceId.toString());
                    if (accountReferenceId) {
                        docLine.accountReferenceId = accountReferenceId.nominalAccountId;
                    }
                }
                if (docLine.clientAccountId && typeof docLine.clientAccountId !== 'number') {
                    const clientAccountId = this.masterdata.counterparties.find((c) => c.counterpartyCode === docLine.clientAccountId.toString());
                    if (clientAccountId) {
                        docLine.clientAccountId = clientAccountId.counterpartyID;
                    }
                }
                if (docLine.costTypeId && typeof docLine.costTypeId !== 'number') {
                    const costTypeId = this.masterdata.costTypes.find((c) => c.costTypeCode === docLine.costTypeId.toString());
                    if (costTypeId) {
                        docLine.costTypeId = costTypeId.costTypeId;
                    }
                }
                if (docLine.associatedAccountId && typeof docLine.associatedAccountId !== 'number') {
                    const associatedAccountId = this.masterdata.counterparties.find((associatedAcc) =>
                        associatedAcc.counterpartyCode === docLine.associatedAccountId.toString());
                    if (associatedAccountId) {
                        docLine.associatedAccountId = associatedAccountId.counterpartyID;
                    }
                }
                if (docLine.accountLineTypeId && typeof docLine.accountLineTypeId !== 'number') {
                    const accountLineType = this.masterdata.accountLineTypes.find((accountLine) =>
                        accountLine.accountLineTypeCode === docLine.accountLineTypeId.toString());
                    if (accountLineType) {
                        docLine.accountLineTypeId = accountLineType.accountLineTypeId;
                    }
                }
                if (docLine.departmentId && typeof docLine.departmentId !== 'number') {
                    const department = this.masterdata.departments.find((dept) =>
                        dept.departmentCode === docLine.departmentId.toString());
                    if (department) {
                        docLine.departmentId = department.departmentId;
                    }
                }
                if (docLine.sectionId && typeof docLine.sectionId !== 'number') {
                    const contracts = this.filteredContracts.find((contract) =>
                        contract.contractLabel === docLine.sectionId.toString());
                    if (contracts) {
                        docLine.sectionId = contracts.sectionId;
                    }
                }
                if (docLine.commodityId && typeof docLine.commodityId !== 'number') {
                    const commoditymatched = this.filteredCommodityList.find((commodity) =>
                        commodity.principalCommodity === docLine.commodityId.toString());
                    if (commoditymatched) {
                        docLine.commodityId = commoditymatched.commodityId.toString();
                    }
                }

                if (docLine.charterId && typeof docLine.charterId !== 'number') {
                    const charterMatched = this.filteredCharter.find((charter) =>
                        charter.charterCode === docLine.charterId.toString());
                    if (charterMatched) {
                        docLine.charterId = charterMatched.charterId;
                    }
                }
                if (docLine.provinceId && typeof docLine.provinceId !== 'number') {
                    const provinceId = this.masterdata.provinces.find((province) =>
                        province.stateCode === docLine.provinceId.toString());
                    if (provinceId) {
                        docLine.provinceId = provinceId.provinceId;
                    }
                }

            });
        }
        const manualJournalDocument: ManualJournalDocument = new ManualJournalDocument(this.createAccountingDocumentLines);
        manualJournalDocument.valueDate = this.valueDateFormCtrl.value;
        manualJournalDocument.documentDate = this.documentDateSelected ? this.documentDateSelected : this.docDateFormCtrl.value;
        manualJournalDocument.currencyCode = this.currencyCtrl.value.currencyCode;
        manualJournalDocument.accountingPeriod = this.accPeriodFormCtrl.value;
        manualJournalDocument.authorizedForPosting = this.authForCtrl.value;
        manualJournalDocument.toInterface = this.interfaceCtrl.value;
        manualJournalDocument.transactionDocumentTypeId = (this.isAccrualSelected === true || this.isMtmSelected) ? PostingDocumentType.TA : PostingDocumentType.JL;
        manualJournalDocument.taTypeId = (this.isMtmSelected) ? 3 : null;
        this.requiredString = '';
        this.manualJournalDocument = manualJournalDocument;
        this.isLoadingassign = true;
        this.subscription.push(this.executionService.createManualJournal(this.manualJournalDocument).subscribe((data) => {
            this.isSummaryView = true;
            this.isLoadingassign = false;
            this.initializeGridColumns();
            this.agGridColumnApi.setColumnVisible(this.createLineMenu, false);
            if ((data.costAlternativeCode 
                && data.departmentAlternativeCode
                && data.nominalAlternativeAccount 
                && data.c2CCode) 
            || !manualJournalDocument.toInterface) {
                if (this.isAccrualSelected || this.isMtmSelected) {
                    this.authForCtrl.value === true ?
                        this.snackbarService.informationAndCopySnackBar(
                            'Accrual and autoreversal '
                            + data.documentReference + ' has been created',
                            data.documentReference) :
                        this.snackbarService.informationAndCopySnackBar(
                            'Accrual ' + data.documentReference
                            + ' has been created',
                            data.documentReference);
                } else {
                    this.snackbarService.informationAndCopySnackBar('Regular journal '
                        + data.documentReference + ' has been created', data.documentReference);
                }
            } else {
                this.showMappingErrorMessage(data);
            }

        }));
    }

    showMappingErrorMessage(data: ManualJournalResponse) {
        if (!data.costAlternativeCode) {
            this.mappingFields.push('"Cost Alternative Code"');
        }
        if (!data.departmentAlternativeCode) {
            this.mappingFields.push('"Department Alternative Code"');
        }
        if (!data.nominalAlternativeAccount) {
            this.mappingFields.push('"Nominal Account"');
        }
        if (!data.c2CCode) {
            this.mappingFields.push('"C2C Code"');
        }
        const mappingErrorFields = this.mappingFields.join(', ');
        const message = 'The document ' + data.documentReference +
            ' will not be sent to the accounting interface because the accounting interface code for '
            + mappingErrorFields + ' is/are not filled in. Please contact the accountant';
        this.snackbarService.informationAndCopySnackBar(message, message);
    }

    getValueForCell(currentValue, list: any[], propertyToCompare: string, returnProperty) {
        const filteredObject = ((currentValue === null ||
            currentValue.trim() === '') ? null :
            list.find((obj) =>
                obj[propertyToCompare] ? obj[propertyToCompare].toUpperCase() === currentValue.toUpperCase() : false));
        if (filteredObject) {
            return filteredObject[returnProperty];
        }
        return null;
    }

    getGridData(): ManualJournalLine[] {
        const accountingDocumentLines = new Array<ManualJournalLine>();
        let isRowDataValid: boolean;
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty) {
                isRowDataValid = false;
                this.columnDefs.forEach((column) => {
                    if (!isRowDataValid) {
                        isRowDataValid = this.validateEmpty(column.colId, rowData);
                    }
                });
                if (isRowDataValid) {
                    rowData.data.amount = rowData.data.fullAmount ? rowData.data.fullAmount : rowData.data.amount;

                    rowData.data.quantity = rowData.data.fullQuantity ? rowData.data.fullQuantity : rowData.data.quantity;

                    accountingDocumentLines.push(rowData.data);
                }
            }

        });

        return accountingDocumentLines;
    }

    onDiscardButtonClicked() {
        this.isSave = true;
        if (!this.isSummaryView) {
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
                    this.router.navigate(
                        ['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries'],
                    );
                }
            });

        } else {
            if (!this.authForCtrl.value) {
                this.router.navigate(
                    ['/' + this.companyManager.getCurrentCompanyId() + '/financial/posting/management'],
                );
            } else {
                this.router.navigate(
                    ['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries'],
                );
            }
        }
    }

    isValueDateBeforeDocumentDate() {
        const result = isDateTwoBeforeDateOne(
            this.documentDateSelected ? this.documentDateSelected : this.docDateFormCtrl.value,
            this.valueDateFormCtrl.value);
        if (result) {
            return result;
        }
    }

    setValidators() {
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.currencies,
                    nameof<Currency>('currencyCode'),
                ),
            ]),
        );

        this.currencyCtrl.setValidators(Validators.compose([Validators.required]));

        if (this.accountCreationConfiguration.length > 0) {
            if (this.isRequired('accountingPeriod')) {
                this.accPeriodFormCtrl.setValidators(Validators.compose([Validators.required]));
            }
           
            this.docDateFormCtrl.setValidators(Validators.compose([Validators.required]));
            
            if (this.isRequired('valueDate')) {
                this.valueDateFormCtrl.setValidators(Validators.compose([Validators.required]));
            }
        }

    }

    formatPrice(value: number) {
        const indexOf = value.toString().indexOf('.');
        if (indexOf !== -1) {
            const remainingLength = value.toString().length - indexOf;
            if (remainingLength > 3) {
                return value.toString().substr(0, indexOf + 3);
            }
        }
        return value.toString();
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            if (params.colDef) {
                const columnChanged: string = params.colDef.field;
                if (columnChanged === this.quantityColumn) {
                    params.data.fullQuantity = params.newValue;
                    params.data.quantity = params.newValue;
                    if (params.newValue < 0) {
                        this.snackbarService.throwErrorSnackBar('The Quantity cannot be negative.');
                    }
                }
                if (columnChanged === this.amountColumn) {

                    params.data.fullAmount = params.newValue;
                    params.data.amount = params.newValue;
                    this.totalAmount = 0;
                    const totalAmountAtlasNumber = new AtlasNumber('0');
                    this.agGridApi.forEachNode((rownode) => {
                        if (rownode.data.fullAmount === 0) {
                            rownode.data.fullAmount = null;
                        }
                        if (rownode.data.fullAmount) {
                            this.calculateTotalAmount();
                        }
                    });
                    if (Number(params.newValue) === 0) {
                        this.snackbarService.throwErrorSnackBar('Amount cannot be zero');
                    }
                } else if (columnChanged === this.nominalAccount) {
                    if (this.nominalAccountFound && this.nominalAccountFound.clientAccountMandatory === 1) {
                        if (params.data && !params.data.clientAccountId) {
                            params.node.setDataValue('clientAccountId', this.requiredString);
                        }
                    }
                }
            }
        }
    }

    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Nom. Account',
                colId: 'accountReferenceId',
                field: 'accountReferenceId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'nominalAccountsGrid',
                        isRequired: this.isRequired('accountReferenceId'),
                        options: this.filteredNominalAccountList,
                        displayProperty: 'accountNumber',
                        codeProperty: 'accountNumber',
                        descriptionProperty: 'detailedDescription',
                        valueProperty: 'nominalAccountId',
                        lightBoxTitle: 'Results for Nominal Accounts',
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                onCellValueChanged: this.onNominalAccountSelected.bind(this),
                tooltip: (params) => this.getTooltip(
                    params, 'detailedDescription', 'accountNumber', this.filteredNominalAccountList),

            },
            {
                headerName: 'Cli. account',
                colId: 'clientAccountId',
                field: 'clientAccountId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isClientAccountRequired = false;
                    if (params.data && params.data.clientAccountId === '') {
                        isClientAccountRequired = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        isRequired: isClientAccountRequired,
                        displayProperty: 'counterpartyCode',
                        codeProperty: 'counterpartyCode',
                        descriptionProperty: 'description',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                onCellValueChanged: this.onClientAccountSelected.bind(this),
                tooltip: (params) => this.getTooltip(params, 'description', 'counterpartyCode', this.filteredCounterpartyList),
            },
            {
                headerName: 'Associated Acc.',
                colId: 'associatedAccountId',
                field: 'associatedAccountId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        // isRequired: (this.isMtmSelected) ? this.isRequired('associatedAccountId') : false,
                        isRequired: this.isRequired('associatedAccountId'),
                        displayProperty: 'counterpartyCode',
                        codeProperty: 'counterpartyCode',
                        descriptionProperty: 'description',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                onCellValueChanged: this.onClientAccountSelected.bind(this),
                tooltip: (params) => this.getTooltip(params, 'description', 'counterpartyCode', this.filteredCounterpartyList),
            },
            {
                headerName: 'Acc. L. Type',
                colId: 'accountLineTypeId',
                field: 'accountLineTypeId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'accountLineTypeGrid',
                        options: (this.isMtmSelected) ? this.filteredAccountLineTypeForMtm : this.filteredAccountLineType,
                        isRequired: this.isRequired('accountLineTypeId'),
                        displayProperty: 'accountLineTypeCode',
                        codeProperty: 'accountLineTypeCode',
                        descriptionProperty: 'description',
                        valueProperty: 'accountLineTypeId',
                        lightBoxTitle: 'Results for  Account Line Type',
                        showContextualSearchIcon: !this.isSummaryView,
                        filterContextualSearchFunction: this.filterAccountLineTypes.bind(this),
                    };
                },
                onCellValueChanged: this.setProvinceAndBranchValue.bind(this),
                tooltip: (params) => this.getTooltip(params, 'description', 'accountLineTypeCode', this.filteredAccountLineType),

            },
            {
                headerName: 'Cost types',
                colId: 'costTypeId',
                field: 'costTypeId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        isEditable: true,
                        gridId: 'costTypesGrid',
                        isRequired: this.isRequired('costTypeId'),
                        displayProperty: 'costTypeCode',
                        codeProperty: 'costTypeCode',
                        descriptionProperty: 'name',
                        valueProperty: 'costTypeId',
                        lightBoxTitle: 'Results for Cost',
                        options: this.filteredCostTypeList,
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                onCellValueChanged: this.setProvinceAndBranchValue.bind(this),
                tooltip: (params) => this.getTooltip(params, 'name', 'costTypeCode', this.filteredCostTypeList),
            },
            {
                headerName: 'Amount',
                colId: 'amount',
                field: 'amount',
                type: 'numericColumn',
                suppressToolPanel: true,
                lockPosition: true,
                editable: this.isGridEditable.bind(this),
                valueFormatter: this.numberFormatter,
                cellRenderer: this.requiredCell.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(15, 10, true),
                    isRightAligned: false,
                },
                onCellValueChanged: this.setProvinceAndBranchValue.bind(this),
            },
            {
                headerName: 'Narrative',
                colId: 'narrative',
                field: 'narrative',
                suppressToolPanel: true,
                lockPosition: true,
                cellRenderer: this.requiredCell.bind(this),
                editable: this.isGridEditable.bind(this),
            },
            {
                headerName: 'Dept',
                colId: 'departmentId',
                field: 'departmentId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'departmentsGrid',
                        isRequired: this.isRequired('departmentId'),
                        displayProperty: 'departmentCode',
                        codeProperty: 'departmentCode',
                        descriptionProperty: 'description',
                        valueProperty: 'departmentId',
                        lightBoxTitle: 'Results for Departments',
                        options: this.filteredDepartmentList,
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                onCellValueChanged: this.setProvinceAndBranchValue.bind(this),
                tooltip: (params) => this.getTooltip(params, 'description', 'departmentCode', this.filteredDepartmentList),
            },
            {
                headerName: 'Sec. Doc. Ref',
                colId: 'secondaryDocumentReference',
                field: 'secondaryDocumentReference',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'transactionDocumentGrid',
                        isRequired: this.isRequired('secondaryDocumentReference'),
                        valueProperty: 'docRef',
                        displayProperty: 'docRef',
                        lightBoxTitle: 'Results for Transaction Documents',
                        options: this.filteredDocuments,
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                tooltip: (params) => {
                    return params.value ? params.value : null;
                },
            },
            {
                headerName: 'Ext. Doc. Ref',
                colId: 'externalDocumentReference',
                field: 'externalDocumentReference',
                suppressToolPanel: true,
                lockPosition: true,
                editable: this.isGridEditable.bind(this),
            },
            {
                headerName: 'Contract  Ref.',
                colId: 'sectionId',
                field: 'sectionId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isContractRefEditable = false;
                    if (params.data && (params.data.dealNumber === '' || params.data.dealNumber === null)) {
                        isContractRefEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isGridEditable() && isContractRefEditable),
                        },
                        gridId: 'tradeList',
                        isRequired: isContractRefEditable ? this.isRequired('sectionId') : false,
                        displayProperty: 'contractLabel',
                        valueProperty: 'sectionId',
                        lightBoxTitle: 'Results for Contracts',
                        dataLoader: this.tradeDataLoader,
                        options: this.filteredContracts,
                        showContextualSearchIcon: (!this.isSummaryView && isContractRefEditable),
                    };
                },
                tooltip: (params) => {
                    return params.value ? params.value : null;
                },
                onCellValueChanged: this.onContractSelected.bind(this),
                cellClass: 'min-doc-ref',
            },
            {
                headerName: 'Deal No.',
                colId: 'dealNumber',
                field: 'dealNumber',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isDealNumberEditable = false;
                    if (params.data && (params.data.sectionId === '' || params.data.sectionId === null)) {
                        isDealNumberEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isGridEditable() && isDealNumberEditable),
                        },
                        gridId: 'fxDealList',
                        isRequired: (isDealNumberEditable)?this.isRequired('dealNumber'):false,
                        displayProperty: 'dealNumber',
                        valueProperty: 'dealNumber',
                        lightBoxTitle: 'Results for FxDeals',
                        dataLoader: this.fxDealLoader,
                        options: this.filteredFxDeals,
                        showContextualSearchIcon: (!this.isSummaryView && isDealNumberEditable),
                    };

                },
                onCellValueChanged: this.onDealNumberSelected.bind(this),
                tooltip: (params) => {
                    return params.value ? params.value : null;
                },
            },

            {
                headerName: 'Settlement Ccy.',
                colId: 'settlementCurrency',
                field: 'settlementCurrency',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isSettlementCurrencyEditable = false;
                    if (params.data && (params.data.sectionId === '' || params.data.sectionId === null)) {
                        isSettlementCurrencyEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (isSettlementCurrencyEditable && this.isGridEditable()),
                        },
                        gridId: 'currenciesGrid',
                        isRequired: (isSettlementCurrencyEditable)? this.isRequired('settlementCurrency') : false,
                        displayProperty: 'currencyCode',
                        codeProperty: 'currencyCode',
                        descriptionProperty: 'description',
                        valueProperty: 'currencyCode',
                        lightBoxTitle: 'Results for Currencies',
                        options: this.filteredSettlementCurrencyList,
                        showContextualSearchIcon: (!this.isSummaryView && isSettlementCurrencyEditable),
                    };
                },
                onCellValueChanged: (params) => this.onValueSelected(
                    params, 'currencyCode', 'Currency', 'currencyCode',
                    this.filteredCurrencyList, this.requiredString),
                tooltip: (params) => this.getTooltip(params, 'description', 'currencyCode', this.filteredCurrencyList),
            },
            {
                headerName: 'Province',
                colId: 'provinceId',
                field: 'provinceId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'provincesMasterData',
                        isRequired: this.companyConfiguration && this.companyConfiguration.isProvinceEnable,
                        displayProperty: 'stateCode',
                        codeProperty: 'stateCode',
                        descriptionProperty: 'description',
                        valueProperty: 'provinceId',
                        lightBoxTitle: 'Results for Provinces',
                        options: this.filteredProvinceList,
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                tooltip: (params) => this.getTooltip(params, 'description', 'stateCode', this.filteredProvinceList),
            },
            {
                headerName: 'Branch',
                colId: 'branchId',
                field: 'branchId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'branchMasterData',
                        isRequired: this.companyConfiguration && this.companyConfiguration.isProvinceEnable,
                        displayProperty: 'branchCode',
                        codeProperty: 'branchCode',
                        descriptionProperty: 'description',
                        valueProperty: 'branchId',
                        lightBoxTitle: 'Results for Branch',
                        options: this.filteredBranchList,
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                tooltip: (params) => this.getTooltip(params, 'description', 'branchCode', this.filteredBranchList),
            },
            {
                headerName: 'Cmy',
                colId: 'commodityId',
                field: 'commodityId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isCommodityEditable = false;
                    if (params.data && (params.data.dealNumber === '' || params.data.dealNumber === null)) {
                        isCommodityEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isGridEditable() && isCommodityEditable),
                        },
                        gridId: 'commodityGrid',
                        isRequired: false,
                        displayProperty: 'principalCommodity',
                        codeProperty: 'principalCommodity',
                        descriptionProperty: 'description',
                        valueProperty: 'commodityId',
                        lightBoxTitle: 'Results for Commodities',
                        options: this.filteredCommodityList,
                        showContextualSearchIcon: (!this.isSummaryView && isCommodityEditable),
                    };
                },
                tooltip: (params) => this.getTooltip(params, 'description', 'principalCommodity', this.filteredCommodityList),
            },
            {
                headerName: 'Qty',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
                suppressToolPanel: true,
                lockPosition: true,
                editable: this.isGridEditable.bind(this),
                cellEditor: 'atlasNumeric',
                cellRenderer: this.requiredCell.bind(this),
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, true),
                    isRightAligned: false,
                },
                tooltip: (params) => {
                    return params.value;
                },
            },
            {
                headerName: 'Charter',
                colId: 'charterId',
                field: 'charterId',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(),
                        },
                        gridId: 'charterGrid',
                        isRequired: this.isRequired('charterId'),
                        displayProperty: 'charterCode',
                        codeProperty: 'charterCode',
                        descriptionProperty: 'description',
                        valueProperty: 'charterId',
                        lightBoxTitle: 'Results for Charters',
                        options: this.filteredCharter,
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                tooltip: (params) => this.getTooltip(params, 'description', 'charterCode', this.filteredCharter),
            },
            {
                headerName: 'CC-1',
                colId: 'costCenter',
                field: 'costCenter',
                suppressToolPanel: true,
                lockPosition: true,
                cellRenderer: this.requiredCell.bind(this),
                editable: this.isGridEditable.bind(this),
            },
            {
                colId: 'accrualNumber',

                field: 'accrualNumber',
                suppressToolPanel: true,
                lockPosition: true,
                editable: this.isGridEditable.bind(this),
                cellRenderer: this.requiredCell.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: AllNumberMask(),
                },
                headerComponentFramework: AgGridAccrualNumberComponent,
                headerComponentParams: {
                    headerName: 'Accrual n°',
                },
            },
            {
                headerName: '',
                colId: 'createLineMenu',
                suppressToolPanel: true,
                lockPosition: true,
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.createAccountingDocumentGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                width: 60,
            },
        ];
    }

    filterCostTypes(value: any, options: any[], rowData: any): any[] {
        // filter cost that have the same nominal account
        const filterCostTypeOnAccountType = [];
        // when there is accountReferenceId in params
        if (rowData && rowData.accountReferenceId) {
            const filteredNominalAccount = this.filteredNominalAccountList.find((nominalAccount) =>
                nominalAccount.nominalAccountId === rowData.accountReferenceId);
            options.filter((costType) => {
                // find mathcing nominal account for cost type
                const matchingNominalAccount = costType.nominalAccountCode === filteredNominalAccount.accountNumber ||
                    costType.otherAcc === filteredNominalAccount.accountNumber;
                if (matchingNominalAccount) {
                    filterCostTypeOnAccountType.push(costType);
                }
            });
            options = filterCostTypeOnAccountType.length > 0 ? filterCostTypeOnAccountType : this.filteredCostTypeList;
        }
        return options;
    }

    filterAccountLineTypes(value: any, options: any[], rowData: any): any[] {
        let accountLineTypeList = [];
        accountLineTypeList = options;
        if (rowData.accountReferenceId) {
            const nominalAccountSelected = this.filteredNominalAccountList.find(
                (nominalAccount) => nominalAccount.nominalAccountId
                    === rowData.accountReferenceId);
            if (nominalAccountSelected) {
                if (this.isMtmSelected) {
                    if (nominalAccountSelected && nominalAccountSelected.clientAccountMandatory === 1) {
                        accountLineTypeList = options.filter((accountType) =>
                            accountType.description === 'Bank');
                    } else {
                        accountLineTypeList = options.filter((accountType) =>
                            accountType.description === 'Ledger');
                    }
                } else {
                    if (nominalAccountSelected && nominalAccountSelected.clientAccountMandatory === 1) {
                        accountLineTypeList = options.filter((accountType) =>
                            accountType.description === 'Customer' || accountType.description === 'Vendor');

                    }
                }
            }
        }
        options = accountLineTypeList;
        return options;
    }

    isGridEditable(): boolean {
        if (!this.isSummaryView) {
            return true;
        }
        return false;
    }

    isRequired(params: string): boolean {
        if (this.accountCreationConfiguration.length > 0) {            
            const result = this.accountCreationConfiguration[this.accountCreationConfiguration.findIndex((x) => x.id === params)];
            if(result && !this.isSummaryView)
            {
                return result.isMandatory;
            }
        }
        return false;
    }

    formatQuantity(params) {
        if (params.value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params.value);

        }
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            if(params.colDef.colId === 'accrualNumber')
            {
                return '<div class=\'document-cell-value-required\'>Required*</div>';
            }
            else if (this.isRequired(params.colDef.colId)) {
                return '<div class=\'document-cell-value-required\'>Required*</div>';
            }
        }    

        return params.value;
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    handleAction(action: string, documentLine: ManualJournalLine) {
        switch (action) {
            case this.createDocumentMenuActions.copyDocumentLine:
                const newManualLine: ManualJournalLine = new ManualJournalLine(documentLine);
                this.createAccountingDocumentLines.push(newManualLine);
                this.agGridApi.updateRowData({ add: [newManualLine] });
                this.calculateTotalAmount();
                this.snackbarService.informationSnackBar('Row added successfully at the end of the grid');
                break;
            case this.createDocumentMenuActions.deleteDocumentLine:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Document Line Deletion',
                        text: 'Are you sure you want to delete this line?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                const confirmationDeleteSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        const itemIndex = this.createAccountingDocumentLines.lastIndexOf(documentLine);
                        this.createAccountingDocumentLines.splice(itemIndex, 1);
                        this.agGridApi.updateRowData({ remove: [documentLine] });
                        this.gridEnlargementComponent.refreshGrid();
                        this.calculateTotalAmount();
                    }
                });
                this.subscriptions.push(confirmationDeleteSubscription);
                break;
            default: this.assertUnreachable(action);
        }
    }

    calculateTotalAmount() {
        this.totalAmount = 0;
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.amount) {
                this.totalAmount = Math.round((this.totalAmount + Number(rowData.data.amount)) * 100) / 100;
                rowData.data.isDirty = true;
            }
        });
    }

    assertUnreachable(x): never {
        throw new Error('Unknown action');
    }

    onContractSelected(params) {
        if (params.data && params.data.sectionId && !this.isSummaryView) {
            this.initializeGridColumns();
        }
        if (params.newValue && params.oldValue !== params.newValue) {
            const selectedNominalAccount = this.filteredContracts.find(
                (contract) => contract.contractLabel.toUpperCase() === params.newValue.toUpperCase(),
            );
            if (!selectedNominalAccount) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Contract reference does not exist');
                params.node.setDataValue('sectionId', '');
            } else {
                params.node.setDataValue('departmentId', selectedNominalAccount.departmentCode);
                params.node.setDataValue('commodityId', selectedNominalAccount.commodity1);
                params.node.setDataValue('charterId', selectedNominalAccount.charterReference);
            }
        }
    }

    onNominalAccountSelected(params) {
        if (params.data && !this.isSummaryView && params.data.accountReferenceId) {
            const selectedNominalAccount = this.filteredNominalAccountList.find((nomAcc) =>
                nomAcc.nominalAccountId === params.data.accountReferenceId);
            if (selectedNominalAccount && selectedNominalAccount.clientAccountMandatory === 1) {
                if (this.isMtmSelected) {
                    params.node.setDataValue('accountLineTypeId', 'B');
                }
                if (!params.data.clientAccountId) {
                    params.node.setDataValue('clientAccountId', '');
                }
            } else {
                if (this.isMtmSelected) {
                    params.node.setDataValue('accountLineTypeId', 'L');
                }
            }
            if (params.data.costTypeId) {
                params.node.setDataValue('costTypeId', '');
            }
        }
        this.setProvinceAndBranchValue(params);
    }

    setProvinceAndBranchValue(params: any) {
        if (!this.isSummaryView && this.companyConfiguration.isProvinceEnable) {
            if (!this.checkNullOrEmpty(params.node.data.accountReferenceId)
                || !this.checkNullOrEmpty(params.node.data.accountLineTypeId)
                || !this.checkNullOrEmpty(params.node.data.amount)
                || !this.checkNullOrEmpty(params.node.data.costTypeId)
                || !this.checkNullOrEmpty(params.node.data.departmentId)
                || !this.checkNullOrEmpty(params.node.data.fullAmount)
            ) {
                if (this.checkNullOrEmpty(params.node.data.provinceId)) {
                    const selectedProvince = this.filteredProvinceList.find(
                        (p) => p.provinceId === this.companyConfiguration.defaultProvinceId,
                    );

                    if (selectedProvince) {
                        params.node.setDataValue('provinceId', selectedProvince.provinceId);
                    }
                }

                if (this.checkNullOrEmpty(params.node.data.branchId)) {
                    const selectedBranch = this.filteredBranchList.find(
                        (p) => p.branchId === this.companyConfiguration.defaultBranchId,
                    );

                    if (selectedBranch) {
                        params.node.setDataValue('branchId', selectedBranch.branchId);
                    }
                }
            }
        }
    }

    checkNullOrEmpty(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return true;
        }
        return false;
    }

    onClientAccountSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            const selectedClientAccount = this.filteredCounterpartyList.find(
                (clientAccount) => clientAccount.counterpartyID === params.newValue,
            );
            if (!selectedClientAccount) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Client Account does not exist');
                params.colDef.colId === 'clientAccountId' ?
                    params.node.setDataValue('clientAccountId', params.oldValue) :
                    params.node.setDataValue('associatedAccountId', '');
            }
        }

        if (params.colDef.colId === 'clientAccountId' && !this.isSummaryView) {
            params.node.setDataValue('associatedAccountId', params.data.clientAccountId);
        }
    }

    onValueSelected(params, columnId: string, valueName: string, code: string, list: any[],
        requiredString: string, includeEmpty: boolean = false) {
        if (params.newValue !== '' && ((includeEmpty && params.newValue === '') || (params.newValue && params.oldValue !== params.newValue))) {
            const selected = list.find(
                (obj) => obj[code] ? obj[code].toUpperCase() === params.newValue.toUpperCase() : false,
            );
            if (!selected) {
                this.snackbarService.throwErrorSnackBar('Not allowed : ' + valueName + ' does not exist');
                params.node.setDataValue(columnId, requiredString);
            }
        }
    }

    onAmountChanged(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            params.data.fullAmount = params.newValue;
        }
    }

    onQuantityChanged(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            params.data.fullQuantity = params.newValue;
        }
    }

    OnExportButton() {
        this.agGridApi.forEachNode((node) => {
            if (node.data.accountReferenceId && typeof node.data.accountReferenceId === 'number') {
                const nominalAccount = this.filteredNominalAccountList.find((nominalAcc) =>
                    nominalAcc.nominalAccountId === node.data.accountReferenceId);
                if (nominalAccount) {
                    node.data.accountReferenceId = nominalAccount.accountNumber;
                }
            }
            if (node.data.clientAccountId && typeof node.data.clientAccountId === 'number') {
                const clientAccount = this.filteredCounterpartyList.find((client) =>
                    client.counterpartyID === node.data.clientAccountId);
                if (clientAccount) {
                    node.data.clientAccountId = clientAccount.counterpartyCode;
                }
            }
            if (node.data.associatedAccountId && typeof node.data.associatedAccountId === 'number') {
                const associatedAccount = this.filteredCounterpartyList.find((associatedAcc) =>
                    associatedAcc.counterpartyID === node.data.associatedAccountId);
                if (associatedAccount) {
                    node.data.associatedAccountId = associatedAccount.counterpartyCode;
                }
            }
            if (node.data.accountLineTypeId && typeof node.data.accountLineTypeId === 'number') {
                const accountLineType = this.filteredAccountLineType.find((accountLine) =>
                    accountLine.accountLineTypeId === node.data.accountLineTypeId);
                if (accountLineType) {
                    node.data.accountLineTypeId = accountLineType.accountLineTypeCode;
                }
            }
            if (node.data.costTypeId && typeof node.data.costTypeId === 'number') {
                const costType = this.filteredCostTypeList.find((cost) =>
                    cost.costTypeId === node.data.costTypeId);
                if (costType) {
                    node.data.costTypeId = costType.costTypeCode;
                }
            }
            if (node.data.departmentId && typeof node.data.departmentId === 'number') {
                const department = this.filteredDepartmentList.find((dept) =>
                    dept.departmentId === node.data.departmentId);
                if (department) {
                    node.data.departmentId = department.departmentCode;
                }
            }
            if (node.data.sectionId && typeof node.data.sectionId === 'number') {
                const contracts = this.filteredContracts.find((contract) =>
                    contract.sectionId === node.data.sectionId);
                if (contracts) {
                    node.data.sectionId = contracts.contractLabel;
                }
            }
            if (node.data.commodityId && typeof node.data.commodityId === 'number') {
                const commoditymatched = this.filteredCommodityList.find((commodity) =>
                    commodity.commodityId === node.data.commodityId);
                if (commoditymatched) {
                    node.data.commodityId = commoditymatched.principalCommodity;
                }
            }
            if (node.data.charterId && typeof node.data.charterId === 'number') {
                const charterMatched = this.filteredCharter.find((charter) =>
                    charter.charterId === node.data.charterId);
                if (charterMatched) {
                    node.data.charterId = charterMatched.charterCode;
                }
            }
        });
    }

    onExportButtonClickedAsExcel() {
        this.OnExportButton();
        this.agGridOptions.api.exportDataAsExcel(this.getExportParams('.xlsx'));
    }

    onExportButtonClickedAsCSV() {
        this.OnExportButton();
        this.agGridOptions.api.exportDataAsCsv(this.getExportParams('.csv'));
    }

    getExportParams(fileExtension) {
        const today = new Date();
        const currentDate = this.datePipe.transform(today, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: currentDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + fileExtension,
        };
        return params;
    }

    onLoadPreviousPageButtonClicked() {
        this.location.back();
    }

    // check if cell value is empty or null
    isNonEmptyData(data: string,validateZero : boolean = false) : boolean
    {
        if( data &&  data.toString().trim()!='' && data.toString().trim() !='Required*')
        {
            if(validateZero && data.toString().trim() === '0')
            {
                return false;              
            }
            return true;
        }
        return false;       
    }

    // Validate Grid Row for each column if it is empty or null based on configuration
    validateEmpty(colId: string, rowData: any) {
        let inValidRow : boolean = true;   
        let isAccuralOrMTM = this.isAccrualSelected || this.isMtmSelected;  
        let headerFieldNotRequiredValidation = ["valueDate","accountingPeriod","paymentDocumentDate" ];
        let fieldNotRequiredValidationNumber =  ["settlementCurrency","dealNumber","accrualNumber"];       
        
        //Apply explicit if Doc is Accrual or MTM then AccuralNumber is required
        if(isAccuralOrMTM && colId == "accrualNumber")
        {
           inValidRow = this.isNonEmptyData(rowData.data[colId]);
        }
        // We are escaping Header Fiele Validation
        else if(!headerFieldNotRequiredValidation.includes(colId) && this.isRequired(colId))
        {         
            // If there is MTM => Section is not required   
            if(this.isMtmSelected)        
            {
                inValidRow = colId=='sectionId' ? true : this.isNonEmptyData(rowData.data[colId], colId==='amount');
            }
            else       
            {
                // For Accrual and Journal => settlementCurrency and dealNumber are not required
                // SettlementCurrency and dealNumber are npot required in configuration
                inValidRow = fieldNotRequiredValidationNumber.includes(colId) ?
                        true : this.isNonEmptyData(rowData.data[colId], colId==='amount');                
            }
        } 
        return inValidRow;
    }
    

    numberFormatter(params) {
        if (params && params.value && !isNaN(params.value)) {
            return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }
        return null;
    }

    formatAmountValue(value) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }

    onDealNumberSelected(params) {
        if (params.data && params.data.dealNumber && !this.isSummaryView) {
            this.initializeGridColumns();
        }
    }

    // Import Document
    ondocumentSelected(file: File) {
        let setDataValue: AccountingImportReport;
        const fileName = file.name;
        const fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
        if (fileType === 'csv') {
            this.progressbar = false;
            this.accountingDocumentService.fileUpload(file, this.isAccrualSelected, this.isMtmSelected).subscribe((data: AccountingImportReport) => {
                if (data) {
                    setDataValue = data;
                    const goodDataResult = this.objectKeys(data.goodData.lineNumber);
                    const blockerDataResult = this.objectKeys(data.goodData.lineNumber);
                    if (goodDataResult.length === 0 && data.blockerData.length > 0) {
                        this.disableConfirmImport = true;
                        data.disableConfirmImport = this.disableConfirmImport;
                    } else {
                        this.disableConfirmImport = false;
                        data.disableConfirmImport = this.disableConfirmImport;
                    }
                    const accountingImportReportMsgDialog = this.dialog.open(AccountingWarningErrorMsgDialogComponent, {
                        data,
                        width: '80%',
                        height: '80%',
                    });
                    accountingImportReportMsgDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            if (answer.toBeImported) {
                                const goodDataResult = this.objectKeys(data.goodData.lineNumber);
                                const setRowValue = data.goodDataList;
                                const result = this.objectKeys(data.blockerData.length);
                                this.agGridApi.setRowData(setRowValue);
                                this.agGridApi.forEachNode((rowData) => {
                                    rowData.data.isDirty = true;
                                    this.totalAmount = this.totalAmount + Number(rowData.data.amount);
                                });

                                if (data.blockerData.length > 0 && (goodDataResult.length > 0)) {
                                    this.snackbarService.informationSnackBar('Import was successful');
                                } else if (data.blockerData.length === 0 && (goodDataResult.length > 0)) {
                                    this.snackbarService.informationSnackBar('Import was successful.');
                                } else if (goodDataResult.length === 0) {
                                    this.snackbarService.informationSnackBar('Import was unsuccessful.');
                                }
                                this.progressbar = false;
                            } else {
                                this.snackbarService.informationSnackBar('Import was unsuccessful.');
                                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entry/new']);
                            }
                        } else {
                            accountingImportReportMsgDialog.close();
                            this.snackbarService.informationSnackBar('Import was unsuccessful.');
                        }
                    });
                }
            });
        } else {
            this.snackbarService.informationSnackBar('Only csv files are allowed to be selected');
        }

    }
}
