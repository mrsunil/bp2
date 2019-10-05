import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';

@Component({
    selector: 'atlas-pricing-options',
    templateUrl: './pricing-options.component.html',
    styleUrls: ['./pricing-options.component.scss'],
})
export class PricingOptionsComponent extends BaseFormComponent implements OnInit {

    @Output() readonly pricingAndDecimalOptionSelected = new EventEmitter<any>();

    pricingOptionsCtrl = new AtlasFormControl('pricingOptions');
    decimalOptionsCtrl = new AtlasFormControl('decimalOptions', 2);

    decimalOptions: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    masterdata: MasterData;

    constructor(private route: ActivatedRoute, protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.bindConfiguration();
        this.emitPricingAndDecimalOptions();
    }

    onPricingDecimalOptionSelected() {
        this.emitPricingAndDecimalOptions();
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            pricingOptionsCtrl: this.pricingOptionsCtrl,
            decimalOptionsCtrl: this.decimalOptionsCtrl,
        });
        return super.getFormGroup();
    }

    emitPricingAndDecimalOptions() {
        this.pricingAndDecimalOptionSelected.emit({
            pricingOption: Number(this.pricingOptionsCtrl.value),
            decimalOption: Number(this.decimalOptionsCtrl.value),
        });
    }

    onDifferentCommoditySelected(differentCommoditySelected: boolean, differentPricesSelected: boolean) {
        if (differentCommoditySelected) {
            this.setValidators();
        } else if (differentPricesSelected) {
            this.setValidators();
        } else {
            this.clearValidators();
        }
    }

    setValidators() {
        this.pricingOptionsCtrl.setValidators(Validators.compose([Validators.required]));
        this.pricingOptionsCtrl.updateValueAndValidity();
    }

    clearValidators() {
        this.pricingOptionsCtrl.clearValidators();
        this.pricingOptionsCtrl.updateValueAndValidity();
    }

    populateEntity(entity: any): any {
        const invoiceType = entity as InvoiceRecord;

        invoiceType.pricingOptionId = this.pricingOptionsCtrl.value ? Number(this.pricingOptionsCtrl.value) : null;
        invoiceType.decimalOption = Number(this.decimalOptionsCtrl.value);
        return invoiceType;
    }

}
