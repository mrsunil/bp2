import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { AccountingDocumentLine } from '../../../../../shared/entities/accounting-document-line.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CostType } from '../../../../../shared/entities/cost-type.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PostingManagement } from '../../../../../shared/entities/posting-management.entity';
import { PostingDocumentType } from '../../../../../shared/enums/posting-document-type.enum';
import { PostingManagementDisplayView } from '../../../../../shared/models/posting-management-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { TitleService } from '../../../../../shared/services/title.service';

@Component({
    selector: 'atlas-reverse-document-summary',
    templateUrl: './reverse-document-summary.component.html',
    styleUrls: ['./reverse-document-summary.component.scss'],
    providers: [DatePipe],
})
export class ReverseDocumentSummaryComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepper: MatStepper;
    agGridOptions: agGrid.GridOptions = {};
    reverseDocumentSummaryGridCols: agGrid.ColDef[];
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
    totalAmount: number = 0;
    private getAccountingLinesByAccountingIdSubscription: Subscription;
    @Input() accountingId: number;
    @Input() documentReferenceId: number;
    @Input() documentReference: string;
    @Input() reversedDocumentReference: string;
    @Input() transactionDocumentTypeId: number;
    masterdata: MasterData;
    costTypes: CostType[];
    departments: Department[];
    amountFormat: string = 'en-US';
    userActiveDirectoryName: string;
    screenName: string = 'ReverseDocumentSummary';
    reverseDocumentDate: Date;
    accountingPeriod: Date;
    transactionDocumentIdFromRoute: number;

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        private preaccountingService: PreaccountingService,
        public gridService: AgGridService,
        private titleService: TitleService) {
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.totalAmount = 0;
        this.company = this.route.snapshot.paramMap.get('company');
        this.transactionDocumentIdFromRoute = Number(this.route.snapshot.paramMap.get('transactionDocumentId'));
        this.masterdata = this.route.snapshot.data.masterdata;
        this.initializeGridColumns();

        this.atlasAgGridParam = this.gridService.getAgGridParam();
        if (this.transactionDocumentIdFromRoute) {
            this.documentReferenceId = this.transactionDocumentIdFromRoute;
            this.route.queryParams.subscribe((params) => {
                this.reversedDocumentReference = params['originalReference'];
                this.documentReference = params['documentReference'];
                this.titleService.setTitle(this.reversedDocumentReference + '- Reverse Summary View');
            });
            this.getAccountingLinesByAccountingId();
        }
    }

    getAccountingLinesByAccountingId() {
        if (this.accountingId || this.transactionDocumentIdFromRoute) {
            this.getAccountingLinesByAccountingIdSubscription = (this.preaccountingService.getAccoutingDocumentAllData(this.documentReferenceId).pipe(
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
        }
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.reverseDocumentSummaryGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.agGridApi.setRowData([]);
    }

    currencyFormatterInGrid(params) {
        if (params.value > 0) {
            params.value = -Math.abs(params.value);
        } else {
            params.value = Math.abs(params.value);
        }
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }

    currencyFormatterForTotalInGrid(totalAmount: number) {
        return (params) => {

            if (params.value > 0) {
                params.value = -Math.abs(params.value);
            } else {
                params.value = Math.abs(params.value);
            }

            this.totalAmount += params.value;
            if (isNaN(params.value) || params.value === null) { return ''; }
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
        };
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

    departmentValueFormatter(params): string {
        if (params.value && this.masterdata.departments) {
            return this.masterdata.departments.find((x) => x.departmentId === params.value).description;

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

    accountLineTypeFormatter(params): string {
        if (params.value && this.masterdata.accountLineTypes) {
            const accountLineTypes = this.masterdata.accountLineTypes.find((x) => x.accountLineTypeId === params.value);
            if (accountLineTypes) {
                return accountLineTypes.accountLineTypeCode;
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
        this.reverseDocumentSummaryGridCols = [
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
                type: 'numericColumn',
                field: 'amount',
                valueFormatter: this.currencyFormatterForTotalInGrid(this.totalAmount),
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
        if (this.transactionDocumentTypeId !== PostingDocumentType.TA) {
            this.docDateFromCtrl.patchValue(_moment(this.reverseDocumentDate).format('DD/MM/YYYY'));
        } else {
            this.docDateFromCtrl.patchValue(_moment(this.accountingDocumentData.documentDate).format('DD/MM/YYYY'));
        }
        const valueDate = _moment(this.accountingDocumentData.valueDate, 'DD-MM-YYYY');
        if (valueDate.isValid()) {
            this.valueDateFormCtrl.patchValue(_moment(this.accountingDocumentData.valueDate).format('DD/MM/YYYY'));
        }
        this.accPeriodFormCtrl.patchValue(this.accountingPeriod ? this.accountingPeriod : _moment(this.accountingDocumentData.accountingPeriod).format('MM/YYYY'));
        this.currencyCtrl.patchValue(this.accountingDocumentData.currencyCode);
    }

    OnExportButton() {
    }

    onExportButtonClickedAsExcel() {
        this.agGridOptions.api.exportDataAsExcel(this.getExportParams('.xlsx'));
    }

    onExportButtonClickedAsCSV() {
        this.agGridOptions.api.exportDataAsCsv(this.getExportParams('.csv'));
    }

    getExportParams(fileExtension) {
        const now = new Date();
        const currentDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: currentDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + fileExtension,
        };
        return params;
    }

    ngOnDestroy(): void {
        if (this.getAccountingLinesByAccountingIdSubscription) {
            this.getAccountingLinesByAccountingIdSubscription.unsubscribe();
        }
    }
}
