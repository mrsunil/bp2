import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../../../execution/services/execution-cash-common-methods';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { FilterGem } from '../../../../../../../shared/entities/filter-gem.entity';
import { FilterValueGenerateEndMonth } from '../../../../../../../shared/entities/filter-value-generate-end-month.entity';
import { TradeCostMonthEndMappingErrors } from '../../../../../../../shared/entities/tradecost-monthend-mappingerrors-entity';
import { UserGridPreferencesParameters } from '../../../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { GenerateMonthEndEnum } from '../../../../../../../shared/enums/generate-month-end-type.enum';
import { ReportType } from '../../../../../../../shared/enums/report-type.enum';
import { OverviewGenerateEndOfMonthDisplayView } from '../../../../../../../shared/models/overview-generate-end-of-month-display-view';
import { FormatDatePipe } from '../../../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-details-tab',
    templateUrl: './details-tab.component.html',
    styleUrls: ['./details-tab.component.scss'],
    providers: [DatePipe],
})
export class DetailsTabComponent extends BaseFormComponent implements OnInit {

    @Input() filteredDetailsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    @Output() readonly applyButtonClicked = new EventEmitter();
    detailsGridOptions: agGrid.GridOptions = {};
    @Output() readonly filteredGrid = new EventEmitter<FilterGem>();
    @Output() readonly mappingError = new EventEmitter<TradeCostMonthEndMappingErrors[]>();
    atlasAgGridParam: AtlasAgGridParam;
    detailsGridColumns: agGrid.ColDef[];
    detailsGridRows: OverviewGenerateEndOfMonthDisplayView[] = [];
    originalDetailsGridRows: OverviewGenerateEndOfMonthDisplayView[];
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

    gridId = 'endOfMonthDetails';
    gridPreferencesParameters: UserGridPreferencesParameters;

    get reportTypeEnum() { return ReportType; }
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        private tradingService: TradingService,
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
        ];
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        if (this.reportType !== ReportType.MTMOpenFx) {
            this.atlasAgGridParam = this.gridService.getAgGridParam();
            const companyDetails = this.companyManager.getCurrentCompany();
            this.quantityWeightCode = '(in ' + companyDetails.weightCode + ')';
            this.company = this.companyManager.getCurrentCompanyId();
            this.initializeGridColumns();
            this.initDetailsGridRows();
            this.initializeSortModel();

            this.gridPreferencesParameters = {
                company: this.company,
                gridId: this.gridId,
                gridOptions: null,
                savingEnabled: false,
                sharingEnabled: false,
                showExport: true,
                hasColumnHandling: false,
            };
        }
    }

    onGridReady(params) {
        this.detailsGridOptions.columnDefs = this.detailsGridColumns;
        this.gridApi = this.detailsGridOptions.api;
        this.gridColumnApi = this.detailsGridOptions.columnApi;
        this.gridService.sizeColumns(this.detailsGridOptions);

    }

    autosizeColumns() {
        if (this.detailsGridOptions) {
            this.gridService.sizeColumns(this.detailsGridOptions);
        }
    }

    initializeSortModel() {
        const defaultSortModel = [
            {
                colId: 'currencyCode',
                sort: 'asc',
            },
            {
                colId: 'departmentCode',
                sort: 'asc',
            },
            {
                colId: 'charterCode',
                sort: 'asc',
            },
            {
                colId: 'costType',
                sort: 'asc',
            },
        ];

        this.gridApi.setSortModel(defaultSortModel);
    }

    initializeGridColumns() {
        this.detailsGridColumns = [
            {
                headerName: 'Accrual Number',
                field: 'accrualNumber',
                colId: 'accrualNumber',
                hide: false,
            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Contract',
                field: 'contractNumber',
                colId: 'contractNumber',
                hide: false,
                valueFormatter: this.contractFormatter.bind(this),
            },
            {
                headerName: ' Cost Type',
                field: 'costType',
                colId: 'costType',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Quantity ' + this.quantityWeightCode,
                field: 'quantity',
                colId: 'quantity',
                hide: false,
                valueFormatter: this.quantityFormatter.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
                valueFormatter: this.currencyFormatter.bind(this),
            },
            {
                headerName: 'Full Value',
                field: 'fullValue',
                colId: 'fullValue',
                hide: (this.reportType === 1) ? false : true,
                valueFormatter: this.amountFormatter.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Invoiced Value',
                field: 'invoicedAmount',
                colId: 'invoicedAmount',
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: '% Actualized',
                field: 'percentageActualized',
                colId: 'percentageActualized',
                hide: (this.reportType === 1) ? false : true,
                valueFormatter: this.amountFormatter.bind(this),
            },
            {
                headerName: 'Accrued Amount',
                field: 'accruedAmount',
                colId: 'accruedAmount',
                hide: (this.reportType === 1) ? false : true,
                valueFormatter: this.amountFormatter.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Document Ref',
                field: 'documentReference',
                colId: 'documentReference',
                hide: (this.reportType !== 1) ? false : true,
                valueFormatter: this.charterFormatter.bind(this),
            },
            {
                headerName: 'Document Date',
                field: 'documentDate',
                colId: 'documentDate',
                hide: (this.reportType !== 1) ? false : true,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                cellClass: 'dateFormat',
                valueGetter: (params) => {
                    const dateFormat: FormatDatePipe = this.formatDate;
                    const val = dateFormat.transformdate(params.data.documentDate);

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
                headerName: 'Associated Client',
                field: 'associatedClient',
                colId: 'associatedClient',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Inhouse/External',
                field: 'inhouseOrExternal',
                colId: 'inhouseOrExternal',
                hide: (this.reportType !== 1) ? false : true,
                valueFormatter: this.charterFormatter.bind(this),
            },
            {
                headerName: 'Charter',
                field: 'charterCode',
                colId: 'charterCode',
                hide: false,
                valueFormatter: this.charterFormatter.bind(this),
            },
            {
                headerName: 'BL Date',
                field: 'blDate',
                colId: 'blDate',
                hide: (this.reportType === 1) ? false : true,
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                cellClass: 'dateFormat',
                valueGetter: (params) => {
                    const dateFormat: FormatDatePipe = this.formatDate;
                    const val = dateFormat.transformdate(params.data.blDate);

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

        ];
    }

    initDetailsGridRows() {
        this.detailsGridRows = [];
    }

    getTradeCostListDetails(filteredDetailsGridRows?: OverviewGenerateEndOfMonthDisplayView[], isFilteredApplied: boolean = false) {
        if (filteredDetailsGridRows && isFilteredApplied === true) {
            this.detailsGridRows = filteredDetailsGridRows;
        } else {
            this.tradingService.getTradeCostList(this.reportType, GenerateMonthEndEnum.Details, this.dataVersionID)
                .subscribe((data) => {
                    if (data && data.value.length > 0) {
                        const mappingErrorDetails = data.value[0].tradeCostMonthEndMappingErrors;
                        this.mappingError.emit(mappingErrorDetails);
                    }
                    this.detailsGridRows = data.value.map((CostTrade) => {
                        return new OverviewGenerateEndOfMonthDisplayView(CostTrade, this.reportType);
                    });
                    if (this.reportType === 2) {

                        this.model = new FilterGem();
                        this.model.departmentCode = [];
                        this.model.charterCode = [];
                        this.model.costType = [];
                        this.model.associatedClient = [];
                        let count = 1;
                        this.detailsGridRows.forEach((x) => {
                            if (x.departmentCode) {
                                const dept = new FilterValueGenerateEndMonth();
                                dept.desc = x.departmentCode;
                                dept.value = count;
                                this.model.departmentCode.push(dept);
                            }
                            if (x.charterCode) {
                                const charter = new FilterValueGenerateEndMonth();
                                charter.desc = x.charterCode;
                                charter.value = count;
                                this.model.charterCode.push(charter);
                            }
                            if (x.costType) {
                                const cost = new FilterValueGenerateEndMonth();
                                cost.desc = x.costType;
                                cost.value = count;
                                this.model.costType.push(cost);
                            }
                            if (x.associatedClient) {
                                const client = new FilterValueGenerateEndMonth();
                                client.desc = x.associatedClient;
                                client.value = count;
                                this.model.associatedClient.push(client);
                            }
                            count = count + 1;
                        });
                        this.detailsGridRows.forEach((x) => {
                            if (x.postingCostType) {
                                const cost = new FilterValueGenerateEndMonth();
                                cost.desc = x.postingCostType;
                                cost.value = count;
                                this.model.costType.push(cost);
                            }
                            count = count + 1;
                        });
                        this.filteredGrid.emit(this.model);
                    }
                    this.isLoading = false;
                    this.originalDetailsGridRows = this.detailsGridRows;
                    if (isFilteredApplied) {
                        this.applyButtonClicked.emit();
                    }
                });
        }
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

    quantityFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 3);
        }
    }

    charterFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 15); }
    }

    dateValueFormatter(param): string {
        if (param.value) { return this.formatDate.transform(param.value); }
    }

    contractFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 12); }
    }

    onExportButtonClickedAsExcel() {
        const screenName: string = 'EndofMonthDetails';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const screenName: string = 'EndofMonthDetails';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }
}
