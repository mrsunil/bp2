import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../../../execution/services/execution-cash-common-methods';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { FilterGem } from '../../../../../../../shared/entities/filter-gem.entity';
import { FilterValueGenerateEndMonth } from '../../../../../../../shared/entities/filter-value-generate-end-month.entity';
import { GenerateMonthEndEnum } from '../../../../../../../shared/enums/generate-month-end-type.enum';
import { ReportType } from '../../../../../../../shared/enums/report-type.enum'
import { OverviewGenerateEndOfMonthDisplayView } from '../../../../../../../shared/models/overview-generate-end-of-month-display-view';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { MonthEndTemporaryAdjustmentListCommand } from '../../../../../../../shared/services/execution/dtos/month-end-temporary-adjustment-list-command';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../../shared/services/ui.service';
import { TradeCostMonthEndMappingErrors } from '../../../../../../../shared/entities/tradecost-monthend-mappingerrors-entity';

@Component({
    selector: 'atlas-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrls: ['./overview-tab.component.scss'],
    providers: [DatePipe],
})
export class OverviewTabComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly filteredGrid = new EventEmitter<FilterGem>();
    @Output() readonly applyButtonClicked = new EventEmitter();
    @Output() readonly disableGeneratePosting = new EventEmitter<boolean>();
    @Output() readonly mappingError = new EventEmitter<TradeCostMonthEndMappingErrors[]>();
    @Input() filteredOverviewGridRows: OverviewGenerateEndOfMonthDisplayView[];
    overviewGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    overviewGridColumns: agGrid.ColDef[];
    overviewGridRows: OverviewGenerateEndOfMonthDisplayView[];
    originalOverviewGridRows: OverviewGenerateEndOfMonthDisplayView[];
    postingsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    dataLength: number = 0;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    company: string;
    defaultColDef: any;
    rowGroupPanelShow: string;
    totalAmount: number;
    userActiveDirectoryName: string;
    private generateMonthEndSubscription: Subscription;
    model: FilterGem;
    dataVersionID: number;
    dataVersionDate: Date;
    dataVersionMonth: string;
    formattedInput: string;
    generatePosting = true;
    reportType: number;
    reportTypeDescription: string;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        private tradingService: TradingService,
        private authorizationService: AuthorizationService,
        private executionService: ExecutionService,
        private snackbarService: SnackbarService,
        private datePipe: DatePipe,
        public gridService: AgGridService) {
        super(formConfigurationProvider);
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.companyManager.getCurrentCompanyId();
        this.initializeGridColumns();
        this.initOverviewGridRows();
        this.initializSortModel();
    }
    onGridReady(params) {
        params.columnDefs = this.overviewGridColumns;
        this.overviewGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridService.sizeColumns(this.overviewGridOptions);

        window.onresize = () => {
            this.gridService.sizeColumns(this.overviewGridOptions);
        };
    }

    initializSortModel() {
        let defaultSortModel = [
            {
                colId: "currencyCode",
                sort: "asc"
            },
            {
                colId: "departmentCode",
                sort: "asc"
            },
            {
                colId: "charterCode",
                sort: "asc"
            },
            {
                colId: "costType",
                sort: "asc"
            }
        ];

        this.gridApi.setSortModel(defaultSortModel);
    }

    initializeGridColumns() {
        this.overviewGridColumns = [
            {
                headerName: 'Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
                enableRowGroup: true,
                hide: true,
                rowGroup: true,
                valueFormatter: this.currencyFormatter.bind(this),
            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                enableRowGroup: true,
                hide: true,
                rowGroup: true,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Charter',
                field: 'charterCode',
                colId: 'charterCode',
                enableRowGroup: true,
                hide: true,
                rowGroup: true,
                valueFormatter: this.charterFormatter.bind(this),
            },
            {
                headerName: ' Cost Type',
                field: 'costType',
                colId: 'costType',
                enableRowGroup: true,
                hide: true,
                rowGroup: true,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Associated Client',
                field: 'associatedClient',
                colId: 'associatedClient',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Sum of Accrued Amount',
                field: 'accruedAmount',
                colId: 'accruedAmount',
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
                aggFunc: 'sum',
                cellStyle: { textAlign: 'right' },
            },
        ];
        this.rowGroupPanelShow = 'always';
        this.defaultColDef = { sortable: true };

    }

    initOverviewGridRows() {
        this.overviewGridRows = [];
    }

    getTradeCostListOverview(filteredOverviewGridRows?: OverviewGenerateEndOfMonthDisplayView[], isFilteredApplied: boolean = false) {
        if (filteredOverviewGridRows && isFilteredApplied === true) {
            this.overviewGridRows = filteredOverviewGridRows;
        } else {
            this.getTradeCostListPosting(this.dataVersionID);
            this.tradingService.getTradeCostList(this.reportType, GenerateMonthEndEnum.Overview, this.dataVersionID)
                .subscribe((data) => {
                    if (data && data.value.length > 0) {
                        var mappingErrorDetails = data.value[0].tradeCostMonthEndMappingErrors;
                        this.mappingError.emit(mappingErrorDetails);
                    }
                    this.overviewGridRows = data.value.map((CostTrade) => {
                        return new OverviewGenerateEndOfMonthDisplayView(CostTrade, this.reportType);
                    });
                    this.model = new FilterGem();
                    this.model.departmentCode = [];
                    this.model.charterCode = [];
                    this.model.costType = [];
                    this.model.associatedClient = [];
                    let count = 1;
                    this.overviewGridRows.forEach((x) => {
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
                    this.overviewGridRows.forEach((x) => {
                        if (x.postingCostType) {
                            const cost = new FilterValueGenerateEndMonth();
                            cost.desc = x.postingCostType;
                            cost.value = count;
                            this.model.costType.push(cost);
                        }
                        count = count + 1;
                    });
                    this.filteredGrid.emit(this.model);
                    this.isLoading = false;
                    this.calculateGrandTotal(this.overviewGridRows);
                    this.originalOverviewGridRows = this.overviewGridRows;
                    if (isFilteredApplied) {
                        this.applyButtonClicked.emit();
                    }
                });
        }
    }

    calculateGrandTotal(amounts: OverviewGenerateEndOfMonthDisplayView[]) {
        this.totalAmount = 0;
        amounts.forEach(
            (amount) => {
                this.totalAmount = (this.totalAmount + amount.accruedAmount);
                this.formattedInput = this.totalAmount.toLocaleString();
                return this.formattedInput;
            },
        );
    }

    currencyFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 3); }
    }

    charterFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 15); }
    }

    stringFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 10); }
    }

    amountFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 2);
        }
    }

    onGenerateTADocument() {
        if (this.postingsGridRows) {
            if (this.postingsGridRows.length > 0) {
                const genetateMonthEndTACommand = new MonthEndTemporaryAdjustmentListCommand();
                genetateMonthEndTACommand.dataVersionId = this.dataVersionID;
                genetateMonthEndTACommand.dataVersionDate = this.dataVersionDate;
                genetateMonthEndTACommand.reportType = this.reportType;
                this.generateMonthEndSubscription = this.executionService
                    .SaveMonthEndTemporaryAdjustment(genetateMonthEndTACommand)
                    .subscribe(((data) => {
                        this.disableGeneratePosting.emit(this.generatePosting);
                        this.snackbarService.informationAndCopySnackBar('The following Accrual and autoreversal have been created:' + data.monthEndTAReferenceNumber, data.monthEndTAReferenceNumber);
                    }),
                    );
            }
        } else {
            this.snackbarService.informationSnackBar('Please wait! Data is loading...');
        }

    }
    ngOnDestroy(): void {
        if (this.generateMonthEndSubscription) {
            this.generateMonthEndSubscription.unsubscribe();
        }
    }
    onExportButtonClickedAsExcel() {
        const screenName: String = 'EndofMonthOverview';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const screenName: String = 'EndofMonthOverview';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }

    getTradeCostListPosting(dataVersionId: number) {
        this.tradingService.getTradeCostList(this.reportType, GenerateMonthEndEnum.Postings, this.dataVersionID)
            .subscribe((data) => {
                this.postingsGridRows = data.value.map((CostTrade) => {
                    return new OverviewGenerateEndOfMonthDisplayView(CostTrade, this.reportType);

                });
            });
    }
}
