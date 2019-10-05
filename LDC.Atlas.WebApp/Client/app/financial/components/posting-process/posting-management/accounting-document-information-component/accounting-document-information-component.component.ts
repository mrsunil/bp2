import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonMethods } from '../../../../..//execution/services/execution-cash-common-methods';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridAccrualNumberComponent } from '../../../../../shared/components/ag-grid-accrual-number/ag-grid-accrual-number.component';
import { AgGridContextualSearchComponent } from '../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { FxDealSearchResult } from '../../../../../shared/dtos/fxDeal-search-result';
import { SectionSearchResult } from '../../../../../shared/dtos/section-search-result';
import { TransactionDocumentSearchResult } from '../../../../../shared/dtos/transaction-document-search-result';
import { AccountLineType } from '../../../../../shared/entities/account-line-type.entity';
import { AccountingDocumentLine } from '../../../../../shared/entities/accounting-document-line.entity';
import { AccountingDocumentStatusToDeletedCommand } from '../../../../../shared/entities/accounting-document-status-deleted.entity';
import { AccountingDocumentStatus } from '../../../../../shared/entities/accounting-document-status.entity';
import { AccountingSetup } from '../../../../../shared/entities/accounting-setup.entity';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { Commodity } from '../../../../../shared/entities/commodity.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { CostType } from '../../../../../shared/entities/cost-type.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';
import { PaymentTerm } from '../../../../../shared/entities/payment-term.entity';
import { PostingManagement } from '../../../../../shared/entities/posting-management.entity';
import { Province } from '../../../../../shared/entities/province.entity';
import { Vat } from '../../../../../shared/entities/vat.entity';
import { AccountLineTypes } from '../../../../../shared/enums/account-line-type.enum';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { PostingDocumentTAType } from '../../../../../shared/enums/posting-document-tatype.enum';
import { PostingDocumentType } from '../../../../../shared/enums/posting-document-type.enum';
import { PostingStatus } from '../../../../../shared/enums/posting-status.enum';
import { PostingManagementDisplayView } from '../../../../../shared/models/posting-management-display-view';
import { AllNumberMask, CustomNumberMask } from '../../../../../shared/numberMask';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../../shared/services/authorization/dtos/user-company-privilege';
import { CharterDataLoader } from '../../../../../shared/services/execution/charter-data-loader';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { FxDealDataLoader } from '../../../../../shared/services/list-and-search/fxDeal-data-loader';
import { TradeDataLoader } from '../../../../../shared/services/list-and-search/trade-data-loader';
import { TransactionDocumentDataLoader } from '../../../../../shared/services/preaccounting/transaction-document-data-loader';
import { SecurityService } from '../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { UrlManagementService } from '../../../../../shared/services/url-management.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { isDateTwoBeforeDateOne } from '../../../../../shared/validators/date-validators.validator';
import { PostingAccountLinesDataLoader } from '../../../../../shared/services/list-and-search/posting-acoount-lines-data-loader';
import { ListAndSearchComponent } from '../../../../../shared/components/list-and-search/list-and-search.component';
import { ItemConfigurationProperties } from '../../../../../shared/entities/form-configuration.entity';
import { FormConfigurationService } from '../../../../../shared/services/http-services/form-configuration.service';

const moment = _moment;

@Component({
    selector: 'atlas-accounting-document-information-component',
    templateUrl: './accounting-document-information-component.component.html',
    styleUrls: ['./accounting-document-information-component.component.scss'],
    providers: [TransactionDocumentDataLoader, TradeDataLoader, CharterDataLoader, FxDealDataLoader, PostingAccountLinesDataLoader],
})
export class AccountingDocumentInformationComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    subscriptions: Subscription[] = [];
    columnDefs: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    rowStyle: any;
    savingInProgress = false;
    isSave: boolean = false;
    isMtmSelected: boolean = false;
    filteredFxDeals: FxDealSearchResult[];
    filteredProvinceList: Province[];
    accountingId: number;
    documentRefData: PostingManagementDisplayView[];
    accountingDocumentLine: AccountingDocumentLine[];
    filteredCostTypeList: CostType[];
    docDateFormCtrl = new AtlasFormControl('docDateFormCtrl');
    valueDateFormCtrl = new AtlasFormControl('valueDateFormCtrl');
    accPeriodFormCtrl = new AtlasFormControl('accPeriodFormCtrl');
    glDateFormCtrl = new AtlasFormControl('glDateFormCtrl');
    currencyCtrl = new AtlasFormControl('currencyCtrl');
    interfaceCtrl = new AtlasFormControl('interfaceCtrl');
    authForCtrl = new AtlasFormControl('authForCtrl');
    addNewLineCtrl = new AtlasFormControl('addNewLineCtrl');
    filteredNominalAccountList: NominalAccount[];
    filteredCounterpartyList: Counterparty[];
    filteredDepartmentList: Department[];
    filteredCommodityList: Commodity[];
    filtererdPaymentList: PaymentTerm[];
    filteredSettlementCurrencyList: Currency[];
    filteredAccountLineTypeForMtm: AccountLineType[] = [];
    filteredVatsList: Vat[];
    isAccrualDocument: boolean = false;
    filteredDocuments: TransactionDocumentSearchResult[];
    accountingSetupModel: AccountingSetup;
    masterdata: MasterData;
    authorisedForPosting: boolean;
    filteredCurrencyList: Currency[];
    amountColumn: string = 'amount';
    clientAccountColumn: string = 'clientAccountId';
    secondaryDocumentReferenceColumn: string = 'secondaryDocumentReference';
    externalDocumentReferenceColumn: string = 'extDocReference';
    costCenterColumn: string = 'costCenter';
    provinceColumn: string = 'provinceId';

    editDocumentFormGroup: FormGroup;
    isAccOrJournalType: boolean = false;
    nominalAccount: string = 'accountReference';
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };

    filteredAccountLineType: AccountLineType[];
    filteredContracts: SectionSearchResult[];
    filteredCharter: Charter[];
    nominalAccountFound: NominalAccount;
    docReference: string;
    taTypeId: number;
    docStatus: string;
    creationDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    errorMessage: string;
    isViewMode: boolean = true;
    isAlreadyAuthorized: boolean = false;
    accountingDocumentData: PostingManagement;
    amount: number;
    decimalOptionValue: number = 2;
    amountFormat: string = 'en-US';
    statutoryCurrencyColumn: string = 'statutoryCurrency';
    functionalCurrencyColumn: string = 'functionalCurrency';
    amountValue: string = 'amount';
    requiredString: string = 'Required*';
    statutoryAmount: number;
    functionalAmount: number;
    currencyControl: Currency;
    editLineMenu: string = 'editLineMenu';
    accrualNumberColumn: string = 'accrualNumber';
    paymentTermColumn: string = 'paymentTermId';
    vatIdColumn: string = 'vatId';
    errormsg: string;
    statusClassApplied: string;
    showErrorMessage: boolean = true;
    accountingDocumentId: string = 'accountingDocumentId';
    dealNumberColumn: string = 'dealNumber';
    settlementCurrencyColumn: string = 'settlementCurrency';
    editAccountingDocumentGridContextualMenuActions: AgContextualMenuAction[];

    accountingDocumentGridContextualMenuActions: AgContextualMenuAction[];
    accountingDocumentMenuActions: { [key: string]: string } = {
        exportDocument: 'export',
    };
    excelSheetName: string = 'Document Lines';
    contractDate: Date;
    isAuthorizedControlenabled: boolean = false;
    isToInterfaceControlenabled: boolean = true;
    isCashDocumentType: boolean;
    isCashDocumentAuthorized: boolean = true;
    isInvoiceDocumentType: boolean = true;
    operationsLastMonthClosed: Date;
    monthNameForlastMonthClosed: string;
    monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    currencyErrorMap: Map<string, string> = new Map()
        .set('required', 'This field is required')
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');
    isDocumentStatusHeld: boolean;
    counterPartyAccountingCategory: string = 'C';
    company: string;
    companyConfiguration: Company;
    postOpClosedPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'POSTOPCLOSED',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'POSTINGMGT',
    };
    lastMonthClosed: Date;
    monthNameForoperationsLastMonthClosed: string;
    editDocumentMenuActions: { [key: string]: string } = {
        copyDocumentLine: 'copy',
        deleteDocumentLine: 'delete',
    };
    date = this.companyManager.getCurrentCompanyDate().toDate();
    isMappingErrorStatus: boolean = false;
    mappingErrorMessages: string[] = [];
    showErrorBanners: boolean = false;
    editPostingManagementPrivilege = false;
    readWritePrivilege = false;
    editAccOrJournalDcoumentPrivilege = false;
    functionalCurrencyHeader: string = 'Functional Currency in ';
    statutoryCurrencyHeader: string = 'Statutory Currency in ';
    PermissionLevels = PermissionLevels;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    destroy$ = new Subject();
    gridCode = "accountingDocByIdGrid";
    accountCreationConfiguration: ItemConfigurationProperties[] = new Array<ItemConfigurationProperties>();

    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        private urlManagementService: UrlManagementService,
        protected router: Router,
        private preaccountingService: PreaccountingService,
        protected snackbarService: SnackbarService,
        protected deleteConfirmationDialog: MatDialog,
        protected companyManager: CompanyManagerService,
        public tradeDataLoader: TradeDataLoader,
        public charterDataLoader: CharterDataLoader,
        private authorizationService: AuthorizationService,
        protected dialog: MatDialog,
        private location: Location,
        public transactionDocumentDataLoader: TransactionDocumentDataLoader,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private uiService: UiService,
        public fxDealLoader: FxDealDataLoader,
        protected securityService: SecurityService,
        protected lockService: LockService,
        private titleService: TitleService,
        public gridService: AgGridService,
        private formConfigurationService: FormConfigurationService,
        public accountingLinesDataLoader: PostingAccountLinesDataLoader,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.formConfigurationService.getMandatoryFieldsConfigurationForFinancial().subscribe((templates) => {
            this.accountCreationConfiguration = templates.value;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.route.snapshot.paramMap.get('company');
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.functionalCurrencyHeader = (this.companyConfiguration.functionalCurrencyCode) ?
            this.functionalCurrencyHeader + this.companyConfiguration.functionalCurrencyCode : this.functionalCurrencyHeader;
        this.statutoryCurrencyHeader = (this.companyConfiguration.statutoryCurrencyCode) ?
            this.statutoryCurrencyHeader + this.companyConfiguration.statutoryCurrencyCode : this.statutoryCurrencyHeader;

        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Financials')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'POSTINGMGT')) {
                this.editPostingManagementPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'EditPostingManagement');
                this.readWritePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'POSTINGMGT');
            }
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Financials')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'AccountingEntries')) {
                this.editAccOrJournalDcoumentPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CreateEditDocument');
            }
        });
        this.accountingId = Number(this.route.snapshot.paramMap.get('accountingId'));
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCurrencyList = this.masterdata.currencies;
        this.filteredSettlementCurrencyList = this.filteredCurrencyList;
        this.filteredCounterpartyList = this.masterdata.counterparties;
        this.filteredAccountLineType = this.masterdata.accountLineTypes;
        this.filteredCostTypeList = this.masterdata.costTypes;
        this.filteredDepartmentList = this.masterdata.departments;
        this.filteredCommodityList = this.masterdata.commodities;
        this.filtererdPaymentList = this.masterdata.paymentTerms;
        this.filteredVatsList = this.masterdata.vats;
        this.filteredProvinceList = this.masterdata.provinces;
        this.addNewLineCtrl.patchValue(1);
        if (this.filteredAccountLineType && this.filteredAccountLineType.length > 0) {
            this.filteredAccountLineType.forEach((account) => {
                if (account.accountLineTypeCode === 'L' || account.accountLineTypeCode == 'B') {
                    this.filteredAccountLineTypeForMtm.push(account);
                }
            });
        }
        this.filteredNominalAccountList = this.masterdata.nominalAccounts;
        this.init();
        this.transactionDocumentDataLoader.getData().subscribe((documents) => {
            this.filteredDocuments = documents;
        });
        const filterList: ListAndSearchFilter[] = [];
        this.tradeDataLoader.getData(filterList).subscribe((trade) => {
            this.filteredContracts = trade.value;
        });
        this.charterDataLoader.getData().subscribe((charter) => {
            this.filteredCharter = charter;
        });
        this.fxDealLoader.getData(filterList).subscribe((fxDeal) => {
            this.filteredFxDeals = fxDeal.value;
        });
        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
                this.operationsLastMonthClosed = new Date(new
                    Date(this.accountingSetupModel.lastMonthClosedForOperation).toDateString());
                this.lastMonthClosed = new Date(new
                    Date(this.accountingSetupModel.lastMonthClosed).toDateString());
                this.monthNameForlastMonthClosed = this.monthNames[this.lastMonthClosed.getMonth()];
                this.monthNameForoperationsLastMonthClosed = this.monthNames[this.operationsLastMonthClosed.getMonth()];
            }));
        this.initView();
        this.disableControls();
        this.getFormGroup();
        this.setValidators();
        });
    }

    init() {
        this.accountingDocumentGridContextualMenuActions = [{
            icon: 'import_export',
            text: 'Export',
            action: this.accountingDocumentMenuActions.exportDocument,
        },
        ];
        this.editAccountingDocumentGridContextualMenuActions = [
            {
                icon: 'content_copy',
                text: 'Copy Line',
                action: this.editDocumentMenuActions.copyDocumentLine,
            },
            {
                icon: 'delete',
                text: 'Delete Line',
                action: this.editDocumentMenuActions.deleteDocumentLine,
            },
        ];

    }

    canDeactivate() {
        if (this.editDocumentFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
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

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.editDocumentFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    disableControls() {
        this.currencyCtrl.disable();
        this.docDateFormCtrl.disable();
        //this.valueDateFormCtrl.disable();
        this.accPeriodFormCtrl.disable();
        this.glDateFormCtrl.disable();
         if (!this.isEditable('valueDate')) 
        {
            this.valueDateFormCtrl.disable();
        }

       
        this.initializeGridColumns();
    }

    onAddOrDeleteColumn(event) {
        const cols = this.columnDefs.filter((col) => col.colId === event.column.colId);
        if (cols.length !== 1) { return; }
        cols[0].hide = !event.visible;
    }

    initView() {
        this.subscriptions.push(this.preaccountingService.getAccoutingDocumentData(this.accountingId).pipe(
            map((data) => {
                this.documentRefData = data.value.map((docRef) => {
                    return new PostingManagementDisplayView(docRef);
                });
                this.accountingDocumentData = this.documentRefData[0];

                this.isAccOrJournalType = this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.TA
                    || this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.JL;
                this.isAccrualDocument = this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.TA;
                this.currencyControl = this.filteredCurrencyList
                    .find((currency) => currency.currencyCode === this.accountingDocumentData.currencyCode);
                this.isCashDocumentType = this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.CP
                    || this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.CI;
                this.isCashDocumentAuthorized = (this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.CP
                    || this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.CI)
                    && this.accountingDocumentData.statusId === PostingStatus.Authorized;
                this.isInvoiceDocumentType = this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.PI
                    || this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.SI
                    || this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.CN
                    || this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.DN;
                this.isDocumentStatusHeld = this.accountingDocumentData.statusId === PostingStatus.Held;
                this.isMappingErrorStatus = this.accountingDocumentData.statusId === PostingStatus.MappingError;
                if (this.isMappingErrorStatus) {
                    this.displayErrorMessages();
                }
                this.accountingDocumentLine = this.accountingDocumentData.accountingDocumentLines;
                this.initializeGridColumns();
                this.assignValuesToControl();
                this.initializeStatusClass();
                if (!this.isViewMode) {
                    this.agGridColumnApi.setColumnVisible(
                        this.editLineMenu,
                        !this.isViewMode && this.isAccOrJournalType && !this.isAlreadyAuthorized);
                    this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, this.isAccrualDocument ? true : false);
                    this.agGridColumnApi.setColumnVisible(this.paymentTermColumn, this.isInvoiceDocumentType ? true : false);
                    this.agGridColumnApi.setColumnVisible(this.vatIdColumn, this.isInvoiceDocumentType ? true : false);
                    this.agGridColumnApi.setColumnVisible(this.statutoryCurrencyColumn, this.isDocumentStatusHeld ? true : false);
                    this.agGridColumnApi.setColumnVisible(this.functionalCurrencyColumn, this.isDocumentStatusHeld ? true : false);
                    this.agGridColumnApi.setColumnVisible(this.dealNumberColumn, false);
                    this.agGridColumnApi.setColumnVisible(this.settlementCurrencyColumn, false);
                    this.agGridColumnApi.setColumnVisible(this.provinceColumn, false);
                }

                if (this.documentRefData[0].taTypeId === 3 && this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.TA) {
                    this.isMtmSelected = true;
                    this.showHideMtmColumn();
                }
                if (!this.isViewMode) {
                    if (this.accountingDocumentData.transactionDocumentTypeId == PostingDocumentType.TA) {
                        this.currencyCtrl.disable();
                    }
                    if (this.accountingDocumentData.taTypeId == PostingDocumentTAType.MonthEndTA) {
                        this.docDateFormCtrl.disable();
                        this.valueDateFormCtrl.disable();
                        this.accPeriodFormCtrl.disable();
                        this.glDateFormCtrl.disable();
                    }
                    this.startLockRefresh(this.accountingId, this.docReference);
                    this.titleService.setTitle(this.docReference + ' - Edit');
                } else {
                    this.titleService.setTitle(this.docReference + ' - View');
                }
            }))
            .subscribe());
    }

    getFormGroup() {
        this.editDocumentFormGroup = this.formBuilder.group({
            currencyCtrl: this.currencyCtrl,
            docDateFormCtrl: this.docDateFormCtrl,
            valueDateFormCtrl: this.valueDateFormCtrl,
            accPeriodFormCtrl: this.accPeriodFormCtrl,
        });
        return super.getFormGroup();
    }

    showOrHideColum(event, col: agGrid.ColDef) {
        this.isSave = true;
        this.agGridColumnApi.setColumnVisible(col.colId, (col.hide || false));
        event.stopPropagation();
        return false;
    }

    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Nominal acc.',
                colId: 'accountReference',
                field: 'accountReference',
                onCellValueChanged: this.onNominalAccountSelected.bind(this),
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: () => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable(),
                        },
                        gridId: 'nominalAccountsGrid',
                        options: this.filteredNominalAccountList,
                        isRequired: (!this.isViewMode) ? this.isRequired('accountReferenceId') : false,
                        displayProperty: 'accountNumber',
                        valueProperty: 'accountNumber',
                        lightBoxTitle: 'Results for Nominal Accounts',
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode,
                    };
                },
            },
            {
                headerName: 'Cli. account',
                colId: 'clientAccountId',
                field: 'clientAccountId',
                cellRendererFramework: AgGridContextualSearchComponent,
                onCellValueChanged: this.onClientAccountIdSelected.bind(this),
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable(),
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        isRequired: this.isRequired( 'clientAccountId'),
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode,
                    };
                },
            },
            {
                headerName: 'Associated Acc.',
                colId: 'associatedAccountCode',
                field: 'associatedAccountCode',
                cellRendererFramework: AgGridContextualSearchComponent,
                onCellValueChanged: this.onClientAccountCodeSelected.bind(this),
                cellRendererParams: () => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable() && this.isEditable('associatedAccountId'),
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        isEditable: this.isColumnEditable() && this.isEditable('associatedAccountId'),
                        isRequired: this.isRequired('associatedAccountId'),
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyCode',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode &&  this.isEditable('associatedAccountId'),
                    };
                },
            },
            {
                headerName: 'Acc. L. Type',
                colId: 'accountLineTypeId',
                field: 'accountLineTypeId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable() && this.isEditable('accountLineTypeId'),
                        },
                        gridId: 'accountLineTypeGrid',
                        options: (this.isMtmSelected) ? this.filteredAccountLineTypeForMtm : this.filteredAccountLineType,
                        isEditable: this.isColumnEditable() && this.isEditable('accountLineTypeId'),
                        isRequired: this.isRequired('accountLineTypeId'),
                        displayProperty: 'accountLineTypeCode',
                        valueProperty: 'accountLineTypeId',
                        lightBoxTitle: 'Results for  Account Line Type',
                        nominalAccountList: this.filteredNominalAccountList,
                        filterContextualSearchFunction: this.filterAccountLineTypes.bind(this),
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode &&  this.isEditable('accountLineTypeId'),
                    };
                },
                onCellValueChanged: this.onAccountLineTypeSelected.bind(this),
            },
            {
                headerName: 'Cost types',
                colId: 'costTypeId',
                field: 'costTypeId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable(),
                        },
                        gridId: 'costTypesGrid',
                        isRequired: (!this.isViewMode) ? this.isRequired('costTypeId') : false,
                        displayProperty: 'costTypeCode',
                        valueProperty: 'costTypeId',
                        lightBoxTitle: 'Results for Cost',
                        options: this.filteredCostTypeList,
                        nominalAccountList: this.filteredNominalAccountList,
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode,
                    };
                },
                onCellValueChanged: this.onCostTypeSelected.bind(this),
            },
            {
                headerName: 'Amount',
                colId: 'amount',
                field: 'amount',
                editable: this.makeColumnEditable.bind(this),
                cellRenderer: this.requiredCellForCostAmount.bind(this),
                cellStyle: { textAlign: 'right' },
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, true),
                    isRightAligned: false,
                },
            },
            {
                headerName: this.statutoryCurrencyHeader,
                colId: 'statutoryCurrency',
                field: 'statutoryCurrency',
                editable: this.makeColumnEditable.bind(this),
                valueFormatter: this.currencyFormatterInGrid.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: this.functionalCurrencyHeader,
                colId: 'functionalCurrency',
                field: 'functionalCurrency',
                editable: this.makeColumnEditable.bind(this),
                valueFormatter: this.currencyFormatterInGrid.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Narrative',
                colId: 'narrative',
                field: 'narrative',
                cellRenderer: this.requiredCell.bind(this),
                editable: this.makeColumnEditable.bind(this) && this.isEditable('narrative'),
            },
            {
                headerName: 'Department',
                colId: 'departmentId',
                field: 'departmentId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable(),
                        },
                        gridId: 'departmentsGrid',
                        isRequired: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode && this.isRequired('departmentId'),
                        displayProperty: 'departmentCode',
                        valueProperty: 'departmentId',
                        lightBoxTitle: 'Results for Departments',
                        options: this.filteredDepartmentList,
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode,
                    };
                },
                onCellValueChanged: this.onDepartmentSelected.bind(this),
                tooltip: (params) => {
                    return params.value ? params.value : null;
                },
            },
            {
                headerName: 'Sec. Doc. ref',
                colId: 'secondaryDocumentReference',
                field: 'secondaryDocumentReference',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: () => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable(),
                        },
                        gridId: 'transactionDocumentGrid',
                        isRequired: this.isRequired('secondaryDocumentReference'),
                        displayProperty: 'docRef',
                        valueProperty: 'docRef',
                        lightBoxTitle: 'Results for Transaction Documents',
                        dataLoader: this.transactionDocumentDataLoader,
                        options: this.filteredDocuments,
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode,
                    };
                },
                onCellValueChanged: this.onDocumentSelected.bind(this),
                tooltip: (params) => {
                    return params.value ? params.value.docRef : null;
                },
            },
            {
                headerName: 'Ext. Doc. Ref',
                colId: 'extDocReference',
                field: 'extDocReference',
                editable: this.makeColumnEditable.bind(this),
            },
            {
                headerName: 'Contract ref.',
                colId: 'sectionReference',
                field: 'sectionReference',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isContractRefEditable = false;
                    if (params.data && (params.data.dealNumber === '' || params.data.dealNumber === null)) {
                        isContractRefEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isColumnEditable() && isContractRefEditable),
                        },
                        gridId: 'tradeList',
                        isRequired: false,
                        displayProperty: 'contractLabel',
                        valueProperty: 'contractLabel',
                        lightBoxTitle: 'Results for Contracts',
                        dataLoader: this.tradeDataLoader,
                        option: this.filteredContracts,
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode && isContractRefEditable,
                    };
                },

                onCellValueChanged: this.onContractSelected.bind(this),
            },

            {
                headerName: 'Commodity',
                colId: 'commodityId',
                field: 'commodityId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isCommodityEditable = false;
                    if (params.data && (params.data.dealNumber === '' || params.data.dealNumber === null)) {
                        isCommodityEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isColumnEditable() && isCommodityEditable),
                        },
                        isEditable: true,
                        gridId: 'commodityGrid',
                        isRequiredField: this.isRequired('commodityId'),
                        displayProperty: 'principalCommodity',
                        valueProperty: 'commodityId',
                        lightBoxTitle: 'Results for Commodities',
                        options: this.filteredCommodityList,
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode && isCommodityEditable,
                    };
                },
                onCellValueChanged: this.onCommoditySelected.bind(this),
                tooltip: (params) => {
                    return params.value ? params.value.description : null;
                },
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                tooltip: (params) => {
                    return this.validateQuantity(params);
                },
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, true),
                    isRightAligned: false,
                },
                editable: this.makeColumnEditable.bind(this),
                cellRenderer: this.requiredCell.bind(this),
                valueFormatter: this.quantityFormatterInGrid.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Charter',
                colId: 'charterId',
                field: 'charterId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable() && this.isEditable('charterId'),
                        },
                        isEditable: this.isColumnEditable() && this.isEditable('charterId'),
                        gridId: 'charterGrid',
                        isRequired : this.isRequired('charterId'),
                        isRequiredField: false,
                        displayProperty: 'charterCode',
                        valueProperty: 'charterId',
                        lightBoxTitle: 'Results for Charters',
                        dataLoader: this.charterDataLoader,
                        options: this.filteredCharter,
                        showContextualSearchIcon: !this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode && this.isEditable('charterId'),
                    };
                },
                onCellValueChanged: this.onCharterSelected.bind(this),
                tooltip: (params) => {
                    return params.value ? params.value.description : null;
                },

            },
            {
                headerName: 'Cost Center',
                colId: 'costCenter',
                field: 'costCenter',
                editable: this.makeColumnEditable.bind(this) && this.isEditable('costCenter'),
                cellRenderer: this.requiredCell.bind(this),                
            },
            {
                headerName: 'Payment terms',
                colId: 'paymentTermId',
                field: 'paymentTermId',
                editable: this.makeColumnEditable.bind(this),
                valueFormatter: this.paymentTermFormatter.bind(this),
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: () => {
                    return {
                        values: this.filtererdPaymentList.map((paymentTerm) => paymentTerm.paymentTermsId),
                        displayPropertyName: 'paymentTermsCode',
                        valuePropertyName: 'paymentTermsId',
                        displayFormat: 'paymentTermsCode',
                    };
                },
            },
            {
                headerName: 'Tax code',
                colId: 'vatId',
                field: 'vatId',
                editable: this.makeColumnEditable.bind(this),
                valueFormatter: this.vatCodeFormatter.bind(this),
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: () => {
                    return {
                        values: this.filteredVatsList.map((vats) => vats.vatId),
                        displayPropertyName: 'vatCode',
                        valuePropertyName: 'vatId',
                        displayFormat: 'vatCode',
                    };
                },
            },

            {
                headerName: 'Settlement Ccy.',
                colId: 'settlementCurrency',
                field: 'settlementCurrency',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let issettlementCurrencyEditable = false;
                    if (params.data && (params.data.sectionReference === '' || params.data.sectionReference === null)) {
                        issettlementCurrencyEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable() && issettlementCurrencyEditable,
                        },
                        gridId: 'currenciesGrid',
                        isRequired: false,
                        displayProperty: 'currencyCode',
                        codeProperty: 'currencyCode',
                        descriptionProperty: 'description',
                        valueProperty: 'currencyCode',
                        lightBoxTitle: 'Results for Currencies',
                        options: this.filteredSettlementCurrencyList,
                        showContextualSearchIcon: (!this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode && issettlementCurrencyEditable),
                    };
                },
                onCellValueChanged: this.onContractSelected.bind(this),

            },

            {
                headerName: 'Province',
                colId: 'provinceId',
                field: 'provinceId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isColumnEditable(),
                        },
                        gridId: 'provincesMasterData',
                        isRequired: false,
                        displayProperty: 'stateCode',
                        codeProperty: 'stateCode',
                        descriptionProperty: 'description',
                        valueProperty: 'provinceId',
                        lightBoxTitle: 'Results for Provinces',
                        options: this.filteredProvinceList,
                        showContextualSearchIcon: (!this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode),
                    };
                },
                onCellValueChanged: this.onContractSelected.bind(this),
            },
            {
                headerName: 'Deal No.',
                colId: 'dealNumber',
                field: 'dealNumber',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    let isDealNumberEditable = false;
                    if (params.data && (params.data.sectionReference === '' || params.data.sectionReference === null)) {
                        isDealNumberEditable = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isColumnEditable() && isDealNumberEditable),
                        },
                        gridId: 'fxDealList',
                        isRequired: false,
                        displayProperty: 'dealNumber',
                        valueProperty: 'dealNumber',
                        lightBoxTitle: 'Results for FxDeals',
                        dataLoader: this.fxDealLoader,
                        options: this.filteredFxDeals,
                        showContextualSearchIcon: (!this.isCashDocumentType && !this.isAlreadyAuthorized
                            && !this.isInvoiceDocumentType && !this.isViewMode && isDealNumberEditable),
                    };

                },
                onCellValueChanged: this.onContractSelected.bind(this),

            },
            {
                colId: 'accrualNumber',
                field: 'accrualNumber',
                editable: false,
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
                colId: 'editLineMenu',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.editAccountingDocumentGridContextualMenuActions,

                },
                cellClass: 'ag-contextual-menu',
                width: 60,
            },
        ];
        this.rowStyle = { 'border-bottom': '1px solid #e0e0e0 !important' };
    }

    quantityFormatterInGrid(param) {
        if (param && param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 3);
        }
    }

    formatValue(amount: number): string {
        if (isNaN(amount) || amount === null) { return ''; }
        return new Intl.NumberFormat(this.amountFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    }

    assignValuesToControl() {
        this.amount = 0;
        this.statutoryAmount = 0;
        this.functionalAmount = 0;
        this.errorMessage = this.accountingDocumentData.errorMessage;
        if (!this.errorMessage) {
            this.showErrorMessage = false;
        } else {
            this.errormsg = 'mat-error-message-chip';
        }
        this.docReference = this.accountingDocumentData.documentReference;
        this.docStatus = PostingStatus[this.accountingDocumentData.statusId];
        this.createdBy = this.accountingDocumentData.createdBy;
        this.creationDate = this.accountingDocumentData.createdDateTime ? this.accountingDocumentData.createdDateTime.toDateString() : '';
        this.modifiedBy = this.accountingDocumentData.modifiedBy;
        this.modifiedDate = this.accountingDocumentData.modifiedDateTime ? this.accountingDocumentData.modifiedDateTime.toDateString() : '';
        this.docDateFormCtrl.patchValue(this.accountingDocumentData.documentDate);
        this.valueDateFormCtrl.patchValue(this.accountingDocumentData.valueDate);
        this.glDateFormCtrl.patchValue((this.isAccOrJournalType) ? null : this.accountingDocumentData.glDate);
        this.accPeriodFormCtrl.patchValue(moment(this.accountingDocumentData.accountingPeriod));
        this.interfaceCtrl.patchValue(this.accountingDocumentData.toInterface);
        this.currencyCtrl.patchValue(this.currencyControl);
        if (!this.isCashDocumentType && !this.isAlreadyAuthorized && !this.isInvoiceDocumentType && !this.isViewMode) {
            this.currencyCtrl.enable();
        } else {
            this.currencyCtrl.disable();
        }
        this.accountingDocumentData.accountingDocumentLines.forEach((rowData) => {
            this.amount = Math.round((this.amount + Number(rowData.amount)) * 100) / 100;

            if (this.isDocumentStatusHeld) {
                this.statutoryAmount = Math.round((this.statutoryAmount + Number(rowData.statutoryCurrency)) * 100) / 100;
            }
            if (this.isDocumentStatusHeld) {
                this.functionalAmount = Math.round((this.functionalAmount + Number(rowData.functionalCurrency)) * 100) / 100;
            }
        });
        this.isAlreadyAuthorized = this.accountingDocumentData.statusId === PostingStatus.Authorized ? true : false;
    }

    validateQuantity(params): string {
        let tooltipMessage: string = null;
        const reg = new RegExp('^[0-9.]*$');
        const validQuantity = String(params.value).match(reg);
        if (params.colDef) {
            if (!validQuantity) {
                tooltipMessage = 'Not allowed. Only numeric values allowed';
                params.data.isQuantityValid = false;
            } else {
                tooltipMessage = null;
                params.data.isQuantityValid = true;
            }
        }
        return tooltipMessage;
    }

    validateTaxCode(params): string {
        let tooltipMessage: string = null;

        if (params.colDef) {
            if (params.data.accountingCategory === this.counterPartyAccountingCategory) {
                tooltipMessage = 'Tax code could not be added on a counterparty leg';
                params.data.isTaxCodeValid = false;
            } else {
                tooltipMessage = null;
                params.data.isTaxCodeValid = true;
            }
        }
        return tooltipMessage;
    }

    onEditClicked() {
        this.lockService.isLockedAccountingDocument(this.accountingId)
            .pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                if (lock.isLocked) {
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: lock.message,
                            okButton: 'Got it',
                        },
                    });
                } else {
                    this.lockService.lockAccountingDocument(this.accountingId, LockFunctionalContext.AccountingDocumentEdition)
                        .pipe(takeUntil(this.destroy$)).subscribe(() => {

                            this.isSave = true;
                            this.isViewMode = false;
                            if (!this.isCashDocumentType && !this.isAlreadyAuthorized && !this.isInvoiceDocumentType && !this.isViewMode) {
                                this.enableControls();
                            }
                            this.init();
                            this.initView();
                            this.agGridApi.refreshCells();
                        });

                }
            });
    }

    startLockRefresh(accountingId: number, documentReference: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'Accounting Document';
        resourceInformation.resourceId = accountingId;
        resourceInformation.resourceCode = documentReference;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }

    enableControls() {
        if (this.isEditable('valueDate')) 
        {
            this.valueDateFormCtrl.enable();
        }        
        this.currencyCtrl.enable();
        this.docDateFormCtrl.enable();        
        this.accPeriodFormCtrl.enable();
        this.glDateFormCtrl.enable();
    }

    makeColumnEditable(params): boolean {
        if (this.isColumnEditable()) {
            params.data.isEditable = true;
            return true;
        }
        return false;
    }

    isColumnEditable() {
        if (this.isViewMode === false && !this.isCashDocumentType && !this.isAlreadyAuthorized && !this.isInvoiceDocumentType && this.accountingDocumentData.taTypeId !== PostingDocumentTAType.MonthEndTA) {
            return true;
        }
        return false;
    }

    vatCodeFormatter(params): string {
        if (params.value && this.masterdata.vats) {
            const vatList = this.masterdata.vats.find((x) => x.vatId === params.value);
            if (vatList) {
                return vatList.vatCode;
            }
        }
        return '';
    }

    paymentTermFormatter(params): string {
        if (params.value && this.masterdata.paymentTerms) {
            const paymentTermsList = this.masterdata.paymentTerms.find((x) => x.paymentTermsId === params.value);
            if (paymentTermsList) {
                return paymentTermsList.paymentTermCode;
            }
        }
        return '';
    }

    currencyFormatter(amount: number): string {
        if (amount === null) { return ''; }
        return new Intl.NumberFormat(this.amountFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    }

    currencyFormatterInGrid(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.amountFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(param.value);
    }

    getValuesforControls() {
        this.accountingDocumentData.documentDate = this.docDateFormCtrl.value;
        this.accountingDocumentData.valueDate = this.valueDateFormCtrl.value;
        if (this.glDateFormCtrl.value) {
            this.accountingDocumentData.glDate = this.glDateFormCtrl.value;
        }
        this.accountingDocumentData.accountingPeriod = this.accPeriodFormCtrl.value;
        this.accountingDocumentData.currencyCode = this.currencyCtrl.value.currencyCode;
        this.accountingDocumentData.toInterface = this.interfaceCtrl.value;
    }

    onActionButtonClicked() {
        this.agGridOptions.api.forEachNode((node) => {

            if (this.masterdata.departments && node.data.departmentId) {
                const departement = this.masterdata.departments.find((dept) =>
                    dept.departmentId === node.data.departmentId);
                node.data.departmentId = departement ? departement.description : null;
            }
            if (this.masterdata.costTypes && node.data.costTypeId) {
                const costType = this.masterdata.costTypes.find((cost) =>
                    cost.costTypeId === node.data.costTypeId);
                node.data.costTypeId = costType ? costType.costTypeCode : null;
            }
            if (this.masterdata.vats && node.data.vatId) {
                const vatSelected = this.masterdata.vats.find((vat) =>
                    vat.vatId === node.data.vatId);
                node.data.vatId = vatSelected ? vatSelected.vatCode : null;
            }
            if (this.masterdata.commodities && node.data.commodityId) {
                const commoditySelected = this.masterdata.commodities.find((commodity) =>
                    commodity.commodityId === node.data.commodityId);
                node.data.commodityId = commoditySelected ? commoditySelected.principalCommodity : null;
            }
            if (this.masterdata.paymentTerms && node.data.paymentTermsId) {
                const paymentTermSelected = this.masterdata.paymentTerms.find((paymentTerm) =>
                    paymentTerm.paymentTermsId === node.data.paymentTermsId);
                node.data.paymentTermsId = paymentTermSelected ? paymentTermSelected.paymentTermCode : null;
            }

        });

        const params = {
            sheetName: this.excelSheetName,
        };

        this.agGridOptions.api.exportDataAsExcel(params);
    }

    onDeleteClicked() {
        this.isSave = true;
        if (this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.TA ||
            this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.JL) {
            const confirmDialog = this.deleteConfirmationDialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Accounting Document Deletion',
                    text: 'You are about to delete the document. This action is irreversible. Continue ?',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    const accountingDocumentStatusToDeleted: AccountingDocumentStatusToDeletedCommand
                        = new AccountingDocumentStatusToDeletedCommand();
                    const accountingDocuments: AccountingDocumentStatus[] = [];
                    const accountingDocumentElement: AccountingDocumentStatus = new AccountingDocumentStatus();
                    accountingDocumentElement.accountingId = this.accountingDocumentData.accountingId;
                    accountingDocumentElement.documentType = this.accountingDocumentData.transactionDocumentTypeId;
                    accountingDocumentElement.statusId = this.accountingDocumentData.statusId;
                    accountingDocuments.push(accountingDocumentElement);
                    accountingDocumentStatusToDeleted.accountingDocuments = accountingDocuments;
                    this.preaccountingService.deleteAccountingDocument(accountingDocumentStatusToDeleted).subscribe(() => {
                        this.snackbarService.informationSnackBar('Accounting document deleted successfully');

                    });

                    this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/posting/management']);
                } else {
                    confirmDialog.close();

                }
            });

        } else {
            this.snackbarService.informationSnackBar('Not allowed. Invoices/cash cannot be deleted');
        }
    }

    toggleAuthorizeButton() {
        this.isAuthorizedControlenabled = !this.isAuthorizedControlenabled;
    }

    onToInterfaceButtonClicked() {
        this.isToInterfaceControlenabled = this.interfaceCtrl.value ? true : false;
    }

    onCancelButtonClicked() {
        this.isSave = true;
        if (!this.isViewMode) {
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
                    this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/posting/management']);
                }
            });
        } else {
            this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/posting/management']);
        }

    }

    ngOnDestroy(): void {
        this.stopLockRefresh();
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }

    requiredCell(params) {
        if ((!params.value || params.value === '') && !this.isViewMode && this.isAccOrJournalType) {
            if (params.colDef.colId === 'narrative')  {               
                    return '<div class=\'document-cell-value-required\'>Required*</div>';
              }
        }
        else if(this.isRequired(params.colDef.colId))
        {
            return '<div class=\'document-cell-value-required\'>Required*</div>';
        }
        if (params.colDef.colId === 'accountLineTypeId') {
            if (params.value && typeof params.value !== 'string') {
                const value: AccountLineType = this.filteredAccountLineType.find(
                    (accountLine) => accountLine.accountLineTypeId === params.value);
                params.setValue(value ? value.accountLineTypeCode : null);
            }
            return params.value;
        }
        return params.value;
    }

    requiredCellForCostAmount(params) {
        if ((!params.value || params.value === '') && !this.isViewMode && this.isAccOrJournalType) {
            return '<div class=\'document-cell-value-required\'>Required*</div>';
        }
        if (params.colDef.colId === 'accountLineTypeId') {
            if (params.value && typeof params.value !== 'string') {
                const value: AccountLineType = this.filteredAccountLineType.find(
                    (accountLine) => accountLine.accountLineTypeId === params.value);
                params.setValue(value ? value.accountLineTypeCode : null);
            }
            return params.value;
        }
        params.value = (this.decimalFormatter(
            params.value,
            this.decimalOptionValue,
            this.amountFormat));
        return params.value;
    }

    decimalFormatter(input, decimaloption: number, format: string) {
        const formattedInput = new Intl.NumberFormat(format, { minimumFractionDigits: 2, maximumFractionDigits: decimaloption }).format(input);
        return formattedInput.toLocaleString();
    }

    onContractSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            const selectedNominalAccount = this.filteredContracts.find(
                (contract) => contract.contractLabel.toUpperCase() === params.newValue.toUpperCase(),
            );
            if (selectedNominalAccount) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Contract reference does not exist');
                params.node.setDataValue('sectionId', '');
            } else {
                params.node.setDataValue('departmentId', selectedNominalAccount.departmentDescription);
                params.node.setDataValue('commodityId', selectedNominalAccount.commodity1);
                params.node.setDataValue('charterId', selectedNominalAccount.charterReference);
            }
        }
    }

    onNominalAccountSelected(params) {
        if (params.newValue === '' || (params.newValue && params.oldValue !== params.newValue)) {
            this.nominalAccountFound = null;
            const nominalAccountSelected = this.filteredNominalAccountList.find(
                (nominalAccount) => nominalAccount.accountNumber.toUpperCase() === params.newValue.toUpperCase(),
            );
            if (nominalAccountSelected) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Nominal Account does not exist');
                params.node.setDataValue('accountReference', this.requiredString);
                this.nominalAccountFound = null;
            } else {
                this.nominalAccountFound = nominalAccountSelected;
            }
        }
        if (!this.isViewMode && this.isMtmSelected && params.data.accountReference) {
            const nominalAccountSelected = this.filteredNominalAccountList.find(
                (nominalAccount) => nominalAccount.accountNumber
                    === params.data.accountReference);
            if (nominalAccountSelected) {
                if (nominalAccountSelected && nominalAccountSelected.clientAccountMandatory === 1) {
                    params.node.setDataValue('accountLineTypeId', AccountLineTypes.Bank);
                } else {
                    params.node.setDataValue('accountLineTypeId', AccountLineTypes.Ledger);
                }
            }
        }

    }

    onClientAccountCodeSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            const selectedClientAccount = this.filteredCounterpartyList.filter(
                (clientAccount) => clientAccount.counterpartyCode.toUpperCase() === params.newValue.toUpperCase(),
            );
            if (selectedClientAccount.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : ' + params.colDef.headerName + ' does not exist');
                params.node.setDataValue('associatedAccountCode', '');
            }
        }
    }

    onClientAccountIdSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            const selectedClientAccount = this.filteredCounterpartyList.filter(
                (clientAccount) => clientAccount.counterpartyID === params.newValue,
            );
            if (selectedClientAccount.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : ' + params.colDef.headerName + ' does not exist');
                params.node.setDataValue('clientAccountId', params.oldValue);
            }
        }
    }

    onCostTypeSelected(params) {
        if (params.newValue === '' || (params.newValue && params.oldValue !== params.newValue)) {
            const selectedCostType = this.filteredCostTypeList.filter(
                (costType) => costType.costTypeId === params.newValue,
            );
            if (selectedCostType.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Cost Type does not exist');
                params.node.setDataValue('costTypeId', this.requiredString);
            }
        }
    }

    onAccountLineTypeSelected(params) {
        if (params.newValue === '' || (params.newValue && params.oldValue !== params.newValue)) {
            const selectedAccountLineType = this.filteredAccountLineType.filter(
                (accountLineType) => accountLineType.accountLineTypeId === params.newValue,
            );
            if (selectedAccountLineType.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Account Line Type does not exist');
                params.node.setDataValue('accountLineTypeId', this.requiredString);
            }
        }
    }
    onDepartmentSelected(params) {
        if (params.newValue === '' || (params.newValue && params.oldValue !== params.newValue)) {
            const selectedDepartment = this.filteredDepartmentList.filter(
                (department) => department.departmentId === params.newValue,
            );
            if (selectedDepartment.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Department does not exist');
                params.node.setDataValue('departmentId', this.requiredString);
            }
        }
    }

    onCommoditySelected(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            const selectedCommodity = this.filteredCommodityList.filter(
                (commodity) => commodity.commodityId === params.newValue,
            );
            if (selectedCommodity.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Commodity does not exist');
                params.node.setDataValue('commodityId', null);
            }
        }
    }

    onCharterSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            const selectedCharter = this.filteredCharter.filter(
                (charter) => charter.charterId === params.newValue,
            );
            if (selectedCharter.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Charter does not exist');
                params.node.setDataValue('charterId', null);
            }
        }
    }

    onDocumentSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            const selectedNominalAccount = this.filteredDocuments.filter(
                (document) => document.docRef.toUpperCase() === params.newValue.toUpperCase(),
            );
            if (selectedNominalAccount.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Document reference does not exist');
                params.node.setDataValue('SecondaryDocumentReference', '');
            }
        }
    }

    onCellValueChanged(params) {
        this.amount = 0;
        this.statutoryAmount = 0;
        this.functionalAmount = 0;
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.agGridColumnApi.autoSizeAllColumns();
            if (params.colDef) {
                const columnChanged: string = params.colDef.field;
                if (columnChanged === this.amountColumn || columnChanged === this.statutoryCurrencyColumn
                    || columnChanged === this.functionalCurrencyColumn) {
                    this.amount = 0;

                    this.agGridApi.forEachNode((rownode) => {
                        if (rownode.data.amount === 0) {
                            rownode.data.amount = null;
                        }
                        if (rownode.data.amount || rownode.data.statutoryCurrency || rownode.data.functionalCurrency) {
                            this.amount = Math.round((this.amount + Number(rownode.data.amount)) * 100) / 100;
                            if (this.isDocumentStatusHeld) {
                                this.functionalAmount = Math.round(
                                    (this.functionalAmount + Number(rownode.data.functionalCurrency)) * 100) / 100;
                                this.statutoryAmount = Math.round(
                                    (this.statutoryAmount + Number(rownode.data.statutoryCurrency)) * 100) / 100;
                            }
                        }
                    });
                    if (Number(params.newValue) === 0) {
                        this.snackbarService.throwErrorSnackBar(params.colDef.headerName + ' cannot be zero');
                    }
                } else if (columnChanged === this.nominalAccount) {
                    if (this.nominalAccountFound && this.nominalAccountFound.clientAccountMandatory === 1) {
                        if (params.data && !params.data.clientAccountId) {
                            params.node.setDataValue('clientAccountId', this.requiredString);
                        }
                    }
                }
                if (this.amount !== 0) {
                    this.snackbarService.throwErrorSnackBar('Not allowed : Sum of amount should be zero');
                }
                if (this.statutoryAmount !== 0) {
                    this.snackbarService.throwErrorSnackBar('Not allowed : Sum of Statutory currency should be zero');
                }
                if (this.functionalAmount !== 0) {
                    this.snackbarService.throwErrorSnackBar('Not allowed : Sum of Functional Currency should be zero');
                }
            }
        }
    }

    isRowDirty(rowData) {
        let isRowDataValid: boolean = false;
        this.columnDefs.forEach((column) => {
            if (!isRowDataValid) {
                isRowDataValid = this.validateEmpty(column.colId, rowData);
            }
        });
        return isRowDataValid;
    }

    getRequiredColumn() {
        let item = [];
        item = this.accountCreationConfiguration.filter((x) => x.isMandatory);
        return item;
    }


    validateGridData(): string {
        let errorMessage: string = '';
        let isRowDataValid: boolean;
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty || this.isRowDirty(rowData)) {
                isRowDataValid = false;
                if (!rowData.data[this.accountingDocumentId]) {
                    isRowDataValid = true;
                    let addNewRowCheck: boolean = true;
                    let columnConfiguration = this.getRequiredColumn();
                    columnConfiguration.forEach((column) => {
                        if (isRowDataValid) {
                            let isValidateEmpty: boolean = false;
                            isValidateEmpty = this.validateEmpty(column.id, rowData);
                            if (!isValidateEmpty) {
                                addNewRowCheck = isValidateEmpty;
                            }
                            isRowDataValid = isValidateEmpty;
                        }
                    });
                    isRowDataValid = !addNewRowCheck;
                } else {
                    let columnConfiguration = this.getRequiredColumn();
                    columnConfiguration.forEach((column) => {
                        if (!isRowDataValid) {
                            isRowDataValid = this.validateEmpty(column.id, rowData);
                        }
                    });
                }
                                    
                if ((this.isAccrualDocument || this.isMtmSelected) && (!rowData.data.accrualNumber)) 
                {
                    errorMessage = 'Accrual numbers are mandatory';
                } else if (this.amount !== 0) {
                    errorMessage = 'Total Amount should be zero';
                } else if (this.statutoryAmount !== 0) {
                    errorMessage = 'Total Statutory Currency should be zero';
                } else if (this.functionalAmount !== 0) {
                    errorMessage = 'Total Functional Currency should be zero';
                }
                else if (isRowDataValid)
                {
                    errorMessage = 'Grid data is invalid. Please resolve the errors.';
                }
            }
        });
        return errorMessage;
    }

    getGridData(): AccountingDocumentLine[] {
        const accountingDocumentLines = new Array<AccountingDocumentLine>();
        let isRowDataValid: boolean;
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty || this.isRowDirty(rowData)) {
                isRowDataValid = false;
                if (!rowData.data[this.accountingDocumentId]) {
                    isRowDataValid = true;
                    let addNewRowCheck: boolean = true; 
                    let columnConfiguration = this.getRequiredColumn();
                    columnConfiguration.forEach((column) => {
                        if (isRowDataValid) {
                            let isValidateEmpty: boolean = false;
                            isValidateEmpty = this.validateEmpty(column.id, rowData);
                            if (!isValidateEmpty) {
                                addNewRowCheck = isValidateEmpty;
                            }
                            isRowDataValid = isValidateEmpty;
                        }
                    });
                    isRowDataValid = !addNewRowCheck;
                } else {
                    let columnConfiguration = this.getRequiredColumn();
                    columnConfiguration.forEach((column) => {
                        if (!isRowDataValid) {
                            isRowDataValid = this.validateEmpty(column.id, rowData);
                        }
                    });
                    isRowDataValid = !isRowDataValid;
                }
                if (isRowDataValid) {
                    const accountingDocumentLineElement = new AccountingDocumentLine();
                    accountingDocumentLineElement.accountingDocumentLineId = rowData.data.accountingDocumentLineId;
                    accountingDocumentLineElement.accountReferenceId = null;
                    if (rowData.data.accountReference) {
                        const account = this.filteredNominalAccountList.find((nominal) =>
                            nominal.accountNumber.toUpperCase() === rowData.data.accountReference.toUpperCase());
                        accountingDocumentLineElement.accountReferenceId = account ? account.nominalAccountId : null;
                    }

                    accountingDocumentLineElement.clientAccountId = rowData.data.clientAccountId;

                    accountingDocumentLineElement.associatedAccountId = null;
                    if (rowData.data.associatedAccountCode) {
                        const counterparty: Counterparty = this.filteredCounterpartyList.find((client) =>
                            client.counterpartyCode.toUpperCase() === rowData.data.associatedAccountCode.toUpperCase());
                        accountingDocumentLineElement.associatedAccountId = counterparty ? counterparty.counterpartyID : null;
                    }

                    accountingDocumentLineElement.accountLineTypeId = rowData.data.accountLineTypeId;
                    accountingDocumentLineElement.costTypeId = rowData.data.costTypeId;
                    accountingDocumentLineElement.amount = rowData.data.amount;
                    accountingDocumentLineElement.statutoryCurrency = rowData.data.statutoryCurrency;
                    accountingDocumentLineElement.functionalCurrency = rowData.data.functionalCurrency;
                    accountingDocumentLineElement.narrative = rowData.data.narrative;
                    accountingDocumentLineElement.departmentId = rowData.data.departmentId;
                    accountingDocumentLineElement.provinceId = rowData.data.provinceId;
                    accountingDocumentLineElement.settlementCurrency = rowData.data.settlementCurrency;
                    accountingDocumentLineElement.dealNumber = rowData.data.dealNumber;
                    accountingDocumentLineElement.secondaryDocumentReference = rowData.data.secondaryDocumentReference;
                    accountingDocumentLineElement.clientReference = rowData.data.extDocReference;

                    if (typeof rowData.data.sectionReference === 'number') {
                        accountingDocumentLineElement.sectionId = rowData.data.sectionId;
                    } else {
                        accountingDocumentLineElement.sectionId = (rowData.data.sectionReference === null ||
                            rowData.data.sectionReference.trim() === '') ? null :
                            this.filteredContracts.find((contract) =>
                                contract.contractLabel.toUpperCase() === rowData.data.sectionReference.toUpperCase()).sectionId;
                    }

                    accountingDocumentLineElement.commodityId = rowData.data.commodityId;
                    accountingDocumentLineElement.quantity = rowData.data.quantity;
                    accountingDocumentLineElement.charterId = rowData.data.charterId;
                    accountingDocumentLineElement.costCenter = rowData.data.costCenter;
                    accountingDocumentLineElement.paymentTermId = rowData.data.paymentTermId;
                    accountingDocumentLineElement.vatId = rowData.data.vatId;
                    accountingDocumentLineElement.accrualNumber = rowData.data.accrualNumber;
                    accountingDocumentLineElement.journalLineId = rowData.data.journalLineId;

                    accountingDocumentLines.push(accountingDocumentLineElement);
                } else {
                    this.agGridApi.updateRowData({ remove: [rowData.data] });
                }
            } else {
                this.agGridApi.updateRowData({ remove: [rowData.data] });
            }
        },
        );
        return accountingDocumentLines;
    }

    isRequired(params: string): boolean {
        let isAccuralOrMTM = this.isAccrualDocument || this.isMtmSelected; 
        if (this.accountCreationConfiguration.length > 0) {            
            const result = this.accountCreationConfiguration[this.accountCreationConfiguration.findIndex((x) => x.id === params)];
            if(result)
            {
                return result.isMandatory;
            }           
        }
        return false;
    }

    isEditable(params: string): boolean {
        if (this.accountCreationConfiguration.length > 0) {            
            const result = this.accountCreationConfiguration[this.accountCreationConfiguration.findIndex((x) => x.id === params)];
            if(result)
            {
                return result.isEditable;
            }
        }
        return false;
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
        if(this.isRequired('accountingPeriod'))
        {
            this.accPeriodFormCtrl.setValidators(Validators.compose([Validators.required]));
        }
        this.docDateFormCtrl.setValidators(Validators.compose([Validators.required]));        
       
        if (this.isRequired('valueDate')) 
        {
            this.valueDateFormCtrl.setValidators(Validators.compose([Validators.required]));
        }

       
    }
    isValueDateBeforeDocumentDate() {
        const result = isDateTwoBeforeDateOne(this.docDateFormCtrl.value, this.valueDateFormCtrl.value);
        if (result) {
            return result;
        }
    }

    accountPeriodChanged(event) {
        const lastDateOfMonth = this.companyManager.getCurrentCompanyDate();
        // Acounting Period Rules for Regular Journal
        if (!this.isAccrualDocument) {
            if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                if ((event.year() === this.lastMonthClosed.getFullYear() && event.month() <= this.lastMonthClosed.getMonth())
                    || (event.year() < this.lastMonthClosed.getFullYear())) {
                    this.snackbarService.informationSnackBar('Not allowed: Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed + '; please check the accounting period');
                    this.accPeriodFormCtrl.patchValue('');
                } else if (event.year() === this.operationsLastMonthClosed.getFullYear() &&
                    event.month() === this.operationsLastMonthClosed.getMonth()) {
                    this.snackbarService.informationSnackBar('Please check document date and accounting period');
                } else if ((!this.checkIfBetweenLastClosedAndOperations(event)) &&
                    (event.year() === this.operationsLastMonthClosed.getFullYear() &&
                        event.month() < this.operationsLastMonthClosed.getMonth())) {
                    this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed
                        + '; The document date and the accounting period must be in an open month');
                    this.accPeriodFormCtrl.patchValue('');
                }
            } else {
                if ((event.year() === this.operationsLastMonthClosed.getFullYear() &&
                    event.month() === this.operationsLastMonthClosed.getMonth()) ||
                    (event.year() === this.lastMonthClosed.getFullYear() && event.month() <= this.lastMonthClosed.getMonth())
                    || (event.year() < this.lastMonthClosed.getFullYear())) {
                    this.snackbarService.informationSnackBar('Not allowed: Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed + '; please check the accounting period');
                    this.accPeriodFormCtrl.patchValue('');
                } else if ((!this.checkIfBetweenLastClosedAndOperations(event)) &&
                    (event.year() === this.operationsLastMonthClosed.getFullYear() &&
                        event.month() < this.operationsLastMonthClosed.getMonth())) {
                    this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed
                        + '; The document date and the accounting period must be in an open month');
                    this.accPeriodFormCtrl.patchValue('');
                }
            } // Acounting Period Rules for Accrual
        } else {
            const isLessOrEqualToLastMonthClosed = (event.year() === this.lastMonthClosed.getFullYear()
                && event.month() <= this.lastMonthClosed.getMonth())
                || event.year() < this.lastMonthClosed.getFullYear();
            if (isLessOrEqualToLastMonthClosed) {
                this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
                this.accPeriodFormCtrl.patchValue('');
            } else {
                if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                    if (!((event.year() === lastDateOfMonth.year() && event.month() === lastDateOfMonth.month()) ||
                        (event.year() === this.operationsLastMonthClosed.getFullYear() &&
                            event.month() === this.operationsLastMonthClosed.getMonth()) ||
                        (this.checkIfBetweenLastClosedAndOperations(event)))) {
                        this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                            this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                            this.monthNameForoperationsLastMonthClosed
                            + '; The document date and the accounting period must be in an open month');
                        this.accPeriodFormCtrl.patchValue('');
                    }
                } else if (!(this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) &&
                    event.year() === this.operationsLastMonthClosed.getFullYear() &&
                    event.month() === this.operationsLastMonthClosed.getMonth() ||
                    (event.year() === this.lastMonthClosed.getFullYear() && event.month() <= this.lastMonthClosed.getMonth())
                    || (event.year() < this.lastMonthClosed.getFullYear())) {
                    this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
                    this.accPeriodFormCtrl.patchValue('');
                } else if (!this.checkIfBetweenLastClosedAndOperations(event) &&
                    (event.year() === this.operationsLastMonthClosed.getFullYear() &&
                        event.month() < this.operationsLastMonthClosed.getMonth())) {
                    this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
                    this.accPeriodFormCtrl.patchValue('');
                }
            }
        }
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

    documentDateChanged(event) {
        const isAccountingAndOperationMonthSame = this.operationsLastMonthClosed.getFullYear() === this.lastMonthClosed.getFullYear()
            && this.operationsLastMonthClosed.getMonth() === this.lastMonthClosed.getMonth();
        // Regular Journal Rules
        if (!this.isAccrualDocument) {
            // Date within a closed period
            if ((event.value.year() === this.lastMonthClosed.getFullYear() && event.value.month() <= this.lastMonthClosed.getMonth())
                || (event.value.year() < this.lastMonthClosed.getFullYear())) {
                this.snackbarService.informationSnackBar('Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; please check the accounting period');
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
            } else if (event.value.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.value.month() === this.operationsLastMonthClosed.getMonth()) {
                if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                    this.accPeriodFormCtrl.patchValue(moment(this.accountingSetupModel.lastMonthClosedForOperation));
                } else {
                    this.snackbarService.informationSnackBar('Last closed accounting period is ' +
                        this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                        this.monthNameForoperationsLastMonthClosed + ' ; please check the accounting period');
                    this.accPeriodFormCtrl.patchValue(moment(new Date(new Date(this.operationsLastMonthClosed).
                        setMonth(this.operationsLastMonthClosed.getMonth() + 1))));
                } // Date between last closed accounting period – last month closed for operation
            } else if (this.checkIfBetweenLastClosedAndOperations(event.value)) {
                if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege)) {
                    this.accPeriodFormCtrl.patchValue(event.value);
                } else {
                    this.accPeriodFormCtrl.patchValue(moment(new Date(new Date(this.operationsLastMonthClosed).
                        setMonth(this.operationsLastMonthClosed.getMonth() + 1))));
                }
            } else if (!this.checkIfBetweenLastClosedAndOperations(event.value) &&
                event.value.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.value.month() < this.operationsLastMonthClosed.getMonth()) {
                this.snackbarService.throwErrorSnackBar('Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
            } // Accrual Document date Rules
        } else {
            const todayDate = this.companyManager.getCurrentCompanyDate();
            if ((event.value.year() === this.lastMonthClosed.getFullYear() && event.value.month() <= this.lastMonthClosed.getMonth())
                || (event.value.year() < this.lastMonthClosed.getFullYear())) {
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
                this.snackbarService.informationSnackBar('Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; please check the accounting period');
                this.accPeriodFormCtrl.patchValue(event.value);
            } else if (!this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
                event.value.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.value.month() === this.operationsLastMonthClosed.getMonth()) {
                this.snackbarService.informationSnackBar('Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + 'The document date and the accounting period must be in an open month');
                this.docDateFormCtrl.patchValue('');
            } else if (!this.checkIfBetweenLastClosedAndOperations(event.value) &&
                event.value.year() === this.operationsLastMonthClosed.getFullYear() &&
                event.value.month() < this.operationsLastMonthClosed.getMonth()) {
                this.docDateFormCtrl.patchValue('');
                this.accPeriodFormCtrl.patchValue('');
                this.snackbarService.throwErrorSnackBar('Not allowed: Last closed accounting period is ' +
                    this.monthNameForlastMonthClosed + ' and Last month closed for operation is ' +
                    this.monthNameForoperationsLastMonthClosed + '; The document date and the accounting period must be in an open month');
            } else {
                this.accPeriodFormCtrl.patchValue(event.value);
            }
        }
    }

    checkAccrualNumber() {
        if (!this.isAuthorizedControlenabled) {
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
                } else if (!answer && (this.isCashDocumentType || this.isInvoiceDocumentType)) {
                    this.disableControls();
                }
            });
        } else {
            const groupByAccrual = [];
            let isValid: boolean = true;

            this.agGridApi.forEachNode((document) => {
                groupByAccrual[document.data.accrualNumber] = groupByAccrual[document.data.accrualNumber] || [];
                groupByAccrual[document.data.accrualNumber].push({ amount: document.data.amount });
            });
            groupByAccrual.forEach((array) => {
                if (isValid) {
                    let totalSubAmount: number = 0;
                    array.forEach((element) => { totalSubAmount = totalSubAmount + element.amount; });
                    if (totalSubAmount !== 0) {
                        isValid = false;
                        this.snackbarService.throwErrorSnackBar('Accrual numbers : Invalid format. '
                            + 'Rows flagged with the same accrual numbers must be balanced (Amount=0.00)');
                    }
                }
            });
            if (isValid) {
                this.afterValidationChecksPassed();
            }
        }
    }

    submitForm() {
        this.isSave = true;
        this.agGridApi.stopEditing();
        this.enableControls();
        if (this.editDocumentFormGroup.valid) {
            const errorMessage = this.validateGridData();
            if (errorMessage === '') {
                this.checkAccrualNumber();
            } else { this.snackbarService.throwErrorSnackBar(errorMessage); }
        } else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
        }
    }

    afterValidationChecksPassed() {
        this.accountingDocumentData.accountingDocumentLines = this.getGridData();
        this.getValuesforControls();
        this.preaccountingService
            .updateAccoutingDocuments(this.accountingDocumentData, this.isAuthorizedControlenabled)
            .subscribe(
                () => {
                    if (this.isAuthorizedControlenabled) {
                        this.subscriptions.push(this.preaccountingService.authorizeForPosting(this.documentRefData).subscribe(
                            () => {
                                this.snackbarService.informationSnackBar('Accounting Document updated');
                                this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId()
                                    + '/financial/posting/management']);
                            },
                            (error) => {
                                console.error(error);

                            },
                        ));
                    } else {
                        this.snackbarService.informationSnackBar('Accounting Document updated');
                        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/posting/management']);
                    }

                });

    }
    onExportButtonClickedAsExcel() {
        this.agGridOptions.api.exportDataAsExcel();
    }

    onExportButtonClickedAsCSV() {
        this.agGridOptions.api.exportDataAsCsv();
    }

    onLoadPreviousPageButtonClicked() {
        this.isSave = true;
        this.location.back();
    }

    onAddAccountingLineButtonClicked(numberOfLines: number) {
        this.isSave = true;
        for (let count = 1; count <= numberOfLines; count++) {
            const newItem = new AccountingDocumentLine();
            newItem.clientAccountId = null;
            newItem.associatedAccountCode = null;
            newItem.secondaryDocumentReference = null;
            newItem.sectionReference = null;
            newItem.commodityId = null;
            newItem.charterId = null;
            newItem.accountReference = null;
            newItem.accountLineTypeId = null;
            newItem.costTypeId = null;
            newItem.departmentId = null;
            newItem.amount = null;
            this.agGridApi.updateRowData({ add: [newItem] });
            this.agGridColumnApi.autoSizeAllColumns();
        }
    }

    handleAction(action: string, documentLine: AccountingDocumentLine) {
        switch (action) {
            case this.editDocumentMenuActions.copyDocumentLine:
                const newManualLine: AccountingDocumentLine = new AccountingDocumentLine(documentLine);
                this.agGridApi.updateRowData({ add: [newManualLine] });
                this.calculateTotalAmount();
                this.snackbarService.informationSnackBar('Row added successfully at the end of the grid');
                break;
            case this.editDocumentMenuActions.deleteDocumentLine:
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
                        this.agGridApi.updateRowData({ remove: [documentLine] });
                        this.calculateTotalAmount();
                    }
                });
                this.subscriptions.push(confirmationDeleteSubscription);
                break;
            default: throw new Error('Unknown action');
        }

    }

    calculateTotalAmount() {
        this.amount = 0;
        this.statutoryAmount = 0;
        this.functionalAmount = 0;
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.amount) {
                this.amount = Math.round((this.amount + Number(rowData.data.amount)) * 100) / 100;
            }
            if (rowData.data.statutoryCurrency && this.isDocumentStatusHeld) {
                this.statutoryAmount = Math.round((this.statutoryAmount + Number(rowData.data.statutoryCurrency)) * 100) / 100;
            }
            if (rowData.data.functionalCurrency && this.isDocumentStatusHeld) {
                this.functionalAmount = Math.round((this.functionalAmount + Number(rowData.data.functionalCurrency)) * 100) / 100;
            }
        });
    }

    initializeStatusClass() {
        if (this.accountingDocumentData.statusId === PostingStatus.MappingError
            || this.accountingDocumentData.statusId === PostingStatus.Held) {
            this.statusClassApplied = 'mat-error-message-chip';
        } else if (this.accountingDocumentData.statusId === PostingStatus.Incomplete
            || this.accountingDocumentData.statusId === PostingStatus.Deleted) {
            this.statusClassApplied = 'mat-neutral-message-chip';
        } else if (this.accountingDocumentData.statusId === PostingStatus.Authorized) {
            this.statusClassApplied = 'mat-success status-chip';
        }

    }

    isNullOrEmpty(data,validateZero : boolean = false) : boolean
    {
        if( data &&  data.toString().trim()!='' && data.toString().trim() !='Required*')
        {
            if(validateZero && data.toString().trim() === '0')
            {
                return true;              
            }
            return false;
        }
        return true;       
    }

    validateEmpty(colId: string, rowData: any) {
        let inValidRow : boolean = false;   
        let isAccuralOrMTM = this.isAccrualDocument || this.isMtmSelected;  
        let headerFieldNotRequiredValidation = ["valueDate","accountingPeriod","paymentDocumentDate" ];
        let fieldNotRequiredValidationNumber =  ["settlementCurrency","dealNumber",'accrualNumber'];       
        
        //Apply explicit if Doc is Accrual & MTM and Column is AccuralNumber
        if(isAccuralOrMTM && colId == "accrualNumber")
        {
           inValidRow = this.isNullOrEmpty(rowData.data[colId]);
        }
        // We are escaping Header Fiele Validation
        else if(!headerFieldNotRequiredValidation.includes(colId) && this.isRequired(colId))
        {         
            if(colId==="accountReferenceId") {colId = "accountReference";}
            else if(colId==="associatedAccountId"){ colId="associatedAccountCode";}
            // If there is MTM => Section is not required   
            if(this.isMtmSelected)        
            {
                inValidRow = colId=='sectionId' ? false : this.isNullOrEmpty(rowData.data[colId], colId==='amount');
            }
            else       
            {
                // For Accrual and Journal => settlementCurrency and dealNumber are not required
                // SettlementCurrency and dealNumber are npot required in configuration               
                inValidRow = fieldNotRequiredValidationNumber.includes(colId) ?
                                false : this.isNullOrEmpty(rowData.data[colId],colId==='amount');   
                             
            }
        } 
        return inValidRow;
    }

    displayErrorMessages() {
        if (this.accountingDocumentData.errorMessage) {
            const messages = this.accountingDocumentData.errorMessage.split(';');
            this.showErrorBanners = true;
            messages.forEach((message) => {
                if (message) {
                    this.mappingErrorMessages.push(message);
                }
            });

        }
    }
    onWarningRemoveButtonClicked(params) {
        if (params) {
            params.currentTarget.parentElement.parentElement.remove();
        }
    }
    showHideMtmColumn() {
        this.agGridColumnApi.setColumnVisible(this.dealNumberColumn, true);
        this.agGridColumnApi.setColumnVisible(this.settlementCurrencyColumn, true);
        this.agGridColumnApi.setColumnVisible(this.provinceColumn, true);
        this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, true);
        this.agGridColumnApi.setColumnVisible(this.clientAccountColumn, false);
        this.agGridColumnApi.setColumnVisible(this.secondaryDocumentReferenceColumn, false);
        this.agGridColumnApi.setColumnVisible(this.externalDocumentReferenceColumn, false);
        this.agGridColumnApi.setColumnVisible(this.costCenterColumn, false);
        this.initializeGridColumns();
    }
    filterAccountLineTypes(value: any, options: any[], rowData: any): any[] {
        let accountLineTypeList = [];
        accountLineTypeList = options;
        if (rowData.accountReference) {
            const nominalAccountSelected = this.filteredNominalAccountList.find(
                (nominalAccount) => nominalAccount.accountNumber
                    === rowData.accountReference);
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

}
