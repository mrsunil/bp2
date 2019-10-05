import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-invoice-totals',
    templateUrl: 'invoice-totals.component.html',
    styleUrls: ['invoice-totals.component.scss'],
})
export class InvoiceTotalsComponent extends BaseFormComponent implements OnInit {

    translationKeyPrefix: string = 'TRADING.TRADE_CAPTURE.INVOICE_MARKING_TAB.TOTALS.';

    totalQuantity: number = 0;
    totalQuantityPercent: number = 0;
    totalInvoiceValue: number = 0;
    totalInvoiceValuePercent: number = 0;
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.bindConfiguration();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({

        });
        return super.getFormGroup();
    }
}
