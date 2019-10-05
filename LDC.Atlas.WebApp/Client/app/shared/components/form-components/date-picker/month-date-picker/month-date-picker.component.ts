import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { UtilService } from './../../../../services/util.service';
import { DatePickerComponent } from './../date-picker.component';

export const MY_FORMATS = {
    parse: {
        dateInput: 'MMM YYYY',
    },
    display: {
        dateInput: 'MMM YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'atlas-month-date-picker',
    templateUrl: './month-date-picker.component.html',
    styleUrls: ['./month-date-picker.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class MonthDatePickerComponent extends DatePickerComponent implements OnInit {
    @Output() readonly monthChanged = new EventEmitter<any>();
    constructor(protected utilService: UtilService) {
        super(utilService);
    }

    onChosenYearSelected(normalizedYear: _moment.Moment) {
        const ctrlValue = this.fieldControl.value ? this.fieldControl.value : normalizedYear;
        ctrlValue.year(normalizedYear.year());
        this.fieldControl.setValue(ctrlValue);
        this.fieldControl.updateValueAndValidity();
    }

    onChosenMonthSelected(normlizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
        const ctrlValue = this.fieldControl.value ? this.fieldControl.value : normlizedMonth;
        ctrlValue.month(normlizedMonth.month());
        ctrlValue.date(1);
        this.fieldControl.setValue(ctrlValue);
        this.fieldControl.updateValueAndValidity();
        datepicker.close();
        this.monthChanged.emit(this.fieldControl.value);
    }
    onValueEntered() {
        if (this.fieldControl.value) {
            const ctrlValue = _moment.parseZone(this.fieldControl.value);
            ctrlValue.date(1);
            this.fieldControl.setValue(ctrlValue);
            this.fieldControl.updateValueAndValidity();
            this.monthChanged.emit(this.fieldControl.value);
        }
    }
}
