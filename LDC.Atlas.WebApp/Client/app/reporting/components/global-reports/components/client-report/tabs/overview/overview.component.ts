import { Component, Inject, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../../../execution/services/execution-cash-common-methods';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { FilterSetDisplayComponent } from '../../../../../../../shared/components/filter-set-display/filter-set-display.component';
import { AccountingSetup } from '../../../../../../../shared/entities/accounting-setup.entity';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { BalancesTypes } from '../../../../../../../shared/entities/balances-type-entity';
import { Company } from '../../../../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../../../../shared/entities/counterparty.entity';
import { Department } from '../../../../../../../shared/entities/department.entity';
import { ColumnConfigurationProperties } from '../../../../../../../shared/entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { MatchingTypes } from '../../../../../../../shared/entities/matchings-type-entity';
import { ReportStyleTypes } from '../../../../../../../shared/entities/report-style-type-entity';
import { UnmatchedTypes } from '../../../../../../../shared/entities/unmatched-type-entity';
import { WINDOW } from '../../../../../../../shared/entities/window-injection-token';
import { ListAndSearchFilterType } from '../../../../../../../shared/enums/list-and-search-filter-type.enum';
import { ReportStyleType } from '../../../../../../../shared/enums/report-style-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { TransactionReportCommand } from '../../../../../../../shared/services/execution/dtos/transaction-report-command';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { ClientReportDataLoader } from '../../../../../../../shared/services/list-and-search/clientReport-data-loader';
import { UiService } from '../../../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { Currency } from '../../../../../../../shared/entities/currency.entity';
import { CostType } from '../../../../../../../shared/entities/cost-type.entity';
import { ClientReportComponent } from '../../client-report.component';


@Component({
    selector: 'atlas-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplay') filterSetDisplayComponent: FilterSetDisplayComponent;

    gridContext: ClientReportComponent;
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridRows: any[] = [];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    isLoading = false;
    gridCode = 'clientReportTransactionGrid';
    gridTitle: string;
    excelStyles: any;
    isUserPreferencesDisplay: boolean = false;
    isClientReportDisplay: boolean = false;
    rowGroupPanelShow: string;
    groupMultiAutoColumn: boolean;
    checkFunctionalCurrency: string;
    checkStatutoryCurrency: string;
    isOverviewMode: boolean = true;

    @Input() clientDateFromCtrl = new AtlasFormControl('clientDateFrom');
    @Input() clientDateToCtrl = new AtlasFormControl('clientDateTo');
    @Input() clientReportFormGroup: FormGroup;
    @Input() balancesCtrl = new AtlasFormControl('balances');
    @Input() reportStyleCtrl = new AtlasFormControl('reportsStyle');
    @Input() matchingCtrl = new AtlasFormControl('matchings');
    @Input() unmatchedCtrl = new AtlasFormControl('unmatcheds');
    @Input() functionalCurrencyCtrl = new AtlasFormControl('clientFunctionalCurrency');
    @Input() accrualsIncludedCtrl = new AtlasFormControl('clientAccrualsIncluded');
    @Input() clientAccountCtrl = new AtlasFormControl('clientAccount');
    @Input() currencyCtrl = new AtlasFormControl('currency');
    @Input() clientDepartmentCtrl = new AtlasFormControl('clientDepartment');
    @Input() costTypeCtrl = new AtlasFormControl('costType');
    @Input() isTabEnalble: boolean;

    company: string;
    filters: ListAndSearchFilter[] = [];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    subscriptions: Subscription[] = [];
    hasGridSharing: boolean;
    companyConfiguration: Company;
    ReportStyleType = ReportStyleType;
    tabIndex: number;
    masterData: MasterData;

    // -- Evolutions to handle correctly GridViews
    clientTransactionGridCode: string = 'clientReportTransactionGrid';
    clientTransactionGridConfig: ColumnConfigurationProperties[] = [];
    clientTransactionQuickSumColumns: string[] = [];

    clientSummaryGridCode: string = 'clientReportSummaryGrid';
    clientSummaryGridConfig: ColumnConfigurationProperties[] = [];
    clientSummaryQuickSumColumns: string[] = [];

    // this is to resolve an issue on first filter change call. Search for A001
    filtersLoadedForReport: boolean = false;

    /* quick sum */
    defaultClass: string = 'ag-theme-material pointer-cursor';
    cellSelectionClass: string = 'ag-theme-material pointer-cursor cell-selection';
    classApplied: string;
    quickSumModeActivated = false;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    allowedColumnsforQuickSum: string[] = [];

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        public dataLoader: ClientReportDataLoader,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService, ) {
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
        this.masterData = this.route.snapshot.data.masterdata;
    }

    ngOnInit() {
        this.company = this.companyManager.getCurrentCompanyId();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;

        this.atlasAgGridParam = this.gridService.getAgGridParam();

        this.loadGridConfiguration();

        // quicksum
        this.classApplied = this.defaultClass;

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    onGenerateReportButtonClicked() {
        if (this.clientReportFormGroup.valid) {
            this.toggleQuickSum(false);
            const hasQuickSearchValues = (this.clientAccountCtrl.value && this.clientAccountCtrl.valid)
                || (this.currencyCtrl.value && this.currencyCtrl.valid)
                || (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid)
                || (this.costTypeCtrl.value && this.costTypeCtrl.valid);

            if (hasQuickSearchValues) {
                const quickFilters: ListAndSearchFilter[] = [];
                if (this.clientAccountCtrl.value && this.clientAccountCtrl.valid) {
                    const clientAccountField = this.columnConfiguration.find((column) => column.fieldName === 'ClientAccount');

                    const clientAccountFilter = new ListAndSearchFilter();
                    clientAccountFilter.fieldId = clientAccountField.fieldId;
                    clientAccountFilter.fieldName = clientAccountField.fieldName;
                    clientAccountFilter.isActive = true;
                    clientAccountFilter.predicate = {
                        filterType: ListAndSearchFilterType.Picklist,
                        operator: 'eq',
                        value1: (this.clientAccountCtrl.value as Counterparty).counterpartyCode,
                    };
                    quickFilters.push(clientAccountFilter);
                }

                if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                    const currencyField = this.columnConfiguration.find((column) => column.fieldName === 'Currency');

                    const currencyFilter = new ListAndSearchFilter();
                    currencyFilter.fieldId = currencyField.fieldId;
                    currencyFilter.fieldName = currencyField.fieldName;
                    currencyFilter.isActive = true;
                    currencyFilter.predicate = {
                        filterType: ListAndSearchFilterType.Picklist,
                        operator: 'eq',
                        value1: (this.currencyCtrl.value as Currency).currencyCode,
                    };
                    quickFilters.push(currencyFilter);
                }

                if (this.clientDepartmentCtrl.value && this.clientDepartmentCtrl.valid) {
                    const departmentField = this.columnConfiguration.find((column) => column.fieldName === 'Department');

                    const departmentFilter = new ListAndSearchFilter();
                    departmentFilter.fieldId = departmentField.fieldId;
                    departmentFilter.fieldName = departmentField.fieldName;
                    departmentFilter.isActive = true;
                    departmentFilter.predicate = {
                        filterType: ListAndSearchFilterType.Picklist,
                        operator: 'eq',
                        value1: (this.clientDepartmentCtrl.value as Department).departmentCode,
                    };
                    quickFilters.push(departmentFilter);
                }

                if (this.costTypeCtrl.value && this.costTypeCtrl.valid) {
                    const costTypeField = this.columnConfiguration.find((column) => column.fieldName === 'CostType');

                    const costTypeFilter = new ListAndSearchFilter();
                    costTypeFilter.fieldId = costTypeField.fieldId;
                    costTypeFilter.fieldName = costTypeField.fieldName;
                    costTypeFilter.isActive = true;
                    costTypeFilter.predicate = {
                        filterType: ListAndSearchFilterType.Picklist,
                        operator: 'eq',
                        value1: (this.costTypeCtrl.value as CostType).costTypeCode,
                    };
                    quickFilters.push(costTypeFilter);
                }
                this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                this.filters = quickFilters;
            }

            let loadConfig = false;

            this.gridCode = this.clientTransactionGridCode;
            this.allowedColumnsforQuickSum = this.clientTransactionQuickSumColumns;
            if (this.clientSummaryGridConfig.length > 0) {
                this.columnConfiguration = this.clientTransactionGridConfig;
            } else {
                loadConfig = true;
            }

            if (loadConfig) {
                this.loadGridConfiguration();
            } else {
                this.initColumns(this.columnConfiguration);
            }
            this.loadData();
        }
    }

    loadData() {
        const clientReport = this.getClientReportParameters();
        this.isLoading = true;
        this.isClientReportDisplay = false;
        this.isUserPreferencesDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(
                first(),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((data) => {
                this.agGridRows = data.value;
                if (this.reportStyleCtrl.value === ReportStyleType.Transactions) {
                    this.rowGroupPanelShow = 'always';
                    this.groupMultiAutoColumn = true;
                }
                this.isClientReportDisplay = true;

            });
    }

    getClientReportParameters() {
        const clientReport = new TransactionReportCommand();
        clientReport.accuralsIncluded = this.accrualsIncludedCtrl.value !== '' ? this.accrualsIncludedCtrl.value : null;
        clientReport.functionalCurrency = this.reportStyleCtrl.value === ReportStyleType.Summary
            && this.functionalCurrencyCtrl.value !== '' ?
            this.functionalCurrencyCtrl.value : null;
        clientReport.balanceType = this.balancesCtrl.value !== null ? this.balancesCtrl.value : null;
        clientReport.fromDate = this.clientDateFromCtrl.value !== null ? this.clientDateFromCtrl.value : null;
        clientReport.toDate = this.clientDateToCtrl.value !== null ? this.clientDateToCtrl.value : null;
        clientReport.matchingType = this.matchingCtrl.value !== null ? this.matchingCtrl.value : null;
        clientReport.unmatchedType = this.unmatchedCtrl.value !== null ? this.unmatchedCtrl.value : null;
        clientReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return clientReport;
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {

                this.clientTransactionGridConfig = configuration.columns;
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser; // should handle this seperatly for both grids
            });
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        const numericColumns: string[] = [];
        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.agGridCols = configuration.map((config) => {
            const columnDef: agGrid.ColDef = {
                colId: this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: this.utilService.convertToCamelCase(config.fieldName),
                width: 100,
                hide: !config.isVisible,
                rowGroup: config.isGroup,
                enableRowGroup: config.isGroup,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                if (this.reportStyleCtrl.value === ReportStyleType.Transactions) {
                    this.clientTransactionQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
                }
                else {
                    this.clientSummaryQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
                }
            }

            const formatter = this.uiService.getFormattterForTypeClientReport(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }

            const dateGetter = this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            // if (this.gridCode === 'clientReportTransactionGrid') {
            if (columnDef.headerName === 'Functional Currency') {
                columnDef.headerName = this.checkFunctionalCurrency + ' eq';
            }
            if (columnDef.headerName === 'Statutory Ccy Amount') {
                columnDef.headerName = this.checkStatutoryCurrency + ' eq';
            }
            const numericColumn = numericColumns.find((column) => column === columnDef.field.toLowerCase());
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = this.numberFormatter;
            }
            // }
            return columnDef;
        });

        if (this.agGridOptions) {
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
                this.agGridColumnApi.autoSizeAllColumns();
            }
        }

    }
    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
    }
    numberFormatter(param) {
        if (param.colDef.colId.toLowerCase() === 'transactionalcurrency' ||
            param.colDef.colId.toLowerCase() === 'functionalcurrency' || param.colDef.colId.toLowerCase() === 'statutoryccyamount'
            || param.colDef.colId.toLowerCase() === 'weight') {
            if (param && param.value) {
                const commonMethods = new CommonMethods();
                if (param.colDef.colId.toLowerCase() === 'weight') {
                    return commonMethods.getFormattedNumberValue(param.value, 3);
                }
                else {
                    return commonMethods.getFormattedNumberValue(param.value);
                }
            }
        }
    }
    onGridReady(params) {
        this.agGridOptions = params;

        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.agGridColumnApi.autoSizeAllColumns();
        };
    }

    // -- Quick Sum

    toggleQuickSum(value: boolean) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        if (this.quickSumModeActivated) {
            this.classApplied = this.cellSelectionClass;
        } else {
            this.classApplied = this.defaultClass;
        }
    }

    onClearSelectionClicked() {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    }
    onRangeSelectionChanged(event) {
        this.selectedColumnsArray = [];

        const rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        // if there is only one column selected
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(rangeSelections[0]);
        } else {
            const cellInfos: any = [];
            const selectedCells: any = [];
            rangeSelections.forEach((row) => {
                const cellExists = selectedCells.find((cell) => cell.start.rowIndex === row.start.rowIndex &&
                    cell.end.rowIndex === row.end.rowIndex && cell.columns[0].getColId() === row.columns[0].getColId());
                if (cellExists === null || cellExists === undefined) {
                    selectedCells.push(row);

                    const obj = { rowIndex: row.start.rowIndex, columnName: row.columns[0].getColId() };
                    cellInfos.push(obj);
                }
            });

            let sum = 0;
            let columnName: string;
            let columnHeader: string;
            const selectedColumnsArray = this.selectedColumnsArray;
            const allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;

            selectedCells.forEach((row) => {
                row.columns.forEach((column) => {
                    sum = 0;
                    columnName = column.getColDef().colId.toLowerCase();
                    columnHeader = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum.includes(columnName)) {
                        for (let rowIndex = 0; rowIndex < cellInfos.length; rowIndex++) {
                            if (cellInfos[rowIndex].columnName.toLowerCase() === columnName) {
                                const rowModel = this.agGridApi.getModel();
                                const rowNode = rowModel.getRow(Number(cellInfos[rowIndex].rowIndex));
                                const value = this.agGridApi.getValue(column, rowNode);
                                sum += Number(value);
                            }
                        }

                        const columnObj = selectedColumnsArray.find((sum) => sum.name === columnHeader);
                        if (columnObj) {
                            columnObj.sum = sum;
                        } else {
                            selectedColumnsArray.push({ name: columnHeader, sum });
                        }
                    }
                });
            });
            this.selectedColumnsArray = selectedColumnsArray;
        }
    }

    rangeSelectionCalculation(rangeSelection: agGrid.RangeSelection) {
        let sum = 0;
        let columnName: string;
        let columnHeader: string;
        this.selectedColumnsArray = [];

        const startRow = Math.min(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);
        const endRow = Math.max(rangeSelection.start.rowIndex, rangeSelection.end.rowIndex);

        const allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        rangeSelection.columns.forEach((column) => {
            columnName = column.getColDef().colId.toLowerCase();
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    const rowModel = this.agGridApi.getModel();
                    const rowNode = rowModel.getRow(rowIndex);
                    const value = this.agGridApi.getValue(column, rowNode);
                    sum += Number(value);
                }
                this.selectedColumnsArray.push({ name: columnHeader, sum });
            }
        });
    }
}

