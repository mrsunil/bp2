import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';

@Component({
    selector: 'atlas-group-function-warning',
    templateUrl: './group-function-warning.component.html',
    styleUrls: ['./group-function-warning.component.scss'],
})
export class GroupFunctionWarningComponent extends BaseFormComponent implements OnInit {
    bulkActionTypeId: number;
    GroupFunctionTypes = GroupFunctionTypes;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
    ) {
        super(formConfigurationProvider);
        this.bulkActionTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('bulkActionTypeId')));
    }
    ngOnInit() {
    }

}
