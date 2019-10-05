import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GroupSelection } from '../../../entities/group-selection-entity';

@Component({
    selector: 'atlas-bulk-update-costs',
    templateUrl: './bulk-update-costs.component.html',
    styleUrls: ['./bulk-update-costs.component.scss'],
})
export class BulkUpdateCostsComponent extends BaseFormComponent implements OnInit {
    bulkCostsUpdateCtrl = new AtlasFormControl('bulkUpdateCostsType');
    company: string;
    groupFunctionTypeMenu: GroupSelection[] = [];
    @Output() readonly bulkCostsUpdateOptionChecked = new EventEmitter<any>();
    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.groupFunctionTypeMenu = this.groupFunctionTypeMenu.filter(
            (functionType) => functionType.functionTypeCode === GroupFunctionTypes.Costs);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bulkCostsUpdateCtrl: this.bulkCostsUpdateCtrl,
        });
        return super.getFormGroup();
    }

    onSelectionChange($event, value, groupFunctionType) {
        this.bulkCostsUpdateOptionChecked.emit({
            bulkCostUpdateOption: Number(groupFunctionType.functionTypeCode),
            checked: Boolean(value),
        });
    }

    bulkCostsUpdateOptionDisable() {
        this.bulkCostsUpdateCtrl.disable();
    }
    bulkCostsUpdateOptionEnable() {
        this.bulkCostsUpdateCtrl.enable();
    }
}
