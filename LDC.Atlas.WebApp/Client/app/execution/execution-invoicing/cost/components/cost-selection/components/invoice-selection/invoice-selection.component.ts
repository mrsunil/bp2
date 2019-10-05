import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-invoice-selection',
    templateUrl: './invoice-selection.component.html',
    styleUrls: ['./invoice-selection.component.scss'],
})
export class InvoiceSelectionComponent extends BaseFormComponent implements OnInit {
    invoiceTypeSelectedCtrl = new AtlasFormControl('invoiceCostTypeSelected');
    costInvoiceTypeName: string = 'Cost';

    constructor(
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.getData();
    }
    getData() {
        this.invoiceTypeSelectedCtrl.patchValue(this.costInvoiceTypeName);
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceTypeSelectedCtrl: this.invoiceTypeSelectedCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceType = entity;
        invoiceType.invoiceType = this.invoiceTypeSelectedCtrl.value;
        return invoiceType;
    }
}
