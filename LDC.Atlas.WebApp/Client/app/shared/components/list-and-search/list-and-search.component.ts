import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { of } from 'rxjs';
import { finalize, first } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../app/core/services/company-manager.service';
import { SectionReference } from '../../../../app/trading/entities/section-reference';
import { TradeActionsService } from '../../../../app/trading/services/trade-actions.service';
import { AgContextualMenuAction } from '../../../shared/entities/ag-contextual-menu-action.entity';
import { AccountingEntriesSearchResult } from '../../dtos/accountingEntries-search-result';
import { UserGridViewDto } from '../../dtos/user-grid-view-dto.dto';
import { AssignedSection } from '../../entities/assigned-section.entity';
import { AtlasAgGridParam } from '../../entities/atlas-ag-grid-param.entity';
import { AtlasNumber } from '../../entities/atlas-number.entity';
import { Company } from '../../entities/company.entity';
import { ColumnConfigurationProperties } from '../../entities/grid-column-configuration.entity';
import { DataLoader } from '../../entities/list-and-search/list-and-search-data-loader.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { UserGridPreferencesParameters } from '../../entities/user-grid-preferences-parameters.entity';
import { WINDOW } from '../../entities/window-injection-token';
import { InvoiceTypes } from '../../enums/invoice-type.enum';
import { ListAndSearchFilterType } from '../../enums/list-and-search-filter-type.enum';
import { AgGridService } from '../../services/ag-grid.service';
import { ListAndSearchExportBase } from '../../services/list-and-search/export/list-and-search-export-base';
import { UiService } from '../../services/ui.service';
import { AgGridHyperlinkForAccountentriesComponent } from '../ag-grid-hyperlink-for-accountentries/ag-grid-hyperlink-for-accountentries.component';
import { AgGridHyperlinkForTradechildsectionsComponent } from '../ag-grid-hyperlink-for-tradechildsections/ag-grid-hyperlink-for-tradechildsections.component';
import { AgGridUserPreferencesComponent } from '../ag-grid-user-preferences/ag-grid-user-preferences.component';
import { FilterSetDisplayComponent } from '../filter-set-display/filter-set-display.component';
import { GridConfigurationProviderService } from './../../services/grid-configuration-provider.service';
import { UtilService } from './../../services/util.service';
import { ListAndSearchContextualMenuComponent } from './list-and-search-contextual-menu.component';

@Component({
    selector: 'atlas-list-and-search',
    templateUrl: './list-and-search.component.html',
    styleUrls: ['./list-and-search.component.scss'],
})
export class ListAndSearchComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplayComponent') filterSetDisplayComponent: FilterSetDisplayComponent;
    gridContext: ListAndSearchComponent;
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridRows: any[] = [];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    isLoading = false;
    loadDataNeverCalled = true;
    columnConfiguration: ColumnConfigurationProperties[] = [];
    quickSumModeActivated = false;
    additionalBooleanParam: boolean;
    allowedColumnsforQuickSum: string[];
    checkFunctionalCurrency: string;
    checkStatutoryCurrency: string;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    filters: ListAndSearchFilter[];
    excelStyles: any;
    hyperLinkClicked = false;
    rowGroupPanelShow: string = 'never';
    groupMultiAutoColumn: boolean = false;
    totalQuantityInSplits: number = 0;
    totalInvoiceValuesInSplits: number = 0;

    @Input() pageSize: number = 100;
    @Input() isFilterSetDisplay: boolean = true;
    @Input() dataLoader: DataLoader;
    @Input() gridCode: string;
    @Input() gridTitle: string;
    @Input() company: string;
    @Input() dataVersionId: number = null;
    @Input() gridContextualMenuActions: AgContextualMenuAction[];
    @Input() additionalFilters: ListAndSearchFilter[];
    @Input() waitBeforeLoadingData = false;
    @Input() loadOnInit = true;
    @Input() hasDeleteViewPrivilege = true;
    @Input() searchCode: string;
    @Input() hasQuickSum: boolean = true;
    @Input() exportAdapter: ListAndSearchExportBase;
    @Input() limitErrorMessage: string = ''; // Not applied yet
    @Input() changesOnColumn: ((column: agGrid.ColDef) => agGrid.ColDef);
    @Input() dateGetterOverride: ((columnDef: agGrid.ColDef, gridType: string) => any);
    @Input() hasGrouping = false;
    @Input() toogleText: string;
    hasGridSharing = false;

    @Output() readonly menuActionClicked = new EventEmitter();
    @Output() readonly rowClicked = new EventEmitter();
    @Output() readonly quickNavigate = new EventEmitter();
    @Output() readonly configurationLoaded = new EventEmitter();
    @Output() readonly linkClicked = new EventEmitter();
    @Output() readonly rowSelected = new EventEmitter();
    @Output() readonly loadDataStarted = new EventEmitter();
    @Output() readonly dataLoaded = new EventEmitter();

    accountingEntriesGridCode: string = 'accountingEntriesGrid';
    tradeChildSectionListGridCode: string = 'tradeChildSectionListGrid';
    counterPartiesListGridCode: string = 'referentialCounterPartiesGrid';
    counterPartiesBulkEditGridCode: string = 'bulkEditGrid';
    invoiceGridCode: string = 'invoiceList';
    tradeListGridCode: string = 'tradeList';
    tradeReportListGridCode: string = 'tradeReportList';
    charterSectionToAssignGridCode: string = 'charterSectionToAssign';
    tradeForTradeAllocationGridCode: string = 'tradeForTradeAllocationList';
    companyConfiguration: Company;
    defaultClass: string = 'ag-theme-material pointer-cursor';
    cellSelectionClass: string = 'ag-theme-material pointer-cursor cell-selection';
    classApplied: string;
    statCurrencyTitle: string;
    funcCurrencyTitle: string;
    amountSum = 0;
    statutoryCcySum = 0;
    functionalCcySum = 0;
    totalSumShow: boolean = false;
    gridPreferences: UserGridPreferencesParameters;
    isLimitReached: boolean = false;
    maxNumberOfRecords: number;
    
    constructor(private uiService: UiService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private utilService: UtilService,
        protected companyManager: CompanyManagerService,
        private agGridService: AgGridService,
        protected tradeActionsService: TradeActionsService,
        protected ngZone: NgZone,
        @Inject(WINDOW) private window: Window,
    ) {
        this.isLoading = true;

        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
            {
                id: 'monthFormat',
                dataType: 'text',
                numberFormat: {
                    format: 'MMM yyyy',
                },
            },
            {
                id: 'timeFormat',
                dataType: 'text',
                numberFormat: {
                    format: 'HH:MM:SS',
                },
            },
        ];
    }

    ngOnInit() {
        this.atlasAgGridParam = this.agGridService.getAgGridParam();

        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.checkFunctionalCurrency = this.companyConfiguration.functionalCurrencyCode;
        this.checkStatutoryCurrency = this.companyConfiguration.statutoryCurrencyCode;
        this.classApplied = this.defaultClass;
        this.gridContext = this;

        this.loadGridConfiguration();
        if (this.gridCode === this.counterPartiesBulkEditGridCode) {
            // USE this.hasGrouping TO DO THIS
            this.rowGroupPanelShow = 'always';
            this.groupMultiAutoColumn = true;
        }
    }

    loadData(emitResult = false) {
        if (this.waitBeforeLoadingData || !this.filters || (!this.loadOnInit && this.loadDataNeverCalled)) {
            this.loadDataNeverCalled = false;
            return;
        }
        this.loadOnInit = true;
        this.loadDataStarted.emit();

        let filters = this.filters ? this.filters.map((x) => ({ ...x })) : [];
        this.isLoading = true;
        if (this.additionalFilters) {
            filters = filters.concat(this.additionalFilters);
        }

        // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID => please use additionalFilters intead
        if (this.gridCode === this.tradeReportListGridCode && this.searchCode) {
            let counterpartyCode: string;
            counterpartyCode = filters[0].predicate.value1;

            if (counterpartyCode && counterpartyCode === this.searchCode) {
                filters[0].predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.searchCode + '%',
                };
            }
        }

        this.isLimitReached = false;
        this.limitErrorMessage = '';
        let getDataObservable = this.dataLoader.getData(filters, this.dataVersionId);
        if (this.additionalBooleanParam) {
            getDataObservable = this.dataLoader.getData(filters, this.dataVersionId, null, null, this.additionalBooleanParam);
        }
        getDataObservable
            .pipe(
                first(),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((result) => {
                const data = result.value ? result.value : result;
                if (emitResult && data.length === 1) {
                    this.quickNavigate.emit(data[0]);
                }
                if (emitResult && data.length > 1){
                    this.dataLoaded.emit(data);
                }
                if (this.maxNumberOfRecords && this.maxNumberOfRecords !== 0) {
                    if (result.count && result.count > this.maxNumberOfRecords) {
                        this.isLimitReached = true;
                        // DON'T ADD MESSAGES SPECIFIC TO ONE PAGE
                        this.limitErrorMessage = 'Showing only the ' + this.maxNumberOfRecords
                            + ' latest created contracts. Refine your filtering to get more accurate result.';
                    }
                }
                this.agGridRows = data;

                // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
                if (this.agGridRows && this.gridCode === this.tradeChildSectionListGridCode) {
                    this.agGridRows.forEach((row) => {
                        this.totalQuantityInSplits += Number(row.quantity);
                        this.totalInvoiceValuesInSplits += (row.quantityInvoiced) ? Number(row.quantityInvoiced) : 0;
                    });
                }

                // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
                if (this.gridCode === this.accountingEntriesGridCode) {
                    this.sumOfAccountingEntriesGridLine(false);
                }

                setTimeout(
                    () => {
                        if (this.agGridColumnApi && this.userPreferencesComponent) {
                            if (this.userPreferencesComponent.gridViewCtrl
                                && !this.userPreferencesComponent.gridViewCtrl.value.isFavorite) {
                                this.agGridService.sizeColumns(this.agGridOptions);
                            }
                        }
                    },
                    1000);
            });
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.pageSize = (configuration.numberOfItemsPerPage) ? configuration.numberOfItemsPerPage : 10;
                this.maxNumberOfRecords = configuration.maxNumberOfRecords;
                this.configurationLoaded.emit();
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;

                if (this.hasGrouping) {
                    this.rowGroupPanelShow = 'always';
                    this.groupMultiAutoColumn = true;
                }

                // issue with this implementation is that it doesn't take into consideration the updates of the inputs.
                this.gridPreferences = {
                    canDeleteView: this.hasDeleteViewPrivilege,
                    company: this.company,
                    gridId: this.gridCode,
                    gridOptions: this.agGridOptions,
                    sharingEnabled: this.hasGridSharing,
                };
            });
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        const numericColumns: string[] = [];

        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(this.utilService.convertToCamelCase(column.fieldName));
            }
        });
        this.allowedColumnsforQuickSum = numericColumns;
        
        this.agGridCols = configuration.filter((config) => config.isResult) 
            .map((config) => {
            let columnDef: agGrid.ColDef = {
                colId: this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: this.utilService.convertToCamelCase(config.fieldName),
                hide: !(config.isVisible && config.isResult),
                rowGroup: config.isGroup,
                enableRowGroup: config.isGroup,
                pinned: '',
            };

            if (this.changesOnColumn) {
                columnDef = this.changesOnColumn(columnDef);
            }
            // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
            if (this.gridCode === this.counterPartiesListGridCode) {
                columnDef.rowGroup = null;
            }
            if (this.gridCode === this.tradeChildSectionListGridCode && config.fieldName.toLowerCase() === 'contractlabel') {
                columnDef.pinned = 'left';
            }
            
            const formatter = this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }
            let dateGetter;
            // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
            if (this.gridCode === this.tradeListGridCode && columnDef.headerName === 'Created Date Time') {
                dateGetter = this.uiService.getterForCreatedDateType(config.gridType);
            } else {
                dateGetter = this.uiService.getterForDateType(config.gridType);
            }
            if (this.dateGetterOverride) {
                dateGetter = this.dateGetterOverride(columnDef, config.gridType);
            }
            if (dateGetter) {
                switch (config.gridType) {
                    case 'month':
                        columnDef.cellClass = 'monthFormat';
                        break;
                    case 'time':
                        columnDef.cellClass = 'timeFormat';
                        break;
                    default:
                        columnDef.cellClass = 'dateFormat';
                        break;
                }
                columnDef.valueGetter = dateGetter;
            }

            // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
            if (this.gridCode === this.tradeChildSectionListGridCode) {
                if (columnDef.headerName === 'Reference' || columnDef.headerName === 'Allocation') {
                    columnDef.cellRendererFramework = AgGridHyperlinkForTradechildsectionsComponent;
                    columnDef.cellRendererParams = {
                        gridId: this.tradeChildSectionListGridCode,
                        columnId: columnDef.colId,
                        context: {
                            componentParent: this,
                        },
                    };
                }
            }

            // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
            if (this.gridCode === this.accountingEntriesGridCode) {
                if (columnDef.headerName === 'Functional Ccy Eq.') {
                    columnDef.headerName = this.checkFunctionalCurrency + ' eq';
                    this.funcCurrencyTitle = this.checkFunctionalCurrency + ' eq';
                }
                if (columnDef.headerName === 'Statutory Ccy Eq.') {
                    columnDef.headerName = this.checkStatutoryCurrency + ' eq';
                    this.statCurrencyTitle = this.checkStatutoryCurrency + ' eq';
                }

                if (columnDef.headerName === 'Contract No') {
                    columnDef.cellRendererFramework = AgGridHyperlinkForAccountentriesComponent;
                    columnDef.cellRendererParams = {
                        gridId: this.accountingEntriesGridCode,
                        columnId: columnDef.colId,
                        context: {
                            componentParent: this,
                        },
                    };
                }
                if (columnDef.headerName === 'Doc. Ref.') {
                    columnDef.cellRendererFramework = AgGridHyperlinkForAccountentriesComponent;
                    columnDef.cellRendererParams = {
                        gridId: this.accountingEntriesGridCode,
                        columnId: columnDef.colId,
                        context: {
                            componentParent: this,
                        },
                    };
                }
                const numericColumn = numericColumns.find((column) => column === columnDef.field.toLowerCase());
                if (numericColumn) {
                    columnDef.type = 'numericColumn';
                    columnDef.valueFormatter = this.numberFormatter;
                }

            }

            if (this.gridCode === this.invoiceGridCode || this.gridCode === this.tradeReportListGridCode || this.tradeListGridCode) {
                const numericColumn = numericColumns.find((column) => column === columnDef.field.toLowerCase());
                if (numericColumn) {
                    columnDef.type = 'numericColumn';
                    columnDef.valueFormatter = this.numberFormatter;
                }
            }

            return columnDef;
        });

        if (this.agGridOptions) {
            this.addMenuAction();
            this.agGridOptions.columnDefs = this.agGridCols;
            if (this.agGridOptions.api) {
                this.agGridOptions.api.setColumnDefs(this.agGridCols);
            }
        }
    }

    addMenuAction() {
        if (this.agGridCols) {
            if (this.agGridCols.length > 0 && this.gridContextualMenuActions) {
                this.agGridCols.push(
                    {
                        headerName: '',
                        colId: 'additionalActions',
                        cellRendererFramework: ListAndSearchContextualMenuComponent,
                        cellRendererParams: {
                            context: {
                                componentParent: this,
                            },
                            menuActions: this.gridContextualMenuActions,
                        },
                        maxWidth: 80,
                    },
                );
            }

            // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
            if (this.agGridCols.length > 0 && (this.gridCode === this.charterSectionToAssignGridCode ||
                this.gridCode === this.tradeForTradeAllocationGridCode)) {
                this.agGridCols.push(
                    {
                        headerName: '',
                        colId: 'selection',
                        headerCheckboxSelection: true,
                        checkboxSelection: true,
                        minWidth: 40,
                        maxWidth: 40,
                        pinned: 'left',
                    },
                );
            }
            if (this.agGridOptions) {
                this.agGridOptions.columnDefs = this.agGridCols;
                if (this.agGridOptions.api) {
                    this.agGridOptions.api.setColumnDefs(this.agGridCols);
                    this.agGridService.sizeColumns(this.agGridOptions);
                }
            }
        }
    }

    checkAndUnCheckSelectContracts(contractLabel: string, isChecked: boolean) {
        this.agGridApi.forEachNode((node) => {
            if (node.data.contractLabel === contractLabel) {
                if (node.isSelected() && !isChecked) {
                    node.setSelected(isChecked);
                } else if (!node.isSelected() && isChecked) {
                    node.setSelected(isChecked);
                }
            }
        });
    }

    unCheckSelectContracts(contractLabel: string, isChecked: boolean) {
        this.agGridApi.forEachNode((node) => {
            if (node.data.physicalContractCode !== contractLabel) {
                if (node.isSelected() && !isChecked) {
                    node.setSelected(isChecked);
                }
            }
        });
    }

    handleAction(action: string, rowData) {
        this.menuActionClicked.emit({ action, rowData });
        event.preventDefault();
    }

    onGridReady(params) {
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]) {
        this.filters = filters;
        this.loadData();
    }

    onRowClicked(row) {
        if (!this.quickSumModeActivated && !this.hyperLinkClicked) {
            this.rowClicked.emit(row);
        }
        this.hyperLinkClicked = false;
    }

    onRowSelected(row) {
        this.rowSelected.emit(row);
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }

    toggleQuickSum() {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = !this.quickSumModeActivated;
        this.classApplied = this.quickSumModeActivated ? this.cellSelectionClass : this.defaultClass;
        this.selectedColumnsArray = [];
    }

    onClearSelectionClicked() {
        this.agGridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    }

    // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
    onFilterChanged(event) {
        if (this.gridCode === this.accountingEntriesGridCode) {
            this.sumOfAccountingEntriesGridLine(true);
        }
    }

    // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
    sumOfAccountingEntriesGridLine(filterApplied: boolean) {
        this.totalSumShow = true;
        this.amountSum = 0;
        this.statutoryCcySum = 0;
        this.functionalCcySum = 0;
        if (filterApplied) {
            this.agGridApi.forEachNodeAfterFilter((node) => {
                // select the node
                this.amountSum += node.data.amount;
                this.statutoryCcySum += Number(node.data.statutoryCurrency);
                this.functionalCcySum += Number(node.data.functionalCurrency);
            });

        } else {
            this.agGridRows.forEach((rowdata) => {
                if (rowdata) {
                    this.amountSum += rowdata.amount;
                    this.statutoryCcySum += Number(rowdata.statutoryCurrency);
                    this.functionalCcySum += Number(rowdata.functionalCurrency);
                }
            });
        }

    }

    rangeSelectionCalculation(event) {
        this.selectedColumnsArray = [];
        const rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        const firstRange = rangeSelections[0];
        const startRow = Math.min(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const endRow = Math.max(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const api = this.agGridApi;
        let sum = 0;
        let columnName: string;
        let columnHeader: string;
        const selectedColumnsArray = this.selectedColumnsArray;
        const allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        firstRange.columns.forEach((column) => {
            sum = 0;
            columnName = column.getColDef().colId;
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsforQuickSum.includes(columnName)) {
                for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    const rowModel = api.getModel();
                    const rowNode = rowModel.getRow(rowIndex);
                    const value = api.getValue(column, rowNode);
                    sum += Number(value);
                }

                selectedColumnsArray.push({ name: columnHeader, sum });
            }
        });
        this.selectedColumnsArray = selectedColumnsArray;
    }

    // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
    hyperlinkClickedforAccounting(accountingEntriesResult: AccountingEntriesSearchResult, columnId: string) {
        let link: string;
        if (columnId === 'documentReference') {
            if (accountingEntriesResult.invoiceId) {
                let invoiceOption = accountingEntriesResult.invoiceId.toString();
                const invoiceType = accountingEntriesResult.invoiceTypeId;
                const originalInvoiceType = accountingEntriesResult.originalInvoiceTypeId;
                const originalInvoiceId = accountingEntriesResult.originalInvoiceId;
                if (originalInvoiceType && originalInvoiceId) {
                    if (invoiceType === InvoiceTypes.Reversal) {
                        invoiceOption = originalInvoiceId.toString();
                    }
                }
                link = '/' + this.companyManager.getCurrentCompanyId() +
                    '/execution/invoicing/summary/' + encodeURIComponent(invoiceOption) + '?invoiceType='
                    + invoiceType + '&' + 'originalInvoiceType=' + originalInvoiceType;
                window.open(link, '_blank');

            }
            if (accountingEntriesResult.cashId) {
                const costDirectionId = accountingEntriesResult.costDirectionId;
                const cashId = accountingEntriesResult.cashId;
                link = '/' + this.companyManager.getCurrentCompanyId() + '/execution/cash/display/'
                    + costDirectionId + '/' + cashId;
                window.open(link, '_blank');
            }

            if (accountingEntriesResult.documentType === 'JournalEntry' || accountingEntriesResult.documentType === 'ManualAccrual') {
                const accountingId = accountingEntriesResult.accountingDocumentId;
                link = '/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entry/view/' + accountingId;
                window.open(link, '_blank');
            }
            if (accountingEntriesResult.documentType === 'Reversal') {
                const transactionDocumentId = accountingEntriesResult.transactionDocumentId;
                const documentReference = accountingEntriesResult.documentReference;
                const originalReference = accountingEntriesResult.originalReferenceId;
                link = '/' + this.companyManager.getCurrentCompanyId() +
                    '/financial/reverse/document/summary/' + encodeURIComponent(transactionDocumentId.toString())
                    + '?documentReference=' + documentReference + '&' + 'originalReference=' + originalReference;
                window.open(link, '_blank');
            }
        }
        if (columnId === 'contractSectionCode') {
            link = '/' + this.companyManager.getCurrentCompanyId() + '/trades/display/' + accountingEntriesResult.sectionId;
            window.open(link, '_blank');
        }
    }

    // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
    hyperlinkClickedforTradeChildSections(rowSelected: AssignedSection, columnId: string) {
        const sectionId = columnId === 'contractLabel' ?
            rowSelected.sectionId : rowSelected.allocatedSectionId;
        this.ngZone.run(() => {
            if (this.dataVersionId) {
                this.tradeActionsService.displaySectionInSnapshotSubject.next(
                    new SectionReference(sectionId, this.dataVersionId));
            } else {
                this.tradeActionsService.displaySectionSubject.next(sectionId);
            }
            return of(true).toPromise();
        }).then();
    }

    hyperlinkClicked(rowSelected: any, event) {
        this.hyperLinkClicked = true;
        this.linkClicked.emit(rowSelected);
        event.preventDefault();
    }

    formatValue(amount: number): string {
        if (isNaN(amount) || amount === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    }

    numberFormatter(params) {
        if (params && params.value && !isNaN(params.value)) {
            // SHOULD BE REMOVED ! SPECIFIC TO ONE GRID
            if (params.colDef.colId.toLowerCase() === 'weight' || params.colDef.colId.toLowerCase() === 'amount' ||
                params.colDef.colId.toLowerCase() === 'functionalcurrency' || params.colDef.colId.toLowerCase() === 'statutorycurrency' ||
                params.colDef.colId.toLowerCase() === 'totalinvoicevalue' || params.colDef.colId.toLowerCase() === 'quantity' ||
                params.colDef.colId.toLowerCase() === 'price' || params.colDef.colId.toLowerCase() === 'contractvalue' ||
                params.colDef.colId.toLowerCase() === 'contractquantity' || params.colDef.colId.toLowerCase() === 'invoicevalue' ||
                params.colDef.colId.toLowerCase() === 'originalquantity' || params.colDef.colId.toLowerCase() === 'quantityinvoiced' ||
                params.colDef.colId.toLowerCase() === 'invoicedvalue' || params.colDef.colId.toLowerCase() === 'invoicepercent' ||
                params.colDef.colId.toLowerCase() === 'invoicedquantity' || params.colDef.colId.toLowerCase() === 'premiumdiscountvalue'
                || params.colDef.colId.toLowerCase() === 'percentageinvoiced') {
                if (params.colDef.colId.toLowerCase() === 'weight' || params.colDef.colId.toLowerCase() === 'quantity' ||
                    params.colDef.colId.toLowerCase() === 'quantityinvoiced' || params.colDef.colId.toLowerCase() === 'originalquantity' ||
                    params.colDef.colId.toLowerCase() === 'contractquantity' || params.colDef.colId.toLowerCase() === 'invoicedquantity') {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params.value);
                } else {
                    if (params.colDef.colId.toLowerCase() === 'price') {
                        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params.value);
                    } else {
                        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
                    }
                }
            }
            if (params.colDef.colId.toLowerCase() === 'contractquantity') {
                const newValue = new AtlasNumber(params.value.toString());
                return newValue.toString();
            }
        }
    }

    onRangeSelectionChanged(event) {
        this.selectedColumnsArray = [];
        const cellInfos: any = [];

        const rangeSelections = this.agGridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        if (rangeSelections && rangeSelections.length === 1) {
            this.rangeSelectionCalculation(event);
        } else {
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

            const api = this.agGridApi;
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
                                const rowModel = api.getModel();
                                const rowNode = rowModel.getRow(Number(cellInfos[rowIndex].rowIndex));
                                const value = api.getValue(column, rowNode);
                                sum += Number(value);
                            }
                        }

                        const columnObj = selectedColumnsArray.find((selectedColumn) => selectedColumn.name === columnHeader);
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

    toggleChanged() {
        this.additionalBooleanParam = !(this.additionalBooleanParam || false);
        this.loadData(true);
    }

    onDismissClicked() {
        this.isLimitReached = false;
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

    export(): void {
        if (this.exportAdapter) {
            this.exportAdapter.export(this.gridCode, this.filters, this.dataVersionId, this.gridPreferences.selectedGridViewId);
        }
    }

    onExportButtonClicked() {
        this.export();
    }
}
