import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject, Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CompanyTabIndex } from '../../../../admin/entities/company-tab-index';
import { AdminActionsService } from '../../../../admin/services/admin-actions.service';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { InvoiceSetupResult } from '../../../../shared/dtos/invoice-setup-result';
import { AccountingFieldSetup } from '../../../../shared/entities/accounting-field-setup.entity';
import { AllocationSetUp } from '../../../../shared/entities/allocation-set-up-entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../shared/entities/company-configuration.entity';
import { CompanySetup } from '../../../../shared/entities/company-setup.entity';
import { Company } from '../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { FloatingActionButtonActions } from '../../../../shared/entities/floating-action-buttons-actions.entity';
import { InvoiceSetup } from '../../../../shared/entities/invoice-Setup.entity';
import { MandatoryTradeApprovalImageSetup } from '../../../../shared/entities/mandatory-trade-fields';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { RetentionPolicy } from '../../../../shared/entities/retention-policy.entity';
import { TradeConfiguration } from '../../../../shared/entities/trade-configuration-entity';
import { Freeze } from '../../../../shared/enums/freeze.enum';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../../../shared/services/authorization/dtos/user-company-privilege';
import { CompanyConfigurationRecord } from '../../../../shared/services/configuration/dtos/company-configuration-record';
import { IntercoNoIntercoEmails } from '../../../../shared/services/configuration/dtos/interco-no-interco-emails';
import { InterfaceSetup } from '../../../../shared/services/execution/dtos/interface-setup';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UtilService } from '../../../../shared/services/util.service';
import { AccountingTabComponent } from './accounting-tab/accounting-tab.component';
import { CompanyMenuBarComponent } from './company-menu-bar/company-menu-bar.component';
import { HeaderFormComponent } from './header-form/header-form.component';
import { InterfaceTabComponent } from './interface-tab/interface-tab.component';
import { InvoiceTabComponent } from './invoice-tab/invoice-tab.component';
import { ItparametersTabComponent } from './itparamters-tab/itparameters-tab.component';
import { CompanyManagementMainTabComponent } from './main-tab/company-management-main-tab.component';
import { DefaultBrokerComponent } from './main-tab/default-broker/default-broker.component';
import { PhysicalsTabComponent } from './physicals-tab/physicals-tab.component';
import { TaxTabComponent } from './tax-tab/tax-tab.component';

@Component({
    selector: 'atlas-company-management',
    templateUrl: './company-management.component.html',
    styleUrls: ['./company-management.component.scss'],
})
export class CompanyManagementComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('companyManagementMainTabComponent') companyManagementMainTabComponent: CompanyManagementMainTabComponent;
    @ViewChild('physicalsTabComponent') physicalsTabComponent: PhysicalsTabComponent;
    @ViewChild('invoiceTabComponent') invoiceTabComponent: InvoiceTabComponent;
    @ViewChild('taxTabComponent') taxTabComponent: TaxTabComponent;
    @ViewChild('accountingTabComponent') accountingTabComponent: AccountingTabComponent;
    @ViewChild('interfaceTabComponent') interfaceTabComponent: InterfaceTabComponent;
    @ViewChild('itparametersTabComponent') itparametersTabComponent: ItparametersTabComponent;
    @ViewChild('companyConfigurationHeader') companyConfigurationHeader: HeaderFormComponent;
    @ViewChild('companyManagementMenuBarComponent') companyManagementMenuBarComponent: CompanyMenuBarComponent;
    @ViewChild('defaultBrokerComponent') defaultBrokerComponent: DefaultBrokerComponent;

    companyFriendlyCodeCtrl = new AtlasFormControl('CompanyFriendlyCode');
    companyNameCtrl = new AtlasFormControl('CompanyName');
    companyClientCodeCtrl = new AtlasFormControl('CompanyClientCode');
    public selectedTab: number = 0;
    model: CompanyConfiguration;
    subscription: Subscription[] = [];
    company: string;
    currentCompany: string;
    isCopy: boolean = false;
    isEdit: boolean = false;
    isDeleteBtnDisabled: boolean = true;
    companyId: string;
    isFrozen: boolean;
    isCompanyIdRequired: boolean = false;
    offsetLeft: number;
    frozenStatus: boolean;
    companyConfigurationFormGroup: FormGroup;
    destroy$ = new Subject();
    filteredCounterparties: Counterparty[];
    formComponents: BaseFormComponent[] = [];
    masterData: MasterData;
    companySetupMainInformation: CompanySetup;
    companySetupPhysicals: CompanySetup;
    companyConfigurationRecord: CompanyConfigurationRecord;
    companySetup: Company[] = [];
    invoiceSetup: InvoiceSetupResult;
    interfaceSetup: InterfaceSetup;
    tradeSetupData: TradeConfiguration;
    intercoNoIntercoEmailSetupData: IntercoNoIntercoEmails[] = [];
    createCompany: boolean = false;
    copyCompany: boolean = false;
    isUnique: boolean = true;
    allocationSetup: AllocationSetUp[] = [];
    PermissionLevels = PermissionLevels;
    fabTitle: string;
    fabType: FABType;
    isLoading = true;
    editCompanyActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'CompanyConfRead',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Administration',
        privilegeParentLevelTwo: null,
    };
    fabMenuActions: FloatingActionButtonActions[] = [];
    mandatoryTradeFields: MandatoryTradeApprovalImageSetup[] = [];
    accountingmandatoryFields: AccountingFieldSetup[] = [];
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    companyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');
    tabValue: string;
    isMenuBarVisible: boolean;
    isCopyCompany: boolean;
    isSaveInProgress = false;
    now: moment.Moment;
    sideNavState: boolean;
    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private companyManager: CompanyManagerService,
        protected formBuilder: FormBuilder,
        protected configurationService: ConfigurationService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        private cdr: ChangeDetectorRef,
        public dialog: MatDialog,
        private router: Router,
        private titleService: TitleService,
        private authorizationService: AuthorizationService,
        protected adminActionsService: AdminActionsService,
    ) {

        super(formConfigurationProvider);
        this.now = this.companyManager.getCurrentCompanyDate();

    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCopyCompany = (this.route.snapshot.data.isCopy) ? true : false;
        this.isEdit = (this.route.snapshot.data.isEdit) ? true : false;
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyConfigurationFormGroup = this.formBuilder.group({
            companyConfigurationHeader: this.companyConfigurationHeader.getFormGroup(),
            companyManagementMainTabComponent: this.companyManagementMainTabComponent.getFormGroup(),
            physicalsTabComponent: this.physicalsTabComponent.getFormGroup(),
            invoiceTabComponent: this.invoiceTabComponent.getFormGroup(),
            taxTabComponent: this.taxTabComponent.getFormGroup(),
            accountingTabComponent: this.accountingTabComponent.getFormGroup(),
            interfaceTabComponent: this.interfaceTabComponent.getFormGroup(),
            itparametersTabComponent: this.itparametersTabComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.companyConfigurationHeader,
            this.companyManagementMainTabComponent,
            this.physicalsTabComponent,
            this.invoiceTabComponent,
            this.taxTabComponent,
            this.accountingTabComponent,
            this.interfaceTabComponent,
            this.itparametersTabComponent,
        );

        this.cdr.detectChanges();
        if (!this.isCopyCompany) {
            if (this.companyId) {
                this.initFABActions();
                this.isLoading = false;
                this.viewEditCompanyConfiguration();
            } else {
                this.createFromScratchDialog();
                this.initFABActions();
                this.isLoading = false;
                this.isMenuBarVisible = false;
                this.titleService.setTitle('Company Creation');
            }
        } else {
            this.isMenuBarVisible = false;
            this.titleService.setTitle('Copy Company');
        }
    }

    createFromScratchDialog() {
        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Global Master Data',
                text: 'Global master data will be available automatically for the newly created company',
                okButton: 'Ok',
            },
        });
    }

    isSideNavOpened(value: boolean) {
        this.sideNavState = value;
    }

    viewEditCompanyConfiguration() {
        if (this.isEdit) {
            this.isMenuBarVisible = false;
            this.tabValue = this.route.snapshot.paramMap.get('tabIndex');
            if (this.tabValue) {
                this.selectedTab = Number(this.tabValue);
            }
        } else {
            this.isMenuBarVisible = true;
        }
        this.loadConfigurationData(this.isEdit, this.companyId);
    }

    getPosition(event) {
        this.selectedTab = event.index;
        return { offsetLeft: this.offsetLeft };
    }

    loadConfigurationData(isEdit: boolean, companyId: string) {
        this.companyConfigurationRecord = new CompanyConfigurationRecord();
        this.tabValue = this.route.snapshot.paramMap.get('tabIndex');
        if (this.tabValue) {
            this.selectedTab = Number(this.tabValue);
        }
        this.isSaveInProgress = true;
        this.subscriptions.push(this.configurationService.getCompanyConfigurationDetails(companyId, this.now.year())
            .subscribe((companyConfigurationRecord: CompanyConfigurationRecord) => {
                if (companyConfigurationRecord) {
                    if (this.isMenuBarVisible) {
                        this.frozenStatus = companyConfigurationRecord.companySetup.isFrozen;
                        this.SetFrozenStatus();
                    }
                    this.companyConfigurationRecord = companyConfigurationRecord;

                    this.formComponents.forEach((comp) => {
                        if (comp) {
                            comp.initForm(this.companyConfigurationRecord, isEdit);
                        }
                    });
                    this.isSaveInProgress = false;
                }
            }));
    }

    SetFrozenStatus() {
        if (this.companyManagementMenuBarComponent) {
            this.companyManagementMenuBarComponent.freezeValue = this.frozenStatus
                ? Freeze.Unfreeze : Freeze.Freeze;
        }
    }

    initFABActions() {
        this.fabTitle = 'Company Add/Edit FAB mini';
        this.fabType = FABType.MiniFAB;

        const actionItemSave: FloatingActionButtonActions = {
            icon: 'save',
            text: 'Save',
            action: 'save',
            disabled: false,
            index: 2,
        };
        const actionItemCancel: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Cancel',
            action: 'cancel',
            disabled: false,
            index: 3,
        };

        const actionItemEdit: FloatingActionButtonActions = {
            icon: 'edit',
            text: 'Edit Company',
            action: 'editCompany',
            index: 0,
            disabled: false,
        };

        const actionItemCreate: FloatingActionButtonActions = {
            icon: 'add',
            text: 'Create Company',
            action: 'createCompany',
            index: 1,
            disabled: false,
        };
        if (this.companyId) {
            if (!this.isEdit) {
                this.fabMenuActions.push(actionItemCreate);
                const editCompanyPrivilegeLevel = this.authorizationService.getPermissionLevel(
                    this.companyId,
                    this.editCompanyActionPrivilege.privilegeName,
                    this.editCompanyActionPrivilege.privilegeParentLevelOne,
                    this.editCompanyActionPrivilege.privilegeParentLevelTwo);

                const hasEditCompanyPrivilege = (editCompanyPrivilegeLevel >= this.editCompanyActionPrivilege.permission);
                if (hasEditCompanyPrivilege) {
                    this.fabMenuActions.push(actionItemEdit);
                }
            } else {
                this.fabMenuActions.push(actionItemCancel);
                actionItemSave.disabled = this.isSaveInProgress;
                this.fabMenuActions.push(actionItemSave);
            }
        } else {
            this.fabMenuActions.push(actionItemCancel);
            actionItemSave.disabled = this.isSaveInProgress;
            this.fabMenuActions.push(actionItemSave);
        }
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'save': {
                this.onSaveButtonClicked();
                break;
            }
            case 'cancel': {
                this.onDiscardButtonClicked();
                break;
            }
            case 'createCompany': {
                this.onCreateButtonClicked();
                break;
            }
            case 'editCompany': {
                this.onEditButtonClicked();
                break;
            }
        }
    }

    onCreateButtonClicked() {
        this.adminActionsService.createCompanySubject.next();
    }

    onEditButtonClicked() {
        if (this.companyManagementMenuBarComponent.freezeValue === Freeze.Unfreeze) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    text: 'User will not be able to edit configuration for this company anymore',
                    okButton: 'Ok',
                },
            });
        } else {
            this.adminActionsService.editCompanySubject.next(new CompanyTabIndex(this.companyId, this.selectedTab));
        }
    }

    onDiscardButtonClicked() {
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
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/companies']);
            }
        });
    }

    onSaveButtonClicked() {
        if (!this.companyId) {
            if (!this.companyConfigurationHeader.companyCodeCtrl.valid) {
                this.snackbarService.throwErrorSnackBar(
                    'Company Id is already Used.',
                );
                return;
            }
        }
        this.utilService.updateFormGroupValidity(this.companyManagementMainTabComponent.mainTabFormGroup);
        if (!this.companyManagementMainTabComponent.mainTabFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Main tab is invalid. Please resolve the errors.',
            );
            return;
        }

        this.utilService.updateFormGroupValidity(this.physicalsTabComponent.mainPhysicalsComponent.physicalsTabMainPhysicalsFormGroup);
        if (!this.physicalsTabComponent.mainPhysicalsComponent.physicalsTabMainPhysicalsFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Physicals tab - Main physicals is invalid. Please resolve the errors.',
            );
            return;
        }
        if (!this.accountingTabComponent.defaultAccountComponent.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Accounting Tab - Default Account is invalid. Please resolve the errors',
            );
            return;
        }
        if (!this.accountingTabComponent.defaultCostTypeComponent.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Accounting Tab - Default Cost type is invalid. Please resolve the errors',
            );
            return;
        }
        this.utilService.updateFormGroupValidity(this.interfaceTabComponent.accountingInterfaceComponent.accountingInterfaceFormGroup);
        if (!this.interfaceTabComponent.accountingInterfaceComponent.accountingInterfaceFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Interface tab - Accounting Interface is invalid. Please resolve the errors.',
            );
            return;
        }

        this.utilService.updateFormGroupValidity(this.interfaceTabComponent.treasurySystemComponent.treasurySystemFormGroup);
        if (!this.interfaceTabComponent.treasurySystemComponent.treasurySystemFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Interface tab - Treasury Interface is invalid. Please resolve the errors.',
            );
            return;
        }

        this.utilService.updateFormGroupValidity(this.companyConfigurationFormGroup);
        if (!this.companyConfigurationFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        }
        // validate ITParameter Tab details
        // 1-validate accountingparameter details
        if (!this.itparametersTabComponent.accountingParameterComponent.isValidAccountingForm) {
            this.snackbarService.throwErrorSnackBar(
                'IT Parameter tab form is invalid. Please resolve the errors.',
            );
            return;
        }
        // 2-validate tradeparameter details
        if (!this.itparametersTabComponent.tradeParameterComponent.isValidTradeForm) {
            this.snackbarService.throwErrorSnackBar(
                'IT Parameter tab form is invalid. Please resolve the errors.',
            );
            return;
        }
        this.getCompanyConfigurationDetails();
        if (this.companyId) {
            this.updateCompanyConfiguration(this.model);
        } else {
            this.createCompanyConfiguration(this.model);
        }
    }

    createCompanyConfiguration(createCompanyModel: CompanyConfiguration) {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Local Master Data, User Privileges and User Accounts',
                // tslint:disable-next-line:max-line-length
                text: 'The new company will be created. Local master data, user priveleges and user accounts should be updated for the new company in the referentials, user profiles and user accounts page',
                okButton: 'Ok',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.isSaveInProgress = true;
                this.subscription.push(this.configurationService.createCompanyConfiguration(createCompanyModel)
                    .pipe(
                        catchError((error) => {
                            return throwError(error);
                        }),
                        finalize(() => {
                            this.isSaveInProgress = false;
                        }),
                    ).subscribe((data) => {
                        const messageText = 'The company ' + createCompanyModel.companyId + ' is successfully created';
                        this.snackbarService.informationSnackBar(messageText);
                        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/companies']);
                    }));
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

    updateCompanyConfiguration(updateCompanyModel: CompanyConfiguration) {
        this.isSaveInProgress = true;
        this.subscriptions.push(this.configurationService.updateCompanyConfiguration(updateCompanyModel)
            .pipe(
                catchError((error) => {
                    return throwError(error);
                }),
                finalize(() => {
                    this.isSaveInProgress = false;
                }),
            ).subscribe((data) => {
                const messageText = 'The company ' + updateCompanyModel.companyId + ' settings are successfully saved';
                this.snackbarService.informationSnackBar(messageText);
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/companies']);
                // tslint:disable-next-line: align
            }, (err) => {
                throw err;
            }));
    }

    getCompanyConfigurationDetails(): CompanyConfiguration {
        this.model = new CompanyConfiguration();
        this.model.companySetup = new CompanySetup();
        this.model.invoiceSetup = new InvoiceSetup();
        this.companySetupMainInformation = new CompanySetup();
        this.companySetupPhysicals = new CompanySetup();
        this.model.retentionPolicy = new RetentionPolicy();
        this.formComponents.forEach((comp) => {
            if (comp === this.companyManagementMainTabComponent) {
                this.model = comp.populateEntity(this.model);
                if (this.companyManagementMainTabComponent.defaultBrokerComponent
                    && this.companyManagementMainTabComponent.defaultBrokerComponent.bankBrokerId) {
                    this.model.companySetup.defaultBrokerId = this.companyManagementMainTabComponent.defaultBrokerComponent.bankBrokerId;
                }
                this.companySetupMainInformation = this.model.companySetup;
            } else if (comp === this.physicalsTabComponent) {
                this.model = comp.populateEntity(this.model);
                this.companySetupPhysicals = this.model.companySetup;
                this.model.companySetup = this.companySetupMainInformation;
                this.model.companySetup.cropYearFormatId = this.companySetupPhysicals.cropYearFormatId;
                this.model.companySetup.isProvinceEnable = this.physicalsTabComponent
                    .mainPhysicalsComponent.isProvinceActivationToggleChecked;
                this.model.companySetup.defaultBranchId = this.companySetupPhysicals.defaultBranchId;
                this.model.companySetup.defaultProvinceId = this.companySetupPhysicals.defaultProvinceId;
                this.model.companySetup.priceUnitId = this.companySetupPhysicals.priceUnitId;
            } else {
                this.model = comp.populateEntity(this.model);
            }
        });
        return this.model;
    }

}
