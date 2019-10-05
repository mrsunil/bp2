import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepicker } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { UtilService } from './../../../../services/util.service';
import { DatePickerComponent } from './../date-picker.component';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};

@Component({
    selector: 'atlas-year-picker',
    templateUrl: './year-picker.component.html',
    styleUrls: ['./year-picker.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class YearPickerComponent extends DatePickerComponent implements OnInit {

    @Output() readonly yearChanged = new EventEmitter<any>();
    constructor(protected utilService: UtilService) {
        super(utilService);
    }
    onChosenYearSelected(normalizedYear: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
        const ctrlValue = this.fieldControl.value ? this.fieldControl.value : normalizedYear;
        ctrlValue.year(normalizedYear.year());
        this.fieldControl.setValue(ctrlValue);
        this.fieldControl.updateValueAndValidity();
        datepicker.close();
        this.yearChanged.emit(this.fieldControl.value);
    }

    onValueEntered() {
        if (this.fieldControl.value) {
            const ctrlValue = _moment.parseZone(this.fieldControl.value);
            ctrlValue.date(1);
            this.fieldControl.setValue(ctrlValue);
            this.fieldControl.updateValueAndValidity();
            this.yearChanged.emit(this.fieldControl.value);
        }
    }

}
