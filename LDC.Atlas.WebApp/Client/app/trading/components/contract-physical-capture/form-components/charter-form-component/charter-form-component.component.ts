import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { UserIdentityService } from '../../../../../shared/services/http-services/user-identity.service';

@Component({
    selector: 'atlas-charter-form-component',
    templateUrl: './charter-form-component.component.html',
    styleUrls: ['./charter-form-component.component.scss'],
})
export class CharterFormComponentComponent extends BaseFormComponent implements OnInit {

    charterRefCtrl = new AtlasFormControl('CharterReference');
    charterManagerCtrl = new AtlasFormControl('CharterManger');
    blDateCtrl = new AtlasFormControl('BLDate');
    shippingStatusCtrl = new AtlasFormControl('shippingStatus');
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    company: string;
    sectionId: number;
    charterAssignmentDate: string;
    isInputField = false;
    charterModel: Charter = new Charter();
    charterAssignedBy: string;
    hasEmptyState: boolean = true;
    charterEmptyMessage: string = 'Execution team is looking for the perfect vessel';

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private executionService: ExecutionService, private userIdentityService: UserIdentityService,
        private formatDate: FormatDatePipe,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            charterRefCtrl: this.charterRefCtrl,
            charterManagerCtrl: this.charterManagerCtrl,
            blDateCtrl: this.blDateCtrl,
            shippingStatusCtrl: this.shippingStatusCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any): any {
        if (this.sectionId !== 0) {
            if (entity.blDate) {
                const dateFormat: FormatDatePipe = this.formatDate;
                const formattedBLDate = dateFormat.transformdate(entity.blDate);
                this.formGroup.patchValue({ blDateCtrl: formattedBLDate });
                this.hasEmptyState = false;
            }
            this.executionService.getCharterBySectionId(this.sectionId)
                .subscribe((data) => {
                    if (data) {
                        this.charterModel = data;
                        this.assignValueToControl();
                        this.hasEmptyState = false;
                    }
                    this.disableControl();
                });
        }
        this.shippingStatusCtrl.disable();
    }

    setBlDate(blDate: Date) {
        if (blDate) {
            const dateFormat: FormatDatePipe = this.formatDate;
            const formattedBLDate = dateFormat.transformdate(blDate);
            this.formGroup.patchValue({ blDateCtrl: formattedBLDate });
            this.hasEmptyState = false;
        }
    }

    assignValueToControl() {
        this.charterAssignmentDate = this.formatDate.transform
            (this.charterModel.assignmentDate === null ? null : this.charterModel.assignmentDate);
        this.charterAssignedBy = this.charterModel.assignedByDisplayName !== null ?
            this.charterModel.assignedByDisplayName : this.charterModel.assignedBy;
        this.formGroup.patchValue({ charterRefCtrl: this.charterModel.charterCode });
        this.formGroup.patchValue({ charterManagerCtrl: this.charterModel.charterManagerDisplayName });
        this.formGroup.patchValue({ shippingStatusCtrl: this.charterModel.shippingStatusDescription });
    }

    charterRefClicked() {
        const charterId = this.charterModel.charterId;
        this.router.navigate([this.company + '/execution/charter/details', charterId]);
    }

    disableControl() {
        this.charterManagerCtrl.disable();
        this.blDateCtrl.disable();
    }

    updateCharterManager() {
        if (this.charterModel.charterManagerId) {
            this.userIdentityService.getAllUsers().subscribe((data) => {
                const userName = data.value.find((user) => user.userId === this.charterModel.charterManagerId).displayName;
                this.formGroup.patchValue({ charterManagerCtrl: userName });

            });
        }
    }

    updateOnlyShippingState() {
        this.hasEmptyState = false;
        this.formGroup.patchValue({ shippingStatusCtrl: 'Cancelled' });
    }
}
