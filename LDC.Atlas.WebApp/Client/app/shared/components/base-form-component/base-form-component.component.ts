import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AtlasFormControl } from '../../entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../services/form-configuration-provider.service';

@Component({
    selector: 'atlas-base-form-component',
    templateUrl: './base-form-component.component.html',
    styleUrls: ['./base-form-component.component.scss'],
})
export class BaseFormComponent implements OnInit, OnDestroy {
    @Input() title: string;
    formGroup: FormGroup;
    subscriptions: Subscription[] = [];
    panelSize: number = 344;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
    ) { }

    ngOnInit() { }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    private getFormControls(): AtlasFormControl[] {
        const properties = Object.getOwnPropertyNames(this);
        const formControls: AtlasFormControl[] = [];
        properties.forEach((element) => {
            if (this[element.toString()] instanceof AtlasFormControl) {
                formControls.push(this[element.toString()]);
            }
        });

        return formControls;
    }

    getFormGroup(): FormGroup {
        return this.formGroup;
    }

    populateEntity(entity: any) {
        return entity;
    }

    initForm(entity: any, isEdit: boolean = false) {
       
    }

    bindConfiguration() {
        const formControls = this.getFormControls();
        this.setMandatoryFields(formControls);
        this.setDefaultValues(formControls);
    }

    setMandatoryFields(formControls: AtlasFormControl[]) {
        formControls.forEach((formControl) => {
            if (
                this.formConfigurationProvider.isFieldMandatory(formControl.id)
            ) {
                formControl.setValidators(Validators.required);
            }
        });
    }

    setDefaultValues(formControls: AtlasFormControl[]) {
        formControls.forEach((control) => {
            const defaultValue = this.formConfigurationProvider.getFieldDefaultValue(
                control.id,
            );

            if (defaultValue) {
                control.setValue(defaultValue);
            }
        });
    }
}
