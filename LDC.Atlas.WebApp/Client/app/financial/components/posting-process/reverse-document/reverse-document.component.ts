import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatMenuTrigger, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AccountingEntriesSearchResult } from '../../../../shared/dtos/accountingEntries-search-result';
import { DocumentReferenceSearchResult } from '../../../../shared/dtos/list-and-search/document-reference-search-result';
import { AccountingSetup } from '../../../../shared/entities/accounting-setup.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { CreateTransactionDocument } from '../../../../shared/entities/create-transaction-document.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { ManualJournalLine } from '../../../../shared/entities/manual-journal-document-line.entity';
import { ManualJournalDocument } from '../../../../shared/entities/manual-journal-document.entity';
import { PostingManagement } from '../../../../shared/entities/posting-management.entity';
import { ReversalAccountingDocument } from '../../../../shared/entities/reversal-accounting-document.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { PostingDocumentType } from '../../../../shared/enums/posting-document-type.enum';
import { ReversalDocumentDisplayView } from '../../../../shared/models/reversal-document-display-view';
import { TransactionDetailDisplayView } from '../../../../shared/models/transaction-detail-display-view';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { DocumentReferenceDataLoader } from '../../../../shared/services/preaccounting/document-reference-data-loader';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UiService } from '../../../../shared/services/ui.service';
import { UtilService } from '../../../../shared/services/util.service';
import { ReverseDocumentCreateComponent } from './reverse-document-create/reverse-document-create.component';
import { ReverseDocumentSummaryComponent } from './reverse-document-summary/reverse-document-summary.component';

@Component({
    selector: 'atlas-reverse-document',
    templateUrl: './reverse-document.component.html',
    styleUrls: ['./reverse-document.component.scss'],
    providers: [DocumentReferenceDataLoader],
})

export class ReverseDocumentComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild(ReverseDocumentCreateComponent) childReverseDocumentCreateComponent: ReverseDocumentCreateComponent;
    @ViewChild(ReverseDocumentSummaryComponent) childReverseDocumentSummaryComponent: ReverseDocumentSummaryComponent;
    reverseDocumentGridCols: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    currentStep: number = 0;
    company: string;
    filteredDocumentReferences: DocumentReferenceSearchResult[];
    allDocumentReferences: DocumentReferenceSearchResult[];
    searchTerm: string;
    searchForm: FormGroup;
    accountingId: number;
    accountingDocumentLine: AccountingEntriesSearchResult[];
    documentRefData: ReversalDocumentDisplayView[];
    accountingDocumentData: ReversalAccountingDocument;
    documentCtrl = new AtlasFormControl('documentCtrl');
    createDocumentFormGroup: FormGroup;
    private getAccountingLinesByDocumentIdSubscription: Subscription;
    private getTransactionDetailSunscription: Subscription;
    transactionData: TransactionDetailDisplayView[];
    transactionDocumentId: number;
    documentReference: string;
    reversedDocumentReference: string;
    reversedTransactionDocumentId: number;
    transactionDocumentTypeId: number;
    disableButton: boolean = true;
    disableNextButton: boolean = true;
    isSave: boolean = false;
    createAccountingDocumentLines: ManualJournalLine[] = [];
    reverseManualJournalDocument: ManualJournalDocument;
    createTransactionDocument: CreateTransactionDocument;
    subscription: Subscription[] = [];
    noOfAccountingEntries: number = 0;
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();

    warningMessage: string;
    isWarningMessage: boolean;
    isReversalDateBefore: boolean;
    isReversalDateAfter: boolean;
    isAccrualDocument: boolean = false;

    accountingDocDetail: PostingManagement;
    accountingSetupModel: AccountingSetup;
    operationsLastMonthClosed: Date;
    lastMonthClosed: Date;
    isAnyAmountColumnZero: boolean = false;
    actionResult: boolean = false;
    monthNameForlastMonthClosed: string;
    monthNameForoperationsLastMonthClosed: string;
    documentDateSelected: Date;
    monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    postOpClosedPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'POSTOPCLOSED',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'POSTINGMGT',
    };

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private route: ActivatedRoute,
        private router: Router,
        protected utilService: UtilService,
        public documentReferenceDataLoader: DocumentReferenceDataLoader,
        private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private uiService: UiService,
        private preaccountingService: PreaccountingService,
        private executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        private authorizationService: AuthorizationService,
        protected companyManager: CompanyManagerService,
        protected lockService: LockService,
        private titleService: TitleService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
        this.searchForm = this.formBuilder.group({
            searchReferenceCtrl: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.initializeGridColumns();
        this.titleService.setTitle(this.route.snapshot.data.title);

        this.documentReferenceDataLoader.getData().subscribe((documents) => {
            this.filteredDocumentReferences = documents;
            this.allDocumentReferences = documents;
        });

        this.documentCtrl.valueChanges.subscribe((input) => {
            this.filteredDocumentReferences = this.utilService.filterListforAutocomplete(
                input,
                this.allDocumentReferences,
                ['documentReference'],
            );
        });

        this.subscription.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
                this.operationsLastMonthClosed = new Date(new
                    Date(this.accountingSetupModel.lastMonthClosedForOperation).toDateString());
                this.lastMonthClosed = new Date(new
                    Date(this.accountingSetupModel.lastMonthClosed).toDateString());
                this.monthNameForlastMonthClosed = this.monthNames[this.lastMonthClosed.getMonth()];
                this.monthNameForoperationsLastMonthClosed = this.monthNames[this.operationsLastMonthClosed.getMonth()];
            }));

        this.getFormGroup();

        this.atlasAgGridParam = this.gridService.getAgGridParam();

    }

    canDeactivate() {
        if (this.createDocumentFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    getFormGroup() {
        this.createDocumentFormGroup = this.formBuilder.group({
            documentCtrl: this.documentCtrl,
        });
        return super.getFormGroup();
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.reverseDocumentGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.agGridApi.setRowData([]);
    }

    initializeGridColumns() {
        this.reverseDocumentGridCols = [
            {
                headerName: 'Doc. Ref.',
                field: 'documentReference',
                colId: 'documentReference',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Posting Line No',
                field: 'postingLineId',
                colId: 'postingLineId',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Nom. Account',
                field: 'nomAccount',
                colId: 'nomAccount',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Match Flag',
                field: 'matchFlag',
                colId: 'matchFlag',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Client Ref.',
                field: 'clientReference',
                colId: 'clientReference',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Cost Type',
                field: 'costType',
                colId: 'costType',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Cost Center',
                field: 'costCenter',
                colId: 'costCenter',
                hide: false,
                editable: false,
            },
            {
                headerName: 'DMS ID',
                field: 'dmsId',
                colId: 'dmsId',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                colId: 'amount',
                type: 'numericColumn',
                valueFormatter: this.NumberFormatterForTotalInGrid.bind(this),
                hide: false,
                editable: false,
            },
            {
                headerName: 'Dept',
                field: 'department',
                colId: 'department',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Associate A/c',
                field: 'associatedAccountCode',
                colId: 'associatedAccountCode',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Payment Terms',
                field: 'paymentTerm',
                colId: 'paymentTerm',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract No',
                field: 'contractSectionCode',
                colId: 'contractSectionCode',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Sec. Ref.',
                field: 'sectionReference',
                colId: 'sectionReference',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Ccy',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Acc. Period',
                field: 'accountingPeriod',
                colId: 'accountingPeriod',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Doc. Date',
                field: 'documentDate',
                colId: 'documentDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Value Date',
                field: 'valueDate',
                colId: 'valueDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Posted Date',
                field: 'postedDate',
                colId: 'postedDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Functional Currency',
                field: 'functionalCurrency',
                colId: 'functionalCurrency',
                hide: false,
                editable: false,
                type: 'numericColumn',
                valueFormatter: this.NumberFormatterForTotalInGrid.bind(this)
            },
            {
                headerName: 'Statutory Currency',
                field: 'statutoryCurrency',
                colId: 'statutoryCurrency',
                hide: false,
                editable: false,
                type: 'numericColumn',
                valueFormatter: this.NumberFormatterForTotalInGrid.bind(this)
            },
            {
                headerName: 'Secure Payment',
                field: 'securePayment',
                colId: 'securePayment',
                hide: false,
                editable: false,
            },
            {
                headerName: 'VAT TurnOver',
                field: 'vatTurnover',
                colId: 'vatTurnover',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Account Category',
                field: 'accountCategory',
                colId: 'accountCategory',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Province',
                field: 'province',
                colId: 'province',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Pre-match',
                field: 'preMatch',
                colId: 'preMatch',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Interface Status',
                field: 'interfaceStatus',
                colId: 'interfaceStatus',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Original Ref.',
                field: 'originalReferenceId',
                colId: 'originalReferenceId',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Payee',
                field: 'payee',
                colId: 'payee',
                hide: false,
                editable: false,
            },
            {
                headerName: 'R.O.E.',
                field: 'roe',
                colId: 'roe',
                hide: false,
                editable: false,
            },
            {
                headerName: 'ROE Type M/D',
                field: 'roeType',
                colId: 'roeType',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Commodity',
                field: 'commodity',
                colId: 'commodity',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Accrual Number',
                field: 'accuralNumber',
                colId: 'accuralNumber',
                type: 'numericColumn',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Back Office Doc ID',
                field: 'backOfficeDocId',
                colId: 'backOfficeDocId',
                hide: false,
                editable: false,
            },
            {
                headerName: 'GL Date(BL Date)',
                field: 'glDate',
                colId: 'glDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Back Office Posting Date',
                field: 'backOfficePostingDate',
                colId: 'backOfficePostingDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Document Type',
                field: 'documentType',
                colId: 'documentType',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Payment Trax ID',
                field: 'paymentTraxId',
                colId: 'paymentTraxId',
                hide: false,
                editable: false,
            },
            {
                headerName: 'ptime',
                field: 'postedTime',
                colId: 'postedTime',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Setup User',
                field: 'setupUser',
                colId: 'setupUser',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Setup Date',
                field: 'setupDate',
                colId: 'setupDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Setup Time',
                field: 'setupTime',
                colId: 'setupTime',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Original Value Date',
                field: 'originalValueDate',
                colId: 'originalValueDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Tax Code',
                field: 'vatCode',
                colId: 'vatCode',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Match Date',
                field: 'matchDate',
                colId: 'matchDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Match Time',
                field: 'matchTime',
                colId: 'matchTime',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Payment Document date',
                field: 'paymentDocumentdate',
                colId: 'paymentDocumentdate',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Inhouse/External',
                field: 'inhouseExternal',
                colId: 'inhouseExternal',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Account Line Type',
                field: 'accountLineType',
                colId: 'accountLineType',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Charter',
                field: 'charter',
                colId: 'charter',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Cmy Description',
                field: 'contractCommodityDescription',
                colId: 'contractCommodityDescription',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Cmy Type',
                field: 'contractCommodityType',
                colId: 'contractCommodityType',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract IncoTerms',
                field: 'contractIncoTerms',
                colId: 'contractIncoTerms',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract BL Date',
                field: 'contractBLDate',
                colId: 'contractBLDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Client Group A/c',
                field: 'clientGroupAccount',
                colId: 'clientGroupAccount',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Group No',
                field: 'contractGroupNumber',
                colId: 'contractGroupNumber',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Port Origin',
                field: 'contractPortOrigin',
                colId: 'contractPortOrigin',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Port Dest',
                field: 'contractPortDestination',
                colId: 'contractPortDestination',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract IncoTerm Port',
                field: 'contractIntercomPort',
                colId: 'contractIntercomPort',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Shipping Period',
                field: 'contractShippingPeriod',
                colId: 'contractShippingPeriod',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Trader',
                field: 'contractTrader',
                colId: 'contractTrader',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Vessel',
                field: 'contractVessel',
                colId: 'contractVessel',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Contract Vessel IMO',
                field: 'contractVesselImo',
                colId: 'contractVesselImo',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Accounting Date',
                field: 'accountingDate',
                colId: 'accountingDate',
                hide: false,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                editable: false,
            },
            {
                headerName: 'Weight (in MT)',
                field: 'weight',
                colId: 'weight',
                hide: false,
                editable: false,
            },
        ];
    }

    onSelectionDiscardButtonClicked() {
        this.isSave = true;
        this.onCancelWarning();
    }

    onSelectionNextButtonClicked() {
        this.lockService.isLockedAccountingDocument(this.accountingId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
                    this.lockService.lockAccountingDocument(this.accountingId, LockFunctionalContext.AccountingDocumentReversal).pipe(takeUntil(this.destroy$)).subscribe((lockState) => {
                        this.childReverseDocumentCreateComponent.getAccountingLinesByAccountingId();
                        if (this.currentStep === 0) {
                            this.stepper.next();
                        }
                        this.startLockRefresh(this.accountingId, this.documentReference);
                        this.titleService.setTitle(this.documentReference + ' - Create Reversal');
                    });
                });
            }
        });
    }

    validateReversalDate() {
        let docResult: boolean = false;
        if (this.transactionDocumentTypeId === PostingDocumentType.TA) {
            docResult = this.checkIfDocumentIsValid();
        } else {
            docResult = true;
        }
        return docResult;
    }

    checkIfDocumentIsValid(): boolean {
        let isProceed = true;
        const todayDate = this.companyManager.getCurrentCompanyDate();
        const documentDate = _moment(this.accountingDocumentData.accountingDocumentLines[0].documentDate);
        let throwErrorNotOpenMonth = false;
        let throwErrorAccountingPeriod = false;
        const isSameMonthAndYearThanOperationsLastMonthClosed = documentDate.year() === this.operationsLastMonthClosed.getFullYear() &&
            documentDate.month() === this.operationsLastMonthClosed.getMonth();
        const isLessOrEqualToLastMonthClosed = (documentDate.year() === this.lastMonthClosed.getFullYear()
            && documentDate.month() <= this.lastMonthClosed.getMonth())
            || (documentDate.year() < this.lastMonthClosed.getFullYear());
        const isSameYearLessMonthThanOperationsLastMonthClosed = documentDate.year() === this.operationsLastMonthClosed.getFullYear() &&
            documentDate.month() < this.operationsLastMonthClosed.getMonth();
        if (isLessOrEqualToLastMonthClosed) {
            this.snackbarService.informationSnackBar('Not allowed. [' + this.documentReference + '] can not be reversed as the period is closed');
            isProceed = false;
        } else if ((documentDate <= this.companyManager.getCurrentCompanyDate() || documentDate.month() === todayDate.month()) &&
            !(documentDate.date() === new Date(documentDate.year(), documentDate.month() + 1, 0).getDate())) {
            this.snackbarService.throwErrorSnackBar('Document date must be a last month day');
            isProceed = false;
        } else if (documentDate.year() === todayDate.year() && documentDate.month() > todayDate.month()) {
            this.snackbarService.throwErrorSnackBar('Document date cannot be in the future');
            isProceed = false;
        } else if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
            this.checkIfBetweenLastClosedAndOperations(documentDate)) {
            throwErrorAccountingPeriod = true;
            isProceed = true;
        } else if (!this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
            isSameMonthAndYearThanOperationsLastMonthClosed) {
            throwErrorNotOpenMonth = true;
            isProceed = false;
        } else if (!this.checkIfBetweenLastClosedAndOperations(documentDate) &&
            isSameYearLessMonthThanOperationsLastMonthClosed) {
            throwErrorNotOpenMonth = true;
            isProceed = false;
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

        return isProceed;
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

    onCreateCancelButtonClicked() {
        this.isSave = true;
        this.onCancelWarning();
    }

    onCreatePreviousButtonClicked() {
        this.isSave = true;
        this.stepper.previous();
    }

    onCreateNextButtonClicked() {
        this.childReverseDocumentSummaryComponent.getAccountingLinesByAccountingId();
        this.createTransactionDocument = new CreateTransactionDocument();
        this.createTransactionDocument.transactionDocumentTypeId = this.transactionDocumentTypeId;
        this.createTransactionDocument.transactionDocumentId = this.transactionDocumentId;
        this.createTransactionDocument.documentDate = this.transactionDocumentTypeId !== PostingDocumentType.TA ? _moment(this.childReverseDocumentCreateComponent.reverseDateFormCtrl.value, 'DD-MM-YYYY').toDate() : _moment(this.childReverseDocumentCreateComponent.docDateFromCtrl.value, 'DD-MM-YYYY').toDate();
        this.createTransactionDocument.currencyCode = this.childReverseDocumentCreateComponent.currencyCtrl.value;
        this.createTransactionDocument.authorizedForPosting = false;
        this.createTransactionDocument.toInterface = this.childReverseDocumentCreateComponent.interfaceCtrl.value;

        this.childReverseDocumentSummaryComponent.reverseDocumentDate = _moment(this.childReverseDocumentCreateComponent.reverseDateFormCtrl.value, 'DD-MM-YYYY').toDate();
        this.childReverseDocumentSummaryComponent.accountingPeriod = this.childReverseDocumentCreateComponent.accPeriodFormCtrl.value;

        this.createTransactionDocument.physicalDocumentId =

            this.subscription.push(this.executionService.CreateTransactionDocument(this.createTransactionDocument).subscribe((data) => {
                this.reversedDocumentReference = data.documentReference;
                this.reversedTransactionDocumentId = data.transactionDocumentId;
            }));

        this.stepper.next();
        this.titleService.setTitle(this.documentReference + ' - Summary Accounting Document Reversal');
    }

    onSummaryFinishButtonClicked() {
        this.isSave = true;
        // this.preaccountingService.createAccountingDocument(this.reversedTransactionDocumentId).subscribe((data) => {
        //     this.router.navigate([this.company + '/financial/accounting/entries']);
        // });

        this.router.navigate([this.company + '/financial/accounting/entries']);
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    displayNotFoundError() {
        this.agGridApi.setRowData([]);
        this.accountingId = null;
        this.documentReference = null;
        this.accountingDocumentLine = [];
        this.snackbarService.throwErrorSnackBar('Document reference not existing');
    }

    OnChangeValue(refrerence) {
        this.searchTerm = this.documentCtrl.value;
        if (this.filteredDocumentReferences && this.searchTerm) {
            if (typeof this.searchTerm === 'object') {
                this.accountingId = this.documentCtrl.value.accountingId;
                this.documentReference = this.documentCtrl.value.documentReference;
            } else {
                const documentSelected = this.filteredDocumentReferences.filter((searchData) =>
                    searchData.documentReference.toUpperCase() === this.searchTerm.toUpperCase());

                if (documentSelected.length === 0) {
                    this.displayNotFoundError();
                } else {
                    this.accountingId = documentSelected[0].accountingId;
                    this.documentReference = documentSelected[0].documentReference;
                }
            }
        }

        if (this.accountingId) {
            this.getTransactionDetailSunscription = this.preaccountingService.getTransactionDetail(this.accountingId).pipe(
                map((data) => {
                    this.transactionData = data.value.map((transactionData) => {
                        return new TransactionDetailDisplayView(transactionData);
                    });
                    if (this.transactionData && this.transactionData.length > 0) {
                        this.transactionDocumentId = this.transactionData[0].transactionDocumentId;
                        this.transactionDocumentTypeId = this.transactionData[0].transactionDocumentTypeId;
                    }
                }))
                .subscribe();

            this.getAccountingLinesByDocumentIdSubscription = (this.preaccountingService.getAccoutingLinesAllData(this.accountingId).pipe(
                map((data) => {
                    this.documentRefData = data.value.map((docRef) => {
                        return new ReversalDocumentDisplayView(docRef);
                    });
                    this.accountingDocumentData = this.documentRefData[0];
                    if (this.accountingDocumentData) {
                        this.accountingDocumentLine = this.accountingDocumentData.accountingDocumentLines;
                        this.noOfAccountingEntries = this.accountingDocumentLine.length;
                        if (this.accountingDocumentLine && this.accountingDocumentLine.length > 0) {
                            const isValid = this.validateReversalDate();
                            if (isValid) {
                                this.disableNextButton = false;
                            }
                        }
                    }
                }))
                .subscribe());
        }
    }

    getDisabledState(value) {
        this.disableButton = value;
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

    ngOnDestroy(): void {
        this.stopLockRefresh();
        if (this.getTransactionDetailSunscription) {
            this.getTransactionDetailSunscription.unsubscribe();
        }
        if (this.getAccountingLinesByDocumentIdSubscription) {
            this.getAccountingLinesByDocumentIdSubscription.unsubscribe();
        }
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }

    onCancelWarning() {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Warning',
                text: 'Reversal is not done.',
                okButton: 'Ok',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate([this.company + '/financial/accounting/entries']);
            }
        });
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.createDocumentFormGroup.dirty) {
            $event.returnValue = true;
        }
    }
    valueChanged(value) {
        this.documentCtrl.patchValue(value);
        this.OnChangeValue(value);
    }

    NumberFormatterForTotalInGrid(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }
}
