import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { GroupSelection } from '../../../../trading/entities/group-selection-entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';

@Component({
    selector: 'atlas-bulk-allocation',
    templateUrl: './bulk-allocation.component.html',
    styleUrls: ['./bulk-allocation.component.scss']
})
export class BulkAllocationComponent extends BaseFormComponent implements OnInit {

    @Output() readonly bulkAllocationOptionChecked = new EventEmitter<any>();

    bulkAllocationCtrl = new AtlasFormControl('bulkAllocationType');
    company: string;
    groupFunctionTypeMenu: GroupSelection[] = [];

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.groupFunctionTypeMenu = this.groupFunctionTypeMenu.filter(
            (functionType) => functionType.functionTypeCode === GroupFunctionTypes.TradeBulkAllocation);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bulkAllocationCtrl: this.bulkAllocationCtrl,
        });
        return super.getFormGroup();
    }

    onSelectionChange($event, value, groupFunctionType) {
        this.bulkAllocationOptionChecked.emit({
            bulkAllocationOption: Number(groupFunctionType.functionTypeCode),
            checked: Boolean(value),
        });
    }

    bulkAllocationOptionDisable() {
        this.bulkAllocationCtrl.disable();
    }
    bulkAllocationOptionEnable() {
        this.bulkAllocationCtrl.enable();
    }


}
