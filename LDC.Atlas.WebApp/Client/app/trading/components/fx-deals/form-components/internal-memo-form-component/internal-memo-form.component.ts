import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';

@Component({
    selector: 'atlas-internal-memo-form',
    templateUrl: './internal-memo-form.component.html',
    styleUrls: ['./internal-memo-form.component.scss']
})
export class InternalMemoFormComponent extends BaseFormComponent implements OnInit {
    internalMemorandumCtrl = new FormControl('');

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            internalMemorandumCtrl: this.internalMemorandumCtrl,
        });
        return super.getFormGroup();
    }

    initForm(fxDealDetail: FxDealDetail, isEdit: boolean) {
        if (fxDealDetail) {
            this.internalMemorandumCtrl.patchValue(fxDealDetail.memorandum);
            if (!isEdit) {
                this.disableFields();
            }
        }

        this.setValidators();
    }

    disableFields() {
        this.internalMemorandumCtrl.disable();
    }

    populateEntity(model: FxDealDetail) {
        model.memorandum = this.internalMemorandumCtrl.value;
    }

    setValidators() {
        this.internalMemorandumCtrl.setValidators([Validators.maxLength(4000)])
    }


    customValidation(event: any) {
        const pattern = /[\\;,\r|\n]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}
