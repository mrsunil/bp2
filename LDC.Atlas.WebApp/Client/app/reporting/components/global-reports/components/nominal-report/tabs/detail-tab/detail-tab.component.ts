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
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../../../shared/entities/company.entity';
import { ColumnConfigurationProperties } from '../../../../../../../shared/entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { NominalAccountTypes } from '../../../../../../../shared/entities/nominal-account-type.entity';
import { ReportStyleTypes } from '../../../../../../../shared/entities/report-style-type.entity';
import { WINDOW } from '../../../../../../../shared/entities/window-injection-token';
import { NominalAccountType } from '../../../../../../../shared/enums/nominal-account-type-enum';
import { ReportStyleType } from '../../../../../../../shared/enums/report-style-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { TransactionReportCommand } from '../../../../../../../shared/services/execution/dtos/transaction-report-command';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { NominalReportDataLoader } from '../../../../../../../shared/services/list-and-search/nominalReport-data-loader';
import { UiService } from '../../../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { Currency } from '../../../../../../../shared/entities/currency.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { NominalAccount } from '../../../../../../../shared/entities/nominal-account.entity';
import { ListAndSearchFilterType } from '../../../../../../../shared/enums/list-and-search-filter-type.enum';
import { FilterSetDisplayComponent } from '../../../../../../../shared/components/filter-set-display/filter-set-display.component';
import { NominalReportComponent } from '../../nominal-report.component';

@Component({
    selector: 'atlas-detail-tab',
    templateUrl: './detail-tab.component.html',
    styleUrls: ['./detail-tab.component.scss']
})
export class DetailTabComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplay') filterSetDisplayComponent: FilterSetDisplayComponent;
    gridContext: NominalReportComponent;
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridRows: any[] = [];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    isLoading = false;
    nominalTransactionGridCode: string = 'nominalReportTransactionGrid';
    nominalTransactionGridConfig: ColumnConfigurationProperties[] = [];
    nominalTrabsactionQuickSumColumns: string[] = [];
    gridTitle: string;
    excelStyles: any;
    isNominalReportDisplay: boolean = false;
    checkFunctionalCurrency: string;
    checkStatutoryCurrency: string;
    isBroughtForward :boolean =false;

    @Input() reportStyleCtrl = new AtlasFormControl('reportStyleTypes');
    @Input() reportStyleTypes: ReportStyleTypes[] = [];
    @Input() accountTypeCtrl = new AtlasFormControl('nominalAccountTypes');
    @Input() nominalAccountTypes: NominalAccountTypes[] = [];
    @Input() documentDateFromCtrl = new AtlasFormControl('documentFromCtrl');
    @Input() documentDateToCtrl = new AtlasFormControl('documentToCtrl');
    @Input() accountingDateFromCtrl = new AtlasFormControl('accountingDateFromCtrl');
    @Input() accountingDateToCtrl = new AtlasFormControl('accountingDateToCtrl');
    @Input() functionalCurrencyCtrl = new AtlasFormControl('nominalFunctionalCurrency');
    @Input() currencyCtrl = new AtlasFormControl('currencyCtrl');
    @Input() nominalAccountsCtrl = new AtlasFormControl('nominalAccountsCtrl');
    @Input() columnConfiguration: ColumnConfigurationProperties[] = [];
    @Input() masterdata: MasterData;
    @Input() nominalReportFormGroup: FormGroup;
    filteredCurrencyList: Currency[];
    company: string;
    filters: ListAndSearchFilter[] = [];

    subscriptions: Subscription[] = [];
    isGenerateButtonClicked: boolean = false;
    hasGridSharing: boolean;
    companyConfiguration: Company;
    ReportStyleType = ReportStyleType;
    filteredNominalAccountList: NominalAccount[];
    isSummaryMode: boolean = false;
    tabIndex: number;
    isDetailMode: boolean = true;

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
        public dataLoader: NominalReportDataLoader,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private utilService: UtilService,
        protected masterdataService: MasterdataService,
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
    }

    getColumnConfig(): ColumnConfigurationProperties[] {
        this.allowedColumnsforQuickSum = this.nominalTrabsactionQuickSumColumns;
        return this.nominalTransactionGridConfig;
    }

    setColumnConfig(config: ColumnConfigurationProperties[]): void {
        this.nominalTransactionGridConfig = config;
    }

    getGridCode(): string {
        return this.nominalTransactionGridCode;
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.reportStyleCtrl.patchValue(ReportStyleType.Summary);
        this.accountTypeCtrl.patchValue(NominalAccountType.Both);
        this.company = this.companyManager.getCurrentCompanyId();
        // this.bindConfiguration();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;

        // quicksum
        this.classApplied = this.defaultClass;
        this.loadGridConfiguration();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }
    onGenerateReportButtonClicked(isGenerateButtonClicked?: boolean) {
        this.isGenerateButtonClicked = isGenerateButtonClicked;
        if (this.isGenerateButtonClicked && this.nominalReportFormGroup.valid) {
            this.toggleQuickSum(false);
            const hasQuickSearchValues = (this.currencyCtrl.value && this.currencyCtrl.valid)
                || (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid);

            if (hasQuickSearchValues) {
                const quickFilters: ListAndSearchFilter[] = [];
                if (this.currencyCtrl.value && this.currencyCtrl.valid) {
                    const currencyField = this.columnConfiguration.find((column) => column.fieldName === 'Currency');

                    const currencyFilter = new ListAndSearchFilter();
                    currencyFilter.fieldId = currencyField.fieldId;
                    currencyFilter.fieldName = currencyField.fieldName;
                    currencyFilter.fieldFriendlyName = currencyField.fieldName;
                    currencyFilter.isActive = true;
                    currencyFilter.predicate = {
                        filterType: ListAndSearchFilterType.Picklist,
                        operator: 'eq',
                        value1: (this.currencyCtrl.value as Currency).currencyCode,
                    };
                    quickFilters.push(currencyFilter);
                    this.currencyCtrl.patchValue(null);
                    this.currencyCtrl.reset();
                }

                if (this.nominalAccountsCtrl.value && this.nominalAccountsCtrl.valid) {
                    const nominalAccountsField = this.columnConfiguration.find((column) => column.fieldName === 'NominalAccount');

                    const nominalAccountsFilter = new ListAndSearchFilter();
                    nominalAccountsFilter.fieldId = nominalAccountsField.fieldId;
                    nominalAccountsFilter.fieldName = nominalAccountsField.fieldName;
                    nominalAccountsFilter.fieldFriendlyName = nominalAccountsFilter.fieldName;
                    nominalAccountsFilter.isActive = true;
                    nominalAccountsFilter.predicate = {
                        filterType: ListAndSearchFilterType.Picklist,
                        operator: 'eq',
                        value1: (this.nominalAccountsCtrl.value as NominalAccount).accountNumber,
                    };
                    quickFilters.push(nominalAccountsFilter);
                    this.nominalAccountsCtrl.reset();
                }
                this.filterSetDisplayComponent.loadFilterSet(quickFilters, true);
                this.filters = quickFilters;
            }
            const columnConfig = this.getColumnConfig();
            if (columnConfig.length === 0) {
                this.loadGridConfiguration();
            } else {
                this.initColumns();
            }

            this.loadData();
        }
    }

    loadData() {
        const clientReport = this.getNominalReportData();
        this.isLoading = true;
        this.isNominalReportDisplay = false;
        this.dataLoader.getData(this.filters, null, null, null, clientReport)
            .pipe(
                first(),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((data) => {
                this.agGridRows = data.value;
                this.isNominalReportDisplay = true;
            });

    }

    getNominalReportData() {
        const nominalReport = new TransactionReportCommand();
        nominalReport.functionalCurrency = this.functionalCurrencyCtrl.value !== ''
            && this.reportStyleCtrl.value === ReportStyleType.Summary
            ? this.functionalCurrencyCtrl.value : null;
        nominalReport.broughtForward = this.isBroughtForward;
        nominalReport.accountType = this.accountTypeCtrl.value !== null ? this.accountTypeCtrl.value : null;
        nominalReport.fromDate = this.accountingDateFromCtrl.value !== null ? this.accountingDateFromCtrl.value : null;
        nominalReport.toDate = this.accountingDateToCtrl.value !== null ? this.accountingDateToCtrl.value : null;
        nominalReport.documentFromDate = this.documentDateFromCtrl.value !== null ? this.documentDateFromCtrl.value : null;
        nominalReport.documentToDate = this.documentDateToCtrl.value !== null ? this.documentDateToCtrl.value : null;
        nominalReport.reportStyleType = this.reportStyleCtrl.value !== null ? this.reportStyleCtrl.value : null;
        return nominalReport;
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.getGridCode())
            .subscribe((configuration) => {
                this.setColumnConfig(configuration.columns);
                this.columnConfiguration = configuration.columns;
                this.initColumns();
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    initColumns() {
        const configuration = this.getColumnConfig();
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
                rowGroup: false,
                enableRowGroup: false,
            };
            if (columnDef.field === 'functionalCurrency' ||
                columnDef.field === 'statutoryCcyAmount' || columnDef.field === 'transactionalCurrency') {
                columnDef.aggFunc = 'sum';
                columnDef.headerName = config.friendlyName;
                this.nominalTrabsactionQuickSumColumns.push(columnDef.field.toLocaleLowerCase());
            }

            const formatter = this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }

            const dateGetter = this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
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

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.agGridColumnApi.autoSizeAllColumns();
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
