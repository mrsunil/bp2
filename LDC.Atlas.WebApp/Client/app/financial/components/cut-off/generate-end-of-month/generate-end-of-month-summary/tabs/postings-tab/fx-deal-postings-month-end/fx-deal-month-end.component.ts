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
    selector: 'atlas-posting-tab-fx-deal-month-end',
    templateUrl: './fx-deal-month-end.component.html',
    styleUrls: ['./fx-deal-month-end.component.scss'],
    providers: [DatePipe],
})
export class PostingTabFxDealMonthEndComponent extends BaseFormComponent implements OnInit {
    @Input() filteredDetailsGridRows: FxDealGenerateEndOfMonthDisplayView[];
    @Output() readonly applyButtonClicked = new EventEmitter();
    @Output() readonly filteredGrid = new EventEmitter<FilterGem>();
    fxDealPostingsGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    fxDealPostingsGridColumns: agGrid.ColDef[];
    fxDealPostingsGridRows: FxDealGenerateEndOfMonthDisplayView[] = [];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    company: string;
    isLoading: boolean;
    length: number = 0;
    userActiveDirectoryName: string;
    excelStyles: any;
    dataVersionID: number;
    dataVersionMonth: string;
    quantityWeightCode: string;
    reportTypeDescription: string;
    reportType: number;
    model: FilterGem;
    exportFileName: string = 'EndOfMonthPostings';

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
        params.columnDefs = this.fxDealPostingsGridColumns;
        this.fxDealPostingsGridOptions = params;
        this.gridApi = this.fxDealPostingsGridOptions.api;
        this.gridColumnApi = this.fxDealPostingsGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.gridService.sizeColumns(this.fxDealPostingsGridOptions);
        window.onresize = () => {
            this.gridService.sizeColumns(this.fxDealPostingsGridOptions);
        };
    }

    prepareData(postingData) {
        this.fxDealPostingsGridRows = [];
        if (postingData) {
            const firstRow = [];
            const secondRow = [];
            postingData.forEach((data) => {
                firstRow.push(new FxDealGenerateEndOfMonthDisplayView(data));
            });
            postingData.forEach((data) => {
                secondRow.push(new FxDealGenerateEndOfMonthDisplayView(data));
            });
            firstRow.forEach((row) => {
                row.variationMargin = -row.variationMargin;
                row.accountNumber = row.line1NominalAccountCode;
                row.accountDescription = row.line1NominalAccountDesc;
                this.fxDealPostingsGridRows.push(row);
            });
            secondRow.forEach((row) => {
                row.accountNumber = row.line2NominalAccountCode;
                row.accountDescription = row.line2NominalAccountDesc;
                this.fxDealPostingsGridRows.push(row);
            });
            this.fxDealPostingsGridOptions.api.setRowData(this.fxDealPostingsGridRows);
        }
    }

    initializeGridColumns() {
        this.fxDealPostingsGridColumns = [
            {
                headerName: 'Accrual Number',
                field: 'accrualNumber',
                colId: 'accrualNumber',
                sort: 'asc',
                cellClass: 'leftAlignment',
                minWidth: 180,
            },
            {
                headerName: 'Nom. Account',
                field: 'accountNumber',
                colId: 'accountNumber',
                cellClass: 'leftAlignment',
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Nom. Description',
                field: 'accountDescription',
                colId: 'accountDescription',
                width: 300,
            },
            {
                headerName: ' Cost Type',
                field: 'costType',
                colId: 'costType',
                valueFormatter: this.stringFormatter.bind(this),
                maxWidth: 250,
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
                headerName: 'Associated Client',
                field: 'associatedClient',
                colId: 'associatedClient',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Func Ccy',
                field: 'currencyCode',
                colId: 'currencyCode',
                valueFormatter: this.currencyFormatter.bind(this),
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

}
