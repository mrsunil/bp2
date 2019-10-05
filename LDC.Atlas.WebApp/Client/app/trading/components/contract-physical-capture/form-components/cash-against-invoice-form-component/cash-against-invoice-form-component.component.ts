import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-cash-against-invoice-form-component',
    templateUrl: './cash-against-invoice-form-component.component.html',
    styleUrls: ['./cash-against-invoice-form-component.component.scss'],
})
export class CashAgainstInvoiceFormComponentComponent extends BaseFormComponent implements OnInit {
    cashMatchDateCtrl = new AtlasFormControl('CashMatchDate');
    hasEmptyState: boolean = true;
    cashAgainstInvoiceEmptyMessage: string = 'Accountants are working on the subject';

    constructor(protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }

}
