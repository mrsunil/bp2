import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ListAndSearchComponent } from '../../../shared/components/list-and-search/list-and-search.component';
import { AccountType } from '../../../shared/entities/account-type.entity';
import { Counterparty } from '../../../shared/entities/counterparty.entity';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { ListAndSearchFilterType } from '../../../shared/enums/list-and-search-filter-type.enum';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { ReferentialCounterpartiesDataLoader } from '../../../shared/services/list-and-search/referentialCounterparties-data-loader';
import { TitleService } from '../../../shared/services/title.service';
import { UtilService } from '../../../shared/services/util.service';
import { ReferentialCounterpartyTabComponent } from '../referential-counterparty-tab/referential-counterparty-tab.component';

@Component({
    selector: 'atlas-referential-counterparties',
    providers: [ReferentialCounterpartiesDataLoader],
    templateUrl: './referential-counterparties.component.html',
    styleUrls: ['./referential-counterparties.component.scss'],
})
export class ReferentialCounterpartiesComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    @ViewChild('referentialComponent') referentialComponent: ReferentialCounterpartyTabComponent;

    gridCode = 'referentialCounterPartiesGrid';
    company: string;
    accountReferenceCtrl: FormControl = new FormControl();
    counterPartyTypeCtrl: FormControl = new FormControl();
    additionalFilters: ListAndSearchFilter[] = [];
    filteredAccTypesList: AccountType[];
    allAccTypesList: AccountType[];
    masterdata: MasterData;

    snapshotErrorMap: Map<string, string> = new Map<string, string>();
    filteredCounterPartyList: Counterparty[];
    counterpartyValue: string;
    clientNameValue: string;
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Counterparties];

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');

    counterpartyId: number;
    searchedCounterpartyCode: string;
    isAutoCompleteActivated: boolean = true;
    isLocalViewModeSelected: boolean = false;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        private companyManager: CompanyManagerService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        private router: Router,
        public dataLoader: ReferentialCounterpartiesDataLoader,
        private titleService: TitleService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.masterData = this.route.snapshot.data.masterdata;
        this.filterCounterparties();
        this.allAccTypesList = this.masterData.accountTypes;
        this.filteredAccTypesList = this.masterData.accountTypes;
        this.counterPartyTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredAccTypesList = this.utilService.filterListforAutocomplete(
                input,
                this.allAccTypesList,
                ['name'],
            );
        });
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
                // this.onCounterpartyIdSelected(this.accountReferenceCtrl.value);
            }
        });
    }

    onCounterpartyIdSelected(value: Counterparty) {
        this.counterpartyValue = this.accountReferenceCtrl.value;
    }

    onQuickSearchButtonClicked() {
        if (this.accountReferenceCtrl.value && typeof this.accountReferenceCtrl.value === 'object') {
            this.accountReferenceCtrl.patchValue(this.accountReferenceCtrl.value);
        }
        if (this.counterPartyTypeCtrl.value && typeof this.counterPartyTypeCtrl.value === 'object') {
            this.counterPartyTypeCtrl.patchValue(this.counterPartyTypeCtrl.value);
        }

        if (!this.listAndSearchComponent) {
            return;
        }

        this.additionalFilters = [];
        const accountRefField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'CounterpartyCode');
        const accountRefTypeField = this.listAndSearchComponent.columnConfiguration
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
                this.additionalFilters.push(filterAccountsRef);
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
            this.additionalFilters.push(filterContractNo);
        }

        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);

    }

    onCounterPartyRowClicked(event) {
        if (event) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/display',
            event.data.counterpartyID]);
        }
    }

    onLocalViewModeCalled(event: any) {
        if (event && event === 1) {
            this.isLocalViewModeSelected = true;
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('c2CCode', true);
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('tradeStatus', true);
        } else {
            this.isLocalViewModeSelected = false;
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('c2CCode', false);
            this.listAndSearchComponent.agGridColumnApi.setColumnVisible('tradeStatus', false);
        }
        this.listAndSearchComponent.loadData(true);
    }

    onConfigurationLoaded() {
        this.listAndSearchComponent.columnConfiguration.filter((colProperties) =>
            colProperties.fieldName === 'C2CCode'||  colProperties.fieldName ==='TradeStatus'  || colProperties.fieldName === 'IsDeactivated',
        ).forEach((colProperties) => colProperties.isVisible = this.isLocalViewModeSelected);
    }
}
