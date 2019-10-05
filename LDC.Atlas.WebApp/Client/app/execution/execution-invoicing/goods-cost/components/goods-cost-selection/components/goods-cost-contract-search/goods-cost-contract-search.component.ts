import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { finalize } from 'rxjs/operators';
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
import { LockFunctionalContext } from '../../../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ContractTypes } from '../../../../../../../shared/enums/contract-type.enum';
import { InvoiceTypes } from '../../../../../../../shared/enums/invoice-type.enum';
import { ListAndSearchFilterType } from '../../../../../../../shared/enums/list-and-search-filter-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../../../../shared/services/execution/charter-data-loader';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
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
    selector: 'atlas-goods-cost-contract-search',
    templateUrl: './goods-cost-contract-search.component.html',
    styleUrls: ['./goods-cost-contract-search.component.scss'],
    providers: [CounterPartyDataLoader, CharterDataLoader],
})
export class GoodsCostContractSearchComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplayComponent') filterSetDisplayComponent: FilterSetDisplayComponent;

    @Output() readonly commoditySelected = new EventEmitter<{ differentCommoditySelected: boolean, differentPricesSelected: boolean }>();
    @Output() readonly contractsSelected = new EventEmitter<boolean>();
    invoiceContractGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    invoiceContractGridColumns: agGrid.ColDef[];
    invoiceContractGridRows: ContractsToInvoice[];
    contractsToInvoice: ContractsToInvoice[];
    allContracts: ContractsToInvoice[];
    selectedContractsToInvoice: ContractsToInvoice[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    searchTerm: string;
    dataLength: number = 0;
    searchContractForm: FormGroup;
    totalQuantity: number = 0;
    invoiceType: number;
    company: string;
    formatType: string = 'en-US';
    // componentId: string = 'invoiceContract';
    decimalOptionValue: number = 3;
    savedSearchTerm: string;
    differentCommoditySelected: boolean;
    isContractSelected: boolean = false;
    counterParty: string;
    isBusinessSectorPostingProcess: boolean = false;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    gridCode: string;
    filters: ListAndSearchFilter[];
    differentPricesSelected: boolean;
    hasGridSharing = false;
    columnDefs: agGrid.ColDef[];
    additionnalColumns = [
        {
            headerName: 'Uninvoiced Quantity',
            field: 'uninvoicedQuantity',
            colId: 'uninvoicedQuantity',
            type: 'numericColumn',
            hide: false,
            valueGetter: this.getUnInvoicedQuantity,
            valueFormatter: this.formatValue.bind(this),
        },
        {
            headerName: 'Quantity to invoice',
            field: 'quantityToInvoice',
            colId: 'quantityToInvoice',
            type: 'numericColumn',
            hide: false,
            editable: this.isQuantityToInvoiceEditable.bind(this),
            valueSetter: this.setQuantityToInvoice.bind(this),
            valueFormatter: this.formatValue.bind(this),
        },
    ];
    saveContractRef: string;
    saveCounterparty: string;
    saveCharterReference: string;
    counterPartyControl: Counterparty;
    counterPartyList: Counterparty[];
    searchCounterPartyTerm: string;
    searchCharterTerm: string;
    charterRefControl: Charter;
    filteredCounterPartyList: Counterparty[];
    masterdata: MasterData = new MasterData();
    counterPartyCtrl = new AtlasFormControl('CounterPartyGoodsCost');
    filteredCharters: Charter[];
    charters: Charter[];
    charterReferenceCtrl = new AtlasFormControl('CharterRefGoodsCost');

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Counter Party not in the list.');
    charterErrorMap: Map<string, string> = new Map();
    agGridOptions: agGrid.GridOptions;
    count: number = 0;
    savedFilters: ListAndSearchFilter[];

    constructor(private formBuilder: FormBuilder, private executionService: ExecutionService,
        private route: ActivatedRoute, private snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        protected lockService: LockService,
        protected dialog: MatDialog,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected utilService: UtilService,
        public counterpartyDataLoader: CounterPartyDataLoader,
        public charterDataLoader: CharterDataLoader,
        private agGridService: AgGridService,
        public gridService: AgGridService,
        public executionActionsService: ExecutionActionsService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.searchContractForm = this.formBuilder.group({
            searchContractReferenceCtrl: [''],
        });
    }

    ngOnInit() {
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.isLoading = true;
        this.gridCode = this.invoiceType === InvoiceTypes.GoodsCostPurchase ? 'invoicePurcGoodsSelectionGrid' : 'invoiceSaleGoodsSelectionGrid'
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
                this.searchContractForm.controls['searchContractReferenceCtrl'].setValue(this.saveContractRef);
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
        this.getBusinessSectorConfiguration();
        if (this.agGridOptions) {
            this.agGridService.sizeColumns(this.agGridOptions);
        }
    }
    getBusinessSectorConfiguration() {
        this.executionService.getBusinessSectorForPosting()
            .subscribe((data) => {
                if (data) {
                    this.isBusinessSectorPostingProcess = data.businessSectorNominalPostingPurpose;
                }
            });
    }

    populateCharterList() {
        this.charterDataLoader.getData().subscribe((charter) => {
            this.charters = charter;
            this.filteredCharters = this.charters;
        });
    }

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onSearchButtonClicked();
        }
    }
    filterCharterReference(input) {
        this.filteredCharters = this.utilService.filterListforAutocomplete(
            input,
            this.charters,
            ['charterCode', 'description'],
        );
        if (this.charterReferenceCtrl.valid || !this.charterReferenceCtrl.value) {
            this.onSearchButtonClicked();
        }
    }

    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(param.value);
    }

    onGridReady(params) {
        params.columnDefs = this.invoiceContractGridColumns;
        this.invoiceContractGridOptions = params;

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridColumnApi.autoSizeAllColumns();
        this.agGridOptions = params;
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    onGridSizeChanged(params) {
        this.autoSizeContractsGrid();
        this.gridColumnApi.autoSizeAllColumns();
    }

    getUnInvoicedQuantity(params) {
        if (params.data.contractQuantity - params.data.invoicedQuantity > 0) {
            return params.data.contractQuantity - params.data.invoicedQuantity;
        } else if (params.data.contractQuantity - params.data.invoicedQuantity < 0) {
            return 0;
        }
    }

    setQuantityToInvoice(params) {
        if (params) {
            let validQuantity = true;
            let invalidValue = true;
            if (params.newValue > (params.data.contractQuantity - params.data.invoicedQuantity)) {
                validQuantity = false;
                params.data.quantityToInvoice = (params.data.contractQuantity - params.data.invoicedQuantity);
            } else if (params.newValue <= 0) {
                invalidValue = false;
                params.data.quantityToInvoice = (params.data.contractQuantity - params.data.invoicedQuantity);
            } else {
                params.data.quantityToInvoice = Number(params.newValue);
            }

            if (!validQuantity) {
                this.snackbarService.informationSnackBar('Quantity cannot be greater than uninvoiced quantity');
            }
            if (!invalidValue) {
                this.snackbarService.informationSnackBar('Quantity cannot be zero or negative');
            }
        } else {
            return false;
        }
        return true;
    }

    getContractsToInvoice() {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration.length > 0 && this.columnConfiguration) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            let contractType;

            if (this.invoiceType === InvoiceTypes.GoodsCostPurchase) {
                contractType = ContractTypes.Purchase;
            } else if (this.invoiceType === InvoiceTypes.GoodsCostSales) {
                contractType = ContractTypes.Sale;
            }

            const contractTypeCodeColumn = this.columnConfiguration
                .find((column) => column.fieldName === 'ContractTypeCode');
            if (this.invoiceType && contractTypeCodeColumn && ContractTypes[contractType]) {
                const filterContractType = new ListAndSearchFilter();
                filterContractType.fieldId = contractTypeCodeColumn.fieldId;
                filterContractType.fieldName = contractTypeCodeColumn.fieldName;
                filterContractType.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: ContractTypes[contractType],
                };
                filterContractType.isActive = true;
                filters.push(filterContractType);
            }
            if (this.invoiceType === InvoiceTypes.GoodsCostPurchase) {
                this.executionService.searchContractsToPurchaseInvoiceForCommercial(filters)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        }),
                    )
                    .subscribe((data) => {
                        this.contractsToInvoice = data;
                        this.getData();
                    });
            }
            else if (this.invoiceType === InvoiceTypes.GoodsCostSales) {
                this.executionService.searchContractsToSaleInvoiceForCommercial(filters)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        }),
                    )
                    .subscribe((data) => {
                        this.contractsToInvoice = data;
                        this.getData();
                    });
            }
        }
    }

    getData() {
        this.invoiceContractGridRows = this.contractsToInvoice.filter((contract) =>
            (contract.contractQuantity - contract.invoicedQuantity) > 0);
        this.allContracts = this.invoiceContractGridRows;
        this.dataLength = this.invoiceContractGridRows.length;
        // this.autoSizeContractsGrid();
        if (this.dataLength && this.dataLength > 0) {
            this.counterParty = this.invoiceContractGridRows[0].counterparty;
        }
        if (this.filters.length === 0) {
            if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference) {
                this.onSearchButtonClicked();
            }
        }
    }

    onSearchButtonClicked() {
        this.searchTerm = this.searchContractForm.get('searchContractReferenceCtrl').value;
        if (this.counterPartyCtrl.value === '') {
            this.searchCounterPartyTerm = this.counterPartyCtrl.value;
        } else
            if (this.counterPartyCtrl.value) {
                this.searchCounterPartyTerm = (this.counterPartyCtrl.value as Counterparty).counterpartyCode;
                if (!this.searchCounterPartyTerm) {
                    this.searchCounterPartyTerm = this.counterPartyCtrl.value;
                }
            }
        if (this.charterReferenceCtrl.value === '') {
            this.searchCharterTerm = this.charterReferenceCtrl.value;
        } else {
            if (this.charterReferenceCtrl.value) {
                this.searchCharterTerm = (this.charterReferenceCtrl.value as Charter).charterCode;
                if (this.searchCharterTerm) {
                    this.searchCharterTerm = this.charterReferenceCtrl.value;
                }
            }
        }
        if (!this.searchTerm && !this.searchCharterTerm && !this.searchCounterPartyTerm) {
            this.invoiceContractGridRows = this.allContracts;
        } else {
            this.isLoading = true;

            // added check to avoid runtime error with Array.Find
            if (this.allContracts && this.allContracts.length > 0) {
                this.contractsToInvoice = this.allContracts;
                this.filters = [];
                if (this.searchTerm && !(this.searchTerm === '')) {
                    this.contractsToInvoice = this.contractsToInvoice.filter((item) =>
                        item.contractReference.toString().toUpperCase().includes(this.searchTerm.toUpperCase()));
                }
                if (this.searchCharterTerm && !(this.searchCharterTerm === '')) {
                    const charterValue = (this.charterReferenceCtrl.value as Charter).charterCode;
                    if (charterValue) {
                        this.contractsToInvoice = this.contractsToInvoice.filter((item) => item.charter != null);
                        this.contractsToInvoice = this.contractsToInvoice.filter((item) =>
                            item.charter.toString().toUpperCase().includes(charterValue.toUpperCase()));
                    }
                }
                if (this.searchCounterPartyTerm && !(this.searchCounterPartyTerm === '')) {
                    this.contractsToInvoice = this.contractsToInvoice.filter((item) => item.counterparty != null);
                    this.contractsToInvoice = this.contractsToInvoice.filter((item) =>
                        item.counterparty.toString().toUpperCase().includes(this.searchCounterPartyTerm.toUpperCase()));
                }
            }
            this.invoiceContractGridRows = this.contractsToInvoice;
        }
        this.dataLength = this.invoiceContractGridRows.length;
        this.autoSizeContractsGrid();
        this.isLoading = false;
        if (this.dataLength && this.dataLength > 0) {
            this.counterParty = this.invoiceContractGridRows[0].counterparty;
        }
        (this.invoiceContractGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
    }

    onSelectionChanged(event) {
        this.totalQuantity = 0;
        const selectedRows = this.gridApi.getSelectedRows();
        const currentRowIndex = event.rowIndex;
        let validQuantity = true;
        let valid = true;
        let validBusinessSector = true;
        if (event.node.isSelected()) {
            selectedRows.forEach(
                (selectedContract: ContractsToInvoice) => {
                    if (selectedContract.contractQuantity > selectedContract.invoicedQuantity) {
                        if (selectedContract.quantityToInvoice === 0) {
                            selectedContract.quantityToInvoice =
                                (selectedContract.contractQuantity - selectedContract.invoicedQuantity);
                        }
                        this.gridApi.refreshCells(event.data);
                        this.totalQuantity += selectedContract.quantityToInvoice;
                    } else {
                        validQuantity = false;
                    }
                },
            );
        } else {
            event.data.quantityToInvoice = 0;
            this.gridApi.refreshCells(event.data);
        }
        if (selectedRows.length > 1) {
            let currencySelected;
            let counterpartySelected;
            let businessSectorSelected;
            for (const row of selectedRows) {
                if (!currencySelected) {
                    currencySelected = row.currencyCode;
                }
                if (!counterpartySelected) {
                    counterpartySelected = row.counterparty;
                }
                if (!businessSectorSelected) {
                    businessSectorSelected = row.businessSector;
                }
                if (currencySelected !== row.currencyCode || counterpartySelected !== row.counterparty) {
                    valid = false;
                    break;
                }

                if (this.isBusinessSectorPostingProcess) {
                    if (businessSectorSelected !== row.businessSector) {
                        validBusinessSector = false;
                        break;
                    }
                }

            }
        }
        if (!valid) {
            this.snackbarService.informationSnackBar('Currency & Counterparty should be same');
        }
        if (!validBusinessSector) {
            this.snackbarService.informationSnackBar('While invoicing, Business Sector must be the same');
        }
        if (!validQuantity) {
            this.snackbarService.informationSnackBar('Value cannot be negative or more than the uninvoiced quantity');
        }
        let rowNode: agGrid.RowNode;
        this.invoiceContractGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                rowNode = node;
                if (valid === false || validQuantity === false || validBusinessSector === false) {
                    this.invoiceContractGridOptions.api.deselectNode(node);
                }
            }
        });
        this.checkCommoditySelected(selectedRows);
        this.isContractSelected = selectedRows.length > 0;
        this.contractsSelected.emit(this.isContractSelected);
        this.grantLock(Number(event.data.sectionId), event.node);
        this.selectedContractsToInvoice = selectedRows;
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
                        this.invoiceContractGridOptions.api.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        this.subscriptions.push(
                            this.lockService.lockContract(sectionId, LockFunctionalContext.ContractInvoicing)
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
                    this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.ContractInvoicing)
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
        this.invoiceContractGridOptions.api.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    checkCommoditySelected(selectedRows: ContractsToInvoice[]) {
        this.differentCommoditySelected = false;
        this.differentPricesSelected = false;
        if (selectedRows.length > 1) {
            const firstSelectedRow = selectedRows[0];
            this.differentCommoditySelected = selectedRows.filter(
                (row) => row.commodity.trim() !== firstSelectedRow.commodity.trim()).length > 0;
            this.differentPricesSelected = selectedRows.filter(
                (row) => row.price !== firstSelectedRow.price).length > 0;
        }
        this.commoditySelected.emit({
            differentCommoditySelected: this.differentCommoditySelected, differentPricesSelected: this.differentPricesSelected,
        });
    }

    populateEntity(entity: InvoiceRecord): ContractsToInvoice[] {

        this.selectedContractsToInvoice = this.gridApi.getSelectedRows();

        return this.selectedContractsToInvoice;
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    onCellValueChanged(params) {
        if (params.oldValue < params.newValue) {
            this.totalQuantity = this.totalQuantity + (params.newValue - params.oldValue);
        } else if (params.oldValue > params.newValue) {
            this.totalQuantity = this.totalQuantity - (params.oldValue - params.newValue);
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

    loadGridConfiguration() {
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
        this.columnDefs = [];
        // selection column
        this.columnDefs.push(
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                minWidth: 40,
                maxWidth: 40, pinned: 'left',
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

            const numericColumn = numericColumns.find((column) => column === columnDef.field.toLowerCase());
            if (numericColumn) {
                columnDef.type = 'numericColumn';
                columnDef.valueFormatter = this.numberFormatter;
            }

            return columnDef;
        }));

        // calculated columns
        this.columnDefs = this.columnDefs.concat(this.additionnalColumns);
        if (this.invoiceContractGridOptions) {
            this.invoiceContractGridOptions.columnDefs = this.columnDefs;
            this.invoiceContractGridOptions.columnApi.autoSizeAllColumns();
        }
    }

    isQuantityToInvoiceEditable(param) {
        return param.node.selected;
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
            this.getContractsToInvoice();
        }
    }

    numberFormatter(params) {
        if (params && params.value && !isNaN(params.value)) {
            if (params.colDef.colId.toLowerCase() === 'contractquantity' || params.colDef.colId.toLowerCase() === 'price' ||
                params.colDef.colId.toLowerCase() === 'invoicedquantity') {
                if (params.colDef.colId.toLowerCase() === 'price') {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(params.value);
                } else {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params.value);
                }
            }
        }
    }

    formatQuantity(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }

    ngOnDestroy(): void {
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }));
    }
}
