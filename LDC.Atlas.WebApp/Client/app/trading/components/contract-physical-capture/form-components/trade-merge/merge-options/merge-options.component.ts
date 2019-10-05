import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { MergeContracts } from '../../../../../../shared/entities/merge-contracts.entity';
import { TradeMergeOptions } from '../../../../../../shared/entities/trade-merge-options.entity';
import { ContractMergeOptions } from '../../../../../../shared/enums/trade-merge-options.enum';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-merge-options',
    templateUrl: './merge-options.component.html',
    styleUrls: ['./merge-options.component.scss'],
})
export class MergeOptionsComponent extends BaseFormComponent implements OnInit {

    @Output() readonly mergeOptionSelected = new EventEmitter<any>();

    mergeOptionsList: TradeMergeOptions[] = [];
    mergeOptionsCtrl = new FormControl();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
        this.mergeOptionsList = TradeMergeOptions.getTradeMergeOptionsList();
    }

    ngOnInit() {
        this.mergeOptionsCtrl = new FormControl(this.mergeOptionsList.find((option) => option.name === 'Contract Header(.0000)'));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            mergeOptionsCtrl: this.mergeOptionsCtrl,
        });
        return super.getFormGroup();
    }

    onMergeOptionSelectionChanged(mergeOptionNames) {
        this.mergeOptionSelected.emit(mergeOptionNames.value);
    }

    populateEntity(entity: MergeContracts[]): MergeContracts[] {
        const selectedContracts = entity;

        if (this.mergeOptionsCtrl.value && this.mergeOptionsCtrl.value.value && this.mergeOptionsCtrl.value.value === ContractMergeOptions.ContractHeader) {

            this.mergeOptionSelected.emit(ContractMergeOptions.ContractHeader);
        }
        return selectedContracts;
    }
}
