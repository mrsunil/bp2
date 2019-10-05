import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger, MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../execution/services/execution-cash-common-methods';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { UserGridViewDto } from '../../../../../shared/dtos/user-grid-view-dto.dto';
import { FilterSetDisplayComponent } from '../../../../../shared/components/filter-set-display/filter-set-display.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AccountingSetup } from '../../../../../shared/entities/accounting-setup.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../shared/entities/company.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { ColumnConfigurationProperties } from '../../../../../shared/entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccountTypes } from '../../../../../shared/entities/nominal-account-type.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';
import { ReportStyleTypes } from '../../../../../shared/entities/report-style-type.entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { WINDOW } from '../../../../../shared/entities/window-injection-token';
import { ListAndSearchFilterType } from '../../../../../shared/enums/list-and-search-filter-type.enum';
import { NominalAccountType } from '../../../../../shared/enums/nominal-account-type-enum';
import { ReportStyleType } from '../../../../../shared/enums/report-style-type.enum';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { TransactionReportCommand } from '../../../../../shared/services/execution/dtos/transaction-report-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { NominalReportDataLoader } from '../../../../../shared/services/list-and-search/nominalReport-data-loader';
import { TitleService } from '../../../../../shared/services/title.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { beforeFromDate } from './nominal-report-period-validator.validator';
import { DetailTabComponent } from './tabs/detail-tab/detail-tab.component';
import { OverviewTabComponent } from './tabs/overview-tab/overview-tab.component';

@Component({
    selector: 'atlas-nominal-report',
    providers: [NominalReportDataLoader],
    templateUrl: './nominal-report.component.html',
    styleUrls: ['./nominal-report.component.scss'],
})
export class NominalReportComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplay') filterSetDisplayComponent: FilterSetDisplayComponent;
    @ViewChild('overviewComponent') overviewComponent: OverviewTabComponent;
    @ViewChild('detailComponent') detailComponent: DetailTabComponent;
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
    nominalSummaryGridCode: string = 'nominalReportSummaryGrid';
    nominalSummaryGridConfig: ColumnConfigurationProperties[] = [];
    nominalSummaryQuickSumColumns: string[] = [];
    gridTitle: string;
    excelStyles: any;
    isUserPreferencesDisplay: boolean = false;
    isNominalReportDisplay: boolean = false;
    rowGroupPanelShow: string = 'onlyWhenGrouping';
    groupMultiAutoColumn: boolean;
    checkFunctionalCurrency: string;
    checkStatutoryCurrency: string;
    isBroughtForward :boolean =false;

    reportStyleCtrl = new AtlasFormControl('reportStyleTypes');
    reportStyleTypes: ReportStyleTypes[] = [];
    accountTypeCtrl = new AtlasFormControl('nominalAccountTypes');
    nominalAccountTypes: NominalAccountTypes[] = [];
    documentDateFromCtrl = new AtlasFormControl('documentFromCtrl');
    documentDateToCtrl = new AtlasFormControl('documentToCtrl');
    accountingDateFromCtrl = new AtlasFormControl('accountingDateFromCtrl');
    accountingDateToCtrl = new AtlasFormControl('accountingDateToCtrl');
    functionalCurrencyCtrl = new AtlasFormControl('nominalFunctionalCurrency');
    broughtForwardCtrl = new AtlasFormControl('broughtForwardCtrl');
    currencyCtrl = new AtlasFormControl('currencyCtrl');
    nominalAccountsCtrl = new AtlasFormControl('nominalAccountsCtrl');
    columnConfiguration: ColumnConfigurationProperties[] = [];
    masterdata: MasterData;
    nominalReportFormGroup: FormGroup;
    filteredCurrencyList: Currency[];
    company: string;
    filters: ListAndSearchFilter[] = [];
    accountPeriodRangeErrorMap: Map<string, string> = new Map();
    documentRangeErrorMap: Map<string, string> = new Map();
    accountingSetupModel: AccountingSetup;
    subscriptions: Subscription[] = [];
    isGenerateButtonClicked: boolean = false;
    hasGridSharing: boolean;
    companyConfiguration: Company;
    ReportStyleType = ReportStyleType;
    filteredNominalAccountList: NominalAccount[];
    isSummaryMode: boolean = false;
    tabIndex: number;
    isTabEnalble: boolean = false;

    /* quick sum */
    defaultClass: string = 'ag-theme-material pointer-cursor';
    cellSelectionClass: string = 'ag-theme-material pointer-cursor cell-selection';
    classApplied: string;
    quickSumModeActivated = false;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    allowedColumnsforQuickSum: string[] = [];
    currencyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');
    nominalAccountErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. NominalAccount not in the list.');
    gridPreferences: UserGridPreferencesParameters;

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        public dataLoader: NominalReportDataLoader,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private utilService: UtilService,
        protected masterdataService: MasterdataService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private preaccountingService: PreaccountingService,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService,
        private titleService: TitleService) {
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
        this.accountPeriodRangeErrorMap
            .set('isClientDateBeforeValid', 'Cannot be before Period From.');
        this.documentRangeErrorMap
            .set('isClientDateBeforeValid', 'Cannot be before Period From.');
    }

    getColumnConfig(): ColumnConfigurationProperties[] {
        this.allowedColumnsforQuickSum = this.nominalSummaryQuickSumColumns;
        return this.nominalSummaryGridConfig;
    }

    updateGroupDisplay() {

        this.rowGroupPanelShow = 'never';
        this.groupMultiAutoColumn = false;

        this.agGridOptions.groupMultiAutoColumn = this.groupMultiAutoColumn;
    }

    setColumnConfig(config: ColumnConfigurationProperties[]): void {

        this.rowGroupPanelShow = 'never';
        this.groupMultiAutoColumn = false;
        config = config.map((x) => {
            x.isGroup = false; return x;
        });
        this.nominalSummaryGridConfig = config;

        this.agGridOptions.groupMultiAutoColumn = this.groupMultiAutoColumn;
    }

    getGridCode(): string {

        return this.nominalSummaryGridCode;

    }

    ngOnInit() {
        this.titleService.setTitle(this.route.snapshot.data.title);
        for (const type in ReportStyleType) {
            if (typeof ReportStyleType[type] === 'number') {
                this.reportStyleTypes.push({ value: ReportStyleType[type] as any, reportStyleDescription: type });
            }
        }
        for (const type in NominalAccountType) {
            if (typeof NominalAccountType[type] === 'number') {
                this.nominalAccountTypes.push({ value: NominalAccountType[type] as any, accountTypeDescription: type });
            }
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.reportStyleCtrl.patchValue(ReportStyleType.Summary);
        this.accountTypeCtrl.patchValue(NominalAccountType.Both);
        this.company = this.companyManager.getCurrentCompanyId();
        this.getFormGroup();
        this.setValidators();
        this.bindConfiguration();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.filteredCurrencyList = this.masterdata.currencies;
        this.filteredNominalAccountList = this.masterdata.nominalAccounts.map(
            (nominal) => {
                nominal.accountNumber = nominal.accountNumber;
                nominal.mainAccountTitle = nominal.shortDescription;
                return nominal;
            });
        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
                if (this.accountingSetupModel.lastMonthClosed !== null) {
                    const numberOfOpenPeriods = this.accountingSetupModel.numberOfOpenPeriod !== null ?
                        this.accountingSetupModel.numberOfOpenPeriod : 1;
                    this.accountingDateToCtrl.setValue(moment(this.accountingSetupModel.lastMonthClosed).add(numberOfOpenPeriods, 'month'));
                    this.onMonthChanged();
                }
            }));
        this.documentDateFromCtrl.setValue(moment().year(1980).month(0).date(1));
        this.documentDateToCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.accountingDateFromCtrl.setValue(this.companyManager.getCurrentCompanyDate().month(0).date(1));
        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.currencies,
                ['currencyCode', 'description'],
            );
        });
        this.nominalAccountsCtrl.valueChanges.subscribe((input) => {
            this.filteredNominalAccountList = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.nominalAccounts,
                ['accountNumber', 'detailedDescription'],
            );
        });

        // quicksum
        this.classApplied = this.defaultClass;
        this.loadGridConfiguration();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    getFormGroup(): FormGroup {
        this.nominalReportFormGroup = this.formBuilder.group({
            reportStyleCtrl: this.reportStyleCtrl,
            accountTypeCtrl: this.accountTypeCtrl,
            documentDateFromCtrl: this.documentDateFromCtrl,
            documentDateToCtrl: this.documentDateToCtrl,
            accountingDateFromCtrl: this.accountingDateFromCtrl,
            accountingDateToCtrl: this.accountingDateToCtrl,
            currencyCtrl: this.currencyCtrl,
            nominalAccountsCtrl: this.nominalAccountsCtrl,
        });

        return super.getFormGroup();
    }

    onFilterSetChanged(filters: ListAndSearchFilter[]) {
        this.filters = filters;
        this.onGenerateReportButtonClicked();
    }

    onGenerateReportButtonClicked(isGenerateButtonClicked?: boolean) {
        this.isGenerateButtonClicked = isGenerateButtonClicked;

        if (this.nominalReportFormGroup.valid && this.isGenerateButtonClicked) {

            if (this.reportStyleCtrl.value === ReportStyleType.Transactions && !this.isSummaryMode) {
                this.isTabEnalble = true;
                this.onSelectedButtonChanged(0);
                this.overviewComponent.isOverviewMode = true;
                this.detailComponent.isDetailMode = true;
            } else {
                this.isTabEnalble = false;
                this.overviewComponent.isOverviewMode = false;
                this.detailComponent.isDetailMode = false;
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
                this.agGridRows = data.value.sort((a, b) => {
                    if (a.nominalAccount < b.nominalAccount) return -1;
                    else if (a.nominalAccount > b.nominalAccount) return 1;
                    else return 0;
                }).sort((a, b) => {
                    if (a.currency < b.currency) return -1;
                    else if (a.currency > b.currency) return 1;
                    else return 0;
                });
                this.isNominalReportDisplay = true;
            });
    }

    getNominalReportData() {
        const nominalReport = new TransactionReportCommand();
        nominalReport.functionalCurrency = this.functionalCurrencyCtrl.value !== ''
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

                this.gridPreferences = new UserGridPreferencesParameters(
                    {
                        company: this.company,
                        gridId: this.getGridCode(),
                        gridOptions: this.agGridOptions,
                        sharingEnabled: this.hasGridSharing,
                    });
            });
    }
    
    toToggleChanged(event: MatSlideToggleChange) {
        this.isBroughtForward =event.checked;
        this.detailComponent.isBroughtForward =event.checked;
        this.overviewComponent.isBroughtForward = event.checked;      
    }

    initColumns() {
        this.updateGroupDisplay();
        const configuration = this.getColumnConfig();
        const numericColumns: string[] = [];
        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(this.utilService.convertToCamelCase(column.fieldName));
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

                this.nominalSummaryQuickSumColumns.push(columnDef.field.toLocaleLowerCase());

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
            const numericColumn = numericColumns.find((column) => column === columnDef.field);
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
                } else {
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
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;

        this.gridService.sizeColumns(this.agGridOptions);
    }

    setValidators() {
        this.accountingDateFromCtrl.setValidators(Validators.required);
        this.accountingDateToCtrl.setValidators(Validators.required);
        this.documentDateFromCtrl.setValidators(Validators.required);
        this.documentDateToCtrl.setValidators(Validators.required);
        this.accountTypeCtrl.setValidators(Validators.required);
        this.reportStyleCtrl.setValidators(Validators.required);
        this.nominalReportFormGroup.setValidators(Validators.compose([beforeFromDate('accountingDateFromCtrl', 'accountingDateToCtrl'),
        beforeFromDate('documentDateFromCtrl', 'documentDateToCtrl')]));
        this.nominalReportFormGroup.updateValueAndValidity();
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.currencies,
                    nameof<Currency>('currencyCode'),
                ),
            ]),
        );
        this.nominalAccountsCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.nominalAccounts,
                    nameof<NominalAccount>('accountNumber'),
                ),
            ]),
        );
    }

    onMonthChanged() {
        this.accountingDateToCtrl.markAsTouched();
        this.accountingDateFromCtrl.updateValueAndValidity();
        this.accountingDateToCtrl.updateValueAndValidity();
    }

    onDateChanged() {
        this.documentDateToCtrl.markAsTouched();
        this.documentDateToCtrl.updateValueAndValidity();
        this.documentDateFromCtrl.updateValueAndValidity();
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
                    columnName = column.getColDef().colId;
                    columnHeader = column.getColDef().headerName;
                    if (allowedColumnsforQuickSum.includes(columnName)) {
                        for (let rowIndex = 0; rowIndex < cellInfos.length; rowIndex++) {
                            if (cellInfos[rowIndex].columnName === columnName) {
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
            columnName = column.getColDef().colId;
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
    onSelectedIndexChanged(value: number) {
        this.tabIndex = value;
        if (this.isGenerateButtonClicked && !this.isSummaryMode) {
            this.onSelectedButtonChanged(this.tabIndex);
        }
    }
    optionValueChanged(event) {
        if (event.value === ReportStyleType.Summary) {
            this.isSummaryMode = true;
        } else {
            this.isSummaryMode = false;
        }
    }

    onSelectedButtonChanged(tabIndex: number) {
        switch (tabIndex) {
            case 0: {
                this.overviewComponent.onGenerateReportButtonClicked(true);
                break;
            }
            case 1: {
                this.detailComponent.onGenerateReportButtonClicked(true);
                break;
            }
        }
    }

    onGridViewSelected(gridViewId: number) {
        this.gridPreferences.selectedGridViewId = gridViewId;
        // this is to trigger the input setter in the enlarged grid child
        this.gridPreferences = new UserGridPreferencesParameters(this.gridPreferences);
    }

    onGridEnlargementClose(gridViewsData: [UserGridViewDto[], UserGridViewDto]) {
        if (gridViewsData) {
            this.userPreferencesComponent.loadGridViews(gridViewsData[0], gridViewsData[1].gridViewId, false);
            this.userPreferencesComponent.loadGridView(gridViewsData[1].gridViewId, false);
        }
    }

    onUserPreferencesLoaded() {
        this.gridPreferences.gridViews = this.userPreferencesComponent.getLoadedGridViews();
        this.gridPreferences = new UserGridPreferencesParameters(this.gridPreferences);
    }

}
