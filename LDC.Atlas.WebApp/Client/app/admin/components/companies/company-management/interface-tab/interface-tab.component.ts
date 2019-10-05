import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CompanyConfiguration } from '../../../../../shared/entities/company-configuration.entity';
import { InterfaceSetup } from '../../../../../shared/entities/interface-setup.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { AccountingInterfaceComponent } from './accounting-interface/accounting-interface.component';
import { DmsComponent } from './dms/dms.component';
import { MappingComponent } from './mapping/mapping.component';
import { TreasurySystemComponent } from './treasury-system/treasury-system.component';

@Component({
    selector: 'atlas-interface-tab',
    templateUrl: './interface-tab.component.html',
    styleUrls: ['./interface-tab.component.scss'],
})
export class InterfaceTabComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    @ViewChild('accountingInterfaceComponent') accountingInterfaceComponent: AccountingInterfaceComponent;
    @ViewChild('mappingComponent') mappingComponent: MappingComponent;
    @ViewChild('dmsComponent') dmsComponent: DmsComponent;
    @ViewChild('treasurySystemComponent') treasurySystemComponent: TreasurySystemComponent;
    @ViewChild('mappingSideNav') mappingSideNav: MatSidenav;
    @ViewChild('accountingInterfaceSideNav') accountingInterfaceSideNav: MatSidenav;
    @ViewChild('dmsSideNav') dmsSideNav: MatSidenav;
    @ViewChild('treasurySystemSideNav') treasurySystemSideNav: MatSidenav;
    formComponents: BaseFormComponent[] = [];
    interfaceTabFormGroup: FormGroup;
    companyConfigurationRecord: CompanyConfigurationRecord;
    hideMappingSideNav: boolean;
    hideAccountingInterfaceSideNav: boolean;
    hideDmsSideNav: boolean;
    hideTreasurySystemSideNav: boolean;
    isEdit: boolean;
    mappingSetupComponent: string = 'MappingComponent';
    accountingInterfaceSetupComponent: string = 'AccountingInterfaceComponent';
    dmsSetupComponent: string = 'DmsComponent';
    treasurySysteSetupComponent: string = 'TreasurySystemComponent';
    company: string;
    masterData: MasterData[];
    treasuryInterfaceSetup: InterfaceSetup[];
    accountingInterfaceSetup: InterfaceSetup[];
    accountingInterfaceStatus: boolean;
    dmsInterfaceStatus: boolean;
    treasuryInterfaceStatus: boolean;
    accountingStatus: string;
    dmsStatus: string;
    treasuryStatus: string;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('companyId');
        this.masterData = this.route.snapshot.data.masterdata;
        this.isSideNavOpened.emit(false);
        this.formComponents.push(
            this.mappingComponent,
            this.accountingInterfaceComponent,
            this.dmsComponent,
            this.treasurySystemComponent,
        );
    }

    initForm(companyConfigurationRecord: any, isEdit): CompanyConfigurationRecord {
        this.isEdit = isEdit;
        this.companyConfigurationRecord = companyConfigurationRecord;
        this.formComponents.forEach((comp) => {
            companyConfigurationRecord = comp.initForm(companyConfigurationRecord, isEdit);
        });
        return companyConfigurationRecord;
    }

    sideNavOpened(event: boolean) {
        this.isSideNavOpened.emit(event);
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        this.formComponents.forEach((comp) => {
            if (comp === this.treasurySystemComponent) {
                entity = comp.populateEntity(entity);
                this.treasuryInterfaceSetup = entity.interfaceSetup;
                entity.interfaceSetup = [];
            } else if (comp === this.accountingInterfaceComponent) {
                entity = comp.populateEntity(entity);
                this.accountingInterfaceSetup = entity.interfaceSetup;
                entity.interfaceSetup = [];
            } else {
                entity = comp.populateEntity(entity);
            }
        });
        entity.interfaceSetup.push(this.accountingInterfaceSetup[0], this.treasuryInterfaceSetup[0]);
        return entity;
    }

    accountingStatusChanged(value: boolean) {
        this.accountingInterfaceStatus = value;
        this.accountingStatus = value ? 'Active' : 'Inactive';
    }
    dmsStatusChanged(value: boolean) {
        this.dmsInterfaceStatus = value;
        this.dmsStatus = value ? 'Active' : 'Inactive';
    }
    treasuryStatusChanged(value: boolean) {
        this.treasuryInterfaceStatus = value;
        this.treasuryStatus = value ? 'Active' : 'Inactive';
    }

    getFormGroup() {
        this.interfaceTabFormGroup = this.formBuilder.group({
            accountingInterfaceGroup: this.accountingInterfaceComponent.getFormGroup(),
            dmsGroup: this.dmsComponent.getFormGroup(),
            treasurySystemGroup: this.treasurySystemComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }

    onMappingTabCliked() {
        this.hideMappingSideNav = false;
        this.hideAccountingInterfaceSideNav = true;
        this.hideDmsSideNav = true;
        this.isSideNavOpened.emit(true);
        this.mappingComponent.loadDefaultMappingFieldSetUpEditor();
        this.mappingSideNav.open();
    }

    onAccountingInterfaceTabCliked() {
        this.hideMappingSideNav = true;
        this.hideAccountingInterfaceSideNav = false;
        this.hideDmsSideNav = true;
        this.isSideNavOpened.emit(true);
        this.accountingInterfaceSideNav.open();
    }

    onDmsTabCliked() {
        this.hideMappingSideNav = true;
        this.hideAccountingInterfaceSideNav = true;
        this.hideDmsSideNav = false;
        this.isSideNavOpened.emit(true);
        this.dmsSideNav.open();
    }

    onTreasurySystemTabCliked() {
        this.isSideNavOpened.emit(true);
        this.treasurySystemSideNav.open();
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
        if (selectedOptionName === this.mappingSetupComponent) {
            this.mappingSideNav.close();
        }

        if (selectedOptionName === this.accountingInterfaceSetupComponent) {
            this.accountingInterfaceSideNav.close();
        }

        if (selectedOptionName === this.dmsSetupComponent) {
            this.dmsSideNav.close();
        }

        if (selectedOptionName === this.treasurySysteSetupComponent) {
            this.treasurySystemSideNav.close();
        }
    }

}
