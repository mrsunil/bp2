import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AccountingDocumentLine } from '../../../../../shared/entities/accounting-document-line.entity';
import { AccountingSetup } from '../../../../../shared/entities/accounting-setup.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CostType } from '../../../../../shared/entities/cost-type.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PostingManagement } from '../../../../../shared/entities/posting-management.entity';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { PostingDocumentType } from '../../../../../shared/enums/posting-document-type.enum';
import { PostingManagementDisplayView } from '../../../../../shared/models/posting-management-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../../shared/services/authorization/dtos/user-company-privilege';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { isDateTwoBeforeDateOne } from '../../../../../shared/validators/date-validators.validator';

@Component({
    selector: 'atlas-reverse-document-create',
    templateUrl: './reverse-document-create.component.html',
    styleUrls: ['./reverse-document-create.component.scss']
})

export class ReverseDocumentCreateComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepper: MatStepper;
    reverseDocumentCreateGridCols: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    currentStep: number = 0;
    company: string;
    accountingDocumentLine: AccountingDocumentLine[];
    documentRefData: PostingManagementDisplayView[];
    accountingDocumentData: PostingManagement;
    docDateFromCtrl = new AtlasFormControl('docDateFromCtrl');
    valueDateFormCtrl = new AtlasFormControl('valueDateFormCtrl');
    accPeriodFormCtrl = new AtlasFormControl('accPeriodFormCtrl');
    currencyCtrl = new AtlasFormControl('currencyCtrl');
    reverseDateFormCtrl = new AtlasFormControl('reverseDateFormCtrl');
    interfaceCtrl = new AtlasFormControl('interfaceCtrl');
    warningMessage: string;
    isWarningMessage: boolean;
    isReversalDateBefore: boolean;
    isReversalDateNotInLastDay: boolean;
    isReversalDateAfter: boolean;
    isAccrualDocument: boolean = false;
    totalAmount: number = 0;
    private getAccountingLinesByAccountingIdSubscription: Subscription;
    @Input() accountingId: number;
    @Input() documentReference: string;
    @Input() transactionDocumentId: number;
    @Input() transactionDocumentTypeId: number;
    @Output() notifyParentForDisableNextButton: EventEmitter<boolean> = new EventEmitter(true);
    masterdata: MasterData;
    costTypes: CostType[];
    departments: Department[];
    amountFormat: string = 'en-US';
    subscription: Subscription[] = [];

    accountingDocDetail: PostingManagement;
    accountingSetupModel: AccountingSetup;
    operationsLastMonthClosed: Date;
    lastMonthClosed: Date;
    isAnyAmountColumnZero: boolean = false;
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
        private authorizationService: AuthorizationService,
        private executionService: ExecutionService,
        protected companyManager: CompanyManagerService,
        private snackbarService: SnackbarService,
        private preaccountingService: PreaccountingService,
        protected dialog: MatDialog,
        public gridService: AgGridService, ) {
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.interfaceCtrl.patchValue(true);
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

        this.initializeGridColumns();
        this.atlasAgGridParam = this.gridService.getAgGridParam();

    }

    getAccountingLinesByAccountingId() {
        if (this.accountingId) {
            this.getAccountingLinesByAccountingIdSubscription = (this.preaccountingService.getAccoutingDocumentAllData(this.transactionDocumentId).pipe(
                map((data) => {
                    this.documentRefData = data.value.map((docRef) => {
                        return new PostingManagementDisplayView(docRef);
                    });
                    this.accountingDocumentData = this.documentRefData[0];
                    if (this.accountingDocumentData) {
                        this.accountingDocumentLine = this.accountingDocumentData.accountingDocumentLines;
                        this.assignValuesToControl();
                    }
                }))
                .subscribe());

            (this.preaccountingService.getAccoutingDocumentAllData(this.transactionDocumentId).pipe(
                map((data) => {
                    const documentRefData = data.value.map((docRef) => {
                        return new PostingManagementDisplayView(docRef);
                    });
                    this.accountingDocDetail = documentRefData[0];
                    if (this.transactionDocumentTypeId === PostingDocumentType.TA) {
                        this.isAccrualDocument = true;
                        this.validateReversalDate();
                    }
                }))
                .subscribe());
        }
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.reverseDocumentCreateGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.agGridApi.setRowData([]);
    }

    getDefaultValue(params) {
        return 0;
    }

    currencyFormatterInGrid(params) {
        if (params.value > 0) {
            params.value = -Math.abs(params.value);
        }
        else {
            params.value = Math.abs(params.value);
        }
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }

    currencyFormatterForTotalInGrid(totalAmount: number) {
        return (params) => {

            if (params.value > 0) {
                params.value = -Math.abs(params.value);
            }
            else {
                params.value = Math.abs(params.value);
            }

            this.totalAmount += params.value;
            if (isNaN(params.value) || params.value === null) { return ''; }
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);

        }
    }

    costTypeFormatter(params): string {
        if (params.value && this.masterdata.costTypes) {
            const costTypeList = this.masterdata.costTypes.find((x) => x.costTypeId === params.value);
            if (costTypeList) {
                return costTypeList.costTypeCode;
            }
        }
        return '';
    }

    accountLineTypeFormatter(params): string {
        if (params.value && this.masterdata.accountLineTypes) {
            const accountLineTypes = this.masterdata.accountLineTypes.find((x) => x.accountLineTypeId === params.value);
            if (accountLineTypes) {
                return accountLineTypes.accountLineTypeCode;
            }
        }
        return '';
    }

    departmentValueFormatter(params): string {
        if (params.value && this.masterdata.departments) {
            const department = this.masterdata.departments.find((x) => x.departmentId === params.value);
            if (department) {
                return department.departmentCode;
            }
        }
        return '';
    }

    commodityFormatter(params): string {
        if (params.value && this.masterdata.commodities) {
            const commodityList = this.masterdata.commodities.find((x) => x.commodityId === params.value);
            if (commodityList) {
                return commodityList.principalCommodity;
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

    vatCodeFormatter(params): string {
        if (params.value && this.masterdata.vats) {
            const vatList = this.masterdata.vats.find((x) => x.vatId === params.value);
            if (vatList) {
                return vatList.vatCode;
            }
        }
        return '';
    }

    initializeGridColumns() {
        this.reverseDocumentCreateGridCols = [
            {
                headerName: 'Nominal acc.',
                colId: 'accountReference',
                field: 'accountReference',
            },
            {
                headerName: 'Associated Acc.',
                colId: 'associatedAccountCode',
                field: 'associatedAccountCode',
            },
            {
                headerName: 'Acc. L. Type',
                colId: 'accountLineTypeId',
                field: 'accountLineTypeId',
                valueFormatter: this.accountLineTypeFormatter.bind(this),
            },
            {
                headerName: 'Cost types',
                colId: 'costTypeId',
                field: 'costTypeId',
                valueFormatter: this.costTypeFormatter.bind(this),
            },
            {
                headerName: 'Amount',
                colId: 'amount',
                field: 'amount',
                type: 'numericColumn',
                valueFormatter: this.currencyFormatterForTotalInGrid(this.totalAmount)
            },
            {
                headerName: 'Statutory currency',
                colId: 'statutoryCurrency',
                field: 'statutoryCurrency',
                type: 'numericColumn',
                valueFormatter: this.currencyFormatterInGrid.bind(this),
            },
            {
                headerName: 'Functional currency',
                colId: 'functionalCurrency',
                field: 'functionalCurrency',
                type: 'numericColumn',
                valueFormatter: this.currencyFormatterInGrid.bind(this),
            },
            {
                headerName: 'Narrative',
                colId: 'narrative',
                field: 'narrative',
            },
            {
                headerName: 'Department',
                colId: 'departmentId',
                field: 'departmentId',
                valueFormatter: this.departmentValueFormatter.bind(this),
            },
            {
                headerName: 'Sec. Doc. ref',
                colId: 'secDocReference',
                field: 'secDocReference',
            },
            {
                headerName: 'Ext. Doc. Ref',
                colId: 'extDocReference',
                field: 'extDocReference',
            },
            {
                headerName: 'Contract ref.',
                colId: 'clientReference',
                field: 'clientReference',
            },

            {
                headerName: 'Commodity',
                colId: 'commodityId',
                field: 'commodityId',
                valueFormatter: this.commodityFormatter.bind(this),
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
            },
            {
                headerName: 'Charter',
                colId: 'charter',
                field: 'charter',
            },
            {
                headerName: 'Cost Center',
                colId: 'costCenter',
                field: 'costCenter',
            },

            {
                headerName: 'Payment terms',
                colId: 'paymentTermId',
                field: 'paymentTermId',
                valueFormatter: this.paymentTermFormatter.bind(this),
            },
            {
                headerName: 'Tax code',
                colId: 'vatId',
                field: 'vatId',
                valueFormatter: this.vatCodeFormatter.bind(this),
            },
            {
                headerName: '',
                hide: true,
                width: 40,
            },
        ];
    }

    assignValuesToControl() {
        this.docDateFromCtrl.patchValue(_moment(this.accountingDocumentData.documentDate).format("DD/MM/YYYY"));
        const valueDate = _moment(this.accountingDocumentData.valueDate, "DD-MM-YYYY");
        if (valueDate.isValid()) {
            this.valueDateFormCtrl.patchValue(_moment(this.accountingDocumentData.valueDate).format("DD/MM/YYYY"));
        }
        this.accPeriodFormCtrl.patchValue(_moment(this.accountingDocumentData.accountingPeriod).format("MM/YYYY"));
        this.currencyCtrl.patchValue(this.accountingDocumentData.currencyCode);
    }

    isReverseDateBeforeDocumentDate() {
        const dateOne = _moment(this.docDateFromCtrl.value, "DD-MM-YYYY");
        const dateTwo = _moment(this.reverseDateFormCtrl.value, "DD-MM-YYYY");
        if (dateOne.isValid() && dateTwo.isValid()) {
            const result = isDateTwoBeforeDateOne(dateOne.toDate(), dateTwo.toDate());
            if (result) {
                this.isReversalDateBefore = true;
                this.notifyParentForDisableNextButton.emit(true);
                return result;
            }
            else {
                this.isReversalDateBefore = false;
                this.notifyParentForDisableNextButton.emit(false);
            }
        }
    }

    isReverseDateAfterCurrentAtlasDate() {
        const dateOne = _moment(this.reverseDateFormCtrl.value, "DD-MM-YYYY");
        const dateTwo = _moment(this.companyManager.getCurrentCompanyDate().toDate(), "DD-MM-YYYY");
        if (dateOne.isValid() && dateTwo.isValid()) {
            const result = isDateTwoBeforeDateOne(dateOne.toDate(), dateTwo.toDate());
            if (result) {
                this.isReversalDateAfter = true;
                this.notifyParentForDisableNextButton.emit(true);
                return result;
            }
            else {
                this.isReversalDateAfter = false;
                this.notifyParentForDisableNextButton.emit(false);
            }
        }
    }

    isReverseDateInOtherMonth() {
        const dateOneMonth = _moment(this.docDateFromCtrl.value, "DD-MM-YYYY");
        const dateTwoMonth = _moment(this.reverseDateFormCtrl.value, 'DD-MM-YYYY');
        const documentDate = _moment(this.accountingDocDetail.documentDate);
        let valueToPatchForAccPeriod = dateTwoMonth;
        if (dateOneMonth.isValid() && dateTwoMonth.isValid()) {
            const result = (dateOneMonth.toDate().getMonth() == dateTwoMonth.toDate().getMonth())
            if (!result) {
                this.isWarningMessage = true;
                if (this.transactionDocumentTypeId === PostingDocumentType.TA) {
                    this.warningMessage = 'The document will be posted on ' + documentDate.format("MM") + "/" + documentDate.format("YYYY");
                    valueToPatchForAccPeriod = documentDate;
                }
                else {
                    this.warningMessage = 'The document will be posted on ' + dateTwoMonth.format("MM") + "/" + dateTwoMonth.format("YYYY");
                    valueToPatchForAccPeriod = dateTwoMonth;
                }
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Warning',
                        text: this.warningMessage,
                        okButton: 'Ok',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.accPeriodFormCtrl.patchValue(_moment(valueToPatchForAccPeriod).format("MM/YYYY"));
                    }
                });
            }
            else {
                this.accPeriodFormCtrl.patchValue(_moment(valueToPatchForAccPeriod).format("MM/YYYY"));
                this.isWarningMessage = false;
                this.warningMessage = "";
            }
        } else {
            this.isWarningMessage = false;
            this.warningMessage = '';
        }
    }

    validateReversalDate() {
        let result: boolean = false;
        let docResult: boolean = false;
        this.isWarningMessage = true;
        this.warningMessage = '';
        this.isReversalDateAfter = false;
        this.isReversalDateBefore = false;
        this.isReversalDateNotInLastDay = false;

        if (this.transactionDocumentTypeId === PostingDocumentType.TA) {
            docResult = this.checkIfDocumentIsValid();
            if (docResult) {
                result = this.isReverseDateBeforeDocumentDate();
                if (!result) {
                    result = this.isReverseDateAfterCurrentAtlasDate();
                }
                this.isReverseDateInOtherMonth();
            }
            else {
                this.notifyParentForDisableNextButton.emit(true);
            }
        }
        else {
            result = this.isReverseDateBeforeDocumentDate();
            if (!result) {
                result = this.isReverseDateAfterCurrentAtlasDate();
            }
            this.isReverseDateInOtherMonth();
        }

        const docDate = _moment(this.docDateFromCtrl.value, "DD-MM-YYYY");
        const reversalDate = _moment(this.reverseDateFormCtrl.value, "DD-MM-YYYY");
        if (docDate.isValid() == false || reversalDate.isValid() == false) {
            this.notifyParentForDisableNextButton.emit(true);
            return false;
        }
    }

    onOkButtonClicked() {
        //this.dialog.close(null);
    }

    checkIfDocumentIsValid(): boolean {
        let isProceed = true;
        const todayDate = this.companyManager.getCurrentCompanyDate();
        const documentDate = _moment(this.accountingDocDetail.documentDate);
        const reverseDate = _moment(this.reverseDateFormCtrl.value, "DD-MM-YYYY");
        let throwErrorNotOpenMonth = false;
        let throwErrorAccountingPeriod = false;
        if (reverseDate.isValid()) {
            const isSameMonthAndYearThanOperationsLastMonthClosed = reverseDate.year() === this.operationsLastMonthClosed.getFullYear() &&
                reverseDate.month() === this.operationsLastMonthClosed.getMonth();
            const isLessOrEqualToLastMonthClosed = (reverseDate.year() === this.lastMonthClosed.getFullYear()
                && reverseDate.month() <= this.lastMonthClosed.getMonth())
                || (reverseDate.year() < this.lastMonthClosed.getFullYear());
            const isSameYearLessMonthThanOperationsLastMonthClosed = reverseDate.year() === this.operationsLastMonthClosed.getFullYear() &&
                reverseDate.month() < this.operationsLastMonthClosed.getMonth();
            if (isLessOrEqualToLastMonthClosed) {
                this.snackbarService.informationSnackBar('Not allowed. [' + this.documentReference + '] can not be reversed as the period is closed');
                this.reverseDateFormCtrl.patchValue('');
                isProceed = false;
            } else if (reverseDate < documentDate && documentDate.month() !== reverseDate.month()) {
                this.snackbarService.throwErrorSnackBar('Not allowed. Reversal doc. date prior to original document date.');
                this.isReversalDateBefore = true;
                this.isReversalDateNotInLastDay = false;
                this.reverseDateFormCtrl.patchValue('');
                isProceed = false;
            } else if (!(reverseDate.date() === new Date(reverseDate.year(), reverseDate.month() + 1, 0).getDate())) {
                this.snackbarService.throwErrorSnackBar('Document date must be a last month day');
                this.isReversalDateBefore = false;
                this.isReversalDateNotInLastDay = true;
                this.reverseDateFormCtrl.patchValue('');
                isProceed = false;
            } else if (reverseDate.year() === todayDate.year() && reverseDate.month() > todayDate.month()) {
                this.snackbarService.throwErrorSnackBar('Document date cannot be in the future');
                this.reverseDateFormCtrl.patchValue('');
                isProceed = false;
            } else if (this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
                this.checkIfBetweenLastClosedAndOperations(reverseDate)) {
                throwErrorAccountingPeriod = true;
                isProceed = true;
            } else if (!this.checkIfUserHasRequiredPrivileges(this.postOpClosedPrivilege) &&
                isSameMonthAndYearThanOperationsLastMonthClosed) {
                throwErrorNotOpenMonth = true;
                this.reverseDateFormCtrl.patchValue('');
                isProceed = false;
            } else if (!this.checkIfBetweenLastClosedAndOperations(reverseDate) &&
                isSameYearLessMonthThanOperationsLastMonthClosed) {
                this.reverseDateFormCtrl.patchValue('');
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
        }
        else {
            isProceed = false;
        }
        this.notifyParentForDisableNextButton.emit(!isProceed);
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

    ngOnDestroy(): void {
        if (this.getAccountingLinesByAccountingIdSubscription) {
            this.getAccountingLinesByAccountingIdSubscription.unsubscribe();
        }
    }
}
