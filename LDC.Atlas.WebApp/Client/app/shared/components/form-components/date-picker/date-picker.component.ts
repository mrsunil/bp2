import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { FormComponentBaseComponent } from '../form-component-base/form-component-base.component';
import { Validators } from '@angular/forms';
import { isValidDateForSql } from '../../../validators/date-validators.validator';

@Component({
    selector: 'atlas-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
})

export class DatePickerComponent extends FormComponentBaseComponent implements OnInit {

    @Input() emptyValue: string;
    @Input() disabled = false;
    @Output() readonly dateChanged = new EventEmitter<any>();

    constructor(protected utils: UtilService) {
        super(utils);
    }

    ngOnInit() {
        this.fieldControl.setValidators(Validators.compose([isValidDateForSql(), this.fieldControl.validator]));

    }
    onChosenDateSelected() {
        this.dateChanged.emit();
    }
}
