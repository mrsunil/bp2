import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GroupFunctionTypes } from '../../../shared/enums/group-function-type';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { TitleService } from '../../../shared/services/title.service';
import { GroupSelection } from '../../entities/group-selection-entity';
import { BulkApprovalComponent } from './bulk-approval/bulk-approval.component';
import { BulkEditionComponent } from './bulk-edition/bulk-edition.component';
import { BulkUpdateCostsComponent } from './bulk-update-costs/bulk-update-costs.component';
import { BulkClosureComponent } from './bulk-closure/bulk-closure.component';
import { BulkAllocationComponent } from './bulk-allocation/bulk-allocation.component';
import { BulkDeallocationComponent } from './bulk-deallocation/bulk-deallocation.component'

@Component({
    selector: 'atlas-group-amendments',
    templateUrl: './group-amendments.component.html',
    styleUrls: ['./group-amendments.component.scss'],
})

export class GroupAmendmentsComponent extends BaseFormComponent implements OnInit {
    @ViewChild('bulkEditionComponent') bulkEditionComponent: BulkEditionComponent;
    @ViewChild('bulkApprovalComponent') bulkApprovalComponent: BulkApprovalComponent;
    @ViewChild('bulkUpdateCostsComponent') bulkUpdateCostsComponent: BulkUpdateCostsComponent;
    @ViewChild('bulkClosureComponent') bulkClosureComponent: BulkClosureComponent;
    @ViewChild('bulkAllocationComponent') bulkAllocationComponent: BulkAllocationComponent;
    @ViewChild('bulkDeAllocationComponent') bulkDeAllocationComponent: BulkDeallocationComponent;

    private formComponents: BaseFormComponent[] = [];
    groupFunctionFormGroup: FormGroup;
    bulkActionTypeId: number;
    isBulkEditChecked: boolean = false;
    isBulkAppovalChecked: boolean = false;
    isSave: boolean = false;
    isDisabled: boolean = true;
    groupFunctionTypeMenu: GroupSelection[] = [];
    groupFunctionFieldList: GroupSelection[] = [];

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private router: Router,
        protected dialog: MatDialog,
        private companyManager: CompanyManagerService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
        this.populateListofOptions();
    }

    ngOnInit() {
        this.bulkApprovalComponent.groupFunctionTypeMenu = this.groupFunctionTypeMenu;
        this.bulkEditionComponent.groupFunctionTypeMenu = this.groupFunctionTypeMenu;
        this.bulkUpdateCostsComponent.groupFunctionTypeMenu = this.groupFunctionTypeMenu;
        this.bulkClosureComponent.groupFunctionTypeMenu = this.groupFunctionTypeMenu;
        this.bulkAllocationComponent.groupFunctionTypeMenu = this.groupFunctionTypeMenu;
        this.bulkDeAllocationComponent.groupFunctionTypeMenu = this.groupFunctionTypeMenu;
        this.groupFunctionFormGroup = this.formBuilder.group({
            bulkEditionComponent: this.bulkEditionComponent.getFormGroup(),
            bulkApprovalComponent: this.bulkApprovalComponent.getFormGroup(),
            bulkUpdateCostsComponent: this.bulkUpdateCostsComponent.getFormGroup(),
            bulkClosureComponent: this.bulkClosureComponent.getFormGroup(),
            bulkAllocationComponent: this.bulkAllocationComponent.getFormGroup(),
            bulkDeAllocationComponent: this.bulkDeAllocationComponent.getFormGroup(),

        });
        this.titleService.setTitle('Bulk Actions');
        this.formComponents.push(
            this.bulkEditionComponent,
            this.bulkApprovalComponent,
            this.bulkUpdateCostsComponent,
            this.bulkClosureComponent,
            this.bulkAllocationComponent,
            this.bulkDeAllocationComponent,
        );
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.groupFunctionFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    canDeactivate() {
        if (this.groupFunctionFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    onDiscardButtonClicked() {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
    }

    onNextButtonClicked(bulkActionTypeId) {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/trades/bulkActions/' + encodeURIComponent(bulkActionTypeId)]);
    }

    populateListofOptions() {
        this.groupFunctionFieldList.push({
            bulkFunctionTypeId: 1,
            name: 'Bulk Edit Trades',
            functionTypeCode: GroupFunctionTypes.TradeBulkEdition,
        });
        this.groupFunctionFieldList.push({
            bulkFunctionTypeId: 2,
            name: 'Bulk Approve Trades',
            functionTypeCode: GroupFunctionTypes.TradeBulkApproval,
        });
        this.groupFunctionFieldList.push({
            bulkFunctionTypeId: 3,
            name: 'Costs',
            functionTypeCode: GroupFunctionTypes.Costs,
        });
        this.groupFunctionFieldList.push({
            bulkFunctionTypeId: 4,
            name: 'Bulk Closure Trades',
            functionTypeCode: GroupFunctionTypes.TradeBulkClosure,
        });
        this.groupFunctionFieldList.push({
            bulkFunctionTypeId: 5,
            name: 'Bulk Allocation Trades',
            functionTypeCode: GroupFunctionTypes.TradeBulkAllocation,
        });

        this.groupFunctionFieldList.push({
            bulkFunctionTypeId: 6,
            name: 'Bulk DeAllocation Trades',
            functionTypeCode: GroupFunctionTypes.TradeBulkDeAllocation,
        });
        this.groupFunctionFieldList.filter((e) => {
            this.groupFunctionTypeMenu.push(e);
        });
    }

    onBulkEditionOptionChecked($event) {
        this.bulkActionTypeId = $event.bulkEditOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.bulkApprovalComponent.bulkApprovalOptionDisable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionDisable();
            this.bulkClosureComponent.bulkClosureOptionDisable();
            this.bulkAllocationComponent.bulkAllocationOptionDisable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionDisable();
        } else {
            this.isDisabled = true;
            this.bulkApprovalComponent.bulkApprovalOptionEnable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionEnable();
            this.bulkClosureComponent.bulkClosureOptionEnable();
            this.bulkAllocationComponent.bulkAllocationOptionEnable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionEnable();
        }
    }

    onBulkApprovalOptionChecked($event) {
        this.bulkActionTypeId = $event.bulkApprovalOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.bulkEditionComponent.bulkEditionOptionDisable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionDisable();
            this.bulkClosureComponent.bulkClosureOptionDisable();
            this.bulkAllocationComponent.bulkAllocationOptionDisable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionDisable();
        } else {
            this.isDisabled = true;
            this.bulkEditionComponent.bulkEditionOptionEnable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionEnable();
            this.bulkClosureComponent.bulkClosureOptionEnable();
            this.bulkAllocationComponent.bulkAllocationOptionEnable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionEnable();
        }
    }

    onBulkCostsUpdateOptionChecked($event) {
        this.bulkActionTypeId = $event.bulkCostUpdateOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.bulkEditionComponent.bulkEditionOptionDisable();
            this.bulkApprovalComponent.bulkApprovalOptionDisable();
            this.bulkClosureComponent.bulkClosureOptionDisable();
            this.bulkAllocationComponent.bulkAllocationOptionDisable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionDisable();
        } else {
            this.isDisabled = true;
            this.bulkEditionComponent.bulkEditionOptionEnable();
            this.bulkApprovalComponent.bulkApprovalOptionEnable();
            this.bulkClosureComponent.bulkClosureOptionEnable();
            this.bulkAllocationComponent.bulkAllocationOptionEnable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionEnable();
        }
    }

    onBulkClosureOptionChecked($event) {
        this.bulkActionTypeId = $event.bulkClosureOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.bulkEditionComponent.bulkEditionOptionDisable();
            this.bulkApprovalComponent.bulkApprovalOptionDisable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionDisable();
            this.bulkAllocationComponent.bulkAllocationOptionDisable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionDisable();
        } else {
            this.isDisabled = true;
            this.bulkEditionComponent.bulkEditionOptionEnable();
            this.bulkApprovalComponent.bulkApprovalOptionEnable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionEnable();
            this.bulkAllocationComponent.bulkAllocationOptionEnable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionEnable();
        }
    }

    onBulkAllocationOptionChecked($event) {
        this.bulkActionTypeId = $event.bulkAllocationOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.bulkEditionComponent.bulkEditionOptionDisable();
            this.bulkApprovalComponent.bulkApprovalOptionDisable();
            this.bulkClosureComponent.bulkClosureOptionDisable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionDisable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionDisable();
        } else {
            this.isDisabled = true;
            this.bulkEditionComponent.bulkEditionOptionEnable();
            this.bulkApprovalComponent.bulkApprovalOptionEnable();
            this.bulkClosureComponent.bulkClosureOptionEnable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionEnable();
            this.bulkDeAllocationComponent.bulkDeAllocationOptionEnable();
        }
    }
    onBulkDeAllocationOptionChecked($event) {
        this.bulkActionTypeId = $event.bulkDeAllocationOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.bulkEditionComponent.bulkEditionOptionDisable();
            this.bulkApprovalComponent.bulkApprovalOptionDisable();
            this.bulkClosureComponent.bulkClosureOptionDisable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionDisable();
            this.bulkAllocationComponent.bulkAllocationOptionDisable();
        } else {
            this.isDisabled = true;
            this.bulkEditionComponent.bulkEditionOptionEnable();
            this.bulkApprovalComponent.bulkApprovalOptionEnable();
            this.bulkClosureComponent.bulkClosureOptionEnable();
            this.bulkUpdateCostsComponent.bulkCostsUpdateOptionEnable();
            this.bulkAllocationComponent.bulkAllocationOptionEnable();
        }
    }
}
