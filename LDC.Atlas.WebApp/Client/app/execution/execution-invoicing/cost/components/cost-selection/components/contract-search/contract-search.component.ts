import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { CostType } from '../../../../../../../shared/entities/cost-type.entity';
import { Counterparty } from '../../../../../../../shared/entities/counterparty.entity';
import { ColumnConfigurationProperties } from '../../../../../../../shared/entities/grid-column-configuration.entity';
import { IsLocked } from '../../../../../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../../../../../../shared/entities/list-and-search/list-and-search-request.entity';
import { LockFunctionalContext } from '../../../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { RateTypes } from '../../../../../../../shared/enums/rate-type.enum';
import { ToleranceTypes } from '../../../../../../../shared/enums/tolerance-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../../../../shared/services/execution/charter-data-loader';
import { ContractsToCostInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../../../shared/services/http-services/lock.service';
import { CostTypeDataLoader } from '../../../../../../../shared/services/masterdata/costType-data-loader';
import { CounterPartyDataLoader } from '../../../../../../../shared/services/masterdata/counterparty-data-loader';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { ExecutionActionsService } from '../../../../../../services/execution-actions.service';
import { ApportionDialogComponent } from '../../../../../dialog-boxes/apportion-dialog/apportion-dialog.component';
import { AtlasNumber } from './../../../../../../..//shared/entities/atlas-number.entity';
import { FilterSetDisplayComponent } from './../../../../../../../shared/components/filter-set-display/filter-set-display.component';

@Component({
    selector: 'atlas-contract-search',
    templateUrl: './contract-search.component.html',
    styleUrls: ['./contract-search.component.scss'],
    providers: [CostTypeDataLoader, CounterPartyDataLoader, CharterDataLoader],
})
export class ContractSearchComponent extends BaseFormComponent implements OnInit, OnDestroy {

    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplayComponent') filterSetDisplayComponent: FilterSetDisplayComponent;
    @Output() readonly supplier = new EventEmitter<any>();
    @Output() readonly costContractsSelected = new EventEmitter<boolean>();

    isLoading: boolean;

    dataLength: number = 0;
    searchForm: FormGroup;
    totalQuantity: number = 0;
    invoiceType: number;
    company: string;
    componentId: string = 'costInvoiceContract';
    searchTerm: string;
    searchCostTerm: string;
    searchSupplierTerm: string;
    searchCharterTerm: string;
    differentCommoditySelected: boolean;
    isContractSelected: boolean = false;
    isApportionDisable: boolean = true;
    supplierSelected: string;
    tolerancePercentage: number;
    saveContractRef: string;
    saveCounterparty: string;
    saveCharterReference: string;
    saveCost: string;
    counterParty: string;
    rateType: RateTypes;
    isApportion: boolean = true;
    totalInvocieValue: number = 0;
    isCostAmountChanged: boolean = true;
    rowSelected: boolean = false;

    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];

    decimalOptionValue: number = 2;
    formatType: string = 'en-US';

    gridTitle = 'Cost Contracts to Invoice';
    gridCode: string = 'invoiceCostSelectionGrid';
    columnDefs: agGrid.ColDef[];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    hasGridSharing = false;
    costContractGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    contractsToInvoice: ContractsToCostInvoice[];
    contractsToInvoiceRow: ContractsToCostInvoice[];
    allContracts: ContractsToCostInvoice[];
    selectedCostContracts: ContractsToCostInvoice[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    costTypeCtrl = new AtlasFormControl('CostType');
    filteredcostTypes: CostType[];
    costControl: CostType;
    costList: CostType[];
    filteredSupplier: Counterparty[];
    counterPartyList: Counterparty[];
    counterPartyControl: Counterparty;
    masterdata: MasterData = new MasterData();
    supplierCodeCtrl = new AtlasFormControl('Supplier');
    charterReferenceCtrl = new AtlasFormControl('CharterRef');
    filteredCharters: Charter[];
    charterRefControl: Charter;
    charters: Charter[];
    filters: ListAndSearchFilter[];
    destroy$ = new Subject();
    costIds: string[] = [];
    selectedCostIds: string;
    totalCostAmount: number = 0;
    currencyCodeSelected: string;

    additionnalColumns = [
        {
            headerName: 'Cost Amount',
            field: 'costAmount',
            colId: 'costAmount',
            valueGetter: this.calculateCostAmount.bind(this),
            valueFormatter: this.formatValue.bind(this),
            type: 'numericColumn',
            hide: false,
        },
        {
            headerName: 'Cost Amount to Invoice',
            field: 'costAmountToInvoice',
            colId: 'costAmountToInvoice',
            type: 'numericColumn',
            editable: this.isGridEditable.bind(this),
            valueSetter: this.setCostAmountToInvoice.bind(this),
            valueFormatter: this.formatValue.bind(this),
            hide: false,
        },
        {
            headerName: '%Invoiced',
            field: 'invoicePercent',
            colId: 'invoicePercent',
            valueSetter: this.setInvoicePercent.bind(this),
            valueFormatter: this.formatValue.bind(this),
            type: 'numericColumn',
            hide: false,
            editable: this.onRowSelectionChanged.bind(this),
        },
        {
            headerName: 'Contract Quantity',
            field: 'quantity',
            colId: 'quantity',
            hide: false,
            editable: true,
            type: 'numericColumn',
            valueSetter: this.setContractQuantity.bind(this),
            onCellValueChanged: this.onQuantityChanged.bind(this),

        },
    ];

    costTypeErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Cost Type not in the list.');

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Supplier not in the list.');

    charterErrorMap: Map<string, string> = new Map();
    count: number = 0;
    savedFilters: ListAndSearchFilter[];

    constructor(private formBuilder: FormBuilder, private executionService: ExecutionService,
        private route: ActivatedRoute, private snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        protected dialog: MatDialog,
        protected lockService: LockService,
        public costTypeDataLoader: CostTypeDataLoader,
        public counterpartyDataLoader: CounterPartyDataLoader,
        protected utilService: UtilService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
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

    populateCharterList() {
        this.charterDataLoader.getData().subscribe((charter) => {
            this.charters = charter;
            this.filteredCharters = this.charters;
        });
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data['masterdata'] as MasterData;
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.route.queryParams.subscribe((params) => {
            this.selectedCostIds = params['costIds'];
        });
        this.filteredcostTypes = this.masterdata.costTypes;
        this.filteredSupplier = this.masterdata.counterparties;
        this.counterPartyList = this.filteredSupplier;
        this.costList = this.filteredcostTypes;
        this.costTypeCtrl.valueChanges.subscribe((input) => {
            this.filterCostTypes(input);
        });
        this.supplierCodeCtrl.valueChanges.subscribe((input) => {
            this.filterSupplier(input);
        });
        this.populateCharterList();
        this.charterReferenceCtrl.valueChanges.subscribe((input) => {
            this.filterCharterReference(input);
        });
        this.loadGridConfiguration();

        this.route.queryParams.subscribe((params) => {
            this.saveContractRef = params['savedContractRefCost'];
            this.saveCounterparty = params['savedCounterPartyCost'];
            this.saveCharterReference = params['savedCharterRefCost'];
            this.saveCost = params['savedCost'];
        });
        if (this.executionActionsService.EditCriteriaRetainFilter && this.executionActionsService.EditCriteriaRetainFilter.length > 0) {
            this.savedFilters = this.executionActionsService.EditCriteriaRetainFilter;
        }
        if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference || this.saveCost) {
            if (this.saveContractRef) {
                this.searchForm.controls['searchContractCtrl'].setValue(this.saveContractRef);
            }
            if (this.saveCounterparty) {
                this.counterPartyControl = this.counterPartyList.find((counterParty) =>
                    counterParty.counterpartyCode === this.saveCounterparty);
                this.supplierCodeCtrl.patchValue(this.counterPartyControl);
            }
            if (this.saveCharterReference) {
                this.charterRefControl = this.charters.find((charter) =>
                    charter.charterCode === this.saveCharterReference);
                this.charterReferenceCtrl.patchValue(this.charterRefControl);
            }
            if (this.saveCost) {
                this.costControl = this.costList.find((cost) =>
                    cost.costTypeCode === this.saveCost);
                this.costTypeCtrl.patchValue(this.costControl);
            }
        }

    }

    onRowSelectionChanged(event): boolean {
        if (event.data.invoicePercent > 0 && event.data.invoicePercent <= 100) {
            this.rowSelected = true;
            return this.rowSelected;
        } else {
            this.rowSelected = false;
            return this.rowSelected;
        }
    }

    setContractQuantity(params) {
        let validQuantity = true;

        if (params && params.data) {
            if (params.newValue > params.data.quantityToInvoice) {
                validQuantity = false;
                params.data.quantity = Number(params.oldValue);

            } else {
                params.data.quantity = Number(params.newValue);
            }

            if (!validQuantity) {
                this.snackbarService.informationSnackBar('Quantity cannot be greater than contract quantity');
            }
            return true;
        }
    }

    onQuantityChanged(params) {
        if (params && params.data) {
            const invoicePercercentage = (100 * params.newValue) / params.oldValue;

            params.data.invoicePercent = (params.data.invoicePercent * invoicePercercentage) / 100;
            params.data.costAmount = (params.data.costAmount * invoicePercercentage) / 100;
            params.data.costAmountToInvoice = (params.data.costAmountToInvoice * invoicePercercentage) / 100;
            if (this.gridApi) {
                this.gridApi.refreshCells(params.data);
            }
        }
    }

    filterCostTypes(input) {
        this.filteredcostTypes = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.costTypes,
            ['costTypeCode', 'name'],
        );

        if (this.costTypeCtrl.valid || !this.costTypeCtrl.value.costTypeCode) {
            this.onSearchCostContracts();
        }
    }

    filterSupplier(input) {
        this.filteredSupplier = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.supplierCodeCtrl.valid || !this.supplierCodeCtrl.value) {
            this.onSearchCostContracts();
        }
    }

    filterCharterReference(input) {
        this.filteredCharters = this.utilService.filterListforAutocomplete(
            input,
            this.charters,
            ['charterCode', 'description'],
        );
        if (this.charterReferenceCtrl.valid || !this.charterReferenceCtrl.value) {
            this.onSearchCostContracts();
        }
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    isGridEditable(params) {
        // cannot edit the column, if row is not selected
        return params.node.selected;
    }

    onFirstDataRendered(params) {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
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

        this.columnDefs = this.columnDefs.concat(configuration.filter((config) => config.isResult)
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
        this.columnDefs = this.columnDefs.concat(this.additionnalColumns);

        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
        if (this.costContractGridOptions) {
            this.costContractGridOptions.columnDefs = this.columnDefs;
        }
    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]) {
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

        this.executionService.searchContractsForCostInvoice(request).pipe(
            takeUntil(this.destroy$),
        ).subscribe((data) => {
            this.isLoading = false;
            if (this.selectedCostIds) {
                if (this.selectedCostIds.toString().includes(',')) {
                    this.costIds = this.selectedCostIds.toString().split(',');
                    if (this.costIds && this.costIds.length > 0) {
                        const costContracts: ContractsToCostInvoice[] = [];
                        this.costIds.forEach((costId) => {
                            data.value.forEach((contract) => {
                                if (Number(costId) === contract.costId && contract) {
                                    costContracts.push(contract);
                                }
                            });
                        });
                        this.contractsToInvoice = costContracts;
                    }
                } else {
                    this.contractsToInvoice = data.value.filter((contract) =>
                        contract.costId === Number(this.selectedCostIds));
                }
            } else {
                this.contractsToInvoice = data.value;
            }
            this.allContracts = this.contractsToInvoice;
            this.gridApi.hideOverlay();
            this.gridColumnApi.autoSizeAllColumns();
            if (this.filters.length === 0) {
                if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference || this.saveCost) {
                    this.onSearchCostContracts();
                }
            }
        });
    }

    onGridReady(params) {
        params.columnDefs = this.columnDefs;
        this.costContractGridOptions = params;

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridColumnApi.autoSizeAllColumns();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    onGridSizeChanged(params) {
        this.autoSizeContractsGrid();
    }

    setCostAmountToInvoice(params): boolean {
        params.data.costAmountToInvoice = Number(params.newValue);
        if (params.newValue <= 0 || !params.data.costAmountToInvoice) {
            this.snackbarService.informationSnackBar('0 or negative cost cannot be invoiced');
            params.data.costAmountToInvoice = params.data.costAmount;
        } else {
            const tolerance: number = this.tolerancePercentage * 100;
            if (this.tolerancePercentage !== ToleranceTypes.Percentage) {
                const minToleranceBand: number = params.data.costAmount -
                    (params.data.costAmount * this.tolerancePercentage);
                const maxToleranceBand: number = params.data.costAmount +
                    (params.data.costAmount * this.tolerancePercentage);
                if (params.newValue < minToleranceBand || params.newValue > maxToleranceBand) {
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Tolerance Information',
                            text: 'Cost Amount to Invoice is greater/less than ' + tolerance + '% – than the cost originally estimated',
                            okButton: 'Ok',
                        },
                    });
                }
            }
        }
        this.calculateTotalCost();
        return true;
    }

    calculateTotalCost() {
        this.totalCostAmount = 0;
        this.totalQuantity = 0;
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows && selectedRows.length > 0) {
            this.currencyCodeSelected = selectedRows[0].currencyCode;
            selectedRows.forEach(
                (selectedContract) => {
                    this.totalCostAmount += selectedContract.costAmountToInvoice;
                },
            );
        }
    }
    calculateCostAmount(params) {
        if (this.isCostAmountChanged) {
            if (params.data.rateTypeCode === RateTypes[RateTypes.Amount]) {
                params.data.costAmount = params.data.rate;
            } else if (params.data.rateTypeCode === RateTypes[RateTypes.Percent]) {
                params.data.costAmount = (Number(params.data.quantity) * params.data.price *
                    (params.data.rate / 100) * params.data.priceConversionFactor * params.data.weightConversionFactor);
            } else if (params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
                params.data.costAmount =
                    Number(params.data.quantity) * params.data.rateConversionFactor * (params.data.weightConversionFactor) * params.data.rate;
            }
        }
        return params.data.costAmount;
    }

    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(param.value);
    }

    onSearchCostContracts() {
        this.searchTerm = this.searchForm.get('searchContractCtrl').value;
        this.searchCostTerm = (this.costTypeCtrl.value as CostType).costTypeCode;
        this.searchSupplierTerm = (this.supplierCodeCtrl.value as Counterparty).counterpartyCode;
        this.searchCharterTerm = (this.charterReferenceCtrl.value as Charter).charterCode;
        let rows: ContractsToCostInvoice[] = [];
        let contractRows: number = 0;
        let charterRows: number = 0;
        let costRows: number = 0;
        if ((!this.searchTerm || this.searchTerm === '') && (!this.searchCostTerm || this.searchCostTerm === '')
            && (!this.searchCharterTerm || this.searchCharterTerm === '')
            && (!this.searchSupplierTerm || this.searchSupplierTerm === '')) {
            return;
        } else {
            this.isLoading = true;
            this.filters = [];
            // added check to avoid runtime error with Array.Find
            if (this.allContracts.length > 0) {
                // sanity check to confirm corresponding fields in array is not null
                this.contractsToInvoice = this.allContracts;

                if (this.searchTerm) {
                    this.contractsToInvoice = this.allContracts.filter((item) => item.contractReference != null);
                    rows = this.contractsToInvoice.filter((item) =>
                        item.contractReference.toString().toUpperCase().includes(this.searchTerm.toUpperCase()));
                    contractRows = -1;
                }
                if (this.searchCharterTerm) {
                    if (rows.length === 0 && contractRows === 0) {
                        this.contractsToInvoice = this.allContracts.filter((item) => item.charterReference != null);
                        rows = this.contractsToInvoice.filter((item) =>
                            item.charterReference.toString().toUpperCase().includes(this.searchCharterTerm.toUpperCase()));
                    } else if (contractRows === -1) {
                        rows = rows.filter((item) => item.charterReference != null);
                        rows = rows.filter((item) => item.charterReference.toString().toUpperCase().
                            includes(this.searchCharterTerm.toUpperCase()));
                    }
                    charterRows = -1;
                }
                if (this.searchCostTerm) {
                    if (rows.length === 0 && charterRows === 0 && contractRows === 0) {
                        this.contractsToInvoice = this.allContracts.filter((item) => item.costTypeCode != null);
                        rows = this.contractsToInvoice.filter((item) =>
                            item.costTypeCode.toString().toUpperCase().includes(this.searchCostTerm.toUpperCase()));
                    } else {
                        rows = rows.filter((item) => item.costTypeCode != null);
                        rows = rows.filter((item) => item.costTypeCode.toString().toUpperCase().
                            includes(this.searchCostTerm.toUpperCase()));
                    }
                    costRows = -1;
                }
                if (this.searchSupplierTerm) {
                    if (rows.length === 0 && charterRows === 0 && contractRows === 0 && costRows === 0) {
                        this.contractsToInvoice = this.allContracts.filter((item) => item.supplierCode != null);
                        rows = this.contractsToInvoice.filter((item) =>
                            item.supplierCode.toString().toUpperCase().includes(this.searchSupplierTerm.toUpperCase()));
                    } else {
                        rows = rows.filter((item) => item.supplierCode != null);
                        rows = rows.filter((item) => item.supplierCode.toString().toUpperCase().
                            includes(this.searchSupplierTerm.toUpperCase()));
                    }
                }
            }
            this.contractsToInvoice = rows;
            this.dataLength = this.contractsToInvoice.length;
            this.autoSizeContractsGrid();
            this.isLoading = false;
            (this.contractsToInvoice) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
        }
    }

    onSelectionChanged(event) {
        const invoicedPercentage: number = 100;
        const selectedNodes: agGrid.RowNode[] = this.gridApi.getSelectedNodes();
        const selectedNodesToApprotionEnabled: ContractsToCostInvoice[] = this.gridApi.getSelectedRows();
        const currentRowIndex = event.rowIndex;
        this.totalQuantity = 0;

        // calculate total quantity for the selected nodes
        if (selectedNodes) {
            const selectedSectionIds = selectedNodes.map((item) => item.data.sectionId).
                filter((value, index, self) => self.indexOf(value) === index);
            if (selectedSectionIds && selectedSectionIds.length > 0) {
                for (const val of selectedSectionIds) {
                    this.totalQuantity += selectedNodes.filter((item) => item.data.sectionId === val)[0].data.quantity;
                }
            }
        }
        this.isApportionDisable = true;
        this.isApportion = true;

        if (selectedNodes.length === 0) {
            this.selectSupplier(null, false);
        } else if (selectedNodes.length === 1) {
            if (selectedNodes[0].data.supplierCode && !this.supplierSelected) {
                this.supplierSelected = selectedNodes[0].data.supplierCode;
            }
            this.selectSupplier(this.supplierSelected);

        } else if (selectedNodes.length > 1) {
            let valid = true;
            let currencySelected;
            let costDirection: string;
            let costTypeCode: string;
            this.isApportionDisable = false;

            for (const node of selectedNodes) {
                if (!currencySelected) {
                    currencySelected = node.data.currencyCode;
                }
                if (currencySelected !== node.data.currencyCode) {
                    valid = false;
                    break;
                }
                if (!costDirection && node.data) {
                    costDirection = node.data.costDirection;
                }
                if (!costTypeCode && node.data) {
                    costTypeCode = node.data.costTypeCode;
                }
                if (node.data && ((costDirection !== node.data.costDirection)
                    || (costTypeCode !== node.data.costTypeCode))) {
                    this.isApportion = false;
                }
            }
            if (!valid) {
                this.snackbarService.informationSnackBar('Different currency types cannot be invoiced together');
                this.deselectNode(currentRowIndex);
            }
            if (valid && !this.supplierSelected) {
                for (const node of selectedNodes) {
                    if (!this.supplierSelected) {
                        this.supplierSelected = node.data.supplierCode;
                        this.selectSupplier(this.supplierSelected);
                    }
                }
            }
        }
        if (event.node.isSelected()) {
            if (event.node) {
                if (!event.node.data.costAmount) {
                    event.node.data.costAmountToInvoice = this.calculateCostAmountOnSelection(event.node.data)
                        - (event.node.data.invoicedAmount);
                    this.gridApi.refreshCells(event.data);
                } else {
                    const unInvoicedAmount = event.node.data.costAmount - event.node.data.invoicedAmount;
                    event.node.data.costAmountToInvoice = (unInvoicedAmount > 0) ? unInvoicedAmount : 0;
                    this.gridApi.refreshCells(event.data);
                }
                if (!event.node.data.invoicedPercentage) {
                    event.node.data.invoicePercent = invoicedPercentage;
                } else if (event.node.data.invoicedPercentage > 0 && event.node.data.invoicedPercentage < 100) {
                    event.node.data.invoicePercent = invoicedPercentage - event.node.data.invoicedPercentage;
                }
            }

            const currentSupplierNode = event.node.data.supplierCode;
            if ((this.supplierSelected !== currentSupplierNode) && currentSupplierNode) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Confirmation of Supplier',
                        text: 'You have selected an estimate line which is different to Previous Supplier. ' +
                            'Do you wish to update this estimate with the same supplier ? ',
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
            this.gridApi.refreshCells();
        } else {
            event.data.costAmountToInvoice = null;
            event.data.invoicePercent = event.data.invoicedPercentage;
            event.data.quantity = event.data.quantityToInvoice;
            this.gridApi.refreshCells(event.data);
        }
        this.calculateTotalCost();
        this.isContractSelected = selectedNodes.length > 0;
        this.costContractsSelected.emit(this.isContractSelected);
        this.grantLock(Number(event.data.sectionId), event.node);
        this.selectedCostContracts = selectedNodes.map((node) => node.data);
    }

    calculateCostAmountOnSelection(contract) {
        if (contract.rateTypeCode === RateTypes[RateTypes.Amount]) {
            contract.costAmount = contract.rate;
        } else if (contract.rateTypeCode === RateTypes[RateTypes.Percent]) {
            contract.costAmount = (Number(contract.quantity) * contract.price *
                (contract.rate / 100) * contract.weightConversionFactor * contract.priceConversionFactor);
        } else if (contract.rateTypeCode === RateTypes[RateTypes.Rate]) {
            contract.costAmount =
                Number(contract.quantity) * contract.rateConversionFactor * (contract.weightConversionFactor) * contract.rate;
        }
        return contract.costAmount;
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
                        this.costContractGridOptions.api.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        this.subscriptions.push(this.lockService.lockContract(sectionId, LockFunctionalContext.CostInvoicing)
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
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.CostInvoicing)
                        .subscribe(() => {
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
        this.costContractGridOptions.api.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    deselectNode(currentRowIndex) {
        this.costContractGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                this.costContractGridOptions.api.deselectNode(node);
                node.data.costAmountToInvoice = null;
                node.data.invoicePercent = null;
            }
        });
    }

    selectSupplier(supplierSelected, isLineSelected = true) {
        this.supplier.emit({
            supplierSelected,
            isLineSelected,
        });
        this.supplierSelected = supplierSelected;
    }
    setTolerancePercentage(tolerancePercentage) {
        this.tolerancePercentage = tolerancePercentage;
    }

    // Commenting this until the counterparty/supplier filter is completely developed
    // onRowDataChanged(params) {
    //     if (this.counterParty) {
    //         const counterPartyFilterComponent = this.gridApi.getFilterInstance('supplierCode');
    //         counterPartyFilterComponent.setModel({
    //             type: 'set',
    //             values: [this.counterParty],
    //         });
    //         this.gridApi.onFilterChanged();
    //     }
    // }

    numberFormatter(params) {
        if (params && params.value && !isNaN(params.value)) {
            if (params.colDef.colId.toLowerCase() === 'quantity' || params.colDef.colId.toLowerCase() === 'rate') {
                if (params.colDef.colId.toLowerCase() === 'rate') {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params.value);
                } else {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params.value);
                }
            }
        }
    }

    onApportionButtonClicked() {
        if (this.isApportion) {
            this.getTotalQuantityAndTotalInvoiceValue();
            const openApportiontDialog = this.dialog.open(ApportionDialogComponent, {
                width: '40%',
                height: '60%',
                data: {
                    selectedRows: this.selectedCostContracts,
                    totalQuantity: this.totalQuantity,
                    totalInvoiceValue: this.totalInvocieValue,
                },

            });

            openApportiontDialog.afterClosed().subscribe((updatedCostContracts: ContractsToCostInvoice[]) => {
                this.updateSelectedCostRows(updatedCostContracts);
                this.isCostAmountChanged = false;
            });
        } else {
            this.snackbarService.informationSnackBar('Apportion Cannot be done for multiple costs types or if there is a mix of Pay/Rec');
        }
    }

    setInvoicePercent(params): boolean {
        if (params.newValue <= 0 || !params.data.invoicePercent) {
            this.snackbarService.informationSnackBar('Invoice Percentage cannot be 0 or negative');
            params.data.invoicePercent = params.oldValue < 1 ? 1 : params.oldValue;
        } else if (params.newValue > 100) {
            this.snackbarService.informationSnackBar('Invoice Percentage cannot be greater than 100');
            params.data.invoicePercent = params.oldValue < 100 ? params.oldValue : 100;
        } else if ((params.newValue > params.oldValue)) {
            this.snackbarService.informationSnackBar('Invoice Percentage cannot be greater available percentage');
            params.data.invoicePercent = params.oldValue;
        } else {
            params.data.invoicePercent = params.newValue;
        }
        return true;
    }

    getTotalQuantityAndTotalInvoiceValue() {
        this.totalQuantity = 0;
        this.totalInvocieValue = 0;
        if (this.selectedCostContracts) {
            this.selectedCostContracts.forEach((costContract) => {
                this.totalQuantity += Number(costContract.quantity);
                this.totalInvocieValue += costContract.costAmountToInvoice;
            });
        }
    }

    updateSelectedCostRows(updatedCostContracts: ContractsToCostInvoice[]) {
        if (updatedCostContracts) {
            this.gridApi.updateRowData({ update: updatedCostContracts });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }));
    }

    formatQuantityAndTotal(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
                                                     {                                          minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }
}
