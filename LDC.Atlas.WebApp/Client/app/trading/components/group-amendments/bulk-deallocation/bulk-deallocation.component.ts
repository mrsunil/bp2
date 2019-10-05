import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { GroupSelection } from '../../../../trading/entities/group-selection-entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';

@Component({
    selector: 'atlas-bulk-deallocation',
    templateUrl: './bulk-deallocation.component.html',
    styleUrls: ['./bulk-deallocation.component.scss']
})

export class BulkDeallocationComponent extends BaseFormComponent implements OnInit {
    @Output() readonly bulkDeAllocationOptionChecked = new EventEmitter<any>();

    bulkDeAllocationCtrl = new AtlasFormControl('bulkDeAllocationType');
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
            (functionType) => functionType.functionTypeCode === GroupFunctionTypes.TradeBulkDeAllocation);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bulkDeAllocationCtrl: this.bulkDeAllocationCtrl,
        });
        return super.getFormGroup();
    }

    onSelectionChange($event, value, groupFunctionType) {
        this.bulkDeAllocationOptionChecked.emit({
            bulkDeAllocationOption: Number(groupFunctionType.functionTypeCode),
            checked: Boolean(value),
        });
    }

    bulkDeAllocationOptionDisable() {
        this.bulkDeAllocationCtrl.disable();
    }

    bulkDeAllocationOptionEnable() {
        this.bulkDeAllocationCtrl.enable();
    }
}
