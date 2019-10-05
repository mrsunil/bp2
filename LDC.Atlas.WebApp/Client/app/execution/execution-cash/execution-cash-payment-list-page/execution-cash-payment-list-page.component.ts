import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { AgGridUserPreferencesComponent } from '../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ListAndSearchComponent } from '../../../shared/components/list-and-search/list-and-search.component';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../shared/entities/atlas-form-control';
import { CashSummary } from '../../../shared/entities/cash.entity';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { CashSelectionType } from '../../../shared/enums/cash-selection-type';
import { ListAndSearchFilterType } from '../../../shared/enums/list-and-search-filter-type.enum';
import { CashDisplayView } from '../../../shared/models/cash-display-view';
import { CharterDisplayView } from '../../../shared/models/charter-display-view';
import { FormatDatePipe } from '../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { CashListPaymentDataLoader } from '../../../shared/services/list-and-search/cashList-payment-data-loader';
import { UiService } from '../../../shared/services/ui.service';
import { ExecutionActionsService } from '../../services/execution-actions.service';

@Component({
    selector: 'atlas-execution-cash-payment-list-page',
    templateUrl: './execution-cash-payment-list-page.component.html',
    styleUrls: ['./execution-cash-payment-list-page.component.scss'],
    providers: [DatePipe, CashListPaymentDataLoader],
})
export class ExecutionCashPaymentListPageComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;

    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    cashGridCols: agGrid.ColDef[];
    searchedValueCtrl = new AtlasFormControl('searchedValue');
    dataLength = 0;
    isLoading: boolean;
    cashGridRows: CashDisplayView[] = [];
    cashTypeId: number;
    savedColumnStates: ColumnState[];
    atlasAgGridParam: AtlasAgGridParam;
    userActiveDirectoryName: string;
    checkExportedFormat: boolean = false;
    company: string;
    formatType: string = 'en-US';
    excelStyles: any;
    cashGridOptions: agGrid.GridOptions = {
        enableSorting: true,
        enableFilter: true,
        suppressColumnVirtualisation: true,
        isExternalFilterPresent: () => true,
        doesExternalFilterPass: this.externalFilterPass.bind(this),
    };
    charters: CharterDisplayView[];
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Departments,
    ];
    gridCode = 'cashList';
    additionalFilters: ListAndSearchFilter[] = [];

    cashGridColumns: agGrid.ColDef[] = [
        {
            headerName: 'CashId',
            headerTooltip: 'CashId',
            field: 'costDirectionId',
            colId: 'costDirectionId',
            hide: true,
        },
        {
            headerName: 'Document reference',
            headerTooltip: 'Document reference',
            field: 'documentReference',
            colId: 'documentReference',
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
        },
        {
            headerName: 'Document Type',
            headerTooltip: 'Document Type',
            field: 'documentType',
            colId: 'documentType',
        },
        {
            // TO DO
            // this need to be discused and property will be binded later
            headerName: 'Trax Status',
            headerTooltip: 'Trax Status',
            field: 'traxStatus',
            colId: 'traxStatus',
        },
        {
            headerName: 'Document date',
            headerTooltip: 'Document date',
            field: 'documentDate',
            colId: 'documentDate',
            valueFormatter: this.dateFormatter.bind(this),
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
            headerName: 'Value date',
            headerTooltip: 'Value date',
            field: 'valueDate',
            colId: 'valueDate',
            valueFormatter: this.dateFormatter.bind(this),
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.valueDate);

                if (val && val.indexOf('/') < 0) {
                    return val;
                }
                const split = val.split('/');
                return split[2] + '-' + split[1] + '-' + split[0];
            },
        },
        {
            headerName: 'Currency',
            headerTooltip: 'Currency',
            field: 'currencyCode',
            colId: 'currencyCode',
        },
        {
            headerName: 'Amount',
            headerTooltip: 'Amount',
            field: 'amount',
            type: 'numericColumn',
            colId: 'amount',
            valueFormatter: this.formatValue.bind(this),
        },
        {
            headerName: 'Charter reference',
            headerTooltip: 'Charter reference',
            field: 'charterCode',
            colId: 'charterCode',
        },
        {
            headerName: 'Client / Nominal account',
            headerTooltip: 'Client / Nominal account',
            field: 'counterpartyOrNominalAccountCode',
            colId: 'counterpartyOrNominalAccountCode',
        },
        {
            headerName: 'Payee / Payer',
            headerTooltip: 'Payee / Payer',
            field: 'ownerName',
            colId: 'ownerName',
        },

        {
            headerName: 'Department',
            headerTooltip: 'Department',
            field: 'departmentDescription',
            colId: 'departmentDescription',
        },
        {
            headerName: 'Posting Status',
            headerTooltip: 'Posting Status',
            field: 'status',
            colId: 'status',
        },
        {
            headerName: 'Error Message',
            headerTooltip: 'Error Message',
            field: 'errorMessage',
            colId: 'errorMessage',
        },
    ];

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private executionService: ExecutionService,
        private uiService: UiService,
        private route: ActivatedRoute,
        protected masterdataService: MasterdataService,
        private formatDate: FormatDatePipe,
        protected executionActionsService: ExecutionActionsService,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService,
        public dataLoader: CashListPaymentDataLoader,

    ) {
        super(formConfigurationProvider);
        this.company = route.snapshot.paramMap.get('company');
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
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterData = this.route.snapshot.data.masterdata;
    }

    externalFilterPass(node) {
        if (this.searchedValueCtrl.value) {
            const documentRef = node.data.documentReference.toUpperCase();
            return documentRef.toString().includes(this.searchedValueCtrl.value.toUpperCase());
        } else {
            return node.data.documentReference;
        }
    }

    showOrHideColum(event, col: agGrid.ColDef) {
        const cols = this.cashGridColumns.filter((colf) => colf.colId === col.colId);
        if (cols.length === 1) {
            cols[0].hide = !(col.hide || false);

            this.gridColumnApi.setColumnVisible(col.colId, !cols[0].hide);
        }
        event.stopPropagation();
        return false;
    }

    onRefreshButtonClicked() {
        this.gridColumnApi.resetColumnState();
        this.cashGridColumns.forEach((colf) => {
            colf.hide = !this.gridColumnApi.getColumn(colf.colId).isVisible();
        });
        this.cashGridOptions.columnApi.autoSizeAllColumns();
    }

    onGridReady(params) {
        this.cashGridOptions = params;
        this.cashGridOptions.columnDefs = this.cashGridColumns;
        this.gridApi = this.cashGridOptions.api;
        this.gridColumnApi = this.cashGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    getCashList() {
        this.initAdditionnalFilters();
    }

    setDepartmentDescription(masterData: MasterData, cash: CashSummary): CashSummary {
        const department = masterData.departments.filter((item) =>
            item.departmentId === cash.departmentId);

        if (department.length > 0) {
            cash.departmentDescription = department[0].departmentCode + ' | ' + department[0].description;
        }
        return cash;
    }

    dateFormatter(param) {
        if (param.value) { return this.formatDate.transform(param.value); }
    }

    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(param.value);
    }

    onCashClicked(event) {
        let cashView: CashDisplayView = event.data;
        if ((cashView.cashTypeId === CashSelectionType.PaymentDifferentCurrency
            || cashView.cashTypeId === CashSelectionType.ReceiptDifferentCurrency)
            && cashView.paymentCashId) {
            // In case of cash diff ccy, we can only navigate to the payment cash
            const cash = new CashSummary();
            cash.cashId = cashView.paymentCashId;
            cash.costDirectionId = cashView.costDirectionId;
            cashView = new CashDisplayView(cash);
        }

        this.executionActionsService.displayCashSubject.next(cashView);
    }

    onExportButtonClickedAsExcel() {
        let screenName: string;
        if (this.cashTypeId === 1) {
            screenName = 'Cash' + '' + 'Payment';
        } else {
            screenName = 'Cash' + '' + 'Receipt';
        }
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }

    onExportButtonClickedAsCSV() {
        const screenName: string = 'FX Rates';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }

    onColumnVisibilityChanged(column: any) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
        this.cashGridOptions.columnApi.autoSizeAllColumns();
    }

    onCashRowClicked(event) {

        this.executionActionsService.displayCashSubject.next(event.data);
    }
    initAdditionnalFilters() {
        this.additionalFilters = [];
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {

            const costDirectionId = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'CostDirectionId');

            const costDirectionIdfilter = new ListAndSearchFilter();
            costDirectionIdfilter.fieldId = costDirectionId.fieldId;
            costDirectionIdfilter.fieldName = costDirectionId.fieldName;

            costDirectionIdfilter.predicate = {
                filterType: ListAndSearchFilterType.Numeric,
                operator: 'eq',
                value1: this.cashTypeId.toString(),
            };
            costDirectionIdfilter.isActive = true;
            this.additionalFilters.push(costDirectionIdfilter);

            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.additionalFilters = this.additionalFilters;
            this.listAndSearchComponent.loadData(true);
        } else {
            return;
        }
    }

    onSearchButtonClicked() {
        this.additionalFilters = [];
        const documentReferenceField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'DocumentReference');

        const filter = new ListAndSearchFilter();
        filter.fieldId = documentReferenceField.fieldId;
        filter.fieldName = documentReferenceField.fieldName;
        filter.predicate = {
            filterType: ListAndSearchFilterType.Text,
            operator: 'eq',
            value1: this.searchedValueCtrl.value + '%',
        };
        filter.isActive = true;
        this.additionalFilters = [filter];
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }

}
