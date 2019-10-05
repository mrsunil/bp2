import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../../../../execution/services/execution-cash-common-methods';
import { BaseFormComponent } from '../../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { FilterGem } from '../../../../../../../../shared/entities/filter-gem.entity';
import { FxDealGenerateEndOfMonthDisplayView } from '../../../../../../../../shared/models/fx-deal-generate-end-of-month-display-view';
import { FormatDatePipe } from '../../../../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../../../../shared/services/http-services/trading.service';
import { UiService } from '../../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-detail-tab-fx-deal-month-end',
    templateUrl: './fx-deal-month-end.component.html',
    styleUrls: ['./fx-deal-month-end.component.scss'],
    providers: [DatePipe],
})
export class DetailTabFxDealMonthEndComponent extends BaseFormComponent implements OnInit {
    @Input() filteredDetailsGridRows: FxDealGenerateEndOfMonthDisplayView[];
    @Output() readonly applyButtonClicked = new EventEmitter();
    @Output() readonly filteredGrid = new EventEmitter<FilterGem>();
    fxDealDetailsGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    fxDealDetailsGridColumns: agGrid.ColDef[];
    fxDealDetailsGridRows: FxDealGenerateEndOfMonthDisplayView[] = [];
    originalDetailsGridRows: FxDealGenerateEndOfMonthDisplayView[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    company: string;
    isLoading: boolean;
    length: number = 0;
    userActiveDirectoryName: string;
    excelStyles: any;
    dataVersionId: number;
    dataVersionMonth: string;
    quantityWeightCode: string;
    reportTypeDescription: string;
    reportType: number;
    model: FilterGem;
    exportFileName: string = 'EndOfMonthDetails';
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        private formatDate: FormatDatePipe,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
            {
                id: 'leftAlignment',
                alignment: {
                    horizontal: 'Left', vertical: 'Bottom',
                },
            },
            {
                id: "twoDecimalPlaces",
                numberFormat: { format: "#,##0.00" },

            },
            {
                id: "fourDecimalPlaces",
                numberFormat: { format: "#,##0.0000" },
            }
        ];
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        const companyDetails = this.companyManager.getCurrentCompany();
        this.quantityWeightCode = '(in ' + companyDetails.weightCode + ')';
        this.company = this.companyManager.getCurrentCompanyId();

        this.initializeGridColumns();
    }

    onGridReady(params) {
        params.columnDefs = this.fxDealDetailsGridColumns;
        this.fxDealDetailsGridOptions = params;
        this.gridApi = this.fxDealDetailsGridOptions.api;
        this.gridColumnApi = this.fxDealDetailsGridOptions.columnApi;
        this.gridService.sizeColumns(this.fxDealDetailsGridOptions);

        window.onresize = () => {
            this.gridService.sizeColumns(this.fxDealDetailsGridOptions);
        };
    }

    prepareData(detailsData) {
        this.fxDealDetailsGridRows = [];
        if (detailsData) {
            detailsData.forEach((row) => {
                this.fxDealDetailsGridRows.push(row);
            });
            this.fxDealDetailsGridOptions.api.setRowData(this.fxDealDetailsGridRows);
        }
    }

    initializeGridColumns() {
        this.fxDealDetailsGridColumns = [
            {
                headerName: 'Accrual Number',
                field: 'accrualNumber',
                colId: 'accrualNumber',
                cellClass: 'leftAlignment',

            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                cellClass: 'leftAlignment',
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Deal No.',
                field: 'dealNumber',
                colId: 'dealNumber',
                cellClass: 'leftAlignment',
            },
            {
                headerName: ' Cost Type',
                field: 'costType',
                colId: 'costType',
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Deal Ccy',
                field: 'dealCurrency',
                colId: 'dealCurrency',
                valueFormatter: this.currencyFormatter.bind(this),
            },
            {
                headerName: 'Settlement Ccy',
                field: 'settlementCurrency',
                colId: 'settlementCurrency',
                valueFormatter: this.currencyFormatter.bind(this),
            },
            {
                headerName: 'Deal Amount',
                field: 'dealAmount',
                colId: 'dealAmount',
                type: 'numericColumn',
                cellClass: 'twoDecimalPlaces',
                cellStyle: { 'text-align': 'right' },
                valueFormatter: (params) => this.amountFormatter(params),

            },
            {
                headerName: 'Settlement Amount',
                field: 'settlementAmount',
                colId: 'settlementAmount',
                cellClass: 'twoDecimalPlaces',
                cellStyle: { 'text-align': 'right' },
                valueFormatter: this.amountFormatter.bind(this),
                type: 'numericColumn',
            },
            {
                headerName: 'Associated Client',
                field: 'associatedClient',
                colId: 'associatedClient',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Maturity Date',
                field: 'maturityDate',
                colId: 'maturityDate',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                cellClass: ['dateFormat', 'leftAlignment'],
                valueGetter: (params) => {
                    const dateFormat: FormatDatePipe = this.formatDate;
                    const val = dateFormat.transformdate(params.data.maturityDate);
                    if (val) {
                        if (val.indexOf('/') < 0) {
                            return val;
                        } else {
                            const split = val.split('/');
                            return split[2] + '-' + split[1] + '-' + split[0];
                        }
                    }
                },

            },
            {
                headerName: 'Market Ccy RoE Dealt',
                field: 'marketCcyRoeDealt',
                colId: 'marketCcyRoeDealt',
                cellClass: 'fourDecimalPlaces',
                cellStyle: { 'text-align': 'right' },
                valueFormatter: this.roeFormatter.bind(this),
                type: 'numericColumn',
            },
            {
                headerName: 'Market Ccy RoE Settlement',
                field: 'marketCcyRoeSettlement',
                colId: 'marketCcyRoeSettlement',
                cellClass: 'fourDecimalPlaces',
                cellStyle: { 'text-align': 'right' },
                valueFormatter: this.roeFormatter.bind(this),
                type: 'numericColumn',
            },
            {
                headerName: 'Variation Margin',
                field: 'variationMargin',
                colId: 'variationMargin',
                cellClass: 'twoDecimalPlaces',
                cellStyle: { 'text-align': 'right' },
                valueFormatter: this.amountFormatter.bind(this),
                type: 'numericColumn',
            },
        ];
    }

    stringFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 10); }
    }

    currencyFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 3); }
    }

    amountFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 2);
        }
    }

    roeFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 4);
        }
    }

    dateValueFormatter(param): string {
        if (param.value) { return this.formatDate.transform(param.value); }
    }

    onExportButtonClickedAsExcel() {
        const screenName: string = this.exportFileName;
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const screenName: string = this.exportFileName;
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }
}
