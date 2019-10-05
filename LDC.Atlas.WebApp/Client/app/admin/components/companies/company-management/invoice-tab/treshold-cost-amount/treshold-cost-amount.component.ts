import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { CustomNumberMask } from '../../../../../../shared/numberMask';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-treshold-cost-amount',
    templateUrl: './treshold-cost-amount.component.html',
    styleUrls: ['./treshold-cost-amount.component.scss'],
})

export class TresholdCostAmountComponent extends BaseFormComponent implements OnInit {
    thresholdIDCtrl = new AtlasFormControl('thresholdIDCtrl');
    invoiceSetUpId: number;
    model: CompanyConfigurationRecord;
    mask = CustomNumberMask(12, 10, false);
    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
    ) { super(formConfigurationProvider); }

    ngOnInit() {

    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            thresholdIDCtrl: this.thresholdIDCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit): any {
        const companyConfiguration = entity;
        this.model = companyConfiguration;

        if (this.model.invoiceSetup) {
            this.thresholdIDCtrl.setValue(this.model.invoiceSetup.thresholdCostAmount);
            this.invoiceSetUpId = this.model.invoiceSetup.invoiceSetupId;
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }

        return entity;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        companyConfiguration.invoiceSetup.thresholdCostAmount = (this.thresholdIDCtrl.value) ? (this.thresholdIDCtrl.value) : 0.00;
        companyConfiguration.invoiceSetup.thresholdCostAmount = Number(companyConfiguration.invoiceSetup.thresholdCostAmount
            .toString().replace('%', ''));
        companyConfiguration.invoiceSetup.invoiceSetupId = this.invoiceSetUpId;
        return companyConfiguration;
    }
}
