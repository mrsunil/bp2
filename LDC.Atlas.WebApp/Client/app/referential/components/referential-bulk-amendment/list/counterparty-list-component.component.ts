import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { finalize, map } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ListAndSearchComponent } from '../../../../shared/components/list-and-search/list-and-search.component';
import { BulkEditSearchResult } from '../../../../shared/dtos/bulkEdit-search-result';
import { ReferentialCounterpartiesSearchResult } from '../../../../shared/dtos/referential-Counterparties-search-result';
import { AccountType } from '../../../../shared/entities/account-type.entity';
import { CounterpartyTradeStatus } from '../../../../shared/entities/counterparty-trade-status.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { ColumnConfigurationProperties } from '../../../../shared/entities/grid-column-configuration.entity';
import { LdcRegion } from '../../../../shared/entities/ldc-region.entity';
import { ListAndSearchFilter } from '../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../../../shared/entities/list-and-search/list-and-search-request.entity';
import { MasterDataProps } from '../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { ListAndSearchFilterType } from '../../../../shared/enums/list-and-search-filter-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../shared/services/grid-configuration-provider.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { ReferentialCounterpartiesService } from '../../../../shared/services/http-services/referential-counterparties.service';
import { ReferentialBulkEditCounterpartiesDataLoader } from '../../../../shared/services/list-and-search/counterparty-bulk-edit-data-loader';
import { UiService } from '../../../../shared/services/ui.service';
import { UtilService } from '../../../../shared/services/util.service';
@Component({
    selector: 'atlas-counterparty-list-component',
    templateUrl: './counterparty-list-component.component.html',
    styleUrls: ['./counterparty-list-component.component.scss'],
    providers: [ReferentialBulkEditCounterpartiesDataLoader],
})

export class CounterpartyListComponentComponent extends BaseFormComponent implements OnInit {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;

    gridCode = 'bulkEditGrid';
    company: string;
    counterpartyContractGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    counterpartyContractGridColumns: agGrid.ColDef[];
    counterpartyContractGridRows: BulkEditSearchResult[];
    accountReferenceCtrl: FormControl = new FormControl();
    counterPartyTypeCtrl: FormControl = new FormControl();
    additionalFilters: ListAndSearchFilter[] = [];
    filteredAccTypesList: AccountType[];
    allAccTypesList: AccountType[];
    masterdata: MasterData;
    columnConfiguration: ColumnConfigurationProperties[] = [];
    snapshotErrorMap: Map<string, string> = new Map<string, string>();
    filteredCounterPartyList: Counterparty[];
    counterpartyValue: string;
    clientNameValue: string;
    masterData: MasterData;
    columnDefs: agGrid.ColDef[];
    hasGridSharing = false;
    filters: ListAndSearchFilter[] = [];
    counterpartyTradeStatusList: CounterpartyTradeStatus[] = [];
    isLoading: boolean;
    contractsCounterpartyToedit: BulkEditSearchResult[];
    filteredLdcRegion: LdcRegion[] = [];
    selectedcontractsCounterpartyToedit: BulkEditSearchResult[];
    masterdataList: string[] = [
        MasterDataProps.Counterparties];
    counterpartyId: number;
    searchedCounterpartyCode: string;
    isAutoCompleteActivated: boolean = true;
    @Output() contractsSelected = new EventEmitter();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        private companyManager: CompanyManagerService,
        protected utilService: UtilService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        private route: ActivatedRoute,
        private router: Router,
        protected uiService: UiService,
        private referentialCounterpartiesService: ReferentialCounterpartiesService,
        public dataLoader: ReferentialBulkEditCounterpartiesDataLoader,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filterCounterparties();
        this.allAccTypesList = this.masterData.accountTypes;
        this.filteredAccTypesList = this.masterData.accountTypes;
        this.counterpartyTradeStatusList = this.masterData.tradeStatus;
        this.filteredLdcRegion = this.masterData.regions;
        this.counterPartyTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredAccTypesList = this.utilService.filterListforAutocomplete(
                input,
                this.allAccTypesList,
                ['name'],
            );
        });
        this.loadGridConfiguration();
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.getContractsToCounterparty();
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]): void {
        this.filters = filters;
        this.getContractsToCounterparty();
    }

    getContractsToCounterparty() {
        if (!this.filters || !(this.columnConfiguration)) {
            return;
        } else if (this.columnConfiguration && this.columnConfiguration.length > 0) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.isLoading = true;
            if (this.accountReferenceCtrl.value && typeof this.accountReferenceCtrl.value === 'object') {
                this.accountReferenceCtrl.patchValue(this.accountReferenceCtrl.value);
            }
            if (this.counterPartyTypeCtrl.value && typeof this.counterPartyTypeCtrl.value === 'object') {
                this.counterPartyTypeCtrl.patchValue(this.counterPartyTypeCtrl.value);
            }
            const accountRefField = this.columnConfiguration
                .find((column) => column.fieldName === 'AccountReference');
            const accountRefTypeField = this.columnConfiguration
                .find((column) => column.fieldName === 'CounterpartyType');
            if (this.accountReferenceCtrl.value) {
                const filterAccountsRef = new ListAndSearchFilter();
                let filterAccountRef;
                if (accountRefField) {
                    filterAccountRef = new ListAndSearchFilter();
                    filterAccountRef.fieldId = accountRefField.fieldId;
                    filterAccountRef.fieldName = accountRefField.fieldName;
                    filterAccountRef.predicate = {
                        filterType: ListAndSearchFilterType.Text,
                        operator: 'eq',
                        value1: this.accountReferenceCtrl.value.counterpartyCode + '%',
                    };
                    filterAccountRef.isActive = true;
                    filterAccountsRef.logicalOperator = 'or';
                    filterAccountsRef.clauses = [filterAccountRef];
                    this.filters.push(filterAccountsRef);
                }
            }
            if (this.counterPartyTypeCtrl.value && accountRefTypeField) {
                const filterContractNo = new ListAndSearchFilter();
                filterContractNo.fieldId = accountRefTypeField.fieldId;
                filterContractNo.fieldName = accountRefTypeField.fieldName;
                filterContractNo.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.counterPartyTypeCtrl.value.name + '%',
                };
                filterContractNo.isActive = true;
                this.filters.push(filterContractNo);
            }
            this.dataLoader.getData(this.filters, null, null)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    if (data) {
                        this.contractsCounterpartyToedit = data.value;
                        this.counterpartyContractGridRows = this.contractsCounterpartyToedit;

                    }
                });
        }
        this.gridApi.sizeColumnsToFit();
        setTimeout(() => {
            this.gridColumnApi.autoSizeAllColumns();
        })
    }

    changeTradeStatusId(params) {
        const tradeStatus = this.counterpartyTradeStatusList.find((tradeStatus) => tradeStatus.enumEntityId === Number(params.value));
        return tradeStatus ? tradeStatus.enumEntityValue : '';
    }
    changeLDCRegion(params) {
        const LDCRegion = this.filteredLdcRegion.find((LDCRegion) => LDCRegion.ldcRegionId === Number(params.value));
        return LDCRegion ? LDCRegion.ldcRegionCode : '';
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
            if (config.fieldName === 'TradeStatusId') {
                columnDef.valueFormatter = this.changeTradeStatusId.bind(this);
            }
            if (config.fieldName === 'LdcRegion') {
                columnDef.valueFormatter = this.changeLDCRegion.bind(this);
            }
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
        if (this.counterpartyContractGridOptions) {
            this.counterpartyContractGridOptions.columnDefs = this.columnDefs;
        }
    }

    onGridReady(params) {
        params.columnDefs = this.counterpartyContractGridColumns;
        this.counterpartyContractGridOptions = params;
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
        this.gridColumnApi.autoSizeAllColumns();
    }

    onSelectionChanged(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.selectedcontractsCounterpartyToedit = selectedRows;
        if (selectedRows) {
            this.contractsSelected.emit(true);
        }
    }

    filterCounterparties() {
        this.searchedCounterpartyCode = this.counterpartyValue;
        let counterpartyList: Counterparty[] = [];
        this.filteredCounterPartyList = this.masterData.counterparties;
        counterpartyList = this.filteredCounterPartyList;
        this.accountReferenceCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
                input,
                counterpartyList,
                ['counterpartyCode', 'description'],
            );
            if (this.accountReferenceCtrl.valid) {
            }
        });
    }

    onCounterpartyIdSelected(value: Counterparty) {
        this.counterpartyValue = this.accountReferenceCtrl.value;
    }

    onQuickSearchButtonClicked() {
        this.getContractsToCounterparty();
    }

}
