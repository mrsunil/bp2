import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { ISelectCellEditorParams } from './ISelectCellEditorParams';

@Component({
    selector: 'atr-cell-editor-select',
    templateUrl: './cell-editor-select.component.html',
    styleUrls: ['./cell-editor-select.component.scss'],
})
export class CellEditorSelectComponent implements AfterViewInit, ICellEditorAngularComp {
    @ViewChild(MatSelect) select: MatSelect;
    values: any[];
    displayPropertyName: string;
    valuePropertyName: string;
    displayFormat: string;
    value: any;
    params: ICellEditorParams;

    constructor() {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.select.focus();
            this.select.open();
        });
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

    focusIn?(): void {}

    focusOut?(): void {}

    agInit(params: ICellEditorParams | ISelectCellEditorParams): void {
        this.params = params as ICellEditorParams;
        this.value = this.params.value;

        const selectParams = params as ISelectCellEditorParams;
        this.values = selectParams.values;
        this.displayPropertyName = selectParams.displayPropertyName;
        this.valuePropertyName = selectParams.valuePropertyName;
        this.displayFormat = selectParams.displayFormat;
    }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {}

    getFormatedValue(code: string): string {
        const item = this.values.filter((val) => val[this.valuePropertyName] === code)[0];

        if (this.displayFormat != null && this.displayFormat !== '') {
            return this.displayFormat
                .replace(this.valuePropertyName, item[this.valuePropertyName])
                .replace(this.displayPropertyName, item[this.displayPropertyName]);
        } else {
            return item[this.displayPropertyName];
        }
    }
}
