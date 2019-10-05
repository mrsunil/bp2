import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../execution/services/execution-cash-common-methods';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FilterSetDisplayComponent } from '../../../../../shared/components/filter-set-display/filter-set-display.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { UserGridViewDto } from '../../../../../shared/dtos/user-grid-view-dto.dto';
import { AccountingSetup } from '../../../../../shared/entities/accounting-setup.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { BalancesTypes } from '../../../../../shared/entities/balances-type-entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { ColumnConfigurationProperties } from '../../../../../shared/entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { MatchingTypes } from '../../../../../shared/entities/matchings-type-entity';
import { ReportStyleTypes } from '../../../../../shared/entities/report-style-type-entity';
import { UnmatchedTypes } from '../../../../../shared/entities/unmatched-type-entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { WINDOW } from '../../../../../shared/entities/window-injection-token';
import { BalancesType } from '../../../../../shared/enums/balances-type.enum';
import { ListAndSearchFilterType } from '../../../../../shared/enums/list-and-search-filter-type.enum';
import { MatchingsType } from '../../../../../shared/enums/matchings-type.enum';
import { ReportStyleType } from '../../../../../shared/enums/report-style-type.enum';
import { UnmatchedType } from '../../../../../shared/enums/unmatched-type.enum';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { TransactionReportCommand } from '../../../../../shared/services/execution/dtos/transaction-report-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { ClientReportDataLoader } from '../../../../../shared/services/list-and-search/clientReport-data-loader';
import { UiService } from '../../../../../shared/services/ui.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { beforeFromDate } from './client-report-period-validator.validator';
import { TitleService } from '../../../../../shared/services/title.service';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { CostType } from '../../../../../shared/entities/cost-type.entity';
import { OverviewComponent } from './tabs/overview/overview.component';
import { DetailComponent } from './tabs/detail/detail.component';

@Component({
    selector: 'atlas-client-report',
    providers: [ClientReportDataLoader, DatePipe],
    templateUrl: './client-report.component.html',
    styleUrls: ['./client-report.component.scss'],
})
export class ClientReportComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplay') filterSetDisplayComponent: FilterSetDisplayComponent;
    @ViewChild('overviewComponent') overviewComponent: OverviewComponent;
    @ViewChild('detailComponent') detailComponent: DetailComponent;
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

    clientDateFromCtrl = new AtlasFormControl('clientDateFrom');
    clientDateToCtrl = new AtlasFormControl('clientDateTo');
    clientReportFormGroup: FormGroup;
    balancesCtrl = new AtlasFormControl('balances');
    reportStyleCtrl = new AtlasFormControl('reportsStyle');
    matchingCtrl = new AtlasFormControl('matchings');
    unmatchedCtrl = new AtlasFormControl('unmatcheds');
    functionalCurrencyCtrl = new AtlasFormControl('clientFunctionalCurrency');
    accrualsIncludedCtrl = new AtlasFormControl('clientAccrualsIncluded');
    clientAccountCtrl = new AtlasFormControl('clientAccount');
    currencyCtrl = new AtlasFormControl('currency');
    clientDepartmentCtrl = new AtlasFormControl('clientDepartment');
    costTypeCtrl = new AtlasFormControl('costType');
    company: string;
    filters: ListAndSearchFilter[] = [];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    balancesTypes: BalancesTypes[] = [];
    reportStyleTypes: ReportStyleTypes[] = [];
    unmatchedTypes: UnmatchedTypes[] = [];
    matchingTypes: MatchingTypes[] = [];
    periodRangeErrorMap: Map<string, string> = new Map();
    accountingSetupModel: AccountingSetup;
    subscriptions: Subscription[] = [];
    hasGridSharing: boolean;
    companyConfiguration: Company;
    ReportStyleType = ReportStyleType;

    filteredCounterPartyList: Counterparty[];
    filteredCurrencyList: Currency[];
    filteredCostTypeList: CostType[];
    clientAccountControl: Counterparty;

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Client not in the list.');
    currencyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');
    costTypeErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');
    filteredDepartmentList: Department[];
    departmentErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Department not in the list.');
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
    counterPartyId: number;
    isFormValid: boolean = false;
    tabIndex: number;
    isTabEnalble: boolean = false;
    isGenerateButtonClicked: boolean = false;
    isSummaryMode: boolean = false;
    userActiveDirectoryName: string;
    saveGridRows: any[] = [];

    gridPreferences: UserGridPreferencesParameters;

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        public dataLoader: ClientReportDataLoader,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private utilService: UtilService,
        private formatDate: FormatDatePipe,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private preaccountingService: PreaccountingService,
        @Inject(WINDOW) private window: Window,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        public gridService: AgGridService,
        private titleService: TitleService, ) {
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
        this.periodRangeErrorMap
            .set('isClientDateBeforeValid', 'Cannot be before Period From.');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterData.counterparties;
        this.filteredCurrencyList = this.masterData.currencies;
        this.filteredDepartmentList = this.masterData.departments;
        this.filteredCostTypeList = this.masterData.costTypes;
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterPartyId'));

        if (this.counterPartyId) {
            this.clientAccountControl = this.filteredCounterPartyList.find((clientAccount) => clientAccount.counterpartyID === this.counterPartyId);
            this.clientAccountCtrl.patchValue(this.clientAccountControl);
        }

        for (const type in BalancesType) {
            if (typeof BalancesType[type] === 'number') {
                this.balancesTypes.push({ value: BalancesType[type] as any, balancesDescription: type });
            }
        }
        for (const type in ReportStyleType) {
            if (typeof ReportStyleType[type] === 'number') {
                this.reportStyleTypes.push({ value: ReportStyleType[type] as any, reportStyleDescription: type });
            }
        }
        for (const type in UnmatchedType) {
            if (typeof UnmatchedType[type] === 'number') {
                this.unmatchedTypes.push({ value: UnmatchedType[type] as any, unmatchedDescription: type });
            }
        }
        for (const type in MatchingsType) {
            if (typeof MatchingsType[type] === 'number') {
                this.matchingTypes.push({ value: MatchingsType[type] as any, matchingTypeDescription: type });
            }
        }
        this.balancesCtrl.patchValue(BalancesType.Both);
        this.reportStyleCtrl.patchValue(ReportStyleType.Transactions);
        this.unmatchedCtrl.patchValue(UnmatchedType.Now);
        this.matchingCtrl.patchValue(MatchingsType.Unmatched);

        this.company = this.companyManager.getCurrentCompanyId();
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;

        this.getFormGroup();
        this.setValidators();
        this.bindConfiguration();

        this.atlasAgGridParam = this.gridService.getAgGridParam();

        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
                if (this.accountingSetupModel.lastMonthClosed !== null) {
                    const numberOfOpenPeriods = this.accountingSetupModel.numberOfOpenPeriod !== null ?
                        this.accountingSetupModel.numberOfOpenPeriod : 1;
                    this.clientDateToCtrl.setValue(moment(this.accountingSetupModel.lastMonthClosed).add(numberOfOpenPeriods, 'month'));
                }
            }));
        this.clientDateFromCtrl.setValue(moment().year(1980).month(0).date(1));

        this.clientAccountCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.counterparties,
                ['counterpartyCode', 'description'],
            );
        });

        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.currencies,
                ['currencyCode', 'description'],
            );
        });

        this.clientDepartmentCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartmentList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.departments,
                ['departmentCode', 'description'],
            );
        });

        this.costTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredCostTypeList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.costTypes,
                ['costTypeCode', 'name'],
            );
        });

        this.loadGridConfiguration();

        // quicksum
        this.classApplied = this.defaultClass;

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }
    getFormGroup() {
        this.clientReportFormGroup = this.formBuilder.group({
            clientDateFromCtrl: this.clientDateFromCtrl,
            clientDateToCtrl: this.clientDateToCtrl,
            balancesCtrl: this.balancesCtrl,
            reportStyleCtrl: this.reportStyleCtrl,
            matchingCtrl: this.matchingCtrl,
            unmatchedCtrl: this.unmatchedCtrl,
            functionalCurrencyCtrl: this.functionalCurrencyCtrl,
            accrualsIncludedCtrl: this.accrualsIncludedCtrl,
            clientAccountCtrl: this.clientAccountCtrl,
            currencyCtrl: this.currencyCtrl,
            clientDepartmentCtrl: this.clientDepartmentCtrl,
            costTypeCtrl: this.costTypeCtrl,
        });
        return super.getFormGroup();
    }
    setValidators() {
        this.clientDateFromCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.clientDateToCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.balancesCtrl.setValidators(Validators.compose([Validators.required]));
        this.reportStyleCtrl.setValidators(Validators.compose([Validators.required]));
        this.matchingCtrl.setValidators(Validators.compose([Validators.required]));
        this.clientReportFormGroup.setValidators(beforeFromDate('clientDateFromCtrl', 'clientDateToCtrl'));
        this.clientReportFormGroup.updateValueAndValidity();

        this.clientAccountCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.counterparties,
                    nameof<Counterparty>('counterpartyCode'),
                    true,
                ),
            ]),
        );

        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                    true,
                ),
            ]),
        );

        this.clientDepartmentCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.departments,
                    nameof<Department>('departmentCode'),
                    true,
                ),
            ]),
        );

        this.costTypeCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.costTypes,
                    nameof<CostType>('costTypeCode'),
                    true,
                ),
            ]),
        );
    }
    onMatchingChange(matchingValue: number) {
        if (matchingValue !== 1) {
            this.unmatchedCtrl.disable();
        } else {
            this.unmatchedCtrl.enable();
        }
    }

    onFilterSetChanged(filters: ListAndSearchFilter[]) {
        this.filters = filters;
        if (!this.counterPartyId) {
            this.clientAccountCtrl.reset();
        }
        this.currencyCtrl.reset();
        this.costTypeCtrl.reset();
        this.clientDepartmentCtrl.reset();
        // -- Issue A001
        // this function is called on load. but we don't want to load the report on screen load.
        // therefor we need one way of blocking the first call on screen load but allow the rest of the time.
        // this following solution "blocks the first call"
        if (this.filtersLoadedForReport) {
            this.onGenerateReportButtonClicked();
        }
        this.filtersLoadedForReport = true;
    }

    onGenerateReportButtonClicked() {
        this.isGenerateButtonClicked = true;
        if (this.clientReportFormGroup.valid) {

            if (this.reportStyleCtrl.value === ReportStyleType.Transactions && !this.isSummaryMode) {
                this.isTabEnalble = true;
                this.onSelectedButtonChanged(0);
                this.overviewComponent.isOverviewMode = true;
                this.detailComponent.isDetailMode = true;

            }
            else {
                this.overviewComponent.isOverviewMode = false;
                this.detailComponent.isDetailMode = false;
                this.isTabEnalble = false;

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
                        clientAccountFilter.fieldFriendlyName = clientAccountField.fieldName;
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
                        currencyFilter.fieldFriendlyName = currencyField.fieldName;
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
                        departmentFilter.fieldFriendlyName = departmentField.fieldName;
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
                        costTypeFilter.fieldFriendlyName = costTypeField.fieldName;
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
                this.gridCode = this.clientSummaryGridCode;
                this.allowedColumnsforQuickSum = this.clientSummaryQuickSumColumns;
                if (this.clientSummaryGridConfig.length > 0) {
                    this.columnConfiguration = this.clientSummaryGridConfig;
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

    }

    onSelectedButtonChanged(tabIndex: number) {
        switch (tabIndex) {
            case 0: {
                this.overviewComponent.onGenerateReportButtonClicked();
                break;
            }
            case 1: {
                this.detailComponent.onGenerateReportButtonClicked();
                break;
            }
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
                this.saveGridRows = data.value;
                if (this.reportStyleCtrl.value === ReportStyleType.Summary) {
                    this.rowGroupPanelShow = 'never';
                    this.groupMultiAutoColumn = false;
                    this.agGridCols = this.agGridCols.map((col) => {
                        col.rowGroup = false;
                        col.enableRowGroup = false;
                        return col;
                    });
                }
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
        clientReport.functionalCurrency = this.functionalCurrencyCtrl.value !== '' ?
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
                this.clientSummaryGridConfig = configuration.columns;
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser; // should handle this seperatly for both grids

                this.gridPreferences = new UserGridPreferencesParameters(
                    {
                        company: this.company,
                        gridId: this.gridCode,
                        gridOptions: this.agGridOptions,
                        sharingEnabled: this.hasGridSharing,
                        hasCustomExport: true,

                    });
            });
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
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
                if (this.reportStyleCtrl.value === ReportStyleType.Transactions) {
                    this.clientTransactionQuickSumColumns.push(this.utilService.convertToCamelCase(config.fieldName));
                } else {
                    this.clientSummaryQuickSumColumns.push(this.utilService.convertToCamelCase(config.fieldName));
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
                } else {
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

    onMonthChanged() {
        this.clientDateToCtrl.markAsTouched();
        this.clientDateFromCtrl.updateValueAndValidity();
        this.clientDateToCtrl.updateValueAndValidity();
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

    onExportButtonClickToExcel() {
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + this.gridCode + '_' + this.userActiveDirectoryName + '.xlsx',
            columnGroups: false,
        };
        this.agGridRows = this.saveGridRows;
        this.rowGroupPanelShow = 'never';
        this.groupMultiAutoColumn = false;
        const columngroup: agGrid.ColDef[] = this.agGridCols.filter((column) =>
            column.rowGroup === true);
        this.agGridCols.forEach((column) =>
            columngroup.forEach((columnrow) => {
                if (column.colId === columnrow.colId) {
                    this.agGridOptions.columnApi.removeRowGroupColumn(columnrow.field);
                }
            }));

        if (this.agGridApi) {
            this.agGridApi.refreshCells({
                force: true,
            });
        }
        this.agGridOptions.api.exportDataAsExcel(params);
        this.rowGroupPanelShow = 'always';
        this.groupMultiAutoColumn = true;
        this.agGridCols.forEach((column) =>
            columngroup.forEach((columnrow) => {
                if (column.colId === columnrow.colId) {
                    this.agGridOptions.columnApi.addRowGroupColumn(columnrow.field);
                }
            }));
        this.agGridColumnApi.resetColumnGroupState();
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

    onSelectedIndexChanged(value: number) {
        this.tabIndex = value;
        if (this.isGenerateButtonClicked && !this.isSummaryMode) {
            this.onSelectedButtonChanged(this.tabIndex);
        }
    }
    optionValueChanged(event) {
        if (event.value === ReportStyleType.Summary) {
            this.isSummaryMode = true;
            this.clientAccountCtrl.reset();
            this.costTypeCtrl.reset();
            this.currencyCtrl.reset();
            this.clientDepartmentCtrl.reset();
        }
        else {
            this.isSummaryMode = false;
        }
    }
}
