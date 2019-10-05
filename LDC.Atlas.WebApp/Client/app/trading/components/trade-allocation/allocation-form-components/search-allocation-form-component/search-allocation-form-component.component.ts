import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-search-allocation-form-component',
    templateUrl: './search-allocation-form-component.component.html',
    styleUrls: ['./search-allocation-form-component.component.scss'],
})
export class SearchAllocationFormComponent extends BaseFormComponent implements OnInit {

    constructor(protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }

}
