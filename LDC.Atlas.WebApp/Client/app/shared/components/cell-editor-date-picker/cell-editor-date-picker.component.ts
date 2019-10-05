import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { Moment } from 'moment';
import { IDatePickerCellEditorParams } from './IDatePickerCellEditorParams';

@Component({
    selector: 'atr-cell-editor-date-picker',
    templateUrl: './cell-editor-date-picker.component.html',
    styleUrls: ['./cell-editor-date-picker.component.scss']
})
export class CellEditorDatePickerComponent<D extends Date | Moment> implements ICellEditorAngularComp, AfterViewInit {

    @ViewChild("calendar")
    public calendar: MatCalendar<D>;

    public params: ICellEditorParams;
    public value: D;

    constructor() { }

    ngAfterViewInit(): void {
        this.calendar._userSelected = () => {
            this.params.stopEditing();
        };
    }

    getValue() {
        return this.value;
    }

    isPopup?(): boolean {
        return true;
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

    agInit(params: ICellEditorParams | IDatePickerCellEditorParams<D>): void {
        this.params = params as ICellEditorParams;
        this.value = this.params.value as D;

        let datepickerParam = params as IDatePickerCellEditorParams<D>;

        if (datepickerParam.minDate) {
            this.calendar.minDate = datepickerParam.minDate;
        }
        if (datepickerParam.maxDate) {
            this.calendar.maxDate = datepickerParam.maxDate;
        }
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {

    }
}
