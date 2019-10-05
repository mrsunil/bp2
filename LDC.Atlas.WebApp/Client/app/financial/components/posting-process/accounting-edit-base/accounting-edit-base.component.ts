import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from './../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from './../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-accounting-edit-base',
    templateUrl: './accounting-edit-base.component.html',
})
export class AccountingEditBaseComponent extends BaseFormComponent implements OnInit {

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }

    getTooltip(params, description: string, valueProperty: string, list: any[]) {
        if (params.value && (typeof params.value === 'string' || typeof params.value === 'number')) {
            const selected = list.find(
                (obj) => obj[valueProperty] ? obj[valueProperty].toString().toUpperCase() === params.value.toString().toUpperCase() : false);
            if (selected) {
                return selected[description];
            }
        }
    }
}
