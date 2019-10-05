import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCalendar, MatDatepicker } from '@angular/material';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { Moment } from 'moment';
import { IDatePickerCellEditorParams } from '../cell-editor-date-picker/IDatePickerCellEditorParams';
import { FormControl } from '@angular/forms';
import { DateFormats } from '../../enums/date-format.enum';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
    selector: 'atr-cell-editor-month-date-picker',
    templateUrl: './cell-editor-month-date-picker.component.html',
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class CellEditorMonthDatePickerComponent<D extends Date | Moment> implements ICellEditorAngularComp, AfterViewInit {

    @ViewChild("picker")
    datePicker: MatDatepicker<D>
    monthPickerCtrl = new FormControl();
    mode: DateFormats;
    viewStart: string;
    endflag: boolean;

    params: ICellEditorParams;
    value: D;
    startDate: D;

    constructor() { }

    ngAfterViewInit(): void {
        this.datePicker.open();
    }

    getValue() {
        return this.monthPickerCtrl.value;
    }

    isPopup?(): boolean {
        return false;
    }

    isCancelBeforeStart?(): boolean {
        return false;
    }

    isCancelAfterEnd?(): boolean {
        return false;
    }

    focusIn?(): void {
    }

    focusOut?(): void {
    }

    agInit(params: any): void {
        this.params = params as ICellEditorParams;
        this.value = this.params.value as D;
        this.startDate = params.startAt;

        if (typeof params.mode === 'number') {
            this.mode = params.mode;
        }
        if (typeof params.mode === 'function') {
            this.mode = params.mode(params);
        }

        if (typeof params.endflag === 'boolean') {
            this.endflag = params.endflag;
        }
        if (typeof params.endflag === 'function') {
            this.endflag = params.endflag(params);
        }

        this.startDate = (typeof params.startAt == 'function') ? params.startAt(params) : params.startAt;

        let datepickerParam = params as IDatePickerCellEditorParams<D>;
        this.viewStart = this.mode == DateFormats.Month ? 'multi-year' : 'month';
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    }

    onMonthSelected(event) {
        if (this.mode == DateFormats.Month) {
            this.monthPickerCtrl.setValue(event);
            this.datePicker.close();
        }
    }

    onPickerClosed() {
        if (this.endflag && this.mode == DateFormats.Month) {
            this.monthPickerCtrl.setValue(this.monthPickerCtrl.value.endOf('month').startOf('day'));
        }
    }

}
