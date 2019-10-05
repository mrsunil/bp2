import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-memo-form-component',
    templateUrl: './memo-form-component.component.html',
    styleUrls: ['./memo-form-component.component.scss'],
})
export class MemoFormComponent extends BaseFormComponent implements OnInit {

    @Input() isCreateOrEdit: boolean = true;

    charterInternalMemorandumCntrl = new FormControl('');

    constructor(protected formbuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        if (this.isCreateOrEdit) {
            this.enableControl();
        } else {
            this.disablControl();
        }
    }

    clearValueOfControl() {
        this.charterInternalMemorandumCntrl.patchValue('');
    }

    enableControl() {
        this.charterInternalMemorandumCntrl.enable();
    }

    disablControl() {
        this.charterInternalMemorandumCntrl.disable();
    }

    initForm(entity: Charter, isEdit: boolean = false) {
        const model = entity;
        this.charterInternalMemorandumCntrl.patchValue(model ? model.memo : '');
    }

    getFormGroup() {
        this.formGroup = this.formbuilder.group({
            charterInternalMemorandumCntrl: this.charterInternalMemorandumCntrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: Charter): Charter {
        const section = entity;
        section.memo = this.charterInternalMemorandumCntrl.value;
        return section;
    }

}
