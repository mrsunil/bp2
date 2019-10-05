import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CompanyConfiguration } from '../../../../../shared/entities/company-configuration.entity';
import { DefaultAccountingSetupResult } from '../../../../../shared/entities/default-accounting-setup-result.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { DefaultAccountComponent } from './default-account/default-account.component';
import { DefaultCostTypeComponent } from './default-cost-type/default-cost-type.component';
import { MainAccountingComponent } from './main-accounting/main-accounting.component';
import { OthersComponent } from './others/others.component';

@Component({
    selector: 'atlas-accounting-tab',
    templateUrl: './accounting-tab.component.html',
    styleUrls: ['./accounting-tab.component.scss'],
})
export class AccountingTabComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    @ViewChild('mainAccountingComponent') mainAccountingComponent: MainAccountingComponent;
    @ViewChild('defaultAccountComponent') defaultAccountComponent: DefaultAccountComponent;
    @ViewChild('defaultCostTypeComponent') defaultCostTypeComponent: DefaultCostTypeComponent;
    @ViewChild('othersComponent') othersComponent: OthersComponent;
    @ViewChild('mainAccountingSideNav') mainAccountingSideNav: MatSidenav;
    @ViewChild('defaultAccountingSideNav') defaultAccountingSideNav: MatSidenav;
    @ViewChild('defaultCostTypeSideNav') defaultCostTypeSideNav: MatSidenav;
    @ViewChild('othersSideNav') othersSideNav: MatSidenav;
    formComponents: BaseFormComponent[] = [];
    accountingTabFormGroup: FormGroup;
    companyConfigurationRecord: CompanyConfigurationRecord;
    company: string;
    masterData: MasterData[];
    isEdit: boolean;
    hideDefaultAccountSideNav: boolean;
    hideMainAccountSideNav: boolean;
    hideDefaultCostTypeSideNav: boolean;
    hideOthersSideNav: boolean;
    mainAccountingSetupComponent: string = 'MainAccountingComponent';
    defaultAccountSetupComponent: string = 'DefaultAccountComponent';
    defaultCostTypeSetupComponent: string = 'DefaultCostTypeComponent';
    othersTypeComponent: string = 'OthersComponent';
    nominalAccountResult: DefaultAccountingSetupResult;
    costTypeResult: DefaultAccountingSetupResult;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('companyId');
        this.masterData = this.route.snapshot.data.masterdata;
        this.isSideNavOpened.emit(false);
        this.formComponents.push(
            this.mainAccountingComponent,
            this.defaultCostTypeComponent,
            this.defaultAccountComponent,
            this.othersComponent,
        );
    }

    sideNavOpened(event: boolean) {
        this.isSideNavOpened.emit(event);
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        this.formComponents.forEach((comp) => {
            if (comp === this.defaultAccountComponent) {
                entity = comp.populateEntity(entity);
                this.nominalAccountResult = entity.defaultAccountingSetup;
            } else if (comp === this.defaultCostTypeComponent) {
                entity = comp.populateEntity(entity);
                this.costTypeResult = entity.defaultAccountingSetup;
            } else {
                entity = comp.populateEntity(entity);
            }
        });
        this.populateAccoutingSetupValues(entity.defaultAccountingSetup);
        return entity;
    }

    populateAccoutingSetupValues(defaultAccountingSetup: DefaultAccountingSetupResult): DefaultAccountingSetupResult {
        // Binding the cost type value
        defaultAccountingSetup.cashReceivedCostTypeId = this.costTypeResult.cashReceivedCostTypeId;
        defaultAccountingSetup.cashPaidCostTypeId = this.costTypeResult.cashPaidCostTypeId;
        defaultAccountingSetup.purchaseInvoiceCostTypeId = this.costTypeResult.purchaseInvoiceCostTypeId;
        defaultAccountingSetup.salesInvoiceCostTypeId = this.costTypeResult.salesInvoiceCostTypeId;
        defaultAccountingSetup.washoutInvoiceGainsCostTypeId = this.costTypeResult.washoutInvoiceGainsCostTypeId;
        defaultAccountingSetup.washoutInvoiceLossCostTypeId = this.costTypeResult.washoutInvoiceLossCostTypeId;
        defaultAccountingSetup.fxRevalCostTypeId = this.costTypeResult.fxRevalCostTypeId;
        defaultAccountingSetup.yepCostTypeId = this.costTypeResult.yepCostTypeId;
        defaultAccountingSetup.cancellationGainCostTypeId = this.costTypeResult.cancellationGainCostTypeId;
        defaultAccountingSetup.cancellationLossCostTypeId = this.costTypeResult.cancellationLossCostTypeId;
        // Binding the nominal Account Values
        defaultAccountingSetup.accountingSetupId = this.nominalAccountResult.accountingSetupId;
        defaultAccountingSetup.defaultBankAccountId = this.nominalAccountResult.defaultBankAccountId;
        defaultAccountingSetup.salesLedgerControlClientDebtorsId = this.nominalAccountResult.salesLedgerControlClientDebtorsId;
        defaultAccountingSetup.purchaseLedgerControlClientCreditorsId = this.nominalAccountResult.purchaseLedgerControlClientCreditorsId;
        defaultAccountingSetup.vatAccountInputsId = this.nominalAccountResult.vatAccountInputsId;
        defaultAccountingSetup.vatAccountOutputsId = this.nominalAccountResult.vatAccountOutputsId;
        defaultAccountingSetup.fxAccountGainId = this.nominalAccountResult.fxAccountGainId;
        defaultAccountingSetup.fxAccountLossId = this.nominalAccountResult.fxAccountLossId;
        defaultAccountingSetup.fxRevalaccountId = this.nominalAccountResult.fxRevalaccountId;
        defaultAccountingSetup.realisedPhysicalsPayableId = this.nominalAccountResult.realisedPhysicalsPayableId;
        defaultAccountingSetup.realisedPhysicalsReceivableId = this.nominalAccountResult.realisedPhysicalsReceivableId;
        defaultAccountingSetup.suspenseAccountforWashoutSuspenseId = this.nominalAccountResult.suspenseAccountforWashoutSuspenseId;
        defaultAccountingSetup.plClearanceYepAccountId = this.nominalAccountResult.plClearanceYepAccountId;
        defaultAccountingSetup.balanceSheetClearanceYepAccountId = this.nominalAccountResult.balanceSheetClearanceYepAccountId;
        defaultAccountingSetup.bsReserveYepAccountId = this.nominalAccountResult.bsReserveYepAccountId;
        defaultAccountingSetup.yepDepartmentId = this.nominalAccountResult.yepDepartmentId;
        return defaultAccountingSetup;
    }

    initForm(companyConfigurationRecord: any, isEdit): CompanyConfigurationRecord {
        this.isEdit = isEdit;
        this.companyConfigurationRecord = companyConfigurationRecord;
        this.formComponents.forEach((comp) => {
            companyConfigurationRecord = comp.initForm(companyConfigurationRecord, isEdit);
        });
        return companyConfigurationRecord;
    }

    onMainAccountingTabCliked() {
        this.hideDefaultAccountSideNav = true;
        this.hideMainAccountSideNav = false;
        this.mainAccountingComponent.loadAccountingMandatoryFieldSetUpEditor();
        this.isSideNavOpened.emit(true);
        this.mainAccountingSideNav.open();
    }

    onDefaultAccountingTabCliked() {
        this.hideDefaultAccountSideNav = false;
        this.hideMainAccountSideNav = true;
        this.defaultAccountComponent.loadDefaultAccountFieldSetUpEditor();
        this.isSideNavOpened.emit(true);
        this.defaultAccountingSideNav.open();
    }

    onDefaultCostTypeTabCliked() {
        this.defaultCostTypeComponent.loadDefaultCostTypeFieldSetUpEditor();
        this.isSideNavOpened.emit(true);
        this.defaultCostTypeSideNav.open();
    }

    onOthersTabCliked() {
        this.hideOthersSideNav = false;
        this.isSideNavOpened.emit(true);
        this.othersSideNav.open();
    }

    onDiscardButtonClicked(value) {
        if (this.isEdit) {
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
                    this.closeSideNavs(value.selectedOptionName);
                }
            });
        } else {
            this.closeSideNavs(value.selectedOptionName);
        }
        this.isSideNavOpened.emit(false);
    }

    closeSideNavs(selectedOptionName: string) {
        if (selectedOptionName === this.mainAccountingSetupComponent) {
            this.mainAccountingSideNav.close();
        }
        if (selectedOptionName === this.defaultAccountSetupComponent) {
            this.defaultAccountingSideNav.close();
        }
        if (selectedOptionName === this.defaultCostTypeSetupComponent) {
            this.defaultCostTypeSideNav.close();
        }
        if (selectedOptionName === this.othersTypeComponent) {
            this.othersSideNav.close();
        }
    }
}
