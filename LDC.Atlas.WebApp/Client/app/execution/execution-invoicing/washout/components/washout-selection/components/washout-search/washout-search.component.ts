import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ListAndSearchFilterDto } from '../../../../../../../shared/dtos/list-and-search/list-and-search-filter-dto.dto';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../../../shared/entities/charter.entity';
import { Counterparty } from '../../../../../../../shared/entities/counterparty.entity';
import { ColumnConfigurationProperties } from '../../../../../../../shared/entities/grid-column-configuration.entity';
import { IsLocked } from '../../../../../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../../../../../../shared/entities/list-and-search/list-and-search-request.entity';
import { LockFunctionalContext } from '../../../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../../../../shared/services/execution/charter-data-loader';
import { ContractsToWashoutInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-washout-invoice';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../../../shared/services/http-services/lock.service';
import { CounterPartyDataLoader } from '../../../../../../../shared/services/masterdata/counterparty-data-loader';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { ExecutionActionsService } from '../../../../../../services/execution-actions.service';
import { FilterSetDisplayComponent } from './../../../../../../../shared/components/filter-set-display/filter-set-display.component';

@Component({
    selector: 'atlas-washout-search',
    templateUrl: './washout-search.component.html',
    styleUrls: ['./washout-search.component.scss'],
    providers: [CounterPartyDataLoader, CharterDataLoader],
})

export class WashoutSearchComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplayComponent') filterSetDisplayComponent: FilterSetDisplayComponent;
    @Output() readonly washoutContractsSelected = new EventEmitter<boolean>();
    @Output() readonly counterPartySelected = new EventEmitter<string>();

    dataLength: number = 0;
    searchForm: FormGroup;
    invoiceType: number;
    company: string;
    isLoading: boolean;
    isContractSelected: boolean = false;
    counterParty: string;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    formatType: string = 'en-US';
    destroy$ = new Subject();

    gridTitle = 'Washout Contracts to Invoice';
    gridCode: string = 'invoiceWashoutSelectionGrid';
    columnConfiguration: ColumnConfigurationProperties[] = [];
    hasGridSharing = false;

    washoutContractGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    washoutContractGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;

    allWashoutContractGridRows: ContractsToWashoutInvoice[];
    washoutContractGridRows: ContractsToWashoutInvoice[];
    washoutContract: ContractsToWashoutInvoice[];
    contractsToInvoice: ContractsToWashoutInvoice[];
    selectedWashoutContracts: ContractsToWashoutInvoice[];
    additionnalColumns = [
        {
            headerName: 'Uninvoiced Quantity',
            field: 'uninvoicedQuantity',
            colId: 'uninvoicedQuantity',
            hide: false,
            valueGetter: this.getUnInvoicedQuantity,
            valueFormatter: this.formatValue.bind(this),
        },
    ];

    filters: ListAndSearchFilter[];
    isConfigLoaded = false;
    searchContractReference: string;
    searchCharterReference: string;
    searchCounterParty: string;
    filteredCounterPartyList: Counterparty[];
    masterdata: MasterData = new MasterData();
    counterPartyCtrl = new AtlasFormControl('CounterPartyWashout');
    filteredCharters: Charter[];
    charters: Charter[];
    charterReferenceCtrl = new AtlasFormControl('CharterRefWashout');
    saveContractRef: string;
    saveCounterparty: string;
    saveCharterReference: string;
    counterPartyControl: Counterparty;
    counterPartyList: Counterparty[];
    charterRefControl: Charter;

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Counter Party not in the list.');
    charterErrorMap: Map<string, string> = new Map();
    count: number = 0;
    savedFilters: ListAndSearchFilter[];

    constructor(private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        protected dialog: MatDialog,
        protected lockService: LockService,
        protected utilService: UtilService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        public counterpartyDataLoader: CounterPartyDataLoader,
        public charterDataLoader: CharterDataLoader,
        public gridService: AgGridService,
        public executionActionsService: ExecutionActionsService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.searchForm = this.formBuilder.group({
            searchContractCtrl: [''],
        });
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.isLoading = true;
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
        this.route.queryParams.subscribe((params) => {
            this.saveContractRef = params['savedContractReference'];
            this.saveCounterparty = params['savedCounterParty'];
            this.saveCharterReference = params['savedCharterReference'];
        });
        if (this.executionActionsService.EditCriteriaRetainFilter && this.executionActionsService.EditCriteriaRetainFilter.length > 0) {
            this.savedFilters = this.executionActionsService.EditCriteriaRetainFilter;
        }
        if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference) {
            if (this.saveContractRef) {
                this.searchForm.controls['searchContractCtrl'].setValue(this.saveContractRef);
            }
            if (this.saveCounterparty) {
                this.counterPartyControl = this.counterPartyList.find((counterParty) =>
                    counterParty.counterpartyCode === this.saveCounterparty);
                this.counterPartyCtrl.patchValue(this.counterPartyControl);
            }
            if (this.saveCharterReference) {
                this.charterRefControl = this.charters.find((charter) =>
                    charter.charterCode === this.saveCharterReference);
                this.charterReferenceCtrl.patchValue(this.charterRefControl);
            }
        }
    }

    populateCharterList() {
        this.charterDataLoader.getData().subscribe((charter) => {
            this.charters = charter;
            this.filteredCharters = this.charters;
        });
    }

    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(param.value);
    }

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onSearchWashoutContractsClicked();
        }
    }
    filterCharterReference(input) {
        this.filteredCharters = this.utilService.filterListforAutocomplete(
            input,
            this.charters,
            ['charterCode', 'description'],
        );
        if (this.charterReferenceCtrl.valid || !this.charterReferenceCtrl.value) {
            this.onSearchWashoutContractsClicked();
        }
    }

    loadGridConfiguration() {
        this.isConfigLoaded = false;
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    onFirstDataRendered(params) {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        this.washoutContractGridColumns = [];
        // selection column
        this.washoutContractGridColumns.push(
            {
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
        
        this.washoutContractGridColumns = this.washoutContractGridColumns.concat(configuration.filter((config) => config.isResult) 
            .map((config) => {
                const columnDef: agGrid.ColDef = {
                    colId: this.utilService.convertToCamelCase(config.fieldName),
                    headerName: config.friendlyName,
                    field: this.utilService.convertToCamelCase(config.fieldName),
                    width: 100,
                    hide: !(config.isVisible && config.isResult),
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
                const numericColumn = numericColumns.find((column) => column === columnDef.field.toLowerCase());
                if (numericColumn) {
                    columnDef.type = 'numericColumn';
                    columnDef.valueFormatter = this.numberFormatter;
                }
                return columnDef;
            }));

        // calculated columns
        this.washoutContractGridColumns = this.washoutContractGridColumns.concat(this.additionnalColumns);

        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
        if (this.washoutContractGridOptions && this.washoutContractGridOptions.api) {
            this.washoutContractGridOptions.columnDefs = this.washoutContractGridColumns;
            this.washoutContractGridOptions.api.setColumnDefs(this.washoutContractGridColumns);
        }
        this.isConfigLoaded = true;
        this.gridApi.refreshView();
    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]): void {
        this.executionActionsService.EditCriteriaRetainFilter = filters;
        this.filters = filters;
        if (this.count === 1) {
            this.filters = this.savedFilters;
            this.savedFilters = null;
            this.count = 0;
        }
        if (this.savedFilters && this.count === 0) {
            if (this.filterSetDisplayComponent) {
                this.count = 1;
                const localFilters: ListAndSearchFilterDto[] = this.savedFilters.map((filter: ListAndSearchFilter) => {
                    return new ListAndSearchFilterDto(filter);
                });
                this.filterSetDisplayComponent.loadFilters(localFilters);
            }
        } else {
            this.loadData();
        }
    }

    loadData(emitResult = false) {
        if (!this.filters) {
            return;
        }
        const filters = this.filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });
        this.isLoading = true;

        const request: ListAndSearchRequest = {
            clauses: { clauses: filters },
        };

        this.executionService.searchWashoutContractsToInvoice(request).pipe(
            takeUntil(this.destroy$),
        ).subscribe((data) => {
            this.isLoading = false;
            this.washoutContract = data.value;
            this.washoutContractGridRows = this.washoutContract.filter((contract) => {
                const washoutContractValue = Number(contract.quantity);
                const washoutContractValueFixes = Number(washoutContractValue.toFixed(3));
                if (washoutContractValueFixes) {
                    return contract;
                }
            });
            this.dataLength = this.washoutContractGridRows.length;
            this.contractsToInvoice = data.value;
            this.allWashoutContractGridRows = this.washoutContractGridRows;
            this.autoSizeContractsGrid();
            if (this.dataLength && this.dataLength > 0) {
                this.counterParty = this.washoutContractGridRows[0].counterparty;
            }
            if (this.filters.length === 0) {
                if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference) {
                    this.onSearchWashoutContractsClicked();
                }
            }
            this.onRowDataChanged(null);
        });
    }

    onSearchWashoutContractsClicked() {
        this.searchContractReference = this.searchForm.get('searchContractCtrl').value;
        if (this.counterPartyCtrl.value === '') {
            this.searchCounterParty = this.counterPartyCtrl.value;
        } else
            if (this.counterPartyCtrl.value) {
                this.searchCounterParty = (this.counterPartyCtrl.value as Counterparty).counterpartyCode;
                if (!this.searchCounterParty) {
                    this.searchCounterParty = this.counterPartyCtrl.value;
                }
            }
        if (this.charterReferenceCtrl.value === '') {
            this.searchCharterReference = this.charterReferenceCtrl.value;
        } else
            if (this.charterReferenceCtrl.value) {
                this.searchCharterReference = (this.charterReferenceCtrl.value as Charter).charterCode;
                if (!this.searchCharterReference) {
                    this.searchCharterReference = this.charterReferenceCtrl.value;
                }
            }
        if (!this.searchContractReference && !this.searchCharterReference && !this.searchCounterParty) {
            this.washoutContractGridRows = this.allWashoutContractGridRows;
            return;
        }
        let rows: ContractsToWashoutInvoice[] = [];
        let contractRows: number = 0;
        let charterRows: number = 0;
        this.filters = [];
        if (this.allWashoutContractGridRows && this.allWashoutContractGridRows.length > 0) {
            this.isLoading = true;
            if (this.searchContractReference) {
                this.contractsToInvoice = this.allWashoutContractGridRows.filter((item) => item.contractReference != null);
                rows = this.contractsToInvoice.filter((item) =>
                    item.contractReference.toString().toUpperCase().includes(this.searchContractReference.toUpperCase()));
                contractRows = -1;
            }
            if (this.searchCharterReference) {
                if (rows.length === 0 && contractRows === 0) {
                    this.contractsToInvoice = this.allWashoutContractGridRows.filter((item) => item.charterReference != null);
                    rows = this.contractsToInvoice.filter((item) =>
                        item.charterReference.toString().toUpperCase().includes(this.searchCharterReference.toUpperCase()));
                } else if (contractRows === -1) {
                    rows = rows.filter((item) => item.charterReference != null);
                    rows = rows.filter((item) => item.charterReference.toString().toUpperCase().
                        includes(this.searchCharterReference.toUpperCase()));
                }
                charterRows = -1;
            }
            if (this.searchCounterParty) {
                if (rows.length === 0 && charterRows === 0 && contractRows === 0) {
                    this.contractsToInvoice = this.allWashoutContractGridRows.filter((item) => item.counterparty != null);
                    rows = this.contractsToInvoice.filter((item) =>
                        item.counterparty.toString().toUpperCase().includes(this.searchCounterParty.toUpperCase()));
                } else {
                    rows = rows.filter((item) => item.counterparty != null);
                    rows = rows.filter((item) => item.counterparty.toString().
                        toUpperCase().includes(this.searchCounterParty.toUpperCase()));
                }
            }
        }
        this.washoutContractGridRows = rows;
        this.dataLength = this.washoutContractGridRows.length;
        this.autoSizeContractsGrid();
        this.isLoading = false;
        if (this.dataLength && this.dataLength > 0) {
            this.counterParty = this.washoutContractGridRows[0].counterparty;
        }
    }

    onGridReady(params) {
        this.washoutContractGridOptions = params;
        if (this.washoutContractGridColumns) {
            this.washoutContractGridOptions.columnDefs = this.washoutContractGridColumns;
            this.washoutContractGridOptions.api.setColumnDefs(this.washoutContractGridColumns);
        }
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi && this.washoutContractGridColumns) {
            const allColumnIds = [];
            this.washoutContractGridColumns.forEach((columnDefs) => {
                allColumnIds.push(columnDefs.field);
            });
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    onGridSizeChanged(params) {
        this.autoSizeContractsGrid();
    }

    getUnInvoicedQuantity(params) {
        if (params.data.quantity - params.data.invoicedQuantity > 0) {
            return params.data.quantity - params.data.invoicedQuantity;
        } else if (params.data.quantity - params.data.invoicedQuantity < 0) {
            return 0;
        }
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    deselectNode(currentRowIndex) {
        this.washoutContractGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                this.washoutContractGridOptions.api.deselectNode(node);
            }
        });
    }

    onSelectionChanged(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        const currentRowIndex = event.rowIndex;
        let valid = true;

        if (selectedRows.length > 1) {
            let currencySelected;
            let counterpartySelected;
            let blDateSelected;
            for (const row of selectedRows) {
                if (!counterpartySelected) {
                    counterpartySelected = row.counterparty;
                }
                if (!currencySelected) {
                    currencySelected = row.currencyCode;
                }
                if (!blDateSelected) {
                    blDateSelected = row.blDate;
                }
                if (currencySelected !== row.currencyCode || counterpartySelected !== row.counterparty) {
                    valid = false;
                    break;
                }
                if (blDateSelected !== row.blDate) {
                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Confirmation of BL Date',
                            text: 'You have selected a contract pair which has a different BL date from the previous selection” Do you wish to update this contract pair with the same BL date? ',
                            okButton: 'Proceed',
                            cancelButton: 'Cancel',
                        },
                    });
                    confirmDialog.afterClosed().subscribe((answer) => {
                        if (!answer) {
                            this.deselectNode(currentRowIndex);
                        }
                    });
                }
            }
        }
        if (!valid) {
            this.snackbarService.informationSnackBar('Currency & Counterparty should be same');
        }
        this.washoutContractGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                if (valid === false) {
                    this.washoutContractGridOptions.api.deselectNode(node);
                }
            }
        });
        this.isContractSelected = selectedRows.length > 0;
        if (this.isContractSelected) {
            this.counterPartySelected.emit(selectedRows[0].counterparty);
            this.washoutContractsSelected.emit(this.isContractSelected);
        }
        this.grantLock(Number(event.data.sectionId), event.node);
        this.selectedWashoutContracts = selectedRows;
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
                        this.washoutContractGridOptions.api.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        this.subscriptions.push(
                            this.lockService.lockContract(sectionId, LockFunctionalContext.WashoutInvoicing).subscribe((lockState) => {
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
                    this.subscriptions.push(
                        this.lockService.unlockContract(sectionId, LockFunctionalContext.WashoutInvoicing).subscribe(() => {
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
        this.washoutContractGridOptions.api.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    numberFormatter(params) {
        if (params && params.value && !isNaN(params.value)) {
            if (params.colDef.colId.toLowerCase() === 'quantity' || params.colDef.colId.toLowerCase() === 'price' ||
                params.colDef.colId.toLowerCase() === 'invoicedquantity') {
                if (params.colDef.colId.toLowerCase() === 'price') {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params.value);
                } else {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params.value);
                }
            }
        }
    }

    onRowDataChanged(params) {
        if (this.counterParty) {
            const counterPartyFilterComponent = this.gridApi.getFilterInstance('counterparty');
            counterPartyFilterComponent.setModel({
                type: 'set',
                values: [this.counterParty],
            });
            this.gridApi.onFilterChanged();
        }
    }
}
