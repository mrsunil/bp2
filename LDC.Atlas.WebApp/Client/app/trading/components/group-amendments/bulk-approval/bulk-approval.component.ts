import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { GroupFunctionTypes } from '../../../../shared/enums/group-function-type';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GroupSelection } from '../../../entities/group-selection-entity';

@Component({
    selector: 'atlas-bulk-approval',
    templateUrl: './bulk-approval.component.html',
    styleUrls: ['./bulk-approval.component.scss'],
})
export class BulkApprovalComponent extends BaseFormComponent implements OnInit {
    @Output() readonly bulkApprovalOptionChecked = new EventEmitter<any>();

    bulkApprovalCtrl = new AtlasFormControl('bulkApprovalType');
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
            (functionType) => functionType.functionTypeCode === GroupFunctionTypes.TradeBulkApproval);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bulkApprovalCtrl: this.bulkApprovalCtrl,
        });
        return super.getFormGroup();
    }

    onSelectionChange($event, value, groupFunctionType) {
        this.bulkApprovalOptionChecked.emit({
            bulkApprovalOption: Number(groupFunctionType.functionTypeCode),
            checked: Boolean(value),
        });
    }

    bulkApprovalOptionDisable() {
        this.bulkApprovalCtrl.disable();
    }
    bulkApprovalOptionEnable() {
        this.bulkApprovalCtrl.enable();
    }

}
