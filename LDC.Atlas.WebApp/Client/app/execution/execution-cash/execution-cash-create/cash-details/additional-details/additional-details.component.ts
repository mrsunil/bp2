import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-additional-details',
    templateUrl: './additional-details.component.html',
    styleUrls: ['./additional-details.component.scss'],
})
export class AdditionalDetailsFormComponent extends BaseFormComponent implements OnInit {
    narrativeCtrl = new AtlasFormControl('Narrative');
    model: CashRecord;
    cashTransactionId: number;
    isPanelExpanded = true;
    isCashTypeIsPayment: boolean;
    cashTypeId: number;
    CashType: CashType;
    narrativeErrorMap: Map<string, string> = new Map();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,

    ) {
        super(formConfigurationProvider);
        this.narrativeErrorMap
            .set('required', 'Required *')
            .set('maxlength', '  Additional Details should be at most 130 Characters long');
    }

    ngOnInit() {
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
        this.isCashTypeIsPayment = this.cashTypeId === CashType.CashPayment ? true : false;

        this.setValidators();
        this.bindConfiguration();
    }
    setValidators() {
        if (this.isCashTypeIsPayment) {
            this.narrativeCtrl.setValidators(
                Validators.compose([Validators.maxLength(130), Validators.required]),
            );
        } else {
            this.narrativeCtrl.setValidators(
                Validators.compose([Validators.maxLength(130)]),
            );
        }
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            narrativeCtrl: this.narrativeCtrl,
        });
        return super.getFormGroup();
    }
    populateEntity(entity: any): any {
        const additionalDetails = entity as CashRecord;
        additionalDetails.narrative = this.narrativeCtrl.value;
        return additionalDetails;
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        this.narrativeCtrl.setValue(entity.narrative);
        if (!isEdit) {
            this.formGroup.disable();
        }
        this.isPanelExpanded = isEdit ? true : false;
        return entity;

    }

    setNarrative(narrative: string) {
        this.narrativeCtrl.setValue(narrative);
    }
    bindSelectedTransactionValue(value: number) {
        this.cashTransactionId = value;
        return value;
    }
}
