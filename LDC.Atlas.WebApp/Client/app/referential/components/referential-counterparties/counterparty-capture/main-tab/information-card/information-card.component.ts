import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control'
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { Trader } from '../../../../../../shared/entities/trader.entity';
import { TradingService } from '../../../../../../shared/services/http-services/trading.service';
import { UtilService, nameof } from '../../../../../../shared/services/util.service';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { Department } from '../../../../../../shared/entities/department.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { DepartmentDataLoader } from '../../../../../../shared/services/masterdata/department-data-loader';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Counterparty } from '../../../../../../shared/entities/counterparty.entity';
import { MatDialog } from '@angular/material';
import { AssociatedCounterpartiesCompanyComponent } from './associated-company/associated-counterparties-company.component';
import { CounterpartyTradeStatus } from '../../../../../../shared/entities/counterparty-trade-status.entity';
import { Company } from '../../../../../../shared/entities/company.entity';
import { AccountType } from '../../../../../../shared/entities/account-type.entity';
import { CounterpartyAccountType } from '../../../../../../shared/entities/counterparty-account-type.entity';
import { CounterpartyCompany } from '../../../../../../shared/entities/counterparty-company.entity';
import { ActivatedRoute } from '@angular/router';
import { Province } from '../../../../../../shared/entities/province.entity';
import { Country } from '../../../../../../shared/entities/country.entity';
import { ContractTerm } from '../../../../../../shared/entities/contract-term.entity';
import { MdmCategoryAccountTypeMapping } from '../../../../../../shared/mdmCategory-account-mapping-entity';


@Component({
    selector: 'atlas-information-card',
    templateUrl: './information-card.component.html',
    styleUrls: ['./information-card.component.scss'],
    providers: [DepartmentDataLoader],
})

export class InformationCardComponent extends BaseFormComponent implements OnInit {
    @ViewChild('associatedCounterpartiesCompanyComponent') associatedCounterpartiesCompanyComponent: AssociatedCounterpartiesCompanyComponent;

    nameCtrl = new AtlasFormControl('Name');
    accountTypeCtrl = new AtlasFormControl('AccountType');
    accountManagerCtrl = new AtlasFormControl('AccountManager');
    tradeStatusCtrl = new AtlasFormControl('tradeStatus');
    headOfFamilyCtrl = new AtlasFormControl('HeadOfFamily');
    departmentCtrl = new AtlasFormControl('Department');
    departmentDescriptionCtrl = new AtlasFormControl('DepartmentDescription');
    fiscalRegCtrl = new AtlasFormControl('FiscalReg');
    associatedCompaniesCtrl = new AtlasFormControl('AssociatedCompanies');
    counterpartyMainInformationFormGroup: FormGroup;
    filteredAccountManagers: Trader[];
    accountManagers: Trader[] = [];
    filteredDepartments: Department[];
    filteredCompany: Company[];
    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Province,
        MasterDataProps.Ports,
        MasterDataProps.AccountTypes,
        MasterDataProps.ContractTerms,
        MasterDataProps.Departments,
        MasterDataProps.TradeStatus
    ];

    accountTypes: AccountType[];
    selectedAccountTypes: CounterpartyAccountType[];
    filteredAccountTypes: AccountType[];
    checkedAccountTypes: AccountType[];
    accountTypesSelect: string[] = ['name'];
    headofFamily: Counterparty[];
    headOfFamilyFiltered: Counterparty[];
    headofFamilyControl: Counterparty;
    headOfFamilySelect: string[] = ['counterpartyCode'];
    counterpartyTradeStatusList: CounterpartyTradeStatus[] = [];
    counterpartyTradeStatusDisplayProperty: string[] = ['enumEntityValue'];
    @Input() isViewMode: boolean = false;
    @Input() isEditMode: boolean = false;
    @Output() selectedAccountTypesOptions = new EventEmitter<any>();
    associatedCompanies: CounterpartyCompany[];

    isAdmin: boolean = false;
    filteredProvince: Province[];
    filteredCountry: Country[];
    inputErrorMap: Map<string, string> = new Map();
    nameErrorMap: Map<string, string> = new Map();

    headOfFamilyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Counterparty not in the list.');
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Counterparty not in the list.');

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected tradingService: TradingService,
        protected utilService: UtilService,
        public departmentDataLoader: DepartmentDataLoader,
        private route: ActivatedRoute,
        protected masterdataService: MasterdataService,
        protected dialog: MatDialog, ) {
        super(formConfigurationProvider);
        this.inputErrorMap.set('maxlength', 'Maximum 20 charcters Allowed');
        this.nameErrorMap.set('maxlength', 'Maximum 200 charcters Allowed');
    }

    ngOnInit() {
        this.associatedCompaniesCtrl.disable();
        if (this.isEditMode && !this.isAdmin) {
            this.nameCtrl.disable();
            this.tradeStatusCtrl.disable();
        }

        this.tradingService.getAllTraders()
            .subscribe((traders) => {
                this.accountManagers = this.filteredAccountManagers = traders.value;
                this.accountManagerCtrl.valueChanges.subscribe((input) => {
                    this.filteredAccountManagers = this.utilService.filterListforAutocomplete(
                        input,
                        this.accountManagers,
                        ['samAccountName', 'firstName', 'lastName'],
                    );
                });
                this.setValidatorsforAccount();
            });

        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.accountTypes = this.masterdata.accountTypes;

                this.filteredDepartments = this.masterdata.departments;
                this.departmentCtrl.valueChanges.subscribe((input) => {

                    this.filteredDepartments = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.departments,
                        ['departmentCode', 'description'],
                    );
                });

                this.headofFamily = this.masterdata.counterparties;
                this.counterpartyTradeStatusList = this.masterdata.tradeStatus;

                this.headOfFamilyFiltered = this.headofFamily;
                this.headOfFamilyCtrl.valueChanges.subscribe((input) => {
                    this.headOfFamilyFiltered = this.utilService.filterListforAutocomplete(
                        input,
                        this.headofFamily,
                        ['counterpartyCode', 'description'],
                    );
                });

                this.setDefaultTrade();
                this.setValidators();
            });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            nameCtrl: this.nameCtrl,
            accountTypeCtrl: this.accountTypeCtrl,
            accountManagerCtrl: this.accountManagerCtrl,
            tradeStatusCtrl: this.tradeStatusCtrl,
            headOfFamilyCtrl: this.headOfFamilyCtrl,
            departmentCtrl: this.departmentCtrl,
            departmentDescriptionCtrl: this.departmentDescriptionCtrl,
            fiscalRegCtrl: this.fiscalRegCtrl,
            associatedCompaniesCtrl: this.associatedCompaniesCtrl,
        });
        this.associatedCompaniesCtrl.disable();
        return super.getFormGroup();
    }
    optionSelected(data: any) {
        this.selectedAccountTypes = [];
        data.forEach(element => {
            this.selectedAccountTypes.push(element);
        });

        this.selectedAccountTypesOptions.emit(this.selectedAccountTypes);
    }

    onCounterpartyIdSelected(value: Counterparty) {
        this.headOfFamilyCtrl.patchValue(this.headOfFamilyCtrl.value);
    }

    onChangeButtonClicked() {
        const openCostMatrixDialog = this.dialog.open(AssociatedCounterpartiesCompanyComponent, {
            width: '45%',
            data: {
                matrixData: this.associatedCompanies,
            },
        });
        openCostMatrixDialog.afterClosed().subscribe((selectedCompanies) => {
            if (selectedCompanies !== null &&
                typeof (selectedCompanies) === "object" &&
                selectedCompanies.length > 0) {
                let associateCompanies: String = '';

                selectedCompanies.forEach(element => {
                    if (element.companyId) {
                        associateCompanies = element.companyId + ', ' + associateCompanies;
                    }
                });

                if (associateCompanies != '') {
                    associateCompanies = associateCompanies.trim();
                    associateCompanies = associateCompanies.substr(0, associateCompanies.length - 1);
                    this.associatedCompaniesCtrl.patchValue(associateCompanies);
                }
            }
        });
    }

    onSelectionChanged(event: any) {
        const selectedDepartment = this.masterdata.departments.find(
            (department) => department.departmentCode === event.option.value,
        );
        if (selectedDepartment) {
            this.departmentDescriptionCtrl.patchValue(selectedDepartment.description);
        }
        else {
            this.departmentDescriptionCtrl.patchValue('');
        }
    }

    getDepartmentId(code: string): number {
        const selectedDepartment = this.masterdata.departments.find(
            (department) => department.departmentCode === code,
        );
        if (selectedDepartment) {
            return selectedDepartment.departmentId;
        }
        return null;
    }

    setValidatorsforAccount() {
        this.accountManagerCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.filteredAccountManagers,
                    nameof<Trader>('samAccountName'),
                ),
            ]),
        );

    }

    setValidators() {
        this.departmentCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.departments,
                    nameof<Department>('departmentCode'),
                ),
            ]),
        );

        this.nameCtrl.setValidators(
            Validators.compose([Validators.required, Validators.maxLength(200)]),
        );

        this.tradeStatusCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.associatedCompaniesCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.fiscalRegCtrl.setValidators(
            Validators.compose([Validators.maxLength(20)]),
        );

        this.formGroup.updateValueAndValidity();
    }

    displayAccountManager(userId: number): string {
        if (userId) {
            const selectedUser = this.accountManagers.find(
                (user) => user.userId === userId,
            );

            if (selectedUser) {
                return selectedUser.displayName;
            }
        }
        return '';
    };

    getAccountManager(name: string) {
        if (name) {
            const selectedUser = this.accountManagers.find(
                (user) => user.samAccountName === name,
            );

            if (selectedUser) {
                return selectedUser.userId;
            }
        }
        return null;
    };

    setDefaultTrade() {
        this.tradeStatusCtrl.patchValue(this.counterpartyTradeStatusList.find((status) =>
            status.enumEntityValue === 'Trade'));
    }

    getTradeId(name: string): number {
        if (name) {
            const selectedTrade = this.counterpartyTradeStatusList.find(
                (trade) => trade.enumEntityValue === name,
            );

            if (selectedTrade) {
                return selectedTrade.enumEntityId;
            }
        }
        return null;
    }

    getHeadOfFamily(name: string): number {
        if (name) {
            const selectedHeadOfFamily = this.headofFamily.find(
                (family) => family.name === name,
            );

            if (selectedHeadOfFamily) {
                return selectedHeadOfFamily.counterpartyID;
            }
        }
        return null;
    }

    getAssociatedCompanies(model: Counterparty, selectedNames: string) {
        let associatedCompanies: CounterpartyCompany[] = [];

        if (selectedNames) {
            let selectedNameList = selectedNames.split(",");
            if (selectedNameList && selectedNameList.length > 0) {
                selectedNameList.forEach((company) => {
                    const selectedCompany: any = this.masterdata.companies.find(
                        (comp) => comp.companyId === company.trim(),
                    );

                    if (selectedCompany) {
                        let counterpartyCompany = new CounterpartyCompany();
                        counterpartyCompany.companyId = selectedCompany.id;
                        counterpartyCompany.isDeactivated = false;
                        associatedCompanies.push(counterpartyCompany);
                    }
                });

                const availableCompanies = this.masterdata.companies;
                availableCompanies.forEach((company) => {
                    const selectedCompany: any = associatedCompanies.find(
                        (comp) => comp.companyId === company.id,
                    );
                    if (!selectedCompany) {
                        let counterpartyCompany = new CounterpartyCompany();
                        counterpartyCompany.companyId = company.id;
                        counterpartyCompany.isDeactivated = true;
                        associatedCompanies.push(counterpartyCompany);
                    }
                });
            }

            if (associatedCompanies && associatedCompanies.length > 0 &&
                model.counterpartyCompanies && model.counterpartyCompanies.length > 0) {
                associatedCompanies.forEach((company) => {
                    const selectedCompany: any = model.counterpartyCompanies.find(
                        (comp) => comp.companyId === company.companyId,
                    );
                    if (selectedCompany) {
                        company.c2CCode = selectedCompany.c2CCode;
                    }
                });
            }
        }
        return associatedCompanies;
    }

    getAssociatedCompanyNameById(id: number) {
        let companyName: string = "";
        const selectedCompany: any = this.masterdata.companies.find(
            (comp) => comp.companyId === "",
        );

        if (selectedCompany) {
            companyName = selectedCompany.companyId;
        }
        return companyName;
    }

    populateEntity(model: Counterparty) {
        model.name = this.nameCtrl.value;
        model.description = this.nameCtrl.value;
        model.counterpartyAccountTypes = this.accountTypeCtrl.value;
        model.acManagerId = this.getAccountManager(this.accountManagerCtrl.value);
        model.counterpartyTradeStatusId = this.tradeStatusCtrl.value.enumEntityId;
        model.headofFamily = (this.headOfFamilyCtrl.value) ? this.headOfFamilyCtrl.value.counterpartyID : null;
        model.departmentId = this.getDepartmentId(this.departmentCtrl.value);
        model.fiscalRegistrationNumber = this.fiscalRegCtrl.value;
        model.counterpartyCompanies = this.getAssociatedCompanies(model, this.associatedCompaniesCtrl.value);
    }


    populateValue(model: Counterparty) {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCountry = this.masterdata.countries;
        this.filteredProvince = this.masterdata.provinces;
        this.filteredDepartments = this.masterdata.departments;
        this.filteredCompany = this.masterdata.companies;
        this.filteredAccountManagers = this.accountManagers;
        this.headOfFamilyFiltered = this.masterdata.counterparties;
        this.filteredAccountTypes = this.masterdata.accountTypes;
        this.counterpartyTradeStatusList = this.masterdata.tradeStatus;

        if (model.countryId) {
            let country = this.filteredCountry.find((country) => country.countryId === model.countryId);
            if (country) {
                model.countryName = country.description;
            }
        }

        if (model.provinceId) {
            let province = this.filteredProvince.find((province) => province.provinceId === model.provinceId);
            if (province) {
                model.provinceName = province.description;
            }
        }

        if (model.departmentId) {
            let department = this.filteredDepartments.find((department) => department.departmentId === model.departmentId);
            if (department) {
                model.departmentCode = department.departmentCode;
                model.departmentName = department.description;
            }
            else {
                model.departmentName = '';
            }
        }
        else {
            model.departmentName = '';
        }

        if (model.associatedCompanies) {
            this.associatedCompanies = model.associatedCompanies;
            let companyName: string = "";
            model.associatedCompanies.forEach((comp) => {
                if (!comp.isDeactivated) {
                    let company = this.filteredCompany.find((company) => company.id === comp.companyId);
                    if (company) {
                        comp.companyName = company.companyId;
                    }
                    companyName = comp.companyName + "," + companyName;
                }
            });
            companyName = companyName.substr(0, companyName.length - 1);
            this.associatedCompaniesCtrl.patchValue(companyName);
        }

        if (model.headofFamily) {
            this.headofFamilyControl = this.headOfFamilyFiltered.find((headValue) => headValue.counterpartyID === model.headofFamily);
            this.headOfFamilyCtrl.patchValue(this.headofFamilyControl);
        }

        if (model.counterpartyAccountTypes) {
            this.checkedAccountTypes = [];
            this.selectedAccountTypes = [];
            model.counterpartyAccountTypes.forEach(element => {
                let accountType = this.filteredAccountTypes.find((accountType) => accountType.accountTypeId === element.accountTypeId);
                if (accountType) {
                    element.name = accountType.name;
                    this.checkedAccountTypes.push(accountType);
                    this.selectedAccountTypes.push(element);
                }
            });

            this.accountTypeCtrl.patchValue(this.checkedAccountTypes);
        }

        if (model.counterpartyTradeStatusId) {
            const tradeStatus = this.counterpartyTradeStatusList.find((status) =>
                status.enumEntityId === model.counterpartyTradeStatusId);
            if (tradeStatus) {
                this.tradeStatusCtrl.patchValue(this.counterpartyTradeStatusList.find((status) =>
                    status.enumEntityValue === tradeStatus.enumEntityValue));
            }
        }

        this.tradingService.getAllTraders()
            .subscribe((traders) => {
                if (traders.value) {
                    this.filteredAccountManagers = traders.value;
                    if (model.acManagerId && this.filteredAccountManagers) {
                        let acManager = this.filteredAccountManagers.find((manager) => manager.userId === model.acManagerId);
                        if (acManager) {
                            model.acManagerName = acManager.samAccountName;
                            this.accountManagerCtrl.patchValue(model.acManagerName);
                        }
                        else {
                            this.accountManagerCtrl.patchValue('');
                        }
                    }
                }
            });
    }
}

