import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GroupSelection } from '../../../entities/group-selection-entity';

@Component({
    selector: 'atlas-bulk-edition',
    templateUrl: './bulk-edition.component.html',
    styleUrls: ['./bulk-edition.component.scss'],
})
export class BulkEditionComponent extends BaseFormComponent implements OnInit {
    @Output() readonly bulkEditOptionChecked = new EventEmitter<any>();

    bulkEditionCtrl = new AtlasFormControl('bulkEditionType');
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
            (functionType) => functionType.functionTypeCode === GroupFunctionTypes.TradeBulkEdition);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bulkEditionCtrl: this.bulkEditionCtrl,
        });
        return super.getFormGroup();
    }

    onSelectionChange($event, value, groupFunctionType) {
        this.bulkEditOptionChecked.emit({
            bulkEditOption: Number(groupFunctionType.functionTypeCode),
            checked: Boolean(value),
        });
    }

    bulkEditionOptionDisable() {
        this.bulkEditionCtrl.disable();
    }
    bulkEditionOptionEnable() {
        this.bulkEditionCtrl.enable();
    }

}
