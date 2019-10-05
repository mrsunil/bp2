import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ListAndSearchComponent } from '../../../../../shared/components/list-and-search/list-and-search.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { Freeze } from '../../../../../shared/entities/freeze.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { TradeStatus } from '../../../../../shared/entities/trade-status.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { ContractStatus } from '../../../../../shared/enums/contract-status.enum';
import { ListAndSearchFilterType } from '../../../../../shared/enums/list-and-search-filter-type.enum';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';
import { ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { FreezeService } from '../../../../../shared/services/http-services/freeze.service';
import { TradeReportDataLoader } from '../../../../../shared/services/list-and-search/tradeReport-data-loader';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { AuthorizationService } from './../../../../../core/services/authorization.service';

@Component({
    selector: 'atlas-trade-report',
    templateUrl: './trade-report.component.html',
    styleUrls: ['./trade-report.component.scss'],
    providers: [TradeReportDataLoader],
})
export class TradeReportComponent implements OnInit {
    @ViewChild('tradeReportListAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    @Output() readonly contractStatusSelected = new EventEmitter<any>();
    databaseCtrl = new FormControl();
    databaseList: FreezeDisplayView[] = [];
    currentDatabase = new FreezeDisplayView(-1, 'CURRENT');
    filteredQuantityCode: WeightUnit[] = [];
    weightUnitIdCtrl = new AtlasFormControl('WeightCodeId');
    masterData: MasterData;
    masterdataList: string[] = [MasterDataProps.WeightUnits];
    additionalFilters: ListAndSearchFilter[] = [];
    contractStatusCtrl = new FormControl();
    contractStatusList: TradeStatus[] = [];
    filteredContractStatusList: TradeStatus[] = [];
    contractStatusDisplayProperty: string[] = ['name'];
    company: string;
    destroy$ = new Subject();
    formGroup: FormGroup;
    gridCode = 'tradeReportList';
    hasDeleteViewPrivilege = false;
    dataVersionId: number;
    counterPartyId: number;
    searchCode: string;
    filteredCounterPartyList: Counterparty[];

    parameters: any[] = [];
    zeroTonnages: string = 'Zero Tonnages';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        public dataLoader: TradeReportDataLoader,
        private freezeService: FreezeService,
        protected utilService: UtilService,
        protected snackbarService: SnackbarService,
        protected authorizationService: AuthorizationService,
        private titleService: TitleService,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterData.counterparties;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterPartyId'));

        if (this.counterPartyId) {
            const counterparty = this.filteredCounterPartyList.find((cp) => cp.counterpartyID === this.counterPartyId);
            if (counterparty) {
                this.searchCode = counterparty.counterpartyCode;
            }
        }

        this.contractStatusList = TradeStatus.getStatusList();
        this.titleService.setTitle(this.route.snapshot.data.title);
        for (const contractStatus of this.contractStatusList) {
            if (contractStatus.name === ContractStatus[ContractStatus.Open] || contractStatus.name === ContractStatus[ContractStatus.Closed] ||
                contractStatus.name === this.zeroTonnages || contractStatus.name === ContractStatus[ContractStatus.Cancelled]) {
                this.filteredContractStatusList.push(contractStatus);
            }
        }
        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Reports') &&
            this.authorizationService.isPrivilegeAllowed(this.company, 'TradeReport')) {
            this.hasDeleteViewPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'DeleteTradeReportView');
        }

        this.filteredQuantityCode = this.masterData.weightUnits;
        this.weightUnitIdCtrl.valueChanges.subscribe((input) => {
            this.filteredQuantityCode = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.weightUnits,
                ['weightCode', 'description'],
            );
        });
        this.loadSnapshots();
        this.setDefaultValues();
        this.applyFiltersForListAndSearchGrid();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            contractStatusCtrl: this.contractStatusCtrl,
            databaseCtrl: this.databaseCtrl,
        });
        return this.formGroup;
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
            this.initializeForm();
        });
    }

    setDefaultValues() {
        this.contractStatusCtrl.patchValue(this.filteredContractStatusList.filter((status) => status.name === 'Open'));
        const defaultWeightUnit = this.filteredQuantityCode.find((weightUnit) => weightUnit.weightCode === 'MT');
        this.weightUnitIdCtrl.patchValue(defaultWeightUnit ? defaultWeightUnit.weightCode : '');
    }

    onQuickSearchButtonClicked() {
        this.applyFiltersForListAndSearchGrid();
    }

    onPanelOpened(isPanelOpened) {
        if (isPanelOpened === false) {
            let contractStatus: TradeStatus[] = [];
            contractStatus = this.contractStatusCtrl.value;
            if (contractStatus.length <= 0) {
                this.contractStatusCtrl.patchValue(this.filteredContractStatusList.filter((status) => status.name === 'Open'));
                this.snackbarService.throwErrorSnackBar(
                    ' Select at least one option from General Inclusion/Exclusion to generate Report',
                );
            }
            if (this.listAndSearchComponent &&
                this.listAndSearchComponent.columnConfiguration &&
                this.listAndSearchComponent.columnConfiguration.length > 0) {
                this.applyFiltersForListAndSearchGrid();
            } else {
                this.configurationColumns();

            }
        }
    }

    configurationColumns() {
        this.listAndSearchComponent.loadGridConfiguration();
        this.applyFiltersForListAndSearchGrid();
    }

    applyFiltersForListAndSearchGrid() {
        this.additionalFilters = [];
        let zeroTonnagesExist: boolean = false;
        const filterContractsStatus = new ListAndSearchFilter();
        filterContractsStatus.clauses = [];
        const filterZeroTonnages = new ListAndSearchFilter();
        const filterCancelled = new ListAndSearchFilter();
        let filterContractStatus;
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {
            const dataVersionIdField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'DataVersionId');
            this.dataVersionId = (this.databaseCtrl.value as FreezeDisplayView).dataVersionId;
            const quantityCodeField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'QuantityCode');
            const tradeStatusField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'TradeStatus');
            const zeroTonnagesField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'Quantity');
            const isCancelledField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'IsCancelled');
            const zeroTonnage: number = 0;
            const cancelled: boolean = true;
            const zeroTonnageInDecimal: string = '0.00';
            let cancelledExist: boolean = false;

            const contractStatusNames = (this.contractStatusCtrl.value as TradeStatus[]).map((status) => status.name);
            if (!this.listAndSearchComponent) {
                return;
            } else
                if (this.databaseCtrl.value && dataVersionIdField && this.dataVersionId !== -1) {
                    const filterDataVersionId = new ListAndSearchFilter();
                    filterDataVersionId.fieldId = dataVersionIdField.fieldId;
                    filterDataVersionId.fieldName = dataVersionIdField.fieldName;
                    filterDataVersionId.predicate = {
                        filterType: ListAndSearchFilterType.Text,
                        operator: 'eq',
                        value1: this.dataVersionId.toString(),
                    };
                    filterDataVersionId.isActive = true;
                    this.additionalFilters = [filterDataVersionId];
                }
            if (this.contractStatusCtrl.value) {
                if (contractStatusNames.length === 1) {
                    this.initAdditionnalFilters();
                }
                if (contractStatusNames.length > 1) {
                    for (const contractStatus of contractStatusNames) {
                        if (contractStatus === this.zeroTonnages) {
                            zeroTonnagesExist = true;
                        } else if (contractStatus === ContractStatus[ContractStatus.Cancelled]) {
                            cancelledExist = true;
                        }
                    }
                    if (this.weightUnitIdCtrl.value && quantityCodeField) {
                        const filterWeightUnit = new ListAndSearchFilter();
                        filterWeightUnit.fieldId = quantityCodeField.fieldId;
                        filterWeightUnit.fieldName = quantityCodeField.fieldName;
                        filterWeightUnit.predicate = {
                            filterType: ListAndSearchFilterType.Text,
                            operator: 'eq',
                            value1: this.weightUnitIdCtrl.value + '%',
                        };
                        filterWeightUnit.isActive = true;
                        this.additionalFilters.push(filterWeightUnit);
                    }
                    if (zeroTonnagesExist && !cancelledExist) {
                        const filterAllContractStatus = new ListAndSearchFilter();

                        for (const contractStatus of contractStatusNames) {
                            if (contractStatus !== this.zeroTonnages && tradeStatusField && contractStatus !== ContractStatus[ContractStatus.Cancelled]) {
                                filterContractStatus = new ListAndSearchFilter();
                                filterContractStatus.fieldId = tradeStatusField.fieldId;
                                filterContractStatus.fieldName = tradeStatusField.fieldName;

                                filterContractStatus.predicate = {
                                    filterType: ListAndSearchFilterType.Text,
                                    operator: 'eq',
                                    value1: contractStatus,
                                };
                                filterContractStatus.isActive = true;
                                filterContractsStatus.clauses.push(filterContractStatus);
                            } else if (zeroTonnagesField) {
                                filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                                filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                                filterZeroTonnages.predicate = {
                                    filterType: ListAndSearchFilterType.Numeric,
                                    operator: 'eq',
                                    value1: zeroTonnage.toString(),
                                };
                                filterZeroTonnages.isActive = true;
                            }
                        }
                        filterContractsStatus.logicalOperator = 'or';
                        if (tradeStatusField || zeroTonnagesField) {
                            if (filterContractStatus && filterZeroTonnages) {
                                filterAllContractStatus.logicalOperator = 'or';
                                filterAllContractStatus.clauses = [filterContractsStatus, filterZeroTonnages];
                                this.additionalFilters.push(filterAllContractStatus);
                            } else {
                                this.additionalFilters.push(filterContractStatus ? filterContractsStatus : filterZeroTonnages);
                            }
                        }
                    } else if (cancelledExist && !zeroTonnagesExist) {
                        const filterAllContractStatus = new ListAndSearchFilter();

                        for (const contractStatus of contractStatusNames) {
                            if (contractStatus !== ContractStatus[ContractStatus.Cancelled] && tradeStatusField) {
                                filterContractStatus = new ListAndSearchFilter();
                                filterContractStatus.fieldId = tradeStatusField.fieldId;
                                filterContractStatus.fieldName = tradeStatusField.fieldName;

                                filterContractStatus.predicate = {
                                    filterType: ListAndSearchFilterType.Text,
                                    operator: 'eq',
                                    value1: contractStatus,
                                };
                                filterContractStatus.isActive = true;
                                filterContractsStatus.clauses.push(filterContractStatus);
                            } else if (isCancelledField) {
                                filterCancelled.fieldId = isCancelledField.fieldId;
                                filterCancelled.fieldName = isCancelledField.fieldName;
                                filterCancelled.predicate = {
                                    filterType: ListAndSearchFilterType.Boolean,
                                    operator: 'eq',
                                    value1: cancelled.toString(),
                                };
                                filterCancelled.isActive = true;
                            }
                        }
                        filterContractsStatus.logicalOperator = 'or';
                        if (tradeStatusField || isCancelledField) {
                            if (filterContractStatus && filterCancelled) {
                                filterAllContractStatus.logicalOperator = 'or';
                                filterAllContractStatus.clauses = [filterContractsStatus, filterCancelled];
                                this.additionalFilters.push(filterAllContractStatus);
                            } else {
                                this.additionalFilters.push(filterContractStatus ? filterContractsStatus : filterCancelled);
                            }
                        }
                    } else if (cancelledExist && zeroTonnagesExist) {
                        const filterAllContractStatus = new ListAndSearchFilter();

                        for (const contractStatus of contractStatusNames) {
                            if (contractStatus !== ContractStatus[ContractStatus.Cancelled] && tradeStatusField && contractStatus !== this.zeroTonnages) {
                                filterContractStatus = new ListAndSearchFilter();
                                filterContractStatus.fieldId = tradeStatusField.fieldId;
                                filterContractStatus.fieldName = tradeStatusField.fieldName;

                                filterContractStatus.predicate = {
                                    filterType: ListAndSearchFilterType.Text,
                                    operator: 'eq',
                                    value1: contractStatus,
                                };
                                filterContractStatus.isActive = true;
                                filterContractsStatus.clauses.push(filterContractStatus);
                            } else if (isCancelledField && zeroTonnagesField) {
                                filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                                filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                                filterZeroTonnages.predicate = {
                                    filterType: ListAndSearchFilterType.Numeric,
                                    operator: 'eq',
                                    value1: zeroTonnage.toString(),
                                };
                                filterZeroTonnages.isActive = true;

                                filterCancelled.fieldId = isCancelledField.fieldId;
                                filterCancelled.fieldName = isCancelledField.fieldName;
                                filterCancelled.predicate = {
                                    filterType: ListAndSearchFilterType.Boolean,
                                    operator: 'eq',
                                    value1: cancelled.toString(),
                                };
                                filterCancelled.isActive = true;
                            }
                        }
                        filterZeroTonnages.logicalOperator = 'or';
                        if (zeroTonnagesField || isCancelledField || tradeStatusField) {
                            const clauseList: ListAndSearchFilter[] = [];
                            if (filterZeroTonnages) {
                                clauseList.push(filterZeroTonnages);
                            }
                            if (filterCancelled) {
                                clauseList.push(filterCancelled);
                            }
                            if (filterContractStatus) {
                                clauseList.push(filterContractStatus);
                            }
                            if (clauseList && clauseList.length > 0) {
                                filterAllContractStatus.logicalOperator = 'or';
                                filterAllContractStatus.clauses = clauseList;
                                this.additionalFilters.push(filterAllContractStatus);
                            } else {
                                this.additionalFilters.push(filterContractStatus ? filterContractsStatus : filterCancelled);
                            }
                        }
                    } else {
                        for (const contractStatus of contractStatusNames) {
                            if (tradeStatusField) {
                                filterContractStatus = new ListAndSearchFilter();
                                filterContractStatus.fieldId = tradeStatusField.fieldId;
                                filterContractStatus.fieldName = tradeStatusField.fieldName;
                                filterContractStatus.predicate = {
                                    filterType: ListAndSearchFilterType.Text,
                                    operator: 'eq',
                                    value1: contractStatus,
                                };
                                filterContractStatus.isActive = true;
                                filterContractsStatus.clauses.push(filterContractStatus);
                            }
                        }
                        filterContractsStatus.logicalOperator = 'or';
                        filterContractsStatus.isActive = true;
                        this.additionalFilters.push(filterContractsStatus);
                        filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                        filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                        filterZeroTonnages.predicate = {
                            filterType: ListAndSearchFilterType.Numeric,
                            operator: 'ne',
                            value1: zeroTonnage.toString(),
                            value2: zeroTonnageInDecimal,
                        };
                        filterZeroTonnages.isActive = true;
                        this.additionalFilters.push(filterZeroTonnages);
                        filterCancelled.fieldId = isCancelledField.fieldId;
                        filterCancelled.fieldName = isCancelledField.fieldName;
                        filterCancelled.predicate = {
                            filterType: ListAndSearchFilterType.Boolean,
                            operator: 'ne',
                            value1: cancelled.toString(),
                        };
                        filterCancelled.isActive = true;
                        this.additionalFilters.push(filterCancelled);
                    }
                    this.listAndSearchComponent.additionalFilters = this.additionalFilters;
                    this.listAndSearchComponent.dataVersionId = this.dataVersionId !== -1 ? this.dataVersionId : null;
                    this.listAndSearchComponent.loadData(true);
                }
            } else {
                return;
            }

        }
    }

    initAdditionnalFilters() {
        if (this.additionalFilters.length === 0) {
            this.additionalFilters = [];
        }
        const contractStatusNames = (this.contractStatusCtrl.value as TradeStatus[]).map((status) => status.name);
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {
            const quantityCodeField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'QuantityCode');
            const tradeStatusField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'TradeStatus');
            const zeroTonnagesField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'Quantity');
            const isCancelledField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'IsCancelled');
            const zeroTonnage: number = 0;
            const zeroTonnageInDecimal: string = '0.00';
            const cancelled: boolean = true;
            const filterWeightUnit = new ListAndSearchFilter();
            filterWeightUnit.fieldId = quantityCodeField.fieldId;
            filterWeightUnit.fieldName = quantityCodeField.fieldName;
            filterWeightUnit.predicate = {
                filterType: ListAndSearchFilterType.Text,
                operator: 'eq',
                value1: 'MT' + '%',
            };
            filterWeightUnit.isActive = true;
            this.additionalFilters.push(filterWeightUnit);
            if ((contractStatusNames[0] === ContractStatus[ContractStatus.Open]) || (contractStatusNames[0] === ContractStatus[ContractStatus.Closed])) {
                const filterContractStatus = new ListAndSearchFilter();
                filterContractStatus.fieldId = tradeStatusField.fieldId;
                filterContractStatus.fieldName = tradeStatusField.fieldName;

                filterContractStatus.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: contractStatusNames[0].toString(),
                };
                filterContractStatus.isActive = true;
                this.additionalFilters.push(filterContractStatus);

                const filterZeroTonnages = new ListAndSearchFilter();
                filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                filterZeroTonnages.predicate = {
                    filterType: ListAndSearchFilterType.Numeric,
                    operator: 'ne',
                    value1: zeroTonnage.toString(),
                    value2: zeroTonnageInDecimal,
                };
                filterZeroTonnages.isActive = true;
                this.additionalFilters.push(filterZeroTonnages);
            } else if (contractStatusNames[0] === ContractStatus[ContractStatus.Cancelled]) {
                const filterCancelled = new ListAndSearchFilter();
                filterCancelled.fieldId = isCancelledField.fieldId;
                filterCancelled.fieldName = isCancelledField.fieldName;
                filterCancelled.predicate = {
                    filterType: ListAndSearchFilterType.Boolean,
                    operator: 'eq',
                    value1: cancelled.toString(),
                };
                filterCancelled.isActive = true;
                this.additionalFilters.push(filterCancelled);
            } else {
                const filterZeroTonnages = new ListAndSearchFilter();
                filterZeroTonnages.fieldId = zeroTonnagesField.fieldId;
                filterZeroTonnages.fieldName = zeroTonnagesField.fieldName;
                filterZeroTonnages.predicate = {
                    filterType: ListAndSearchFilterType.Numeric,
                    operator: 'eq',
                    value1: zeroTonnage.toString(),
                };
                filterZeroTonnages.isActive = true;
                this.additionalFilters.push(filterZeroTonnages);
            }
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.additionalFilters = this.additionalFilters;
            this.listAndSearchComponent.loadData(true);
        } else {
            return;
        }
    }
}
