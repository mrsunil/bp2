import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridAutocompleteComponent } from '../../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorDatePickerComponent } from '../../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorMonthDatePickerComponent } from '../../../../../../shared/components/cell-editor-month-date-picker/cell-editor-month-date-picker.component';
import { CellEditorNumericComponent } from '../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SectionSearchResult } from '../../../../../../shared/dtos/section-search-result';
import { AgContextualMenuAction } from '../../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../../shared/entities/charter.entity';
import { Commodity } from '../../../../../../shared/entities/commodity.entity';
import { Company } from '../../../../../../shared/entities/company.entity';
import { LdrepManualAdjustmentRecords } from '../../../../../../shared/entities/ldrep-manual-adjustment-records.entity';
import { LdrepManualAdjustment } from '../../../../../../shared/entities/ldrep-manual-adjustment.entity';
import { ListAndSearchFilter } from '../../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../../../../shared/entities/window-injection-token';
import { DateFormats } from '../../../../../../shared/enums/date-format.enum';
import { FreezeType } from '../../../../../../shared/enums/freeze-type.enum';
import { CustomNumberMask } from '../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../../../shared/services/execution/charter-data-loader';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../../shared/services/http-services/execution.service';
import { ReportingService } from '../../../../../../shared/services/http-services/reporting.service';
import { TradeDataLoader } from '../../../../../../shared/services/list-and-search/trade-data-loader';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../shared/services/ui.service';
import { LdrepDisplayView } from './ldrep-display-view';

@Component({
    selector: 'atlas-ldrep-manual-adjustment-report',
    templateUrl: './ldrep-manual-adjustment-report.component.html',
    styleUrls: ['./ldrep-manual-adjustment-report.component.scss'],
    providers: [TradeDataLoader, CharterDataLoader],
})
export class LdrepManualAdjustmentReportComponent extends BaseFormComponent implements OnInit {
    @Output() readonly fromSelected = new EventEmitter<string>();
    @Output() readonly toSelected = new EventEmitter<string>();
    @Output() readonly periodSelected = new EventEmitter<string>();
    fromDateCtrl = new AtlasFormControl('FromDate');
    toDateCtrl = new AtlasFormControl('ToDate');
    activateDay: boolean = true;
    activateMonth: boolean = false;
    dailyErrorMap: Map<string, string> = new Map();
    monthlyErrorMap: Map<string, string> = new Map();
    addNewLineCtrl = new AtlasFormControl('AddNewLine');
    editToggleButtonCtrl = new AtlasFormControl('EditToggle');
    dailyMonthlyToggleCtrl = new AtlasFormControl('DailyMonthlyToggle');
    atlasAgGridParam: AtlasAgGridParam;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    ldrepManualAdjustmentGridOptions: agGrid.GridOptions = {
        enableSorting: true,
        enableFilter: true,
    };
    isLoading: boolean = false;
    isEditChecked: boolean = false;
    toDateDefaultValue: Date = new Date;
    ldrepManualAdjustmentGridCols: agGrid.ColDef[];
    masterdata: MasterData;
    ldrepAdjustmentGridContextualMenuActions: AgContextualMenuAction[];
    ldrepManualAdjustmentGridRows: LdrepManualAdjustmentRecords[] = [];
    ldrepManualAdjustmentRecords: LdrepManualAdjustmentRecords[];
    model: LdrepManualAdjustment;
    company: string;
    functionalCurrencyCode: string;
    statutoryCurrencyCode: string;
    filteredContracts: SectionSearchResult[];
    filteredContractForCharterOrDept: SectionSearchResult[];
    filteredCharter: Charter[];
    filteredCommodityList: Commodity[];
    requiredString: string = 'Required*';
    formatType: string = 'en-US';

    dateFormats = {
        Date: DateFormats.Date,
        Month: DateFormats.Month,
    };

    companyConfiguration: Company;
    gridContext = {
        gridEditable: true,
    };
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
        atlasDatePicker: CellEditorDatePickerComponent,
        atlasMonthDatePicker: CellEditorMonthDatePickerComponent,
    };
    disableMonthly: boolean = true;
    disableDaily: boolean = true;
    disableFrom: boolean = true;
    disableTo: boolean = true;
    FreezeType: FreezeType;
    setPeriodType: FreezeType;
    daily: FreezeType = FreezeType.Daily;
    monthly: FreezeType = FreezeType.Monthly;
    fromDateSet: Date;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private uiService: UiService,
        protected dialog: MatDialog,
        private reportingService: ReportingService,
        private executionService: ExecutionService,
        protected snackbarService: SnackbarService,
        private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        public tradeDataLoader: TradeDataLoader,
        public charterDataLoader: CharterDataLoader,
        public gridService: AgGridService,
        @Inject(WINDOW) private window: Window,
    ) {
        super(formConfigurationProvider);
    }

    ldrepAdjustmentMenuActions: { [key: string]: string } = {
        deleteAdjustment: 'delete',
    };

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.company = this.route.snapshot.paramMap.get('company');
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.functionalCurrencyCode = this.companyConfiguration.functionalCurrencyCode;
        this.statutoryCurrencyCode = this.companyConfiguration.statutoryCurrencyCode;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.dailyMonthlyToggleCtrl.patchValue(this.daily);
        this.fromDateCtrl.setValue(moment(this.getYesterdayDate()));
        this.filteredCommodityList = this.masterdata.commodities;
        this.charterDataLoader.getData().subscribe((charter) => {
            this.filteredCharter = charter;
        });
        const filterList: ListAndSearchFilter[] = [];
        this.tradeDataLoader.getData(filterList).subscribe((trade) => {
            this.filteredContracts = trade.value;
            this.filteredContractForCharterOrDept = trade.value;
        });
        this.init();
        this.initLDREPAdjustmentGridColumns();
    }

    init() {
        this.ldrepAdjustmentGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.ldrepAdjustmentMenuActions.deleteAdjustment,
            },
        ];
    }

    onSearchButtonClicked() {
        if (this.fromDateCtrl.value) {
            if (this.isValid(this.toDateCtrl.value)) {
                if (this.fromDateCtrl.value <= this.toDateCtrl.value) {
                    this.search();
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'To date cannot be before From date.',
                    );
                    return;
                }
            } else {
                this.search();
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'From date is required.',
            );
            return;
        }
    }

    search() {
        this.isLoading = true;
        this.gridContext.gridEditable = this.isEditChecked;
        this.getAllLdrepManualAdjustments();
        this.autoSizeGrid();
    }

    getAllLdrepManualAdjustments() {
        const toDate = (this.setPeriodType === this.monthly) ? this.toDateCtrl.value.endOf('month') : this.toDateCtrl.value;

        this.subscriptions.push(this.reportingService.getAllLdrepManualAdjustments(this.fromDateCtrl.value, toDate)
            .subscribe((data) => {
                if (data && data.value.length > 0) {
                    this.clearLdrepGrid();
                    data.value.forEach((element) => {
                        const displayCostRow = new LdrepDisplayView(element, this.masterdata);

                        if (this.gridApi) {
                            this.gridApi.updateRowData({ add: [displayCostRow] });
                        }
                    });
                } else {
                    this.clearLdrepGrid();
                    this.snackbarService.throwErrorSnackBar('No records are available for this search criteria.');
                }
                this.isLoading = false;
            }));
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.autoSizeGrid();
    }

    autoSizeGrid() {
        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    initLDREPAdjustmentGridColumns() {
        this.ldrepManualAdjustmentGridOptions = {
            context: this.gridContext,
        };
        this.ldrepManualAdjustmentGridCols = [
            {
                headerName: 'From Date Format*',
                field: 'fromDateFormat',
                colId: 'fromDateFormat',
                editable: (params) => this.gridContext.gridEditable,
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: Object.keys(this.dateFormats),
                },
                onCellValueChanged: (params) => {
                    if (params.newValue === 'Date') {
                        params.node.setDataValue('dateFrom', this.getYesterdayDate());
                    } else if (params.newValue === 'Month') {
                        params.node.setDataValue('dateFrom', moment(new Date()).subtract(1, 'month').startOf('month'));
                    }
                    params.node.setDataValue('toDateFormat', params.newValue);
                },
            },
            {
                headerName: 'From*',
                field: 'dateFrom',
                colId: 'dateFrom',
                editable: (params) => this.gridContext.gridEditable,
                cellEditor: 'atlasMonthDatePicker',
                cellEditorParams: {
                    mode: (params) => {
                        return DateFormats[params.node.data.fromDateFormat];
                    },
                },
                cellRenderer: (params) => {
                    if (params.value) {
                        const dateformat = params.node.data.fromDateFormat === DateFormats[DateFormats.Month] ? 'MMM YYYY' : 'DD MMM YYYY';
                        return moment(params.value).format(dateformat);
                    }

                    return this.requiredCell(params);
                },
                onCellValueChanged: this.onFromDateSelected.bind(this),
            },
            {
                headerName: 'To Date Format',
                field: 'toDateFormat',
                colId: 'toDateFormat',
                editable: (params) => this.gridContext.gridEditable,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: Object.keys(this.dateFormats),
                },
                onCellValueChanged: (params) => {
                    params.node.setDataValue('dateTo', '');
                },
            },
            {
                headerName: 'To',
                field: 'dateTo',
                colId: 'dateTo',
                editable: (params) => {
                    return this.gridContext.gridEditable && params.node.data.toDateFormat;
                },
                cellEditor: 'atlasMonthDatePicker',
                cellEditorParams: {
                    mode: (params) => {
                        return DateFormats[params.node.data.toDateFormat];
                    },
                    endflag: true,
                },
                cellRenderer: (params) => {
                    if (params.value) {
                        const dateformat = params.node.data.toDateFormat === DateFormats[DateFormats.Month] ? 'MMM YYYY' : 'DD MMM YYYY';
                        return moment(params.value).format(dateformat);
                    }
                    return '';
                },
                onCellValueChanged: this.onToDateSelected.bind(this),
            },
            {
                headerName: 'Department*',
                field: 'departmentCode',
                colId: 'departmentCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: (params) => {
                    return {
                        options: this.masterdata.departments,
                        valueProperty: 'departmentCode',
                        codeProperty: 'departmentCode',
                        displayProperty: 'description',
                        isRequired: true,
                    };
                },
                onCellValueChanged: (params) => {
                    if (!params.data.charterId && params.data.departmentCode) {
                        this.filteredContractForCharterOrDept = this.filteredContracts;
                        this.filteredContractForCharterOrDept = this.filteredContractForCharterOrDept.filter(
                            (e) => e.departmentCode === params.data.departmentCode);
                    }
                },
            },
            {
                headerName: 'Type*',
                field: 'pNLType',
                colId: 'pNLType',
                editable: (params) => this.gridContext.gridEditable,
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.masterdata.pnlTypes.map((pnlType) => pnlType.enumEntityDescription),
                },
            },
            {
                headerName: 'Realized',
                field: 'realized',
                colId: 'realized',
                editable: false,
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: (params) => !this.gridContext.gridEditable,
                },
            },
            {
                headerName: this.functionalCurrencyCode + ' Adjustment',
                field: 'functionalCCYAdjustment',
                colId: 'functionalCCYAdjustment',
                editable: (params) => this.gridContext.gridEditable,
                valueFormatter: this.formatValue.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, true),
                    isRightAligned: false,
                },
            },
            {
                headerName: this.statutoryCurrencyCode + ' Adjustment',
                field: 'statutoryCCYAdjustment',
                colId: 'statutoryCCYAdjustment',
                editable: (params) => this.gridContext.gridEditable,
                valueFormatter: this.formatValue.bind(this),
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, true),
                    isRightAligned: false,
                },
            },
            {
                headerName: 'Narrative*',
                field: 'narrative',
                colId: 'narrative',
                editable: (params) => this.gridContext.gridEditable,
                cellRenderer: this.requiredCell,
                cellEditor: 'agLargeTextCellEditor',
                cellEditorParams: {
                    maxLength: 50,
                    rows: 3,
                    cols: 50,
                },
            },
            {
                headerName: 'Charter Reference',
                colId: 'charterId',
                field: 'charterId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'charterGrid',
                        isRequired: false,
                        displayProperty: 'charterCode',
                        valueProperty: 'charterId',
                        lightBoxTitle: 'Results for Charters',
                        options: this.filteredCharter,
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                onCellValueChanged: (params) => this.onValueSelected(
                    params, 'charterId', 'Charter', 'charterCode', this.filteredCharter, ''),
                tooltip: (params) => this.getTooltip(params, 'description', 'charterCode', this.filteredCharter),
            },
            {
                headerName: 'Contract Reference',
                colId: 'sectionId',
                field: 'sectionId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'tradeList',
                        isRequired: false,
                        displayProperty: 'contractLabel',
                        valueProperty: 'sectionId',
                        lightBoxTitle: 'Results for Contracts',
                        dataLoader: this.tradeDataLoader,
                        options: this.filteredContractForCharterOrDept,
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                tooltip: (params) => {
                    return params.value ? params.value : null;
                },
                onCellValueChanged: this.onContractReferenceSelected.bind(this),
            },
            {
                headerName: 'Cmy1',
                colId: 'principalCommodity',
                field: 'principalCommodity',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'commodityGrid',
                        isRequired: false,
                        displayProperty: 'principalCommodity',
                        valueProperty: 'principalCommodity',
                        lightBoxTitle: 'Results for Commodities',
                        options: this.filteredCommodityList,
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                onCellValueChanged: (params) => this.onValueSelected(
                    params, 'commodityId', 'Commodity', 'principalCommodity', this.filteredCommodityList, this.requiredString),
                tooltip: (params) => this.getTooltip(params, 'description', 'principalCommodity', this.filteredCommodityList),
            },
            {
                headerName: 'Cmy2',
                field: 'cmy2',
                colId: 'cmy2',
            },
            {
                headerName: 'Cmy3',
                field: 'cmy3',
                colId: 'cmy3',
            },
            {
                headerName: 'Cmy4',
                field: 'cmy4',
                colId: 'cmy4',
            },
            {
                headerName: 'Cmy5',
                field: 'cmy5',
                colId: 'cmy5',
            },
            {
                headerName: 'Crop Year',
                field: 'cropYear',
                colId: 'cropYear',
                editable: this.isCropYearEditable.bind(this),
                onCellValueChanged: (params) => this.onCropYearSetValidate(params),
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    isDisabled: (params) => !this.gridContext.gridEditable,
                    menuActions: this.ldrepAdjustmentGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(param.value);
    }

    isCropYearEditable(params) {
        if (this.gridContext.gridEditable) {
            return params.data.sectionId ? false : true;
        } else {
            return false;
        }
    }

    onCropYearSetValidate(params) {
        let error = null;
        if (params.data.cropYear) {
            const reg = new RegExp(/[0-9]{4}/g);
            const reg1 = new RegExp(/^[0-9]{4}(\/[0-9]{4})/);
            const cropString = String(params.data.cropYear).match(reg1);
            const years = String(params.data.cropYear).match(reg);
            const subString = String(params.data.cropYear).includes('/', 4);

            if (years) {
                if (years.length > 1 && years.length <= 2) {
                    if (Number(years[1]) < Number(years[0])) {
                        error = { isFirstYearGreater: true };
                    }
                } else if (years.length > 2) {
                    error = { NotRegularFormat: true };
                }
            } else {
                error = { NotRegularFormat: true };
            }

            if (!cropString && years && years.length === 1) {
                error = subString ? { NotRegularFormat: true } : null;
            }
        }
        if (error) {
            if (error.NotRegularFormat) {
                params.node.setDataValue('cropYear', null);
                this.snackbarService.throwErrorSnackBar(
                    'only YYYY or YYYY/YYYY format is allowed',
                );
            } else if (error.isFirstYearGreater) {
                this.snackbarService.throwErrorSnackBar(
                    'Second year entered after the “/” should always be “greater than” the first year entered before the “/”');
            }
        }
        return null;
    }

    onFromDateSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            if (params.data.dateFrom && params.data.dateTo && params.data.dateFrom > params.data.dateTo) {
                this.snackbarService.throwErrorSnackBar('From date cannot be after To date.');
                params.node.setDataValue('dateFrom', '');
            }
        }
    }

    onToDateSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue !== this.requiredString) {
            if (params.data.dateFrom && params.data.dateTo && params.data.dateFrom > params.data.dateTo) {
                this.snackbarService.throwErrorSnackBar('To date cannot be before From date.');
                params.node.setDataValue('dateTo', '');
            }
        }
    }

    onValueSelected(params, columnId: string, valueName: string, code: string, list: any[],
        requiredString: string, includeEmpty: boolean = false) {
        if ((includeEmpty && params.newValue === '') || (params.newValue && params.oldValue !== params.newValue)) {
            const selected = list.find(
                (obj) => obj[code] ? obj[code].toUpperCase() === params.newValue.toString().toUpperCase() : false,
            );
            if (!selected) {
                this.snackbarService.throwErrorSnackBar('Not allowed : ' + valueName + ' does not exist');
                params.node.setDataValue(columnId, requiredString);
            }
        }
        if (columnId === 'charterId') {
            if (params.data.charterId) {
                this.filteredContractForCharterOrDept = this.filteredContracts;
                const charterRefrence = this.filteredCharter.find(
                    (e) => e.charterId === params.data.charterId).charterCode;

                this.filteredContractForCharterOrDept = this.filteredContractForCharterOrDept.filter(
                    (e) => e.charterReference === charterRefrence);

                if (this.gridApi && this.filteredContractForCharterOrDept) {
                    this.gridApi.refreshCells({
                        rowNodes: [params.node],
                        force: true,
                    });
                }
            }
        }

        if (columnId === 'commodityId') {
            const selectedCommodity = this.filteredCommodityList.find(
                (commodity) => commodity.principalCommodity === params.data.principalCommodity);

            if (selectedCommodity) {
                params.node.setDataValue('cmy2', selectedCommodity.part2);
                params.node.setDataValue('cmy3', selectedCommodity.part3);
                params.node.setDataValue('cmy4', selectedCommodity.part4);
                params.node.setDataValue('cmy5', selectedCommodity.part5);
            }
        }
    }

    getTooltip(params, description: string, code: string, list: any[]) {
        if (params.value && typeof params.value === 'string') {
            const selected = list.find(
                (obj) => obj[code] ? obj[code].toUpperCase() === params.value.toUpperCase() : false);
            if (selected) {
                return selected[description];
            }
        }
    }

    getYesterdayDate() {
        const date = new Date();
        const yesterday = new Date(date.getTime());
        yesterday.setDate(date.getDate() - 1);
        return moment(yesterday).startOf('day').toDate();
    }

    createNewRowData() {
        const newAdjustmentRow = new LdrepDisplayView();
        newAdjustmentRow.isDirty = true;
        newAdjustmentRow.fromDateFormat = DateFormats[DateFormats.Date];
        newAdjustmentRow.toDateFormat = DateFormats[DateFormats.Date];
        newAdjustmentRow.dateFrom = this.getYesterdayDate();
        newAdjustmentRow.realized = false;
        newAdjustmentRow.functionalCCYAdjustment = 0;
        newAdjustmentRow.statutoryCCYAdjustment = 0;
        return newAdjustmentRow;
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    }

    validate(): boolean {
        let isValid = true;
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty) {
                if (!(rowData.data.fromDateFormat && rowData.data.dateFrom && rowData.data.departmentCode
                    && rowData.data.pNLType && rowData.data.narrative)) {
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    isValid(value) {
        if (value === null || value === '' || value === undefined || value === 0) {
            return false;
        } else {
            return true;
        }
    }

    handleAction(action: string, ldrep: LdrepDisplayView) {
        if (!this.isValid(ldrep.functionalCCYAdjustment) && !this.isValid(ldrep.statutoryCCYAdjustment)) {
            switch (action) {
                case this.ldrepAdjustmentMenuActions.deleteAdjustment:
                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'LDREP Manual Adjustment Deletion',
                            text: 'Are you sure you want to delete the manual adjustment?',
                            okButton: 'Delete anyway',
                            cancelButton: 'Cancel',
                        },
                    });
                    const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            this.model = new LdrepManualAdjustment();
                            ldrep.isDirty = true;
                            this.model.ldrepManualAdjustmentRecords = this.getGridData();
                            if (this.model.ldrepManualAdjustmentRecords.length > 0) {
                                if (this.model.ldrepManualAdjustmentRecords[0].manualAdjustmentId) {
                                    this.subscriptions.push(this.reportingService.deleteLdrepManualAdjustments(this.model).subscribe(() => {
                                        this.snackbarService.informationSnackBar('Manual adjustment deleted.');
                                        this.gridApi.updateRowData({ remove: [ldrep] });
                                        this.isEditChecked = false;
                                        this.gridContext.gridEditable = false;
                                        this.refreshGrid();
                                    }));
                                } else {
                                    this.gridApi.updateRowData({ remove: [ldrep] });
                                    this.snackbarService.informationSnackBar('Manual adjustment deleted.');
                                }
                            } else {
                                this.gridApi.updateRowData({ remove: [ldrep] });
                                this.snackbarService.informationSnackBar('Manual adjustment deleted.');
                            }
                        }
                    });
                    this.subscriptions.push(confirmationSubscription);
                    break;
                default: this.assertUnreachable(action);
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Adjustment is not zero.',
            );
            return;
        }
    }

    assertUnreachable(x): never {
        throw new Error('Unknown action');
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    onBulkDeleteButtonCliked() {

    }

    onProceedButtonClicked() {
        const lines = this.addNewLineCtrl.value;
        for (let count = 1; count <= lines; count++) {
            const newItem = this.createNewRowData();
            const res = this.gridApi.updateRowData({ add: [newItem], addIndex: 0 });
        }
        this.addNewLineCtrl.setValue('');
        this.gridColumnApi.autoSizeAllColumns();
    }

    onContractReferenceSelected(params) {
        if (params.data.sectionId) {
            const selectedContractReference = this.filteredContracts.find(
                (contract) => contract.sectionId === params.data.sectionId);
            if (selectedContractReference) {
                params.node.setDataValue('cropYear', selectedContractReference.cropYear);
                params.node.setDataValue('principalCommodity', selectedContractReference.commodity1);
                params.node.setDataValue('cmy2', selectedContractReference.commodity2);
                params.node.setDataValue('cmy3', selectedContractReference.commodity3);
                params.node.setDataValue('cmy4', selectedContractReference.commodity4);
                params.node.setDataValue('cmy5', selectedContractReference.commodity5);
            }
        }
    }

    getMaxDate() {
        const maxDate = moment('9999-12-31', 'YYYY-MM-DD');
        return maxDate;
    }

    onSaveButtonClick() {
        if (!this.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Manual adjustment record is invalid. Please resolve the errors.',
            );
            return;
        }

        this.model = new LdrepManualAdjustment();
        this.model.ldrepManualAdjustmentRecords = this.getGridData();

        // Check for duplicate adjustment data and show warning
        const rowData = [];
        this.gridApi.forEachNode((node) => rowData.push(node.data));
        const overlap_exists = [];

        if (rowData.length > 1) {
            for (let i = 0; i < rowData.length - 1; i++) {
                for (let j = i + 1; j < rowData.length; j++) {
                    const a = rowData[i];
                    const b = rowData[j];
                    const a_dateTo = a.dateTo ? a.dateTo : this.getMaxDate();
                    const b_dateTo = b.dateTo ? b.dateTo : this.getMaxDate();

                    const dates_overlap = (b.dateFrom >= a.dateFrom && b.dateFrom <= a_dateTo) ||
                        (b_dateTo >= a.dateFrom && b_dateTo <= a_dateTo);

                    if (dates_overlap
                        && a.fromDateFormat === b.fromDateFormat
                        && a.toDateFormat === b.toDateFormat
                        && a.departmentCode === b.departmentCode
                        && a.pNLType === b.pNLType
                        && a.realized === b.realized
                        && a.functionalCCYAdjustment === b.functionalCCYAdjustment
                        && a.statutoryCCYAdjustment === b.statutoryCCYAdjustment
                        && a.charterId === b.charterId
                        && a.sectionId === b.sectionId
                        && a.commodityId === b.commodityId
                        && (a.cropYear ? a.cropYear : null) === b.cropYear) {
                        overlap_exists.push([i, j]);
                    }
                }
            }

            if (overlap_exists.length > 0) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'LDREP Manual Adjustment',
                        text: 'An adjustment for this period already exists. Please review your adjustment.',
                        okButton: 'Save anyway',
                        cancelButton: 'Cancel',
                    },
                });
                const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.save();
                    }
                });
            } else {
                this.save();
            }
        } else {
            this.save();
        }
    }

    clearDirty() {
        this.gridApi.forEachNode((rowData) => {
            rowData.data.isDirty = false;
        });
    }

    save() {
        if (this.model && this.model.ldrepManualAdjustmentRecords.length > 0) {
            this.subscriptions.push(this.reportingService
                .createUpdateLdrepManualAdjustment(this.model)
                .subscribe(
                    (data) => {
                        this.snackbarService.informationSnackBar('LDREP adjustment saved successfully.');
                        this.isEditChecked = false;
                        this.gridContext.gridEditable = false;
                        this.refreshGrid();
                        this.autoSizeGrid();
                        this.clearDirty();
                    },
                    (err) => {
                        this.isLoading = false;
                        throw err;
                    }));
        } else {
            this.snackbarService.throwErrorSnackBar('No records are available to save.');
            return;
        }
    }

    getGridData(): LdrepManualAdjustmentRecords[] {
        const ldrep = new Array<LdrepManualAdjustmentRecords>();
        this.gridApi.forEachNode((rowData) => {
            const ldrepData: LdrepDisplayView = rowData.data;
            if (ldrepData.isDirty) {
                ldrep.push(ldrepData.getLdrepData(this.masterdata));
            }
        });
        return ldrep;
    }

    onChanges() {
        if (this.dailyMonthlyToggleCtrl.value === this.daily) {
            this.setPeriodType = this.daily;
        } else if (this.dailyMonthlyToggleCtrl.value === this.monthly) {
            this.setPeriodType = this.monthly;
        }
        this.fromDateCtrl.reset();
        this.toDateCtrl.reset();

        this.setDefaultValues();
        this.onToggleChangeSetDefaultFromDateValues();
    }

    setDefaultValues() {
        if (this.setPeriodType === this.daily) {
            this.activateMonth = false;
            this.activateDay = true;
        }
        if (this.setPeriodType === this.monthly) {
            this.activateDay = false;
            this.activateMonth = true;
        }
    }

    onToggleChangeSetDefaultFromDateValues() {
        if (this.setPeriodType === this.daily) {
            this.fromDateCtrl.setValue(moment(this.getYesterdayDate()));
        }
        if (this.setPeriodType === this.monthly) {
            this.fromDateCtrl.setValue(moment(new Date()).subtract(1, 'month').startOf('month'));
        }
    }

    onFromChanged(): void {
        this.fromDateCtrl.valueChanges.subscribe((fromValue) => {
            this.setDefaultValues();
            this.fromSelected.emit((fromValue));
            this.fromDateSet = fromValue;
        });
    }

    onToChanged(): void {
        this.toDateCtrl.valueChanges.subscribe((toValue) => {
            this.setDefaultValues();
            this.toSelected.emit((toValue));
        });
    }

    clearLdrepGrid() {
        if (this.gridApi) {
            this.gridApi.setRowData([]);
        }
    }

    onEditToggleButtonClicked(event) {
        this.isEditChecked = event.checked;
        this.gridContext.gridEditable = event.checked;
        this.refreshGrid();
        this.autoSizeGrid();
    }

    refreshGrid() {
        this.isLoading = true;
        this.gridApi.redrawRows();
        this.isLoading = false;
    }
}
