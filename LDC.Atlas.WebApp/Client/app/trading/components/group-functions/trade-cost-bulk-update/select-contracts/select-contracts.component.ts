import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { Freeze } from '../../../../../shared/entities/freeze.entity';
import { ColumnConfigurationProperties } from '../../../../../shared/entities/grid-column-configuration.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../../../shared/entities/window-injection-token';
import { GroupFunctionTypes } from '../../../../../shared/enums/group-function-type';
import { ListAndSearchFilterType } from '../../../../../shared/enums/list-and-search-filter-type.enum';
import { AssignedSectionView } from '../../../../../shared/models/assigned-section-display-view';
import { CharterDisplayView } from '../../../../../shared/models/charter-display-view';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { CharterDataLoader } from '../../../../../shared/services/execution/charter-data-loader';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { FreezeService } from '../../../../../shared/services/http-services/freeze.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { CounterPartyDataLoader } from '../../../../../shared/services/masterdata/counterparty-data-loader';
import { ContractsForBulkFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { UiService } from '../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-select-contracts',
    templateUrl: './select-contracts.component.html',
    styleUrls: ['./select-contracts.component.scss'],
    providers: [CounterPartyDataLoader, CharterDataLoader],
})
export class SelectContractsComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly contractSelected = new EventEmitter<boolean>();
    @Input() hasDeleteViewPrivilege = true;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    searchContractForm: FormGroup;
    company: string;
    searchContractReferenceCtrl = new AtlasFormControl('contractReference');
    charterReferenceCtrl = new AtlasFormControl('charterReference');
    counterPartyCtrl = new AtlasFormControl('CounterPartyCommercial');
    databaseCtrl = new AtlasFormControl('Database');
    isLoading: boolean = false;
    contractGridRows: ContractsForBulkFunctions[];
    selectedContractsForBulkEdit: ContractsForBulkFunctions[];
    atlasAgGridParam: AtlasAgGridParam;
    groupFunctionsGridOptions: agGrid.GridOptions = {};
    columnDefs: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridCode = 'tradeList';
    hasGridSharing = false;
    gridColumnApi: agGrid.ColumnApi;
    columnConfiguration: ColumnConfigurationProperties[] = [];
    bulkActionTypeId: number;
    filters: ListAndSearchFilter[];
    contractsToEdit: ContractsForBulkFunctions[];
    dataLength: number = 0;
    totalContractList: ContractsForBulkFunctions[];
    filteredCharters: Charter[];
    charters: Charter[];
    masterdata: MasterData = new MasterData();
    filteredCounterPartyList: Counterparty[];
    counterPartyList: Counterparty[];
    searchContractReference: string;
    searchCounterParty: string;
    searchCharterReference: string;
    searchDatabase: string;
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Counter Party not in the list.');
    destroy$ = new Subject();
    databaseList: FreezeDisplayView[] = [];
    currentDatabase = new FreezeDisplayView(-1, 'CURRENT');
    invoiceContractGridRows: ContractsForBulkFunctions[];
    allInvoiceContractGridRows: ContractsForBulkFunctions[];
    contractsForBulkFunctions: ContractsForBulkFunctions[];
    isContractsNextDisabled: boolean = true;
    isContractSelected: boolean = false;
    charterList: CharterDisplayView[] = [];
    charter: string;
    charterId: number;
    openContract = 'Open';
    quantity = 0;
    sectionsAssigned: AssignedSectionView[];
    model: AssignedSection[] = [];
    contractsAssignedToCharter: ContractsForBulkFunctions[] = [];
    totalQuantity: number = 0;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    subscriptions: Subscription[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private gridService: AgGridService,
        private agGridService: AgGridService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected utilService: UtilService,
        protected uiService: UiService,
        private route: ActivatedRoute,
        protected lockService: LockService,
        private tradingService: TradingService,
        public charterDataLoader: CharterDataLoader,
        public counterpartyDataLoader: CounterPartyDataLoader,
        private freezeService: FreezeService,
        @Inject(WINDOW) private window: Window,
        protected dialog: MatDialog,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.bulkActionTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('bulkActionTypeId')));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.charterId = this.route.snapshot.params['charterId'];

        this.getFormGroup();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.counterPartyList = this.filteredCounterPartyList;
        this.counterPartyCtrl.valueChanges.subscribe((input) => {
            this.filterCounterParty(input);
        });
        this.populateCharterList();
        this.charterReferenceCtrl.valueChanges.subscribe((input) => {
            this.filterCharterReference(input);
        });
        this.loadGridConfiguration();
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe());
        this.loadSnapshots();
    }

    onGridReady(params) {
        this.groupFunctionsGridOptions.columnDefs = this.columnDefs;
        this.groupFunctionsGridOptions = params;
        this.gridApi = this.groupFunctionsGridOptions.api;
        this.gridColumnApi = this.groupFunctionsGridOptions.columnApi;
        this.agGridService.sizeColumns(this.groupFunctionsGridOptions);
        this.gridApi.sizeColumnsToFit();
        this.gridColumnApi.autoSizeAllColumns();
        this.gridApi.showNoRowsOverlay();
        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.agGridService.sizeColumns(this.groupFunctionsGridOptions);
        };
    }

    getFormGroup(): FormGroup {
        this.searchContractForm = this.formBuilder.group({
            searchContractReferenceCtrl: new FormControl(),
            charterReferenceCtrl: new FormControl(),
            counterPartyCtrl: new FormControl(),
            databaseCtrl: new FormControl(),

        });
        return this.searchContractForm;
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.getContractsToEditCost();
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        this.columnDefs = [];
        this.columnDefs.push(
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                width: 40,
                pinned: 'left',
                hide: false,
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
        if (this.groupFunctionsGridOptions) {
            this.groupFunctionsGridOptions.columnDefs = this.columnDefs;
        }
    }

    columnStateSetToGrid() {
        if (!this.groupFunctionsGridOptions.columnDefs.find((col) => (col as agGrid.ColDef).colId === 'selection')) {
            this.groupFunctionsGridOptions.columnDefs.push(
                {
                    headerName: '',
                    colId: 'selection',
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    width: 40,
                    pinned: 'left',
                    hide: false,
                });
        }
        this.gridColumnApi.setColumnVisible('selection', true);
    }

    getContractsToEditCost() {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            if (this.charterId) {
                const charterIdField = this.columnConfiguration
                    .find((column) => column.fieldName === 'CharterId');
                if (charterIdField) {
                    const filterCharterId = new ListAndSearchFilter();
                    filterCharterId.fieldId = charterIdField.fieldId;
                    filterCharterId.fieldName = charterIdField.fieldName;
                    filterCharterId.predicate = {
                        filterType: ListAndSearchFilterType.Numeric,
                        operator: 'eq',
                        value1: this.charterId.toString(),
                    };
                    filterCharterId.isActive = true;
                    filters.push(filterCharterId);
                }
            }
            const openContractsField = this.columnConfiguration
                .find((column) => column.fieldName === 'IsTradeClosed');
            if (openContractsField) {
                const filterOpenContracts = new ListAndSearchFilter();
                filterOpenContracts.fieldId = openContractsField.fieldId;
                filterOpenContracts.fieldName = openContractsField.fieldName;
                filterOpenContracts.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.openContract,
                };
                filterOpenContracts.isActive = true;
                filters.push(filterOpenContracts);
            }
            const quantityField = this.columnConfiguration
                .find((column) => column.fieldName === 'Quantity');
            if (quantityField) {
                const filterQuantity = new ListAndSearchFilter();
                filterQuantity.fieldId = quantityField.fieldId;
                filterQuantity.fieldName = quantityField.fieldName;
                filterQuantity.predicate = {
                    filterType: ListAndSearchFilterType.Numeric,
                    operator: 'ne',
                    value1: this.quantity.toString(),
                };
                filterQuantity.isActive = true;
                filters.push(filterQuantity);
            }
            this.tradingService.searchContractsForBulkEdit(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                ).subscribe((data) => {
                    if (data) {
                        this.contractsToEdit = data;
                        this.contractGridRows = this.contractsToEdit;
                        this.dataLength = this.contractGridRows.length;
                        this.totalContractList = this.contractGridRows;
                    }
                });
        }
    }

    loadSnapshots() {
        this.freezeService.getFreezeList().pipe(
            map((data: ApiPaginatedCollection<Freeze>) => {
                return data.value.map((freeze) => {
                    return new FreezeDisplayView(
                        freeze.dataVersionId,
                        this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate));
                });
            }),
            takeUntil(this.destroy$),
        ).subscribe((snapshots: FreezeDisplayView[]) => {
            this.databaseList = snapshots;
            this.databaseList.unshift(this.currentDatabase);
            this.databaseCtrl.patchValue(this.currentDatabase);
        });
    }

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onSearchContracts();
        }
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    onFirstDataRendered() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    onSearchContracts() {
        this.searchContractReference = this.searchContractForm.get('searchContractReferenceCtrl').value;
        this.searchCharterReference = this.searchContractForm.get('charterReferenceCtrl').value;
        this.contractGridRows = [];
        if (this.counterPartyCtrl.value) {
            this.searchCounterParty = (this.counterPartyCtrl.value as Counterparty).counterpartyCode;
        }
        if (this.databaseCtrl.value) {
            this.searchDatabase = (this.databaseCtrl.value as FreezeDisplayView).dataVersionId.toString();
        }
        let rows: ContractsForBulkFunctions[] = [];
        let contractRows: number = 0;
        let charterRows: number = 0;

        if (!this.searchContractReference) {
            this.contractGridRows = this.totalContractList;
        }
        if (!this.searchCharterReference) {
            this.contractGridRows = this.totalContractList;
        }
        if (!this.searchCounterParty) {
            this.contractGridRows = this.totalContractList;
        }

        if (this.totalContractList && this.totalContractList.length > 0) {
            this.isLoading = true;
            if (this.searchContractReference) {
                this.contractsToEdit = this.totalContractList.filter((item) => item.contractLabel != null);
                rows = this.contractsToEdit.filter((item) =>
                    item.contractLabel.toString().toUpperCase().includes(this.searchContractReference.toUpperCase()));
                contractRows = -1;
            }
            if (this.searchCharterReference) {
                this.contractsToEdit = this.totalContractList.filter((item) => item.charterReference != null);
                rows = this.contractsToEdit.filter((item) =>
                    item.charterReference.toString().toUpperCase().includes(this.searchCharterReference.toUpperCase()));
                charterRows = -1;
            } else if (charterRows === -1) {
                rows = rows.filter((item) => item.charterReference != null);
                rows = rows.filter((item) => item.charterReference.toString().toUpperCase().
                    includes(this.searchCharterReference.toUpperCase()));
            }
            charterRows = -1;
            if (this.searchCounterParty) {
                this.contractsToEdit = this.totalContractList.filter((item) => item.counterparty != null);
                rows = this.contractsToEdit.filter((item) =>
                    item.counterparty.toString().toUpperCase().includes(this.searchCounterParty.toUpperCase()));
            }

            if (this.searchDatabase && this.searchDatabase !== '-1') {
                const databaseField = this.columnConfiguration
                    .find((column) => column.fieldName === 'DataVersionId');
                const filterDatabase = new ListAndSearchFilter();
                filterDatabase.fieldId = databaseField.fieldId;
                filterDatabase.fieldName = databaseField.fieldName;
                filterDatabase.predicate = {
                    filterType: ListAndSearchFilterType.Numeric,
                    operator: 'eq',
                    value1: this.searchDatabase,
                };
                filterDatabase.isActive = true;
                this.filters.push(filterDatabase);
                this.getContractsToEditCost();
            }
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
        this.contractGridRows = rows;
        this.gridApi.setRowData(this.contractGridRows);
        this.dataLength = this.contractGridRows.length;
        this.autoSizeContractsGrid();
        this.isLoading = false;
        (this.contractGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
        this.gridApi.forEachNode((node) => {
            const row = selectedRows.find((data) => data.sectionId === node.data.sectionId);
            if (row) {
                node.setSelected(true);
            }
        });
    }

    getSelectedContracts(): ContractsForBulkFunctions[] {
        this.selectedContractsForBulkEdit = this.gridApi.getSelectedRows();
        return this.selectedContractsForBulkEdit;
    }

    getSelectedContractQuantity() {
        return this.totalQuantity;
    }

    onSelectionChanged(event) {
        this.totalQuantity = 0;
        const selectedRows = this.gridApi.getSelectedRows();
        this.gridApi.forEachNode((node) => {
            if (event.node.isSelected() && event.node.data.sectionId === node.data.sectionId) {
                node.setSelected(true);
            }
        });
        if (event.node.isSelected()) {
            selectedRows.forEach((contract) => {
                this.totalQuantity += contract.quantity;
            });
        }
        this.isContractSelected = selectedRows.length > 0;
        this.contractSelected.emit(this.isContractSelected);
        this.grantLock(Number(event.data.sectionId), event.node);
        this.gridApi.refreshCells(event.data);
    }

    populateCharterList() {
        this.charterDataLoader.getData().subscribe((charter) => {
            this.charters = charter;
            this.filteredCharters = this.charters;
        });
    }

    filterCharterReference(input) {
        this.filteredCharters = this.utilService.filterListforAutocomplete(
            input,
            this.charters,
            ['charterCode', 'description'],
        );
        if (this.charterReferenceCtrl.valid || !this.charterReferenceCtrl.value) {
            this.onSearchContracts();
        }
    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]): void {
        this.filters = filters;
        if (this.bulkActionTypeId === GroupFunctionTypes.Costs) {
            this.getContractsToEditCost();
        }
    }

    grantLock(sectionId: number, node: agGrid.RowNode) {
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
                        this.groupFunctionsGridOptions.api.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        this.subscriptions.push(
                            this.lockService.lockContract(sectionId, LockFunctionalContext.BulkEdition)
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
                this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.BulkEdition)
                    .subscribe(() => {
                        node.setRowSelectable(true);
                        this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                    }));
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

    ngOnDestroy(): void {

        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }));
    }
}
