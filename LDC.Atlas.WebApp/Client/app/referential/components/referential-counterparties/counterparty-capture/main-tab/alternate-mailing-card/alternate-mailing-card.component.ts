import { Component, OnInit } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control'
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Counterparty } from '../../../../../../shared/entities/counterparty.entity';

@Component({
    selector: 'atlas-alternate-mailing-card',
    templateUrl: './alternate-mailing-card.component.html',
    styleUrls: ['./alternate-mailing-card.component.scss']
})
export class AlternateMailingCardComponent extends BaseFormComponent implements OnInit {
    alternateMailingAdd1Ctrl = new AtlasFormControl('AlternateMailingAddress1');
    alternateMailingAdd2Ctrl = new AtlasFormControl('AlternateMailingAddress2');
    alternateMailingAdd3Ctrl = new AtlasFormControl('AlternateMailingAddress3');
    alternateMailingAdd4Ctrl = new AtlasFormControl('AlternateMailingAddress4');
    inputErrorMap: Map<string, string> = new Map();

    constructor(protected formBuilder: FormBuilder, protected formConfigurationProvider: FormConfigurationProviderService, ) {
        super(formConfigurationProvider);
        this.inputErrorMap.set('email', 'Not a valid email');
    }

    ngOnInit() {
        this.setValidators();
    }

    setValidators() {
        this.alternateMailingAdd1Ctrl.setValidators(
            Validators.compose([Validators.email, Validators.maxLength(160)]),
        );

        this.alternateMailingAdd2Ctrl.setValidators(
            Validators.compose([Validators.email, Validators.maxLength(160)]),
        );

        this.alternateMailingAdd3Ctrl.setValidators(
            Validators.compose([Validators.email, Validators.maxLength(160)]),
        );

        this.alternateMailingAdd4Ctrl.setValidators(
            Validators.compose([Validators.email, Validators.maxLength(160)]),
        );
    }


    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            alternateMailingAdd1Ctrl: this.alternateMailingAdd1Ctrl,
            alternateMailingAdd2Ctrl: this.alternateMailingAdd2Ctrl,
            alternateMailingAdd3Ctrl: this.alternateMailingAdd3Ctrl,
            alternateMailingAdd4Ctrl: this.alternateMailingAdd4Ctrl,
        });

        return super.getFormGroup();
    }

    populateValue(model: Counterparty) {
        this.alternateMailingAdd1Ctrl.patchValue(model.alternateMailingAddress1);
        this.alternateMailingAdd2Ctrl.patchValue(model.alternateMailingAddress2);
        this.alternateMailingAdd3Ctrl.patchValue(model.alternateMailingAddress3);
        this.alternateMailingAdd4Ctrl.patchValue(model.alternateMailingAddress4);

    }

    populateEntity(model: Counterparty) {
        model.alternateMailingAddress1 = this.alternateMailingAdd1Ctrl.value;
        model.alternateMailingAddress2 = this.alternateMailingAdd2Ctrl.value;
        model.alternateMailingAddress3 = this.alternateMailingAdd3Ctrl.value;
        model.alternateMailingAddress4 = this.alternateMailingAdd4Ctrl.value;
    }
}
