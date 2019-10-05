import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control'
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { CharterGroupFunctionTypes } from '../../../../shared/enums/charter-group-function-type';
import { CharterGroupSelection } from '../../../../shared/entities/charter-group-selection.entity';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'atlas-charter-bulk-closure',
    templateUrl: './charter-bulk-closure.component.html',
    styleUrls: ['./charter-bulk-closure.component.scss']
})
export class CharterBulkClosureComponent extends BaseFormComponent implements OnInit {
    charterBulkClosureCtrl = new AtlasFormControl('charterBulkClosure');
    company: string;
    charterGroupFunctionTypeMenu: CharterGroupSelection[] = [];
    @Output() readonly charterBulkClosureOptionChecked = new EventEmitter<any>();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute, private formBuilder: FormBuilder) { super(formConfigurationProvider) }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.charterGroupFunctionTypeMenu = this.charterGroupFunctionTypeMenu.filter(
            (functionType) => functionType.charterFunctionTypeCode === CharterGroupFunctionTypes.CharterBulkClosure);
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            charterBulkClosureCtrl: this.charterBulkClosureCtrl,
        });
        return super.getFormGroup();
    }
    onSelectionChange($event, value, groupFunctionType) {
        this.charterBulkClosureOptionChecked.emit({
            bulkClosureOption: Number(groupFunctionType.charterFunctionTypeCode),
            checked: Boolean(value),
        });
    }

}
