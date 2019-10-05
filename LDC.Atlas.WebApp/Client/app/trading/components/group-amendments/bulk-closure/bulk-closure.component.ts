import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { GroupSelection } from '../../../../trading/entities/group-selection-entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';

@Component({
    selector: 'atlas-bulk-closure',
    templateUrl: './bulk-closure.component.html',
    styleUrls: ['./bulk-closure.component.scss']
})

export class BulkClosureComponent extends BaseFormComponent implements OnInit {
    @Output() readonly bulkClosureOptionChecked = new EventEmitter<any>();

    bulkClosureCtrl = new AtlasFormControl('bulkClosureType');
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
            (functionType) => functionType.functionTypeCode === GroupFunctionTypes.TradeBulkClosure);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bulkClosureCtrl: this.bulkClosureCtrl,
        });
        return super.getFormGroup();
    }

    onSelectionChange($event, value, groupFunctionType) {
        this.bulkClosureOptionChecked.emit({
            bulkClosureOption: Number(groupFunctionType.functionTypeCode),
            checked: Boolean(value),
        });
    }

    bulkClosureOptionDisable() {
        this.bulkClosureCtrl.disable();
    }

    bulkClosureOptionEnable() {
        this.bulkClosureCtrl.enable();
    }
}
