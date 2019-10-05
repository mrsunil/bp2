import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { Allocation } from '../../../../../shared/entities/allocation.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { TradeDataService } from '../../../../services/trade-data.service';
import { SnackbarService } from './../../../../../shared/services/snackbar.service';
import { SectionReference } from './../../../../entities/section-reference';
import { TradeActionsService } from './../../../../services/trade-actions.service';

@Component({
    selector: 'atlas-allocation-info-form-component',
    templateUrl: './allocation-info-form-component.component.html',
    styleUrls: ['./allocation-info-form-component.component.scss'],
})
export class AllocationInfoFormComponentComponent extends BaseFormComponent implements OnInit {

    allocatedDateCtrl = new AtlasFormControl('AllocationDate');
    groupingNumberCtrl = new AtlasFormControl('GroupingNumber');
    contractNumberCtrl = new AtlasFormControl('ContractNumber');
    counterpartyReferenceCtrl = new AtlasFormControl('CounterpartyReference');
    contractTermsCtrl = new AtlasFormControl('ContractTerms');

    company: string;
    sectionId: number;
    dataVersionId: number;
    dateOfAllocation: string;
    allocationModel: Allocation = new Allocation();
    tradeRecord: SectionCompleteDisplayView;
    hasEmptyState: boolean = true;
    allocationEmptyMessage: string = 'This trade has not been allocated yet';

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private executionService: ExecutionService,
        private router: Router,
        private route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        private formatDate: FormatDatePipe,
        private tradeActionsService: TradeActionsService,
        private snackbarService: SnackbarService,
        private tradeDataService: TradeDataService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            groupingNumberCtrl: this.groupingNumberCtrl,
            contractNumberCtrl: this.contractNumberCtrl,
            counterpartyReferenceCtrl: this.counterpartyReferenceCtrl,
            contractTermsCtrl: this.contractTermsCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any) {
        if (this.sectionId !== 0) {
            this.subscriptions.push(this.tradeDataService.getAllocationDetails()
                .subscribe((data: Allocation) => {
                    if (data) {
                        this.allocationModel = data;
                        this.assignValueToControl(entity);
                        this.hasEmptyState = false;
                    }
                    this.disableControl();
                }));
        }
    }
    assignValueToControl(entity: any) {
        this.tradeRecord = new SectionCompleteDisplayView(entity);
        this.dateOfAllocation = this.formatDate.transform
            (this.allocationModel.dateOfAllocation === null ? null : this.allocationModel.dateOfAllocation);
        this.formGroup.patchValue({
            groupingNumberCtrl: this.allocationModel.groupNumber === null ? '' : this.allocationModel.groupNumber,
            contractNumberCtrl: this.allocationModel.allocatedSectionCode === null ? '' : this.allocationModel.allocatedSectionCode,
            contractTermsCtrl: this.allocationModel.contractTermCode === null ? '' : this.allocationModel.contractTermCode,
        });
        if (this.tradeRecord.type === ContractTypes[ContractTypes.Sale]) {
            this.formGroup.patchValue({ counterpartyReferenceCtrl: this.allocationModel.sellerCode });
        } else {
            this.formGroup.patchValue({ counterpartyReferenceCtrl: this.allocationModel.buyerCode });
        }
    }
    disableControl() {
        this.groupingNumberCtrl.disable();
        this.counterpartyReferenceCtrl.disable();
        this.contractTermsCtrl.disable();
    }
    onContractReferenceClicked() {
        const sectionId = this.allocationModel.allocatedSectionId;
        if (!sectionId) {
            this.snackbarService.throwErrorSnackBar('Cannot navigate to the allocation contract');
            return;
        }
        if (this.dataVersionId) {
            this.tradeActionsService.displaySectionInSnapshotSubject.next(new SectionReference(sectionId, this.dataVersionId));
        } else {
            this.tradeActionsService.displaySectionSubject.next(sectionId);
        }
    }
}
