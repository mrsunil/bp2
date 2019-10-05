import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AllocationSetUp } from '../../../../../shared/entities/allocation-set-up-entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../shared/services/configuration/dtos/company-configuration-record';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { ConfirmationDialogComponent } from './../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { User } from './../../../../../shared/entities/user.entity';
import { FormConfigurationProviderService } from './../../../../../shared/services/form-configuration-provider.service';
import { AllocationSetUpComponent } from './allocation-set-up/allocation-set-up.component';
import { MandatoryTradeApprovalComponent } from './mandatory-trade-approval/mandatory-trade-approval.component';
import { PhysicalsMainComponent } from './physicals-main/physicals-main.component';

@Component({
    selector: 'atlas-physicals-tab',
    templateUrl: './physicals-tab.component.html',
    styleUrls: ['./physicals-tab.component.scss'],
})
export class PhysicalsTabComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    @ViewChild('mainPhysicalsComponent') mainPhysicalsComponent: PhysicalsMainComponent;
    @ViewChild('mainPhysicalsSideNav') mainPhysicalsSideNav: MatSidenav;
    @ViewChild('mandatoryTradeSetUpComponent') mandatoryTradeSetUpComponent: MandatoryTradeApprovalComponent;
    @ViewChild('allocationSetupComponent') allocationSetupComponent: AllocationSetUpComponent;
    @ViewChild('allocationSetUpSideNav') allocationSetUpSideNav: MatSidenav;
    @ViewChild('mandatoryTradeSetUpSideNav') mandatoryTradeSetUpSideNav: MatSidenav;

    formComponents: BaseFormComponent[] = [];
    users: User[] = [];
    isEdit: boolean;
    masterdata: MasterData = new MasterData();
    company: string;
    physicalsMainComponent: string = 'PhysicalsMainComponent';
    allocationSetUpComponent: string = 'AllocationSetUpComponent';
    mandatoryTradeApprovalComponent: string = 'MandatoryTradeApprovalComponent';
    dataList: AllocationSetUp[] = [];
    companyConfigurationRecord: CompanyConfigurationRecord;
    @ViewChild('divAllocate') divAllocate: ElementRef;
    hideAllocationSidenav: boolean;
    hideMandatorySidenav: boolean;
    @Output() readonly businessSectorMandatory = new EventEmitter();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected configurationService: ConfigurationService,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('companyId');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.isSideNavOpened.emit(false);
        this.formComponents.push(
            this.mainPhysicalsComponent,
            this.mandatoryTradeSetUpComponent,
            this.allocationSetupComponent,
        );
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            mainPhysicalsGroup: this.mainPhysicalsComponent.getFormGroup(),
            locationGroup: this.mandatoryTradeSetUpComponent.getFormGroup(),
            detailsGroup: this.allocationSetupComponent.getFormGroup(),
        });
        return super.getFormGroup();
    }

    sideNavOpened(event: boolean) {
        this.isSideNavOpened.emit(event);
    }

    onMainPhysicalsTabCliked() {
        this.hideAllocationSidenav = true;
        this.hideMandatorySidenav = true;
        this.isSideNavOpened.emit(true);
        this.mainPhysicalsSideNav.open();
    }

    onAllocationSetUpTabCliked() {
        this.hideAllocationSidenav = false;
        this.hideMandatorySidenav = true;
        this.allocationSetupComponent.readyAllocationSetUpEditor();
        this.isSideNavOpened.emit(true);
        this.allocationSetUpSideNav.open();
    }

    onMandatoyTradeSetUpTabCliked() {
        this.hideMandatorySidenav = false;
        this.hideAllocationSidenav = true;
        this.mandatoryTradeSetUpComponent.readyMandatoryFieldSetUpEditor();
        this.isSideNavOpened.emit(true);
        this.mandatoryTradeSetUpSideNav.open();
    }

    onDiscardClick(value) {
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
                    if (value) {
                        this.closeSideNavs(value.selectedOptionName);
                    }
                }
            });
        } else {
            if (value) {
                this.closeSideNavs(value.selectedOptionName);
            }
        }
        this.isSideNavOpened.emit(false);
    }

    closeSideNavs(selectedOptionName: string) {
        if (selectedOptionName === this.physicalsMainComponent) {
            this.mainPhysicalsSideNav.close();
        } else if (selectedOptionName === this.allocationSetUpComponent) {
            this.allocationSetUpSideNav.close();
        } else if (selectedOptionName === this.mandatoryTradeApprovalComponent) {
            this.mandatoryTradeSetUpSideNav.close();
        }
    }

    initForm(companyConfigurationRecord: any, isEdit): any {
        this.isEdit = isEdit;
        this.companyConfigurationRecord = companyConfigurationRecord;
        this.formComponents.forEach((comp) => {
            companyConfigurationRecord = comp.initForm(companyConfigurationRecord, isEdit);
        });
        return companyConfigurationRecord;
    }

    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }

    onBusinessMandatory(value) {
      this.mainPhysicalsComponent.checkBusinessSector(value);
    }
}
