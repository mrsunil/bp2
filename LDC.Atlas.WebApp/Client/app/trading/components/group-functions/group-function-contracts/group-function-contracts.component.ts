import { Component, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { Subscription, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AgGridUserPreferencesComponent } from '../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { EnumEntity } from '../../../../shared/entities/enum-entity.entity';
import { ColumnConfigurationProperties } from '../../../../shared/entities/grid-column-configuration.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../../shared/entities/window-injection-token';
import { ContractStatus } from '../../../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../../../shared/enums/contract-type.enum';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';
import { ListAndSearchFilterType } from '../../../../shared/enums/list-and-search-filter-type.enum';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../shared/services/grid-configuration-provider.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { UiService } from '../../../../shared/services/ui.service';
import { UtilService } from '../../../../shared/services/util.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'atlas-group-function-contracts',
    templateUrl: './group-function-contracts.component.html',
    styleUrls: ['./group-function-contracts.component.scss'],
})
export class GroupFunctionContractsComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly contractSelected = new EventEmitter<boolean>();
    @Input() hasDeleteViewPrivilege = true;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly resetAllocationGrids = new EventEmitter<boolean>();

    searchContractForm: FormGroup;
    company: string;
    isLoading: boolean = false;
    atlasAgGridParam: AtlasAgGridParam;
    groupFunctionsGridColumns: agGrid.ColDef[];
    groupFunctionType = GroupFunctionTypes;
    savedColumnStates: ColumnState[];
    groupFunctionsGridOptions: agGrid.GridOptions = {};
    ContractGridRows: ContractsForBulkFunctions[];
    contractsToedit: ContractsForBulkFunctions[];
    contractsToApprove: ContractsForBulkFunctions[];
    selectedContractsForBulkFunctions: ContractsForBulkFunctions[];
    private getTradesForSubscription: Subscription;
    totalContractList: ContractsForBulkFunctions[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    destroy$ = new Subject();
    dataLength: number = 0;
    subscriptions: Subscription[] = [];
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    selectedSectionIds: number[] = [];
    unlocking: number[] = [];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    gridTitle = 'Physical Contracts';
    gridCode = 'tradeList';
    filters: ListAndSearchFilter[];
    masterdata: MasterData;
    columnDefs: agGrid.ColDef[];
    hasGridSharing = false;
    savedSearchTerm: string;
    searchContractReference: any;
    searchContractReferenceDeallocation: any;
    groupingNumber: any;
    isContractSelected: boolean = false;
    cellSelectionClass: string = 'ag-theme-material pointer-cursor cell-selection';
    classApplied: string;
    quickSumModeActivated = false;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    isQuickSumDisplay: boolean = false;
    allowedColumnsForQuickSum: string[] = [];
    defaultClass: string = 'ag-theme-material pointer-cursor';
    bulkActionTypeId: number;
    showDeallocationSearch: boolean = false;
    bulkAllocationColumns = ['ContractLabel', 'Counterparty', 'Commodity1', 'Commodity2', 'Commodity3', 'Commodity4',
        'Commodity5', 'Quantity', 'WeightUnitCode', 'ShippingPeriod', 'ContractTermCode',
        'ContractTermDescription', 'CharterReference', 'BLDate',
        'CurrencyCode', 'Price', 'PriceCode', 'DepartmentCode', 'AllocatedContractReference', 'Status', 'ShipmentPeriod', 'IsTradeClosed'];

    bulkDeAllocationColumns = ['ContractLabel', 'Counterparty', 'Commodity1', 'Commodity2', 'Commodity3', 'Commodity4',
        'Commodity5', 'Quantity', 'WeightUnitCode', 'AllocatedContractReference'
        , 'CharterReference', 'GroupNumber', 'BLDate', 'ContractType', 'GroupingNumber'];
    lockedContracts: EnumEntity[] = [];
    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private tradingService: TradingService,
        private lockService: LockService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected uiService: UiService,
        private agGridService: AgGridService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected utilService: UtilService,
        public gridService: AgGridService,
        @Inject(WINDOW) private window: Window,
    ) {
        super(formConfigurationProvider);
        this.bulkActionTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('bulkActionTypeId')));
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.searchContractForm = this.formBuilder.group({
            searchContractReferenceCtrl: [''],
            searchContractReferenceDeallocationCtrl: [''],
            groupNumberDeallocationCtrl: [''],

        });
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.isLoading = true;
        if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
            this.showDeallocationSearch = true;
        }
        this.loadGridConfiguration();
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe());
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.searchContractForm.dirty) {
            $event.returnValue = true;
        }
    }

    toggleQuickSum(value: boolean) {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = value;
        this.classApplied = (this.quickSumModeActivated) ? this.cellSelectionClass : this.defaultClass;
        this.selectedColumnsArray = [];
    }

    onClearSelectionClicked() {
        this.gridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    }

    onRangeSelectionChanged(event) {
        this.selectedColumnsArray = [];
        const cellInfos: any = [];

        const rangeSelections = this.gridApi.getRangeSelections();
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

            const api = this.gridApi;
            let sum = 0;
            let columnName: string;
            let columnHeader: string;
            const selectedColumnsArray = this.selectedColumnsArray;
            const allowedColumnsForQuickSum = this.allowedColumnsForQuickSum;

            selectedCells.forEach((row) => {
                row.columns.forEach((column) => {
                    sum = 0;
                    columnName = column.getColDef().colId.toLowerCase();
                    columnHeader = column.getColDef().headerName;
                    if (allowedColumnsForQuickSum.includes(columnName)) {
                        for (let rowIndex = 0; rowIndex < cellInfos.length; rowIndex++) {
                            if (cellInfos[rowIndex].columnName.toLowerCase() === columnName) {
                                const rowModel = api.getModel();
                                const rowNode = rowModel.getRow(Number(cellInfos[rowIndex].rowIndex));
                                const value = api.getValue(column, rowNode);
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

    rangeSelectionCalculation(event) {
        this.selectedColumnsArray = [];
        const rangeSelections = this.gridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        const firstRange = rangeSelections[0];
        const startRow = Math.min(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const endRow = Math.max(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const api = this.gridApi;
        let sum = 0;
        let columnName: string;
        let columnHeader: string;
        const selectedColumnsArray = this.selectedColumnsArray;
        const allowedColumnsForQuickSum = this.allowedColumnsForQuickSum;
        firstRange.columns.forEach((column) => {
            sum = 0;
            columnName = column.getColDef().colId.toLowerCase();
            columnHeader = column.getColDef().headerName;
            if (allowedColumnsForQuickSum.includes(columnName)) {
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

    onGridReady(params) {
        this.groupFunctionsGridOptions = params;
        this.groupFunctionsGridOptions.columnDefs = this.columnDefs;
        this.gridApi = this.groupFunctionsGridOptions.api;
        this.gridColumnApi = this.groupFunctionsGridOptions.columnApi;
        if (this.savedColumnStates) {
            this.groupFunctionsGridOptions.columnApi.setColumnState(this.savedColumnStates);
        }
        this.agGridService.sizeColumns(this.groupFunctionsGridOptions);
        this.gridApi.sizeColumnsToFit();
        this.gridColumnApi.autoSizeAllColumns();
        this.gridApi.showNoRowsOverlay();
        this.window.onresize = () => {
            this.agGridService.sizeColumns(this.groupFunctionsGridOptions);
        };
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                const allocationColumnConfiguration = configuration.columns;
                if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
                    this.columnConfiguration = this.loadBulkAllocationColumns(allocationColumnConfiguration);
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
                    this.columnConfiguration = this.loadBulkDeAllocationColumns(allocationColumnConfiguration);
                } else {
                    this.columnConfiguration = configuration.columns;
                }
                this.initColumns(this.columnConfiguration);
                this.isQuickSumDisplay = false;
                if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkEdition) {
                    this.getContractsToEdit();
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkApproval) {
                    this.getContractsToApprove();
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkClosure) {
                    this.getContractsToClosure();
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
                    this.getContractsToAllocation();
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
                    this.getContractsToDeAllocation();
                }
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        this.columnDefs = [];
        // selection column
        this.columnDefs.push(
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'left',
            });

        // grid config
        const numericColumns: string[] = [];
        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        this.allowedColumnsForQuickSum = numericColumns;
        this.columnDefs = this.columnDefs.concat(configuration.map((config) => {
            const columnDef: agGrid.ColDef = {
                colId: this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: this.utilService.convertToCamelCase(config.fieldName),
                hide: !config.isVisible,
            };

            const formatter = this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }

            const dateGetter = this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }
            return columnDef;
        }));
        if (this.groupFunctionsGridOptions) {
            this.groupFunctionsGridOptions.columnDefs = this.columnDefs;
        }
    }

    onColumnStateSetToGrid() {
        this.gridColumnApi.setColumnVisible('selection', true);
    }

    ngOnDestroy(): void {
        if (this.getTradesForSubscription) {
            this.getTradesForSubscription.unsubscribe();
        }
    }

    getContractsToEdit() {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            this.tradingService.searchContractsForBulkEdit(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    if (data) {
                        this.contractsToedit = data;
                        this.ContractGridRows = this.contractsToedit;
                        this.dataLength = this.ContractGridRows.length;
                        this.totalContractList = this.ContractGridRows;
                        this.isQuickSumDisplay = true;
                    }
                });
        }
    }
    getContractsToClosure() {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            this.tradingService.searchContractsForBulkEdit(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    if (data) {
                        this.contractsToedit = data;
                        this.ContractGridRows = this.contractsToedit;
                        this.dataLength = this.ContractGridRows.length;
                        this.totalContractList = this.ContractGridRows;
                    }
                });
        }
    }

    getContractsToApprove() {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            const tradeApprovalStatusColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'Status');
            if (tradeApprovalStatusColumn && ContractStatus[ContractStatus.Unapproved]) {
                const filterContractStatusType = new ListAndSearchFilter();
                filterContractStatusType.fieldId = tradeApprovalStatusColumn.fieldId;
                filterContractStatusType.fieldName = tradeApprovalStatusColumn.fieldName;
                filterContractStatusType.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: ContractStatus[ContractStatus.Unapproved],
                };
                filterContractStatusType.isActive = true;
                filters.push(filterContractStatusType);
            }
            this.tradingService.searchContractsForBulkEdit(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    if (data) {
                        this.contractsToedit = data;
                        this.ContractGridRows = this.contractsToedit;
                        this.dataLength = this.ContractGridRows.length;
                        this.totalContractList = this.ContractGridRows;
                        this.isQuickSumDisplay = true;
                    }
                });
        }
    }

    getContractsToAllocation(isEmit: boolean = false) {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            const quantityColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'Quantity');
            if (quantityColumn) {

                const filterQuantityType = new ListAndSearchFilter();
                filterQuantityType.fieldId = quantityColumn.fieldId;
                filterQuantityType.fieldName = quantityColumn.fieldName;
                filterQuantityType.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'ne',
                    value1: '0',
                };
                filterQuantityType.isActive = true;
                filters.push(filterQuantityType);
            }
            const allocatedContractColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'AllocatedContractReference');
            if (allocatedContractColumn) {
                const filterAllocationStatusType = new ListAndSearchFilter();
                filterAllocationStatusType.fieldId = allocatedContractColumn.fieldId;
                filterAllocationStatusType.fieldName = allocatedContractColumn.fieldName;
                filterAllocationStatusType.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'empty',
                    value1: null,
                    value2: '',
                };
                filterAllocationStatusType.isActive = true;
                filters.push(filterAllocationStatusType);
            }

            const tradeApprovalStatusColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'Status');
            if (tradeApprovalStatusColumn) {
                const filterContractStatusType = new ListAndSearchFilter();
                filterContractStatusType.fieldId = tradeApprovalStatusColumn.fieldId;
                filterContractStatusType.fieldName = tradeApprovalStatusColumn.fieldName;
                filterContractStatusType.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: ContractStatus[ContractStatus.Approved],
                };
                filterContractStatusType.isActive = true;
                filters.push(filterContractStatusType);
            }

            const isTradeClosedColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'IsTradeClosed');
            if (isTradeClosedColumn) {
                const filterTradeClosed = new ListAndSearchFilter();
                filterTradeClosed.fieldId = isTradeClosedColumn.fieldId;
                filterTradeClosed.fieldName = isTradeClosedColumn.fieldName;
                filterTradeClosed.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: 'Open',

                };
                filterTradeClosed.isActive = true;
                filters.push(filterTradeClosed);
            }

            this.tradingService.searchContractsForBulkEdit(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    if (data) {
                        this.contractsToedit = data;
                        this.ContractGridRows = this.contractsToedit;
                        if (isEmit) {
                            this.resetAllocationGrids.emit(true);
                        }
                        this.dataLength = this.ContractGridRows.length;
                        this.totalContractList = this.ContractGridRows;
                        this.autoSizeContractsGrid();
                    }
                });
        }
    }

    getContractsToDeAllocation(isEmit: boolean = false) {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            const allocatedContractColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'AllocatedContractReference');
            if (allocatedContractColumn) {
                const filterAllocationStatusType = new ListAndSearchFilter();
                filterAllocationStatusType.fieldId = allocatedContractColumn.fieldId;
                filterAllocationStatusType.fieldName = allocatedContractColumn.fieldName;
                filterAllocationStatusType.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'notEmpty',
                    value1: null,
                    value2: '',
                };
                filterAllocationStatusType.isActive = true;
                filters.push(filterAllocationStatusType);
            }

            this.tradingService.searchContractsForBulkEdit(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    if (data) {
                        this.contractsToedit = data;
                        this.ContractGridRows = this.contractsToedit;
                        if (isEmit) {
                            this.resetAllocationGrids.emit(true);
                        }
                        this.dataLength = this.ContractGridRows.length;
                        this.totalContractList = this.ContractGridRows;
                        this.autoSizeContractsGrid();
                    }
                });
        }
    }

    onSearchContracts() {
        this.searchContractReference = this.searchContractForm.get('searchContractReferenceCtrl').value;
        const rows: ContractsForBulkFunctions[] = [];
        const contractRows: number = 0;
        this.ContractGridRows = [];
        if (!this.searchContractReference) {
            const selectedRows = this.gridApi.getSelectedRows();
            this.ContractGridRows = this.totalContractList;
            this.gridApi.setRowData(this.ContractGridRows);
            this.dataLength = this.ContractGridRows.length;
            this.autoSizeContractsGrid();
            this.isLoading = false;
            (this.ContractGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
            if (selectedRows) {
                this.gridApi.forEachNode((node) => {
                    const row = selectedRows.find((data) => data.sectionId === node.data.sectionId);
                    if (row) {
                        node.setSelected(true);
                    }
                });
            }

            return;
        }
        if (this.totalContractList && this.totalContractList.length > 0) {
            this.isLoading = true;
            if (this.searchContractReference) {
                this.checkExistingRows();
            }
        }
    }

    onSelectionChanged(event) {

        this.gridApi.forEachNode((node) => {
            if (event.node.isSelected() && event.node.data.sectionId === node.data.sectionId) {
                node.setSelected(true);
            }
            if (node.data.isTradeClosed === 'Closed' && node.data.contractLabel === event.data.contractLabel) {
                node.selectable = true;
            }
            if (this.bulkActionTypeId !== GroupFunctionTypes.TradeBulkClosure) {
                if (node.data.isTradeCancelled === 'Cancelled' && node.data.contractLabel === event.data.contractLabel) {
                    node.selectable = true;
                }
            }

        });

        const selectedRows = this.gridApi.getSelectedRows();
        this.isContractSelected = selectedRows.length > 0;
        if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
            if (selectedRows.length > 1) {
                const purchaseContract = selectedRows.find((contract) => contract.contractType === ContractTypes[0]);
                const salesContract = selectedRows.find((contract) => contract.contractType === ContractTypes[1]);
                if (purchaseContract && salesContract) {
                    this.contractSelected.emit(this.isContractSelected);
                } else {
                    this.contractSelected.emit(false);
                }
            } else {
                this.contractSelected.emit(false);
            }
        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
            this.gridApi.forEachNode((node) => {
                if (node.data.allocatedContractReference === event.node.data.contractLabel) {
                    if (event.node.isSelected() && event.node.data.contractType === ContractTypes[1] && event.node.data.blDate) {
                        event.node.setSelected(false);
                        node.setSelected(false);
                        this.snackbarService.informationSnackBar('Allocated Sales Contract having BL Date can not be De-allocated');
                    } else if (node.data.contractType === ContractTypes[1] && node.data.blDate) {
                        event.node.setSelected(false);
                        node.setSelected(false);
                        this.snackbarService.informationSnackBar('Allocated Sales Contract having BL Date can not be De-allocated');
                    } else if (event.node.isSelected()) {
                        node.setSelected(true);
                    } else {
                        node.setSelected(false);
                    }
                }
            });

            const selectedRows = this.gridApi.getSelectedRows();
            this.isContractSelected = selectedRows.length > 1;
            this.contractSelected.emit(this.isContractSelected);
        } else {
            this.contractSelected.emit(this.isContractSelected);
        }

        this.gridApi.refreshCells(event.data);
        this.grantLock(Number(event.data.sectionId), event.node, event.data.isLocked);
        this.selectedContractsForBulkFunctions = selectedRows;
    }

    populateEntity(entity: any): any {
        this.selectedContractsForBulkFunctions = this.gridApi.getSelectedRows();

        return this.selectedContractsForBulkFunctions;
    }
    grantLock(sectionId: number, node: agGrid.RowNode, isLocked: boolean) {
        if (node.isSelected()) {
            if (!this.locking.includes(sectionId)) {
                this.locking.push(sectionId);
                this.subscriptions.push(
                    this.lockService.isLockedContract(sectionId).pipe(
                        takeUntil(this.destroy$),
                    ).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                        confirmDiscardDialog.afterClosed().subscribe((answer) => {
                            if (answer) {
                                if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkEdition) {
                                    this.locking = this.locking.filter((id) => id !== sectionId);
                                    this.lockedContracts.push({ enumEntityId: sectionId, enumEntityValue: lock.message });
                                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkApproval
                                    || this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation
                                    || this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
                                    isLocked = true;
                                    const selectedSection = this.selectedContractsForBulkFunctions.filter((item) => item.sectionId === sectionId);
                                    if (selectedSection.length > 0) {
                                        selectedSection[0].isLocked = isLocked;
                                        selectedSection[0].lockMessage = lock.message;
                                    }
                                    this.locking = this.locking.filter((id) => id !== sectionId);
                                }
                                node.setSelected(false);
                            }
                        });                       
                    } else {
                        if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkEdition) {
                            this.subscriptions.push(
                                this.lockService.lockContract(sectionId, LockFunctionalContext.BulkEdition)
                                    .subscribe(() => {
                                        this.refeshResourceInformation();
                                        this.locking = this.locking.filter((id) => id !== sectionId);
                                    }));
                        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkApproval) {
                            this.subscriptions.push(
                                this.lockService.lockContract(sectionId, LockFunctionalContext.BulkApproval)
                                    .subscribe(() => {
                                        this.refeshResourceInformation();
                                        isLocked = false;
                                        const selectedSection = this.selectedContractsForBulkFunctions.filter
                                            ((item) => item.sectionId === sectionId);
                                        if (selectedSection.length > 0) {
                                            selectedSection[0].isLocked = isLocked;
                                            selectedSection[0].lockMessage = lock.message;
                                        }
                                        this.locking = this.locking.filter((id) => id !== sectionId);
                                    }));
                        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
                            this.subscriptions.push(
                                this.lockService.lockContract(sectionId, LockFunctionalContext.BulkAllocation)
                                    .subscribe(() => {
                                        this.refeshResourceInformation();
                                        isLocked = false;
                                        const selectedSection = this.selectedContractsForBulkFunctions.filter
                                            ((item) => item.sectionId === sectionId);
                                        if (selectedSection.length > 0) {
                                            selectedSection[0].isLocked = isLocked;
                                            selectedSection[0].lockMessage = lock.message;
                                        }
                                        this.locking = this.locking.filter((id) => id !== sectionId);
                                    }));
                        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
                            this.subscriptions.push(
                                this.lockService.lockContract(sectionId, LockFunctionalContext.BulkDeallocation)
                                    .subscribe(() => {
                                        this.refeshResourceInformation();
                                        isLocked = false;
                                        const selectedSection = this.selectedContractsForBulkFunctions.filter
                                            ((item) => item.sectionId === sectionId);
                                        if (selectedSection.length > 0) {
                                            selectedSection[0].isLocked = isLocked;
                                            selectedSection[0].lockMessage = lock.message;
                                        }
                                        this.locking = this.locking.filter((id) => id !== sectionId);
                                    }));
                        }
                    }
                }));
            }
        } else {
            this.lockedContracts = this.lockedContracts.filter((item) => item.enumEntityId !== sectionId);

            if (!this.unlocking.includes(sectionId)) {
                this.unlocking.push(sectionId);
                this.refeshResourceInformation();
                if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkEdition) {
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.BulkEdition)
                        .subscribe(() => {
                            node.setRowSelectable(true);
                            this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                        }));
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkApproval) {
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.BulkApproval)
                        .subscribe(() => {
                            node.setRowSelectable(true);
                            this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                        }));
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.BulkAllocation)
                        .subscribe(() => {
                            node.setRowSelectable(true);
                            this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                        }));
                } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.BulkDeallocation)
                        .subscribe(() => {
                            node.setRowSelectable(true);
                            this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                        }));
                }
            }
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        this.groupFunctionsGridOptions.api.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
            this.agGridService.sizeColumns(this.groupFunctionsGridOptions);
        }
    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]): void {
        this.filters = filters;
        if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkEdition) {
            this.getContractsToEdit();
        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkApproval) {
            this.getContractsToApprove();
        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkClosure) {
            this.getContractsToClosure();
        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
            this.getContractsToAllocation();
        } else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
            this.getContractsToDeAllocation();
        }
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }
    loadBulkAllocationColumns(columnConfiguration) {
        let allocationColumnConfiguration: any;
        allocationColumnConfiguration = this.getColumnConfiguration(columnConfiguration, this.bulkAllocationColumns);
        return allocationColumnConfiguration;
    }
    loadBulkDeAllocationColumns(columnConfiguration) {
        let deAllocationColumnConfiguration: any;
        deAllocationColumnConfiguration = this.getColumnConfiguration(columnConfiguration, this.bulkDeAllocationColumns);
        return deAllocationColumnConfiguration;
    }

    getColumnConfiguration(columnConfiguration, columnsInList) {
        const gridColumnConfiguration = [];
        if (columnConfiguration.length > 0) {
            columnConfiguration.forEach((column) => {
                if (columnsInList.indexOf(column.fieldName) > -1) {
                    column.isVisible = true;
                    gridColumnConfiguration.push(column);
                }

            });
        }
        return gridColumnConfiguration;
    }

    onFirstDataRendered() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    checkExistingRows() {
        const selectedRows = this.gridApi.getSelectedRows();
        let rows = [];
        if (selectedRows && selectedRows.length > 0) {
            rows = this.gridApi.getSelectedRows();
        }
        this.contractsToedit = this.totalContractList.filter((item) => item.contractLabel != null);
        const data = this.contractsToedit.filter((item) =>
            item.contractLabel.toString().toUpperCase().includes(this.searchContractReference.toUpperCase()));
        if (data) {
            data.forEach((rowSelected) => {
                let addAllocatedSection: boolean = false;
                if (rows && rows.length > 0) {
                    const rowExists = rows.find((section) => section.sectionId === rowSelected.sectionId);
                    if (!rowExists) {
                        rows.push(rowSelected);
                        addAllocatedSection = true;
                    }
                } else {
                    rows.push(rowSelected);
                    addAllocatedSection = true;
                }
                if (addAllocatedSection && rowSelected.allocatedContractReference
                    && this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
                    const allocatedSection = this.totalContractList.find(
                        (section) => section.contractLabel === rowSelected.allocatedContractReference);
                    if (allocatedSection) {
                        rows.push(allocatedSection);
                    }
                }
            });
        }
        this.ContractGridRows = rows;
        this.gridApi.setRowData(this.ContractGridRows);
        this.dataLength = this.ContractGridRows.length;
        this.autoSizeContractsGrid();
        this.isLoading = false;
        (this.ContractGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
        if (this.dataLength > 0) {
            this.gridApi.forEachNode((node) => {
                const row = selectedRows.find((data) => data.sectionId === node.data.sectionId);
                if (row) {
                    node.setSelected(true);
                }
            });
        }
    }
    onSearchContractsDeallocation() {
        this.searchContractReferenceDeallocation = this.searchContractForm.get('searchContractReferenceDeallocationCtrl').value;
        this.groupingNumber = this.searchContractForm.get('groupNumberDeallocationCtrl').value;
        this.ContractGridRows = [];
        let rows: ContractsForBulkFunctions[] = [];
        if (!this.searchContractReferenceDeallocation && !this.groupingNumber) {
            const selectedRows = this.gridApi.getSelectedRows();
            this.ContractGridRows = this.totalContractList;
            this.gridApi.setRowData(this.ContractGridRows);
            this.dataLength = this.ContractGridRows.length;
            this.autoSizeContractsGrid();
            this.isLoading = false;
            (this.ContractGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
            if (selectedRows) {
                this.gridApi.forEachNode((node) => {
                    const row = selectedRows.find((data) => data.sectionId === node.data.sectionId);
                    if (row) {
                        node.setSelected(true);
                    }
                });
            }

            return;
        }
        if (this.totalContractList && this.totalContractList.length > 0) {
            this.isLoading = true;
            if (this.searchContractReferenceDeallocation) {
                this.contractsToedit = this.totalContractList.filter((item) => item.contractLabel != null);
                rows = this.contractsToedit.filter((item) =>
                    item.contractLabel.toString().toUpperCase().includes(this.searchContractReferenceDeallocation.toUpperCase()));
            }
            if (this.groupingNumber) {
                this.contractsToedit = this.totalContractList.filter((item) => item.groupingNumber != null);
                rows = this.contractsToedit.filter((item) =>
                    item.groupingNumber === (Number(this.groupingNumber)));
            }

            const selectedRows = this.gridApi.getSelectedRows();
            if (selectedRows) {
                selectedRows.forEach((row) => {
                    const rowAlreadyExists = rows.find((section) => section.sectionId === row.sectionId);
                    if (!rowAlreadyExists) {
                        rows.push(row);

                    }

                },
                );
            }
            const alloactedRows = rows;
            alloactedRows.forEach((row) => {
                if (row.allocatedContractReference) {
                    const allocatedRow = this.totalContractList.find((allocatedRow) => allocatedRow.contractLabel === row.allocatedContractReference);
                    if (allocatedRow) {
                        const rowAlreadyExists = rows.find((section) => section.sectionId === allocatedRow.sectionId);
                        if (!rowAlreadyExists) {
                            rows.push(allocatedRow);
                        }
                    }

                }

            });
            this.ContractGridRows = rows;
            this.gridApi.setRowData(this.ContractGridRows);
            this.dataLength = this.ContractGridRows.length;
            this.autoSizeContractsGrid();
            this.isLoading = false;
            (this.ContractGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
            if (this.dataLength > 0) {
                this.gridApi.forEachNode((node) => {
                    const row = selectedRows.find((data) => data.sectionId === node.data.sectionId);
                    if (row) {
                        node.setSelected(true);
                    }
                });
            }

        }

    }
}
