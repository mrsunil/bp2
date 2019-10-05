import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../shared/entities/company-configuration.entity';
import { CreateCompany } from '../../../../shared/entities/create-company.entity';
import { UserAccountList } from '../../../../shared/entities/user-account.entity';
import { UserProfileList } from '../../../../shared/entities/user-profile.entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../shared/services/http-services/configuration.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UtilService } from '../../../../shared/services/util.service';
import { CompanyManagementComponent } from '../company-management/company-management.component';
import { InvoiceTabComponent } from '../company-management/invoice-tab/invoice-tab.component';
import { CompanyManagementMainTabComponent } from '../company-management/main-tab/company-management-main-tab.component';
import { PhysicalsTabComponent } from '../company-management/physicals-tab/physicals-tab.component';
import { TaxTabComponent } from '../company-management/tax-tab/tax-tab.component';
import { MasterDataFieldComponent } from '../company-settings/master-data-field/master-data-field.component';
import { TransactionDataComponent } from '../company-settings/transaction-data/transaction-data.component';
import { UserAccountComponent } from '../company-settings/user-account/user-account.component';
import { UserPrivilegesComponent } from '../company-settings/user-privileges/user-privileges.component';

@Component({
    selector: 'atlas-copy-company',
    templateUrl: './copy-company.component.html',
    styleUrls: ['./copy-company.component.scss'],
})
export class CopyCompanyComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('masterDataField') masterDataField: MasterDataFieldComponent;
    @ViewChild('userPrivileges') userPrivileges: UserPrivilegesComponent;
    @ViewChild('userAccounts') userAccounts: UserAccountComponent;
    @ViewChild('transactionData') transactionData: TransactionDataComponent;
    @ViewChild('companyManagement') companyManagement: CompanyManagementComponent;
    @ViewChild('companyCreation') companyCreation: CompanyManagementComponent;
    @ViewChild('companyManagementMainTabComponent') companyManagementMainTabComponent: CompanyManagementMainTabComponent;
    @ViewChild('physicalsTabComponent') physicalsTabComponent: PhysicalsTabComponent;
    @ViewChild('invoiceTabComponent') invoiceTabComponent: InvoiceTabComponent;
    @ViewChild('taxTabComponent') taxTabComponent: TaxTabComponent;

    transactionDataCtrl = new AtlasFormControl('TransactionDataSelection');
    companyFriendlyCodeCtrl: any;
    companyNameCtrl: any;
    model: CreateCompany;
    currentStep: number = 0;
    isCompanyView: boolean = false;
    isUserPrivilegesSelected: boolean = false;
    isUserPrivilegesRowChanged: boolean = false;
    isUserAccountsSelected: boolean = false;
    copyCompanyFormGroup: FormGroup;
    formComponents: BaseFormComponent[] = [];
    selectedProfileIds: number[] = [];
    subscription: Subscription[] = [];
    userAccountsList: UserAccountList[];
    isCounterpartySelected: boolean;
    CompanyConfiguration: CompanyConfiguration;
    isSaveInProgress: boolean;
    currentCompany: string;
    companyId: string;
    isCopyCompany: boolean;
    isMasterdataNextButtonClicked: boolean = false;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private router: Router,
        private route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        protected configurationService: ConfigurationService,
        protected utilService: UtilService,
        protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected formBuilder: FormBuilder,
        private userIdentityService: UserIdentityService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCopyCompany = (this.route.snapshot.data.isCopy) ? true : false;
        this.copyCompanyFormGroup = this.formBuilder.group({
            masterDataField: this.masterDataField.getFormGroup(),
            userPrivileges: this.userPrivileges.getFormGroup(),
            userAccounts: this.userAccounts.getFormGroup(),
            transactionData: this.transactionData.getFormGroup(),
            companyConfigurationHeader: this.companyCreation.companyConfigurationHeader.getFormGroup(),
            companyManagementMainTabComponent: this.companyCreation.companyManagementMainTabComponent.getFormGroup(),
            physicalsTabComponent: this.companyCreation.physicalsTabComponent.getFormGroup(),
            invoiceTabComponent: this.companyCreation.invoiceTabComponent.getFormGroup(),
            taxTabComponent: this.companyCreation.taxTabComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.masterDataField,
            this.transactionData,
            this.userPrivileges,
            this.userAccounts,
            this.companyCreation,
        );
        this.companyManagement.loadConfigurationData(false, this.companyId);
        this.companyCreation.loadConfigurationData(true, this.companyId);

    }

    onStepActionChanged(event) {
        this.currentStep = event.selectedIndex;
    }

    isCounterpartyToggleEnabled(counterpartySelected: boolean) {
        this.isCounterpartySelected = counterpartySelected;
    }

    userPrivilegesEvent(event) {
        this.isUserPrivilegesSelected = event;
    }

    userPrivilegeRowChangedEvent(event: boolean) {
        this.isUserPrivilegesRowChanged = event;
    }

    userAccountEvent(event) {
        this.isUserAccountsSelected = event;
    }

    onNextButtonClicked() {
        this.stepper.next();
    }

    onSummaryViewNextButtonClicked() {
        this.stepper.next();
    }

    onMasterDataNextButtonClicked() {
        if (!this.isMasterdataNextButtonClicked) {
            this.companyCreation.companyConfigurationHeader.companyCodeCtrl.setValue(null);
            this.companyCreation.companyConfigurationHeader.companyCodeCtrl.setErrors({ notUnique: false });
            this.companyCreation.companyConfigurationHeader.companyCodeCtrl.enable();
            this.companyCreation.companyConfigurationHeader.companyFriendlyCodeCtrl.setValue(null);
            this.companyCreation.companyConfigurationHeader.companyClientCodeCtrl.setValue(null);
            this.companyCreation.companyConfigurationHeader.companyNameCtrl.setValue(null);
            this.companyCreation.companyManagementMainTabComponent.identityComponent.formGroup.setValue({
                legalEntityCtrl: '',
                legalEntityNameCtrl: '',
                functionalCcyCtrl: null,
                statutoryCcyCtrl: null,
                companyTypeCtrl: null,
                companyPlatformCtrl: null,
            });
            this.isMasterdataNextButtonClicked = true;
        }

        if (!this.isCounterpartySelected) {
            this.companyCreation.companyClientCodeCtrl.disable();
            this.transactionData.transactionDataCtrl.setValue(false);
            this.transactionData.transactionDataCtrl.disable();
        } else {
            this.companyCreation.companyClientCodeCtrl.enable();
            this.transactionData.transactionDataCtrl.enable();
        }
        this.stepper.next();
    }

    onUserPrivilegeNextButtonClicked() {
        if (!this.isUserPrivilegesSelected) {
            this.nextButtonDialog();
            this.userAccounts.getUserAccounts(null);
        } else {
            if (this.isUserPrivilegesRowChanged) {
                this.profileSelected();
                this.stepper.next();
                this.isUserPrivilegesRowChanged = false;
            } else {
                this.stepper.next();
            }

        }
    }

    onUserAccountNextButtonClicked() {
        if (!this.isUserAccountsSelected) {
            this.nextButtonDialog();
        } else {
            this.stepper.next();
        }
    }

    onPreviousButtonClicked() {
        this.stepper.previous();
    }

    onDiscardButtonClicked() {
        this.discardButtonDialog();
    }

    profileSelected() {
        const selectedProfiles = this.userPrivileges.selectedProfileList as UserProfileList[];
        this.selectedProfileIds = [];
        selectedProfiles.forEach((element) => {
            this.selectedProfileIds.push(element.profileId);
        });
        if (this.selectedProfileIds) {
            this.userIdentityService.getUsersByProfileId(this.selectedProfileIds, this.companyId).subscribe((data) => {
                if (data) {
                    this.userAccountsList = data.value;
                    this.userAccounts.getUserAccounts(this.userAccountsList);
                }
            });
        }
    }

    onSaveButtonClicked() {
        if (!this.companyCreation.companyConfigurationHeader.companyCodeCtrl.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Company Id is already Used.',
            );
            return;
        }
        const mainTabInfo = this.companyCreation.companyManagementMainTabComponent.mainTabFormGroup;
        const mainPhysicalsInfo = this.companyCreation.physicalsTabComponent.mainPhysicalsComponent.physicalsTabMainPhysicalsFormGroup;
        this.utilService.updateFormGroupValidity(mainTabInfo);
        if (!mainTabInfo.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Main tab is invalid. Please resolve the errors.',
            );
            return;
        }

        this.utilService.updateFormGroupValidity(mainPhysicalsInfo);
        if (!mainPhysicalsInfo.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Physicals tab - Main physicals is invalid. Please resolve the errors.',
            );
            return;
        }
        this.utilService.updateFormGroupValidity(this.copyCompanyFormGroup);
        if (!this.copyCompanyFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        }
        this.getCompanyDetails();
        this.isSaveInProgress = true;
        this.subscription.push(this.configurationService.createCompanyByCopy(this.model)
            .pipe(catchError((error) => {
                return throwError(error);
            }),   finalize(() => {
                this.isSaveInProgress = false;
            }),
            ).subscribe(() => {
                const messageText = 'The company ' + this.model.companyConfiguration.companyId + ' is successfully created';
                this.snackbarService.informationSnackBar(messageText);
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/companies']);
            }));
    }

    getCompanyDetails() {
        this.model = new CreateCompany();
        this.model.companyId = this.companyCreation.companyFriendlyCodeCtrl.value;
        this.formComponents.forEach((comp) => {
            if (comp === this.companyCreation) {
                this.model.companyConfiguration = this.companyCreation.getCompanyConfigurationDetails();
            } else {
                this.model = comp.populateEntity(this.model);
            }
        });
    }

    discardButtonDialog() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                    '/admin/companies']);
            }
        });
    }

    nextButtonDialog() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Next Step',
                text: 'You haven’t selected any data from this Screen. Do you wish to proceed?',
                okButton: 'Proceed',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.stepper.next();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }
}
