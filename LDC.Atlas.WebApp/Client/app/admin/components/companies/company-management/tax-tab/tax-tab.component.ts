import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { DefaultTaxesComponent } from './default-taxes/default-taxes.component';
import { TaxConfigurationComponent } from './tax-configuration/tax-configuration.component';

@Component({
    selector: 'atlas-tax-tab',
    templateUrl: './tax-tab.component.html',
    styleUrls: ['./tax-tab.component.scss'],
})
export class TaxTabComponent extends BaseFormComponent implements OnInit {
    @ViewChild('taxConfigurationComponent') taxConfigurationComponent: TaxConfigurationComponent;
    @ViewChild('defaultTaxesComponent') defaultTaxesComponent: DefaultTaxesComponent;
    taxActiveStatus = true;
    formComponents: BaseFormComponent[] = [];
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.formComponents.push(
            this.taxConfigurationComponent,
            this.defaultTaxesComponent,
        );
    }

    public getData(value): void {
        this.taxActiveStatus = value;
        this.defaultTaxesComponent.taxStatus = this.taxActiveStatus;
        this.defaultTaxesComponent.setValidations(this.taxActiveStatus);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            taxConfigurationGroup: this.taxConfigurationComponent.getFormGroup(),
            defaultTaxesGroup: this.defaultTaxesComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }

    initForm(entity: any, isEdit): any {
        this.formComponents.forEach((comp) => {
            entity = comp.initForm(entity, isEdit);
        });
        return entity;
    }

    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }

}
