import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { DefaultPaymentTermsComponent } from './default-payment-terms/default-payment-terms.component';
import { TresholdCostAmountComponent } from './treshold-cost-amount/treshold-cost-amount.component';

@Component({
    selector: 'atlas-invoice-tab',
    templateUrl: './invoice-tab.component.html',
    styleUrls: ['./invoice-tab.component.scss'],
})
export class InvoiceTabComponent extends BaseFormComponent implements OnInit {
    @ViewChild('tresholdCostAmountComponent') tresholdCostAmountComponent: TresholdCostAmountComponent;
    @ViewChild('defaultPaymentTermsComponent') defaultPaymentTermsComponent: DefaultPaymentTermsComponent;
    formComponents: BaseFormComponent[] = [];
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.formComponents.push(
            this.tresholdCostAmountComponent,
            this.defaultPaymentTermsComponent,
        );
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            tresholdCostAmountGroup: this.tresholdCostAmountComponent.getFormGroup(),
            defaultPaymentTermsGroup: this.defaultPaymentTermsComponent.getFormGroup(),
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
