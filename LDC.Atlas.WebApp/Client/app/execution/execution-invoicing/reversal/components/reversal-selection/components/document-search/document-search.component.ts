import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgGridCheckboxComponent } from '../../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { InvoiceReversalSearchResult } from '../../../../../../../shared/dtos/invoice-reversal';
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
import { ReversalRowSelection } from '../../../../../../../shared/entities/reversal-row-selection.entity';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../../../../shared/services/execution/charter-data-loader';
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
import { DocumentTypeComponent } from '../document-type/document-type.component';
import { FilterSetDisplayComponent } from './../../../../../../../shared/components/filter-set-display/filter-set-display.component';

@Component({
    selector: 'atlas-document-search',
    templateUrl: './document-search.component.html',
    styleUrls: ['./document-search.component.scss'],
    providers: [CounterPartyDataLoader, CharterDataLoader],
})
export class DocumentSearchComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplayComponent') filterSetDisplayComponent: FilterSetDisplayComponent;
    @ViewChild('documentTypeComponent') documentTypeComponent: DocumentTypeComponent;
    @Output() readonly documentTypeSelected = new EventEmitter<number>();
    @Output() readonly documentDateSelected = new EventEmitter<Date>();
    @Output() readonly rowSelected = new EventEmitter<ReversalRowSelection>();

    dataLength: number = 0;
    searchForm: FormGroup;
    invoiceType: number;
    company: string;
    isLoading: boolean;
    searchInvoiceReference: string;
    documentDate: Date;
    documentTypeId: number;
    transactionDocumentId: number;
    reversalInvoiceReference: string;
    transactionDocumentTypeId: number = 0;
    invoiceId: number;
    searchContractReference: string;
    searchCharterReference: string;
    searchCounterParty: string;

    gridTitle = 'Reversible Invoices';
    gridCode: string = 'invoiceReversalSelectionGrid';

    reversalDocumentGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    reversalDocumentGridColumns: agGrid.ColDef[];
    hasGridSharing = false;
    columnConfiguration: ColumnConfigurationProperties[] = [];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    reversalDocumentGridRows: InvoiceReversalSearchResult[];
    reversalDocumentGrid: InvoiceReversalSearchResult[];
    reversalDocuments: InvoiceReversalSearchResult[];
    additionnalColumns = [];

    filters: ListAndSearchFilter[];
    destroy$ = new Subject();

    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    filteredCounterPartyList: Counterparty[];
    masterdata: MasterData = new MasterData();
    counterPartyCtrl = new AtlasFormControl('CounterPartyReversal');
    filteredCharters: Charter[];
    charters: Charter[];
    charterReferenceCtrl = new AtlasFormControl('CharterRefReversal');
    saveContractRef: string;
    saveCounterparty: string;
    saveCharterReference: string;
    saveInvoiceReference: string;
    counterPartyControl: Counterparty;
    counterPartyList: Counterparty[];
    charterRefControl: Charter;

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Counter Party not in the list.');
    charterErrorMap: Map<string, string> = new Map();
    count: number = 0;
    savedFilters: ListAndSearchFilter[];

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private snackbarService: SnackbarService,
        protected uiService: UiService,
        private executionService: ExecutionService,
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
            searchDocumentCtrl: [''],
            contractReferenceCtrl: [''],
        });
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data['masterdata'] as MasterData;
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.bindConfiguration();
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
            this.saveInvoiceReference = params['savedInvoiceReference'];
        });
        if (this.executionActionsService.EditCriteriaRetainFilter && this.executionActionsService.EditCriteriaRetainFilter.length > 0) {
            this.savedFilters = this.executionActionsService.EditCriteriaRetainFilter;
        }
        if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference || this.saveInvoiceReference) {
            if (this.saveContractRef) {
                this.searchForm.controls['contractReferenceCtrl'].setValue(this.saveContractRef);
            }
            if (this.saveInvoiceReference) {
                this.searchForm.controls['searchDocumentCtrl'].setValue(this.saveInvoiceReference);
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

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onSearchReversalDocumentClicked();
        }
    }
    filterCharterReference(input) {
        this.filteredCharters = this.utilService.filterListforAutocomplete(
            input,
            this.charters,
            ['charterCode', 'description'],
        );
        if (this.charterReferenceCtrl.valid || !this.charterReferenceCtrl.value) {
            this.onSearchReversalDocumentClicked();
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
        this.reversalDocumentGridColumns = [];
        const numericColumns: string[] = [];
        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        // selection column
        this.reversalDocumentGridColumns.push(
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'left',
            });

        // grid config
        this.reversalDocumentGridColumns = this.reversalDocumentGridColumns.concat(
            configuration.filter((config) => config.isResult) 
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

                if (config.gridType === 'boolean') {
                    columnDef.cellRendererFramework = AgGridCheckboxComponent;
                    columnDef.cellRendererParams = { disabled: true };
                }

                const numericColumn = numericColumns.find((column) => column === columnDef.field.toLowerCase());
                if (numericColumn) {
                    columnDef.type = 'numericColumn';
                    columnDef.valueFormatter = this.numberFormatter;
                }

                return columnDef;
            }));

        // calculated columns
        this.reversalDocumentGridColumns = this.reversalDocumentGridColumns.concat(this.additionnalColumns);

        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
        if (this.reversalDocumentGridOptions && this.reversalDocumentGridOptions.api) {
            this.reversalDocumentGridOptions.columnDefs = this.reversalDocumentGridColumns;
            this.reversalDocumentGridOptions.api.setColumnDefs(this.reversalDocumentGridColumns);
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

    loadData() {
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

        this.executionService.searchInvoicesToReverse(request).pipe(
            takeUntil(this.destroy$),
        ).subscribe((data) => {
            this.reversalDocumentGrid = data.value;
            this.reversalDocumentGridRows = this.reversalDocumentGrid.filter((reversalContract) => {
                const reversalContractQuantityValue = Number(reversalContract.quantity);
                const reversalContractQuantityValueFixes = Number(reversalContractQuantityValue.toFixed(3));
                if (reversalContractQuantityValueFixes) {
                    return reversalContract;
                }
            });
            this.reversalDocuments = this.reversalDocumentGridRows;
            this.dataLength = this.reversalDocumentGridRows.length;
            this.gridApi.hideOverlay();
            this.gridColumnApi.autoSizeAllColumns();
            if (this.filters.length === 0) {
                if (this.saveContractRef || this.saveCounterparty || this.saveCharterReference || this.saveInvoiceReference) {
                    this.onSearchReversalDocumentClicked();
                }
            }
            this.isLoading = false;
        });
    }

    onGridReady(params) {
        params.columnDefs = this.reversalDocumentGridColumns;
        this.gridApi = params.api;
        this.reversalDocumentGridOptions = params;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
    }
    autoSizeContractsGrid() {
        if (this.gridColumnApi && this.reversalDocumentGridColumns) {
            const allColumnIds = [];
            this.reversalDocumentGridColumns.forEach((columnDefs) => {
                allColumnIds.push(columnDefs.field);
            });
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    onGridSizeChanged() {
        this.autoSizeContractsGrid();
    }

    externalFilterPresent() {
        if (this.searchInvoiceReference) {
            return true;
        } else { return false; }
    }

    externalFilterPass(node) {
        const invoiceReference = node.data.invoiceReference;
        return invoiceReference === this.searchInvoiceReference.toUpperCase()
            || invoiceReference.toString().match(this.searchInvoiceReference);
    }

    contractValid(node) {
        if (node.data.contractUnApproved === true || node.data.invoiceMatched === true) {
            return { background: 'rgba(199, 194, 196, 0.5)', color: '#928D8F' };
        }
    }

    onSearchReversalDocumentClicked() {
        this.searchInvoiceReference = this.searchForm.get('searchDocumentCtrl').value;
        this.searchContractReference = this.searchForm.get('contractReferenceCtrl').value;
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
        let documentRows: number = 0;
        let contractRows: number = 0;
        let charterRows: number = 0;
        // This Commented code will be removed once thorough testing for grid is done
        // if (this.gridApi) { this.gridApi.onFilterChanged(); }
        // this.dataLength = this.gridApi.getDisplayedRowCount();

        let rows: InvoiceReversalSearchResult[] = [];
        let reversalContracts: InvoiceReversalSearchResult[] = [];
        if (!this.searchInvoiceReference && !this.searchContractReference && !this.searchCharterReference && !this.searchCounterParty) {
            this.reversalDocumentGridRows = this.reversalDocuments;
            return;
        }
        if (this.reversalDocuments && this.reversalDocuments.length > 0) {
            this.isLoading = true;
            this.reversalDocumentGridRows = this.reversalDocuments;
            this.filters = [];
            // (this.searchTerm) ?
            //     rows = this.reversalDocuments.filter((item) =>
            //         item.invoiceReference.toString().toUpperCase().includes(this.searchTerm.toUpperCase())) :
            //     rows = this.reversalDocuments;
            if (this.searchInvoiceReference) {
                reversalContracts = this.reversalDocuments.filter((item) => item.invoiceReference != null);
                rows = reversalContracts.filter((item) =>
                    item.invoiceReference.toString().toUpperCase().includes(this.searchInvoiceReference.toUpperCase()));
                documentRows = -1;
            }
            if (this.searchContractReference) {
                if (rows.length === 0 && contractRows === 0) {
                    reversalContracts = this.reversalDocuments.filter((item) => item.contractReference != null);
                    rows = reversalContracts.filter((item) =>
                        item.contractReference.toString().toUpperCase().includes(this.searchContractReference.toUpperCase()));
                } else {
                    rows = rows.filter((item) => item.contractReference != null);
                    rows = rows.filter((item) => item.contractReference.toString().toUpperCase().
                        includes(this.searchContractReference.toUpperCase()));
                }
                contractRows = -1;
            }
            if (this.searchCharterReference) {
                if (rows.length === 0 && contractRows === 0) {
                    reversalContracts = this.reversalDocuments.filter((item) => item.charterReference != null);
                    rows = reversalContracts.filter((item) =>
                        item.charterReference.toString().toUpperCase().includes(this.searchCharterReference.toUpperCase()));
                } else {
                    rows = rows.filter((item) => item.charterReference != null);
                    rows = rows.filter((item) => item.charterReference.toString().toUpperCase().
                        includes(this.searchCharterReference.toUpperCase()));
                }
                charterRows = -1;
            }
            if (this.searchCounterParty) {
                if (rows.length === 0 && charterRows === 0 && contractRows === 0) {
                    reversalContracts = this.reversalDocuments.filter((item) => item.customerRef != null);
                    rows = reversalContracts.filter((item) =>
                        item.customerRef.toString().toUpperCase().includes(this.searchCounterParty.toUpperCase()));
                } else {
                    rows = rows.filter((item) => item.customerRef != null);
                    rows = rows.filter((item) => item.customerRef.toString().toUpperCase().
                        includes(this.searchCounterParty.toUpperCase()));
                }
            }
        }

        this.reversalDocumentGridRows = rows;
        this.dataLength = this.reversalDocumentGridRows.length;
        this.autoSizeContractsGrid();
        this.isLoading = false;
        (this.reversalDocumentGridRows) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();

    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }
    deselectNode(currentRowIndex) {
        this.reversalDocumentGridOptions.api.forEachNode((node) => {
            if (Number(node.id) === currentRowIndex) {
                this.reversalDocumentGridOptions.api.deselectNode(node);
            }
        });
    }
    onRowSelected(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        const currentRowIndex = event.rowIndex;
        if (selectedRows.length === 0) {
            this.documentDateSelected.emit(null);
            this.reversalInvoiceReference = '';
            const row: ReversalRowSelection = {
                data: null,
                isRowSelected: false,
            };
            this.rowSelected.emit(row);
        }
        if (!event.node.isSelected()) {
            if (event.data.invoiceReference === this.reversalInvoiceReference) {
                this.gridApi.forEachNode((rowData) => {
                    if (rowData.data.invoiceReference === this.reversalInvoiceReference) {
                        rowData.selectThisNode(false);
                    }
                });
            }
            this.gridApi.deselectNode(event.node);
        } else {
            if (event.data.contractUnApproved === true) {
                this.snackbarService.informationSnackBar('Check Approval Status of the Contract');
                this.gridApi.deselectIndex(currentRowIndex);
            }
            if (event.data.invoiceMatched === true) {
                this.snackbarService.informationSnackBar('Document cannot be reversed since it is already matched');
                this.gridApi.deselectIndex(currentRowIndex);
            }
            if (selectedRows.length === 1) {
                if (event.node.selected === true) {
                    this.reversalInvoiceReference = event.data.invoiceReference;
                    this.invoiceId = event.data.invoiceId;
                    this.documentDate = event.data.documentDate;
                    this.transactionDocumentId = event.data.transactionDocumentId;
                    this.transactionDocumentTypeId = event.data.transactionDocumentTypeId;
                    this.documentTypeSelected.emit(this.documentTypeId);
                    this.documentDateSelected.emit(this.documentDate);
                    const row: ReversalRowSelection = {
                        data: event.data,
                        isRowSelected: event.node.selected,
                    };
                    this.rowSelected.emit(row);
                }
            }
            if (selectedRows.length > 1) {
                if (event.data.invoiceReference !== this.reversalInvoiceReference) {
                    this.snackbarService.informationSnackBar('Only One Invoice Document can be reversed at a time');
                    this.gridApi.deselectIndex(currentRowIndex);
                }
            }
        }
        this.grantLock(Number(event.data.invoiceId), event.node);
    }

    grantLock(invoiceId: number, node: agGrid.RowNode) {
        if (node.isSelected()) {
            if (!this.locking.includes(invoiceId)) {
                this.locking.push(invoiceId);
                this.subscriptions.push(this.lockService.isLockedInvoice(invoiceId).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                        this.gridApi.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== invoiceId);
                    } else {
                        this.subscriptions.push(this.lockService.lockInvoice(
                            invoiceId, LockFunctionalContext.ReversalInvoicing).subscribe(
                                () => {
                                    this.refeshResourceInformation();
                                    this.locking = this.locking.filter((id) => id !== invoiceId);
                                },
                                (error) => {
                                    const errorMessage = error && error.error && error.error.detail && error.error.detail.length > 0 ?
                                        error.error.detail :
                                        'The invoice or one of the contract related is locked by another user.';
                                    this.dialog.open(ConfirmationDialogComponent, {
                                        data: {
                                            title: 'Lock',
                                            text: errorMessage,
                                            okButton: 'Got it',
                                        },
                                    });
                                    this.gridApi.deselectNode(node);
                                    this.locking = this.locking.filter((id) => id !== invoiceId);
                                }));
                    }
                }));
            }
        } else {
            if (!this.unlocking.includes(invoiceId)) {
                this.unlocking.push(invoiceId);
                this.refeshResourceInformation();
                if (this.resourcesInformation.filter((rsc) => rsc.resourceId === invoiceId).length === 0) {
                    this.subscriptions.push(this.lockService.unlockInvoice(
                        invoiceId, LockFunctionalContext.ReversalInvoicing).subscribe(() => {
                            node.setRowSelectable(true);
                            this.unlocking = this.unlocking.filter((id) => id !== invoiceId);
                        }));
                } else {
                    node.setRowSelectable(true);
                    this.unlocking = this.unlocking.filter((id) => id !== invoiceId);
                }
            }
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        this.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Invoice';
                resourceInformation.resourceId = node.data.invoiceId;
                resourceInformation.resourceCode = node.data.invoiceReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceDetails = entity as InvoiceRecord;
        invoiceDetails.invoiceId = this.invoiceId;
        invoiceDetails.transactionDocumentId = this.transactionDocumentId;
        invoiceDetails.invoiceLabel = this.reversalInvoiceReference;
        invoiceDetails.transactionDocumentTypeId = this.transactionDocumentTypeId;
        return invoiceDetails;
    }

    numberFormatter(params) {
        if (params && params.value && !isNaN(params.value)) {
            if (params.colDef.colId.toLowerCase() === 'costamount' || params.colDef.colId.toLowerCase() === 'totalinvoicevalue'
                || params.colDef.colId.toLowerCase() === 'quantity') {
                if (params.colDef.colId.toLowerCase() === 'quantity') {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(params.value);
                } else {
                    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
                }
            }
        }
    }

    ngOnDestroy(): void {

        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }));
    }
}
