import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { PaymentTerm } from '../../../../../../shared/entities/payment-term.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-default-payment-terms',
    templateUrl: './default-payment-terms.component.html',
    styleUrls: ['./default-payment-terms.component.scss'],
})

export class DefaultPaymentTermsComponent extends BaseFormComponent implements OnInit {
    defaultPaymentIDCtrl = new AtlasFormControl('defaultPaymentIDCtrl');
    masterdata: MasterData = new MasterData();
    PaymentTermType: PaymentTerm[];
    selectedValue = '';
    model: CompanyConfigurationRecord;
    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.PaymentTermType = this.masterdata.paymentTerms;
        this.defaultPaymentIDCtrl.valueChanges.subscribe((input) => {
            this.PaymentTermType = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.paymentTerms,
                ['paymentTermCode', 'description'],
            );
        });
        this.setValidators();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            defaultPaymentIDCtrl: this.defaultPaymentIDCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit): any {
        const companyConfiguration = entity;
        this.model = companyConfiguration;

        if (this.model.invoiceSetup) {
            if (this.model.invoiceSetup.paymentTermCode !== null && this.model.invoiceSetup.paymentTermCode !== '') {
                this.defaultPaymentIDCtrl.setValue(this.model.invoiceSetup.paymentTermCode);
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }

        return entity;
    }

    setValidators() {
        this.defaultPaymentIDCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.paymentTerms,
                    nameof<PaymentTerm>('paymentTermCode'),
                ),
            ]));
        this.defaultPaymentIDCtrl.setValidators([
            Validators.compose([Validators.required]),
        ]);
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        companyConfiguration.invoiceSetup.paymentTermId = this.masterdata.paymentTerms.find((item) =>
            item.paymentTermCode === this.defaultPaymentIDCtrl.value).paymentTermsId;

        return companyConfiguration;
    }
}
