import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { GroupFunctionTypes } from '../../../shared/enums/group-function-type';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TitleService } from '../../../shared/services/title.service';
import { TradeBulkApprovalComponent } from './trade-bulk-approval/trade-bulk-approval.component';
import { TradeBulkEditComponent } from './trade-bulk-edit/trade-bulk-edit.component';
import { TradeCostBulkUpdateComponent } from './trade-cost-bulk-update/trade-cost-bulk-update.component';
import { TradeBulkClosureComponent } from './trade-bulk-closure/trade-bulk-closure.component';
import { TradeBulkAllocationComponent } from './trade-bulk-allocation/trade-bulk-allocation.component';
import { TradeBulkDeallocationComponent } from './trade-bulk-deallocation/trade-bulk-deallocation.component';

@Component({
    selector: 'atlas-group-functions',
    templateUrl: './group-functions.component.html',
    styleUrls: ['./group-functions.component.scss'],
})
export class GroupFunctionsComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('tradeBulkEdition') tradeBulkEdition: TradeBulkEditComponent;
    @ViewChild('tradeBulkApproval') tradeBulkApproval: TradeBulkApprovalComponent;
    @ViewChild('costBulkUpdate') costBulkUpdate: TradeCostBulkUpdateComponent;
    @ViewChild('tradeBulkClosure') tradeBulkClosure: TradeBulkClosureComponent;
    @ViewChild('tradeBulkAllocation') tradeBulkAllocation: TradeBulkAllocationComponent;
    @ViewChild('tradeBulkDeAllocation') tradeBulkDeAllocation: TradeBulkDeallocationComponent;

    formComponents: BaseFormComponent[] = [];
    groupFunctionsFormGroup: FormGroup;
    GroupFunctionTypes = GroupFunctionTypes;
    company: string;
    bulkActionTypeId: number;
    isSave: boolean = false;

    constructor(
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        private formBuilder: FormBuilder,
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private titleService: TitleService,
    ) {
        super(formConfigurationProvider);
        this.bulkActionTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('bulkActionTypeId')));

    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.groupFunctionsFormGroup = this.formBuilder.group({
            dummyFormControl: new FormControl(),
        });

    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.groupFunctionsFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    ngAfterViewInit() {
        if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkEdition) {
            this.isSave = true;
            this.titleService.setTitle('Trade Bulk Edition');
            this.groupFunctionsFormGroup = this.formBuilder.group({
                tradeBulkEdition: this.tradeBulkEdition.getFormGroup(),
            });
            this.formComponents.push(this.tradeBulkEdition);
        }
        else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkApproval) {
            this.titleService.setTitle('Trade Bulk Approval');
            this.groupFunctionsFormGroup = this.formBuilder.group({
                tradeBulkApproval: this.tradeBulkApproval.getFormGroup(),
            });
            this.formComponents.push(this.tradeBulkApproval);
        }
        else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkClosure) {
            this.titleService.setTitle('Trade Closure Approval');
            this.groupFunctionsFormGroup = this.formBuilder.group({
                tradeBulkClosure: this.tradeBulkClosure.getFormGroup(),
            });
            this.formComponents.push(this.tradeBulkClosure);
        }
        else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkAllocation) {
            this.titleService.setTitle('Trade Bulk Allocation');
            this.groupFunctionsFormGroup = this.formBuilder.group({
                tradeBulkAllocation: this.tradeBulkAllocation.getFormGroup(),
            });
            this.formComponents.push(this.tradeBulkAllocation);
        }
        else if (this.bulkActionTypeId === GroupFunctionTypes.TradeBulkDeAllocation) {
            this.titleService.setTitle('Trade Bulk DeAllocation');
            this.groupFunctionsFormGroup = this.formBuilder.group({
                tradeBulkDeAllocation: this.tradeBulkDeAllocation.getFormGroup(),
            });
            this.formComponents.push(this.tradeBulkDeAllocation);
        }


    }
}
