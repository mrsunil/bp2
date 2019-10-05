import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ListAndSearchFilterType } from '../../../../..//shared/enums/list-and-search-filter-type.enum';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CommodityInputComponent } from '../../../../../shared/components/commodity-input/commodity-input.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ListAndSearchComponent } from '../../../../../shared/components/list-and-search/list-and-search.component';
import { AllocatedTradeSearchResult } from '../../../../../shared/dtos/allocated-trade';
import { AllocationSetUp } from '../../../../../shared/entities/allocation-set-up-entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ColumnConfigurationProperties } from '../../../../../shared/entities/grid-column-configuration.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { AllocatedTradeDisplayView } from '../../../../../shared/models/allocated-trade-display-view';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { AllocateSectionCommand } from '../../../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { TradeAllocationDataLoader } from '../../../../../shared/services/list-and-search/tradeAllocation-data-loader';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { GetWarningMessages } from '../../../../../shared/validators/warning-messages-validator.validator';
import { AllocationMessage } from '../../../../entities/allocation-message';

@Component({
    selector: 'atlas-allocation-table-form-component',
    templateUrl: './allocation-table-form-component.component.html',
    styleUrls: ['./allocation-table-form-component.component.scss'],
    providers: [TradeAllocationDataLoader],
})
export class AllocationTableFormComponent extends BaseFormComponent implements OnInit, OnDestroy {

    @Output() readonly validateWarningMessages = new EventEmitter<any>();
    @Output() readonly disableAllocateButton = new EventEmitter<any>();
    @Output() readonly contractRowSelected = new EventEmitter<string[]>();
    @Output() readonly counterpartyForContractRowSelected = new EventEmitter<string[]>();
    @ViewChild('commodityInput') commodityInput: CommodityInputComponent;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    getAllocationWarningMessagesSubscription: Subscription;
    allocationMessage: AllocationMessage[] = [];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    allocationGridCols: agGrid.ColDef[];
    allocationGridOptions: agGrid.GridOptions = {};
    allocationGridRows: AllocatedTradeDisplayView[] = [];
    allocatedTrades: AllocatedTradeDisplayView[];
    sectionId: number;
    searchedValueCtrl = new AtlasFormControl('searchedValue');
    contractType: string;
    tradeRowData: string[] = [];
    tradeRowDataForWashout: string[] = [];
    masterData: MasterData;
    isEmptyStateShowed: boolean = false;
    emptySearchResultTitle: string;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    rowId: string[] = [];
    columnDefs: agGrid.ColDef[];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    selectedTradeAllocationData: AllocatedTradeSearchResult;
    dataVersionId: number;
    allocationSetUpData: AllocationSetUp[] = [];
    company: string;

    gridCode = 'tradeForTradeAllocationList';
    filters: ListAndSearchFilter[] = [];
    additionalFilters: ListAndSearchFilter[] = [];
    isLoading: boolean;
    hasGridSharing = false;
    loadOnInit = false;
    gridPreferences: UserGridPreferencesParameters = new UserGridPreferencesParameters();

    constructor(
        private tradingService: TradingService,
        private activeroute: ActivatedRoute,
        protected snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
        private uiService: UiService,
        protected lockService: LockService,
        protected dialog: MatDialog,
        protected companyManagementService: CompanyManagerService,
        public gridService: AgGridService,
        protected configurationService: ConfigurationService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected utilService: UtilService,
        public dataLoader: TradeAllocationDataLoader,

    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.sectionId = Number(this.activeroute.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.masterData = this.route.snapshot.data.masterdata;
        this.getAllocationSetUpData(this.company);
    }

    externalFilterPresent() {
        return true;
    }

    externalFilterPass(node) {
        const contractLabel = node.data.contractLabel;
        if (!this.searchedValueCtrl.value || !contractLabel) {
            return contractLabel === 'No Value';
        } else {
            return contractLabel === this.searchedValueCtrl.value.toUpperCase()
                || contractLabel.toUpperCase().toString().startsWith(this.searchedValueCtrl.value.toUpperCase());
        }
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.contractType = tradeRecord.type;
        return entity;
    }

    onGridReady(params) {
        this.allocationGridOptions.columnDefs = this.allocationGridCols;
        this.gridApi = this.allocationGridOptions.api;
        this.gridColumnApi = this.allocationGridOptions.columnApi;

        this.gridService.sizeColumns(this.allocationGridOptions);
        this.gridApi.showNoRowsOverlay();
    }

    onSearchChange() {
        this.additionalFilters = [];
        const contractRefField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'PhysicalContractCode');
        const ParentSectionIdField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'PhysicalContractSectionId');

        if (!this.listAndSearchComponent) {
            return;
        } else {

            if (this.searchedValueCtrl.value) {
                if ((this.contractType === ContractTypes[ContractTypes.Purchase])
                    && this.searchedValueCtrl.value.substr(0, 1).toUpperCase() === 'P') {
                    this.displayMessageWhenPruchaseAllocatedToSales();
                } else if ((this.contractType === ContractTypes[ContractTypes.Sale])
                    && this.searchedValueCtrl.value.substr(0, 1).toUpperCase() === 'S') {
                    this.displayMessageWhenSaleAllocatedToPurchase();
                } else {
                    if (contractRefField) {
                        const filterContractReference = new ListAndSearchFilter();
                        filterContractReference.fieldId = contractRefField.fieldId;
                        filterContractReference.fieldName = contractRefField.fieldName;
                        filterContractReference.predicate = {
                            filterType: ListAndSearchFilterType.Text,
                            operator: 'eq',
                            value1: this.searchedValueCtrl.value + '%',
                        };
                        filterContractReference.isActive = true;
                        this.additionalFilters.push(filterContractReference);
                    }
                    if (ParentSectionIdField) {
                        const filterParentContractReference = new ListAndSearchFilter();
                        filterParentContractReference.fieldId = ParentSectionIdField.fieldId;
                        filterParentContractReference.fieldName = ParentSectionIdField.fieldName;
                        filterParentContractReference.predicate = {
                            filterType: ListAndSearchFilterType.Numeric,
                            operator: 'eq',
                            value1: this.sectionId.toString(),
                        };
                        filterParentContractReference.isActive = true;
                        this.additionalFilters.push(filterParentContractReference);
                    }
                    this.listAndSearchComponent.additionalFilters = this.additionalFilters;
                    this.listAndSearchComponent.loadData(true);

                }
            }
        }
    }

    initAdditionnalFilters() {
        if (this.additionalFilters.length === 0) {
            this.additionalFilters = [];
        }
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {
            const ParentSectionIdField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'PhysicalContractSectionId');
            if (ParentSectionIdField) {
                const filterParentContractReference = new ListAndSearchFilter();
                filterParentContractReference.fieldId = ParentSectionIdField.fieldId;
                filterParentContractReference.fieldName = ParentSectionIdField.fieldName;
                filterParentContractReference.predicate = {
                    filterType: ListAndSearchFilterType.Numeric,
                    operator: 'eq',
                    value1: this.sectionId.toString(),
                };
                filterParentContractReference.isActive = true;
                this.additionalFilters.push(filterParentContractReference);
            }
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.additionalFilters = this.additionalFilters;
            this.listAndSearchComponent.loadData(true);
        } else {
            return;
        }
    }

    filter(search: any) {
        if (search) {
            const abc = [];
            this.allocationGridRows.forEach((row) => {
                if (row.contractLabel.toLowerCase().startsWith(search.toLowerCase())) {
                    abc.push(row);
                }
            });
            this.gridApi.setRowData(abc);
        }
    }

    onRowDataChanged() {
        this.gridService.sizeColumns(this.allocationGridOptions);
    }

    rowSelected(event) {
        this.tradeRowData = [];
        this.tradeRowDataForWashout = [];
        if (event.node.selected === true) {
            this.rowId = [];
            this.selectedTradeAllocationData = event.data;
            this.listAndSearchComponent.unCheckSelectContracts(this.selectedTradeAllocationData.physicalContractCode, false);
            this.rowId.push(event.node.id);
            this.tradeRowData.push(event.data.quantity);
            this.tradeRowData.push(event.data.weightCode);
            this.contractRowSelected.emit(this.tradeRowData);
            this.tradeRowDataForWashout.push(event.data.counterparty);
            this.tradeRowDataForWashout.push(event.data.currencyCode);

            this.counterpartyForContractRowSelected.emit(this.tradeRowDataForWashout);
        } else {
            if (this.rowId && this.rowId[0] === event.node.id) {
                this.contractRowSelected.emit(this.tradeRowData);
            }
        }
        if (event.data.type === ContractTypes.Purchase.toString() && event.node.selected &&
            this.contractType === ContractTypes[ContractTypes.Purchase]) {
            this.displayMessageWhenPruchaseAllocatedToSales();
        } else {

            if (event.node.selected === true) {
                // check box selected.
                // fetch all warning messages.
                this.allocationMessage = [];
                this.getAllocationWarningMessagesSubscription =
                    this.executionService.getWarningMessages(this.sectionId, event.data.sectionId)
                        .subscribe((data) => {
                            if (data.value.length > 1) {
                                this.allocationMessage = GetWarningMessages(data.value, this.allocationSetUpData);
                            }
                            this.validateWarningMessages.emit(this.allocationMessage);
                        });
            } else {
                // checkbox is unselected.
                this.validateWarningMessages.emit('ClearTradeSelection');
            }
        }
        this.grantLock(event.data.sectionId, event.node);
    }

    grantLock(sectionId: number, node: agGrid.RowNode) {
        if (this.dataVersionId) {
            return;
        }
        if (node.isSelected()) {
            if (!this.locking.includes(sectionId)) {
                this.locking.push(sectionId);
                this.subscriptions.push(this.lockService.isLockedContract(sectionId).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                        this.gridApi.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        this.subscriptions.push(this.lockService.lockContract(sectionId, LockFunctionalContext.Allocation)
                            .subscribe(() => {
                                this.refeshResourceInformation();
                                this.locking = this.locking.filter((id) => id !== sectionId);
                            }));

                    }
                }));
            }
        } else {
            if (!this.unlocking.includes(sectionId)) {
                this.unlocking.push(sectionId);
                this.refeshResourceInformation();
                if (this.resourcesInformation.filter((rsc) => rsc.resourceId === sectionId).length === 0) {
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.Allocation).subscribe(() => {
                        node.setRowSelectable(true);
                        this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                    }));
                } else {
                    node.setRowSelectable(true);
                    this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                }
            }
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const mainContractInformation = new LockResourceInformation();
        mainContractInformation.resourceType = 'Contract';
        mainContractInformation.resourceId = this.sectionId;
        this.resourcesInformation.push(mainContractInformation);
        if (this.gridApi) {
            this.gridApi.forEachNode((node) => {
                if (node.isSelected()) {
                    const resourceInformation = new LockResourceInformation();
                    resourceInformation.resourceType = 'Contract';
                    resourceInformation.resourceId = node.data.sectionId;
                    resourceInformation.resourceCode = node.data.contractReference;
                    this.resourcesInformation.push(resourceInformation);
                }
            });
        }
    }

    displayMessageWhenPruchaseAllocatedToSales() {
        this.disableAllocateButton.emit(true);
        this.snackbarService.throwErrorSnackBar(
            'Purchase contract can only be allocated to a Sale contract',
        );
    }

    displayMessageWhenSaleAllocatedToPurchase() {
        this.disableAllocateButton.emit(true);
        this.snackbarService.throwErrorSnackBar(
            'Sale contract can only be allocated to a Purchase contract',
        );
    }
    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;

                this.gridPreferences = {
                    company: this.company,
                    gridId: this.gridCode,
                    gridOptions: this.allocationGridOptions,
                    sharingEnabled: this.hasGridSharing,
                };
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
                pinned: 'left',
                minWidth: 40,
                maxWidth: 40,
            });

        // grid config
        const numericColumns: string[] = [];
        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
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

    }

    quantityFormatter(params) {
        return params.value.toFixed(2) + ' ' + params.value.quantityUnitCode;
    }

    getTradesForAllocation() {
        const filters = this.filters.map((x) => ({ ...x }));
        this.tradingService.searchContractsToAllocate(filters)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((data) => {
                this.allocatedTrades = data;
                data.forEach((trade) => {
                    this.allocationGridRows.push(new AllocatedTradeDisplayView(trade));
                });
                this.gridApi.setRowData([]);
                this.onSearchChange();
            });
    }

    populateEntity(command: any): any {
        const allocateSection = command as AllocateSectionCommand;
        allocateSection.allocatedSectionId = this.selectedTradeAllocationData.sectionId;
        allocateSection.targetQuantity = this.selectedTradeAllocationData.quantity;
        allocateSection.allocatedSectionReference = this.selectedTradeAllocationData.physicalContractCode;
        return allocateSection;
    }

    resetAllocationgrid() {
        this.gridApi.deselectAll();
    }

    ngOnDestroy(): void {
        if (this.getAllocationWarningMessagesSubscription) {
            this.getAllocationWarningMessagesSubscription.unsubscribe();
        }
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }));
    }

    // this method will fetch allocationsetupdata for a company
    getAllocationSetUpData(company: string) {
        this.configurationService.getAllocationSetUpByCompany(company)
            .subscribe((data) => {
                if (data && data.length > 0) {
                    this.allocationSetUpData = data;
                }
            });
    }
}
