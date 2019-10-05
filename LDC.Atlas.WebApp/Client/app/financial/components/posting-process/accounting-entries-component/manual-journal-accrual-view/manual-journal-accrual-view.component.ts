import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AccountingDocumentLine } from '../../../../../shared/entities/accounting-document-line.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PostingManagement } from '../../../../../shared/entities/posting-management.entity';
import { PostingDocumentType } from '../../../../../shared/enums/posting-document-type.enum';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../../shared/services/execution/charter-data-loader';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { UiService } from '../../../../../shared/services/ui.service';
const moment = _moment;

@Component({
    selector: 'atlas-manual-journal-accrual-view',
    templateUrl: './manual-journal-accrual-view.component.html',
    styleUrls: ['./manual-journal-accrual-view.component.scss'],
    providers: [CharterDataLoader],
})
export class ManualJournalAccrualViewComponent extends BaseFormComponent implements OnInit {

    subscriptions: Subscription[] = [];
    accountingId: number;
    viewAccountingLines: PostingManagement[] = [];
    columnDefs: agGrid.ColDef[];
    rowStyle: any;
    accountingDocumentData: PostingManagement;
    amount: number = 0;
    docReference: string;
    currencyControl: Currency;
    filteredCurrencyList: Currency[];
    masterdata: MasterData;
    accountingDocumentLine: AccountingDocumentLine[];
    atlasAgGridParam: AtlasAgGridParam;
    amountFormat: string = 'en-US';
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    accountDocumentFormGroup: FormGroup;
    filteredCharter: Charter[];
    isAccrual: boolean;
    accrualNumberColumn: string = 'accrualNumber';

    docDateFormCtrl = new AtlasFormControl('docDateFormCtrl');
    valueDateFormCtrl = new AtlasFormControl('valueDateFormCtrl');
    accPeriodFormCtrl = new AtlasFormControl('accPeriodFormCtrl');
    currencyCtrl = new AtlasFormControl('currencyCtrl');

    constructor(private preaccountingService: PreaccountingService,
        private route: ActivatedRoute,
        private uiService: UiService,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public charterDataLoader: CharterDataLoader,
        protected router: Router,
        private companyManager: CompanyManagerService,
        public gridService: AgGridService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.accountingId = Number(this.route.snapshot.paramMap.get('accountingId'));
        this.subscriptions.push(this.preaccountingService.getAccoutingDocumentData(this.accountingId).subscribe((data) => {
            if (data) {
                this.initializeGridColumns();
                this.charterDataLoader.getData().subscribe((charter) => {
                    this.filteredCharter = charter;
                });
                this.filteredCurrencyList = this.masterdata.currencies;
                this.viewAccountingLines = data.value;
                this.accountingDocumentData = this.viewAccountingLines[0];
                this.titleService.setTitle(this.accountingDocumentData.documentReference + ' - ' + this.route.snapshot.data.title);
                this.currencyControl = this.filteredCurrencyList.find((currency) =>
                    currency.currencyCode === this.accountingDocumentData.currencyCode);
                this.accountingDocumentLine = this.accountingDocumentData.accountingDocumentLines;
                this.isAccrual = (this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.TA) ? true : false;
                this.getFormGroup();
                this.initializeGridColumns();
                this.assignValuesToControl();
                this.accountDocumentFormGroup.disable();
                this.agGridApi.setColumnDefs(this.columnDefs);
                this.agGridColumnApi.setColumnVisible(this.accrualNumberColumn, this.isAccrual ? true : false);
            }
        }));
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;

        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
    }

    getFormGroup() {
        this.accountDocumentFormGroup = this.formBuilder.group({
            currencyCtrl: this.currencyCtrl,
            docDateFormCtrl: this.docDateFormCtrl,
            valueDateFormCtrl: this.valueDateFormCtrl,
            accPeriodFormCtrl: this.accPeriodFormCtrl,
        });
        return super.getFormGroup();
    }

    assignValuesToControl() {
        this.amount = 0;
        this.docReference = this.accountingDocumentData.documentReference;
        this.docDateFormCtrl.patchValue(this.accountingDocumentData.documentDate);
        this.valueDateFormCtrl.patchValue(this.accountingDocumentData.valueDate);
        this.accPeriodFormCtrl.patchValue(moment(this.accountingDocumentData.accountingPeriod));

        this.currencyCtrl.patchValue(this.currencyControl ? this.currencyControl.currencyCode : null);
        this.accountingDocumentData.accountingDocumentLines.forEach((rowData) => {
            this.amount += rowData.amount;
        });
    }

    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries']);
    }

    formatValue(amount: number): string {
        if (isNaN(amount) || amount === null) { return ''; }
        return new Intl.NumberFormat(this.amountFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    }

    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Nominal acc.',
                colId: 'accountReference',
                field: 'accountReference',
            },
            {
                headerName: 'Cli. account',
                colId: 'clientAccountId',
                field: 'clientAccountId',
                valueFormatter: this.clientAccountIdFormatter.bind(this),
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
                valueFormatter: this.accountLineTypeIdFormatter.bind(this),
            },
            {
                headerName: 'Cost types',
                colId: 'costTypeId',
                field: 'costTypeId',
                valueFormatter: this.costTypeIdFormatter.bind(this),
            },
            {
                headerName: 'Amount',
                colId: 'amount',
                field: 'amount',
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
                valueFormatter: this.departmentIdFormatter.bind(this),
            },
            {
                headerName: 'Sec. Doc. ref',
                colId: 'secondaryDocumentReference',
                field: 'secondaryDocumentReference',
            },
            {
                headerName: 'Ext. Doc. Ref',
                colId: 'extDocReference',
                field: 'extDocReference',
            },
            {
                headerName: 'Contract ref.',
                colId: 'sectionReference',
                field: 'sectionReference',
            },
            {
                headerName: 'Commodity',
                colId: 'commodityId',
                field: 'commodityId',
                valueFormatter: this.commodityIdFormatter.bind(this),
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',

            },
            {
                headerName: 'Charter',
                colId: 'charterId',
                field: 'charterId',
                valueFormatter: this.charterIdFormatter.bind(this),
            },
            {
                headerName: 'Cost Center',
                colId: 'costCenter',
                field: 'costCenter',
            },
            {
                headerName: 'Accrual Number',
                colId: 'accrualNumber',
                field: 'accrualNumber',
            },
        ];
        this.rowStyle = { 'border-bottom': '1px solid #e0e0e0 !important' };
    }

    clientAccountIdFormatter(params): string {
        if (params.value && this.masterdata.counterparties) {
            const counterpartiesList = this.masterdata.counterparties.find((x) => x.counterpartyID === params.value);
            if (counterpartiesList) {
                return counterpartiesList.counterpartyCode;
            }
        }
        return '';
    }
    accountLineTypeIdFormatter(params): string {
        if (params.value && this.masterdata.accountLineTypes) {
            const accountLineTypesList = this.masterdata.accountLineTypes.find((x) => x.accountLineTypeId === params.value);
            if (accountLineTypesList) {
                return accountLineTypesList.accountLineTypeCode;
            }
        }
        return '';
    }

    costTypeIdFormatter(params): string {
        if (params.value && this.masterdata.costTypes) {
            const costTypesList = this.masterdata.costTypes.find((x) => x.costTypeId === params.value);
            if (costTypesList) {
                return costTypesList.costTypeCode;
            }
        }
        return '';
    }

    departmentIdFormatter(params): string {
        if (params.value && this.masterdata.departments) {
            const departmentsList = this.masterdata.departments.find((x) => x.departmentId === params.value);
            if (departmentsList) {
                return departmentsList.departmentCode;
            }
        }
        return '';
    }

    commodityIdFormatter(params): string {
        if (params.value && this.masterdata.commodities) {
            const commoditiesList = this.masterdata.commodities.find((x) => x.commodityId === params.value);
            if (commoditiesList) {
                return commoditiesList.principalCommodity;
            }
        }
        return '';
    }

    charterIdFormatter(params): string {
        if (params.value && this.filteredCharter) {
            const charterList = this.filteredCharter.find((x) => x.charterId === params.value);
            if (charterList) {
                return charterList.charterCode;
            }
        }
        return '';
    }

    currencyFormatterInGrid(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat(this.amountFormat, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }
}
