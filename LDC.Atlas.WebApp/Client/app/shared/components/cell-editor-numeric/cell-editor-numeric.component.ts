import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { ConvertToNumber } from '../../numberMask';
import { INumericCellEditorParams } from './INumericCellEditorParams';

@Component({
    selector: 'atr-cell-editor-numeric',
    templateUrl: './cell-editor-numeric.component.html',
    styleUrls: ['./cell-editor-numeric.component.scss'],
})
export class CellEditorNumericComponent implements AfterViewInit, ICellEditorAngularComp {

    @ViewChild(MatInput) matInput: MatInput;
    @ViewChild('numericInput') input: any;
    originalValue: number | string;
    value: number | string;
    displayMask: string[] | RegExp = [];
    isRightAligned: boolean;
    params: ICellEditorParams;
    isRequiredField: boolean = false;

    constructor() { }

    ngAfterViewInit() {
        setTimeout(() => {
            this.matInput.focus();
            this.input.nativeElement.select();
        });
    }

    getValue(): number | string {
        return ConvertToNumber(this.value);
    }

    isPopup?(): boolean {
        return false;
    }

    isCancelBeforeStart?(): boolean {
        return false;
    }

    isCancelAfterEnd?(): boolean {
        return (this.originalValue === ConvertToNumber(this.value));
    }

    focusIn?(): void {
    }

    focusOut?(): void {
    }

    agInit(params: ICellEditorParams | INumericCellEditorParams | any): void {

        this.isRequiredField = params.isRequiredField;
        this.params = params as ICellEditorParams;
        this.value = this.params.value;
        this.originalValue = this.value;

        const numericParams = params as INumericCellEditorParams;
        this.displayMask = numericParams.displayMask;
        this.isRightAligned = numericParams.isRightAligned;
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    }
}
