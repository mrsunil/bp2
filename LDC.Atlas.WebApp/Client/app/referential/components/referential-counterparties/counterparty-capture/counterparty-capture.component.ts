import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleService } from '../../../../shared/services/title.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { CounterpartyCaptureFormMainTabComponent } from './main-tab/counterparty-capture-form-main-tab.component';
import { CounterpartyCaptureFormAddressTabComponent } from './address-tab/counterparty-capture-form-address-tab.component';
import { CounterpartyCaptureFormContactTabComponent } from './contact-tab/counterparty-capture-form-contact-tab.component';
import { CounterpartyCaptureFormBankAccountTabComponent } from './bank-account-tab/counterparty-capture-form-bank-account-tab.component';
import { CounterpartyCaptureFormTaxInfoTabComponent } from './tax-info-tab/counterparty-capture-form-tax-info-tab.component';
import { CounterpartyCaptureFormReportTabComponent } from './report-tab/counterparty-capture-form-report-tab.component';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { CounterpartyHeaderComponent } from './counterparty-header/counterparty-header.component';
import { UtilService } from '../../../../shared/services/util.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Subscription } from 'rxjs';
import { SecurityService } from '../../../../shared/services/security.service';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { PermissionLevels } from './../../../../shared/enums/permission-level.enum';
import { CounterpartyManagementMenuBarComponent } from './counterparty-management-menu-bar/counterparty-management-menu-bar.component';
import { CounterpartyAddress } from './../../../../shared/entities/counterparty-address.entity';
import { MasterData } from './../../../../shared/entities/masterdata.entity';
import { Company } from './../../../../shared/entities/company.entity';
import { MdmCategoryAccountTypeMapping } from './../../../../shared/mdmCategory-account-mapping-entity';

@Component({
    selector: 'atlas-counterparty-capture',
    templateUrl: './counterparty-capture.component.html',
    styleUrls: ['./counterparty-capture.component.scss']
})
export class CounterpartyCaptureComponent extends BaseFormComponent implements OnInit, OnDestroy {

    @ViewChild('headerComponent') headerComponent: CounterpartyHeaderComponent;
    @ViewChild('menuComponent') menuComponent: CounterpartyManagementMenuBarComponent;
    @ViewChild('mainTabComponent') mainTabComponent: CounterpartyCaptureFormMainTabComponent;
    @ViewChild('addressTabComponent') addressTabComponent: CounterpartyCaptureFormAddressTabComponent;
    @ViewChild('contactTabComponent') contactTabComponent: CounterpartyCaptureFormContactTabComponent;
    @ViewChild('bankAccountTabComponent') bankAccountTabComponent: CounterpartyCaptureFormBankAccountTabComponent;
    @ViewChild('taxInfoTabComponent') taxInfoTabComponent: CounterpartyCaptureFormTaxInfoTabComponent;
    @ViewChild('reportTabComponent') reportTabComponent: CounterpartyCaptureFormReportTabComponent;

    public selectedTab: number = 0;
    isLoading: boolean = false;
    isShow: boolean = true;
    isEdit: boolean = false;
    saveInProgress: boolean;
    counterPartyId: number;
    company: string;
    creationDate: string;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    captureCounterpartyFormGroup: FormGroup;
    statusClassApplied: string;
    counterpartyStatus: string = '';
    onValidationState = false;
    counterPartyStatusTypeCtrl = new AtlasFormControl('counterPartyStatusTypeCtrl');
    model: Counterparty;
    subscriptions: Subscription[] = [];
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    isCreateMode: boolean = false;
    isEditMode: boolean = false;
    isViewMode: boolean = false;
    isEditExceptionPrivilege: boolean = false;
    isReadWritePermission: boolean = false;
    mainAddress: any;
    counterpartyAddresses: CounterpartyAddress[] = [];
    companyId: number;
    masterdata: MasterData;
    filteredCompany: Company[];
    mappedData: MdmCategoryAccountTypeMapping[] = [];

    constructor(
        protected formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private titleService: TitleService,
        protected dialog: MatDialog,
        protected masterDataService: MasterdataService,
        protected utilService: UtilService,
        private companyManager: CompanyManagerService,
        private router: Router,
        protected snackbarService: SnackbarService,
        protected securityService: SecurityService, private authorizationService: AuthorizationService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.isLoading = true;
        this.company = this.route.snapshot.params['company'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCompany = this.masterdata.companies;
        this.companyId = this.filteredCompany.find((company) => company.companyId === this.company).id;

        this.securityService.isSecurityReady().subscribe(() => {

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Referential')) {

                let permissionLevel: number;
                permissionLevel = this.authorizationService.getPermissionLevel(this.company, 'TradingAndExecution', 'Referential');
                if (permissionLevel == PermissionLevels.ReadWrite) {
                    this.menuComponent.isEditCounterpartyPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'TradingAndExecution');
                }
            }
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Referential')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'TradingAndExecution')) {
                this.isEditExceptionPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'EditCounterparty');
            }
            if (!this.authorizationService.isAdministrator(this.company)) {
                this.addressTabComponent.addressDetailComponent.isDeleteDisabled = true;
                this.bankAccountTabComponent.bankAccountDetailsComponent.isDeleteDisabled = true;
                this.contactTabComponent.contactDetailCardComponent.isDeleteDisabled = true;
                this.taxInfoTabComponent.isDeleteDisabled = true;
            }
            else {
                this.mainTabComponent.informationCardComponent.isAdmin = true;
                this.mainTabComponent.thirdSystemCodesCardComponent.isAdmin = true;
                this.headerComponent.isAdmin = true;
                this.addressTabComponent.addressDetailComponent.isDeleteDisabled = false;
                this.bankAccountTabComponent.bankAccountDetailsComponent.isDeleteDisabled = false;
                this.contactTabComponent.contactDetailCardComponent.isDeleteDisabled = false;
                this.taxInfoTabComponent.isDeleteDisabled = false;
            }
        });

        this.captureCounterpartyFormGroup = this.formBuilder.group({
            headerGroup: this.headerComponent.getFormGroup(),
            mainTabComponent: this.mainTabComponent.getFormGroup(),
            addressTabComponent: this.addressTabComponent.getFormGroup(),
            contactTabComponent: this.contactTabComponent.getFormGroup(),
        });

        if (this.route.snapshot.data.formId === 'CounterPartyCapture') {
            this.isCreateMode = true;
        }
        if (this.route.snapshot.data.formId === 'CounterPartyDisplay') {
            this.isViewMode = true;
            this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
            this.captureCounterpartyFormGroup.disable();
        }
        if (this.route.snapshot.data.formId === 'CounterPartyEdit') {
            this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
            this.isEditMode = true;
        }

        if (this.counterPartyId && this.counterPartyId > 0) {
            if (!this.isViewMode) {
                this.titleService.setTitle("Counterparty Edit");
            } else {
                this.titleService.setTitle("Counterparty View");
            }
            this.masterDataService
                .getCounterpartyById(this.counterPartyId)
                .subscribe((data) => {
                    let counterparty: any = data;
                    if (counterparty) {
                        this.fillValues(counterparty);
                    }
                });
        }
        else {
            this.isLoading = false;
            this.titleService.setTitle("Capture Counterparty");
        }

        this.masterDataService
            .getMdmCategoryAccountTypeMapping()
            .subscribe((data) => {
                this.mappedData = data.value;
            });


        this.cdr.detectChanges();
    }

    fillValues(counterparty: Counterparty) {
        this.model = counterparty;
        this.headerComponent.accountRefCtrl.patchValue(this.model.counterpartyCode);
        this.headerComponent.accountTitleCtrl.patchValue(this.model.description);
        this.headerComponent.creationDateCtrl.patchValue(counterparty.createdDateTime.toDateString());
        this.headerComponent.createdByCtrl.patchValue(counterparty.createdBy);
        this.model.counterpartyCompanies.forEach((comp) => {

            if (comp.companyId === this.companyId) {
                this.headerComponent.isDeactivated = comp.isDeactivated;
            }
        });

        if (counterparty.modifiedDateTime) {
            this.headerComponent.lastAmendedByCtrl.patchValue(counterparty.modifiedDateTime.toDateString());
            this.headerComponent.isShowLastAmendedBy = true;
            this.headerComponent.modifiedDateCtrl.patchValue(counterparty.modifiedBy);
        }

        this.model.associatedCompanies = this.model.counterpartyCompanies;
        this.mainTabComponent.informationCardComponent.populateValue(this.model);
        this.mainTabComponent.informationCardComponent.nameCtrl.patchValue(this.model.description);
        this.mainTabComponent.informationCardComponent.accountTypeCtrl.patchValue(this.model.accountTypeName);
        this.mainTabComponent.informationCardComponent.departmentCtrl.patchValue(this.model.departmentCode);
        this.mainTabComponent.informationCardComponent.departmentDescriptionCtrl.patchValue(this.model.departmentName);
        this.mainTabComponent.informationCardComponent.fiscalRegCtrl.patchValue(this.model.fiscalRegistrationNumber);

        this.updateRandomId(this.model);

        this.mainAddress = this.model.counterpartyAddresses.find((address) => address.main);
        if (!this.mainAddress && this.model.counterpartyAddresses && this.model.counterpartyAddresses.length > 0) {
            this.mainAddress = this.model.counterpartyAddresses[0];
        }

        if (this.mainAddress) {

            this.mainTabComponent.mainAddressCardComponent.populateValues(this.mainAddress);

            this.mainTabComponent.mainAddressCardComponent.addressTypeCodeCtrl.patchValue(this.mainAddress.addressTypeCode);
            this.mainTabComponent.mainAddressCardComponent.addressTypeNameCtrl.patchValue(this.mainAddress.addressTypeCode);
            this.mainTabComponent.mainAddressCardComponent.address1Ctrl.patchValue(this.mainAddress.address1);
            this.mainTabComponent.mainAddressCardComponent.address2Ctrl.patchValue(this.mainAddress.address2);
            this.mainTabComponent.mainAddressCardComponent.zipCodeCtrl.patchValue(this.mainAddress.zipCode);
            this.mainTabComponent.mainAddressCardComponent.cityCtrl.patchValue(this.mainAddress.city);
            this.mainTabComponent.mainAddressCardComponent.emailCtrl.patchValue(this.mainAddress.mail);
            this.mainTabComponent.mainAddressCardComponent.phoneNumberCtrl.patchValue(this.mainAddress.phoneNo);
            this.mainTabComponent.mainAddressCardComponent.faxNumberCtrl.patchValue(this.mainAddress.faxNo);
            this.mainTabComponent.mainAddressCardComponent.ldcRegionCtrl.patchValue(this.mainAddress.ldcRegionCode);
            this.mainTabComponent.mainAddressCardComponent.provinceCtrl.patchValue(this.model.provinceName);
            this.mainTabComponent.mainAddressCardComponent.countryCtrl.patchValue(this.model.countryName);
        }

        this.addressTabComponent.addressComponent.counterpartyAddresses = this.model.counterpartyAddresses;
        this.addressTabComponent.addressComponent.populateValue();
        this.contactTabComponent.contactCardComponent.contactData = this.model.counterpartyContacts;
        this.contactTabComponent.contactCardComponent.populateValue();
        this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData = this.model.counterpartyBankAccounts;
        if (this.model.counterpartyBankAccountIntermediaries) {
            if (this.model.counterpartyBankAccountIntermediaries[0]) {
                this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary1 = this.model.counterpartyBankAccountIntermediaries[0];
            }
            if (this.model.counterpartyBankAccountIntermediaries[1]) {
                this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary2 = this.model.counterpartyBankAccountIntermediaries[1];
            }
        }
        this.taxInfoTabComponent.counterpartyTaxes = this.model.counterpartyTaxes;
        this.taxInfoTabComponent.initTaxsGridRows();

        this.mainTabComponent.thirdSystemCodesCardComponent.populateValue(this.model);

        this.mainTabComponent.alternateMailingCardComponent.populateValue(this.model);

        this.mainTabComponent.customerDefaultCardComponent.populateContractTermValue(this.model);

        this.isLoading = false;
    }

    updateRandomId(model: Counterparty) {
        if (model) {
            let counter = 1;
            if (model.counterpartyAddresses) {
                model.counterpartyAddresses.forEach((address) => {
                    address.randomId = counter;
                    counter++;
                });
            }

            if (model.counterpartyContacts) {
                counter = 1;
                model.counterpartyContacts.forEach((contact) => {
                    contact.randomId = counter;
                    counter++;
                });
            }

            if (model.counterpartyBankAccounts) {
                counter = 1;
                model.counterpartyBankAccounts.forEach((bankAccount) => {
                    bankAccount.randomId = counter;
                    counter++;
                });
            }
        }
    }

    ngOnDestroy(): void {

    }

    onSaveButtonClicked() {
        this.saveInProgress = true;
        this.onValidationState = true;
        this.utilService.updateFormGroupValidity(this.captureCounterpartyFormGroup);

        if (this.captureCounterpartyFormGroup.pending) {
            this.captureCounterpartyFormGroup.statusChanges.subscribe(() => {
                if (this.onValidationState) {
                    this.onValidationState = false;
                    this.handleSave();
                }
            });
        } else {
            this.onValidationState = false;
            this.handleSave();
        }
    }

    handleSave() {
        try {
            if (!this.headerComponent.formGroup.valid) {
                this.snackbarService.throwErrorSnackBar(
                    'Form is invalid. Please resolve the errors.',
                );
                this.saveInProgress = false;
                return;
            }
            if (!this.mainTabComponent.formGroup.valid) {
                this.snackbarService.throwErrorSnackBar(
                    'Form is invalid. Please resolve the errors.',
                );
                this.saveInProgress = false;
                return;
            }

            if (!this.taxInfoTabComponent.validate()) {
                this.snackbarService.throwErrorSnackBar(
                    'Form is invalid. Please resolve the errors.',
                );
                this.saveInProgress = false;
                return;
            }

            if (!this.model) {
                this.model = new Counterparty();
            }
            this.model.counterpartyAddresses = [];

            this.headerComponent.populateEntity(this.model);
            this.mainTabComponent.informationCardComponent.populateEntity(this.model);
            if (this.model.counterpartyCompanies.length == 0) {
                this.snackbarService.throwErrorSnackBar(
                    'please select the associated company.',
                );
                this.saveInProgress = false;
                return;
            }

            this.mainTabComponent.mainAddressCardComponent.updateEntity(this.model, this.mainAddress);
            this.mainTabComponent.customerDefaultCardComponent.populateEntity(this.model);
            this.mainTabComponent.alternateMailingCardComponent.populateEntity(this.model);
            this.mainTabComponent.thirdSystemCodesCardComponent.populateEntity(this.model);

            if (this.addressTabComponent.addressComponent.counterpartyAddresses && this.addressTabComponent.addressComponent.counterpartyAddresses.length > 0) {
                let counter = 0;
                this.addressTabComponent.addressComponent.counterpartyAddresses.forEach((address) => {

                    if (this.model.counterpartyAddresses.find((add) => add.addressId == address.addressId &&
                        add.randomId == address.randomId && !address.isDeactivated)) {
                        if (address.main) {
                            this.counterpartyAddresses[counter] = this.model.counterpartyAddresses[0];
                        }
                        else {
                            this.model.counterpartyAddresses[0].main = false;
                            this.counterpartyAddresses[counter] = this.model.counterpartyAddresses[0];
                        }
                    }
                    else {
                        this.counterpartyAddresses.push(address);
                    }
                    counter++;
                });
                this.model.counterpartyAddresses = this.counterpartyAddresses;
            }

            this.model.counterpartyContacts = this.contactTabComponent.contactCardComponent.contactData;
            this.model.counterpartyBankAccounts = this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData;
            if (this.model.counterpartyBankAccounts && this.model.counterpartyBankAccounts.length > 0) {
                this.model.counterpartyBankAccountIntermediaries = [];
                this.model.counterpartyBankAccountIntermediaries.push(this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary1);
                this.model.counterpartyBankAccountIntermediaries.push(this.bankAccountTabComponent.bankAccountListComponent.bankAccountsData[0].bankAccountIntermediary2);
            }
            else {
                this.model.counterpartyBankAccountIntermediaries = [];
            }
            this.model.counterpartyTaxes = this.taxInfoTabComponent.counterpartyTaxes;

            this.updateCounerpartyId(this.model);

            this.subscriptions.push(this.masterDataService
                .addOrUpdateCounterparty(this.model)
                .subscribe((data: any[]) => {
                    if (data) {
                        this.saveInProgress = false
                        if (this.isCreateMode) {
                            this.snackbarService.informationSnackBar('Counterparty has been created successfully.');
                        }
                        else if (this.isEditMode) {
                            this.snackbarService.informationSnackBar('Counterparty has been updated successfully.');
                        }
                        this.goToCounterPartyDetails(data[0]);
                    }
                    else {
                        this.saveInProgress = false
                    }
                },
                    (err) => {
                        this.saveInProgress = false
                        console.error(err);
                        this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    }));
        }
        catch (ex) {
            this.saveInProgress = false;
            console.error(ex);
        }
    }


    updateCounerpartyId(model: Counterparty) {
        if (model.counterpartyID) {
            if (model.counterpartyAccountTypes) {
                model.counterpartyAccountTypes.forEach((obj) => {
                    obj.counterpartyID = model.counterpartyID;
                });
            }

            if (model.counterpartyCompanies) {
                model.counterpartyCompanies.forEach((obj) => {
                    obj.counterpartyId = model.counterpartyID;
                    if (obj.companyId === this.companyId) {
                        obj.c2CCode = model.c2CCode;
                        obj.isDeactivated = model.isDeactivated;
                    }
                });
                model.isDeactivated = false;
                model.c2CCode = '';
            }

            if (model.counterpartyContacts) {
                model.counterpartyContacts.forEach((obj) => {
                    obj.counterpartyId = model.counterpartyID;
                    obj.main = obj.isFavorite;
                });
            }

            if (model.counterpartyAddresses) {
                model.counterpartyAddresses.forEach((obj) => {
                    obj.counterpartyId = model.counterpartyID;
                    obj.main = obj.main;
                });
            }

            if (model.counterpartyBankAccounts) {
                model.counterpartyBankAccounts.forEach((obj) => {
                    obj.counterpartyId = model.counterpartyID;
                });
            }

            if (model.counterpartyTaxes) {
                model.counterpartyTaxes.forEach((obj) => {
                    obj.counterpartyId = model.counterpartyID;
                });
            }

            if (model.counterpartyMdmCategory) {
                model.counterpartyMdmCategory.forEach((obj) => {
                    obj.counterpartyID = model.counterpartyID;
                });
            }
        }
    }

    OnSaveMethodCalled() {
        this.onSaveButtonClicked();
    }
    onLocalViewModeCalled(event: any) {
        if (event && event.value && event.value === "Local") {
            if (this.model.associatedCompanies && this.model.associatedCompanies.length > 0) {
                const company = this.model.associatedCompanies.find((c) => c.companyName == this.company);
                if (company) {
                    this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue(company.c2CCode);
                }
                else {
                    this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue('');
                }
            }
            else {
                this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue('');
            }
        }
        else {
            this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.patchValue('');
        }

        if (event && event.value && event.value === "Local" &&
            this.isEditMode && this.isEditExceptionPrivilege) {
            this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.enable();
            this.mainTabComponent.informationCardComponent.departmentCtrl.enable();
            this.headerComponent.isLocalViewMode = true;
        }
        else {
            this.mainTabComponent.thirdSystemCodesCardComponent.c2cCodeCtrl.disable();
            this.mainTabComponent.informationCardComponent.departmentCtrl.disable();
            this.headerComponent.isLocalViewMode = false;
        }
    }

    goToCounterPartyDetails(counterPartyId: number) {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/referential/counterparty/display', counterPartyId]);
    }

    onCancelButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/referential/masterdata/counterparties']);
    }
}