import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../core/services/authorization.service';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { FABType } from '../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AtlasFormControl } from '../../shared/entities/atlas-form-control';
import { Counterparty } from '../../shared/entities/counterparty.entity';
import { FloatingActionButtonActions } from '../../shared/entities/floating-action-buttons-actions.entity';
import { InvoiceType } from '../../shared/entities/invoice-type.entity';
import { MasterData } from '../../shared/entities/masterdata.entity';
import { InvoiceDataLoader } from '../../shared/services/list-and-search/invoice-data-loader';
import { CounterPartyDataLoader } from '../../shared/services/masterdata/counterparty-data-loader';
import { SecurityService } from '../../shared/services/security.service';
import { UtilService } from '../../shared/services/util.service';
import { ListAndSearchComponent } from './../../shared/components/list-and-search/list-and-search.component';
import { ListAndSearchFilter } from './../../shared/entities/list-and-search/list-and-search-filter.entity';
import { InvoiceTypes } from './../../shared/enums/invoice-type.enum';
import { ListAndSearchFilterType } from './../../shared/enums/list-and-search-filter-type.enum';
import { PermissionLevels } from './../../shared/enums/permission-level.enum';
import { InvoiceHomeSearch } from './../../shared/services/execution/dtos/invoice-home-search';
import { TitleService } from './../../shared/services/title.service';

@Component({
    selector: 'atlas-execution-invoicing-home',
    templateUrl: './execution-invoicing-home.component.html',
    styleUrls: ['./execution-invoicing-home.component.scss'],
    providers: [InvoiceDataLoader, CounterPartyDataLoader],
})
export class ExecutionInvoicingHomeComponent implements OnInit {

    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    company: string;
    invoiceTypeId: number;
    gridCode = 'invoiceList';

    invoices: InvoiceHomeSearch[];
    showInvoices: boolean;
    invoiceTypeMap: Map<number, string> = new Map<number, string>();
    invoiceReferenceCtrl: FormControl = new FormControl();
    showResults: boolean;
    invoiceTypeMenuItems: InvoiceType[];
    PermissionLevels = PermissionLevels;
    additionalFilters: ListAndSearchFilter[] = [];
    filteredCounterPartyList: Counterparty[];
    masterdata: MasterData = new MasterData();
    counterPartyCtrl = new AtlasFormControl('CounterPartyHomeInvoice');
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Counter Party not in the list.');
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;
    loadOnInit = false;

    constructor(private securityService: SecurityService,
        private router: Router,
        private route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        public dataLoader: InvoiceDataLoader,
        public counterpartyDataLoader: CounterPartyDataLoader,
        protected utilService: UtilService,
        private authorizationService: AuthorizationService,
        private titleService: TitleService) {

    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.securityService.isSecurityReady().subscribe(() => {
            this.company = this.route.snapshot.paramMap.get('company');
        });
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.counterPartyCtrl.valueChanges.subscribe((input) => {
            this.filterCounterParty(input);
        });
        this.initFABActions();
    }

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onQuickSearchButtonClicked();
        }
    }
    onNewInvoiceButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/invoicing/new']);
    }

    onQuickSearchButtonClicked() {
        this.additionalFilters = [];
        let searchCounterParty: string;
        if (this.counterPartyCtrl.value) {
            searchCounterParty = (this.counterPartyCtrl.value as Counterparty).counterpartyCode;
            if (!searchCounterParty) {
                searchCounterParty = this.counterPartyCtrl.value;
            }
        }
        const invoicereferenceField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'InvoiceCode');
        const counterpartyCodeField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'CounterParty');
        if (!this.listAndSearchComponent) {
            return;
        } else {
            if (this.invoiceReferenceCtrl.value && invoicereferenceField) {
                const filterInvoiceReference = new ListAndSearchFilter();
                filterInvoiceReference.fieldId = invoicereferenceField.fieldId;
                filterInvoiceReference.fieldName = invoicereferenceField.fieldName;
                filterInvoiceReference.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.invoiceReferenceCtrl.value + '%',
                };
                filterInvoiceReference.isActive = true;
                this.additionalFilters = [filterInvoiceReference];
            }
            if (this.counterPartyCtrl.value && counterpartyCodeField) {
                const filterCounterParty = new ListAndSearchFilter();
                filterCounterParty.fieldId = counterpartyCodeField.fieldId;
                filterCounterParty.fieldName = counterpartyCodeField.fieldName;
                filterCounterParty.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: searchCounterParty + '%',
                };
                filterCounterParty.isActive = true;
                this.additionalFilters.push(filterCounterParty);
            }
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }

    onQuickNavigate(event) {
        let invoiceOption = event.invoiceId;
        const invoiceType = event.invoiceTypeId;
        const originalInvoiceType = event.originalInvoiceTypeId;
        const orginalInvoiceId = event.data.orginalInvoiceId;
        if (originalInvoiceType && orginalInvoiceId) {
            if (invoiceType === InvoiceTypes.Reversal) {
                invoiceOption = orginalInvoiceId;
            }
        }
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/summary/' + encodeURIComponent(invoiceOption)],
            {
                queryParams: { invoiceType, originalInvoiceType },
                skipLocationChange: true,
            });
    }

    onInvoiceRowClicked(event) {
        let invoiceOption = event.data.invoiceId;
        const invoiceType = event.data.invoiceTypeId;
        const originalInvoiceType = event.data.originalInvoiceTypeId;
        const originalInvoiceId = event.data.originalInvoiceId;
        if (originalInvoiceType && originalInvoiceId) {
            if (invoiceType === InvoiceTypes.Reversal) {
                invoiceOption = originalInvoiceId;
            }
        }
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/summary/' + encodeURIComponent(invoiceOption)],
            {
                queryParams: { invoiceType, originalInvoiceType },
                skipLocationChange: true,
            });
    }

    initFABActions() {
        this.fabTitle = 'CREATE INVOICE';
        this.fabType = FABType.ExtendedSingleButton;

        const actionCreateInvoice: FloatingActionButtonActions = {
            icon: 'add',
            text: 'CREATE INVOICE',
            action: 'createInvoice',
            disabled: false,
            index: 0,
        };

        if (this.checkInvoiceCreationPrivilege()) {
            this.fabMenuActions.push(actionCreateInvoice);
        }

        this.isLoaded = true;
    }

    checkInvoiceCreationPrivilege() {
        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Invoices')) {
            if (this.authorizationService.isPrivilegeAllowed(
                this.company, 'InvoiceCreation', PermissionLevels.ReadWrite)) {
                return true;
            } else {
                return false;
            }
        }
    }

    onFabActionClicked(action: string) {
        this.onNewInvoiceButtonClicked();
    }
}
