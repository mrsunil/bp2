import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ReportSortType } from '../../../../../../../shared/enums/report-sort-type.enum'
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';


@Component({
    selector: 'atlas-sort-by',
    templateUrl: './sort-by.component.html',
    styleUrls: ['./sort-by.component.scss']
})
export class SortByComponent extends BaseFormComponent implements OnInit {
    @Output() readonly sortBySelected = new EventEmitter<string>();
    sortByCtrl = new FormControl();
    formGroup: FormGroup;
    ReportSortType = ReportSortType;
    constructor(private formBuilder: FormBuilder,
        formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.getFormGroup();
        this.sortByCtrl.patchValue(ReportSortType.Currency);
        this.onChanges();
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            sortByCtrl: this.sortByCtrl,
        });
        return super.getFormGroup();
    }
    onChanges() {
        this.sortByCtrl.valueChanges.subscribe((sortByValue) => {
            this.sortBySelected.emit(sortByValue);
        });
    }


} 
