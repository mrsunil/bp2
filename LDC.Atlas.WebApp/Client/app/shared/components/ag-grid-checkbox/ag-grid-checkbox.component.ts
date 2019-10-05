import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, ICellRendererParams } from 'ag-grid-community';
import { CheckboxCellRendererParams } from './checkbox-cell-renderer-params';

@Component({
    selector: 'atlas-ag-grid-checkbox',
    templateUrl: './ag-grid-checkbox.component.html',
    styleUrls: ['./ag-grid-checkbox.component.scss'],
})
export class AgGridCheckboxComponent implements AgRendererComponent {

    private _params: ICellRendererParams;
    public isChecked: boolean;
    private editableFunc;

    disabled: boolean;

    get params() {
        return this._params;
    }

    agInit(params: ICellRendererParams | CheckboxCellRendererParams): void {
        this._params = params as ICellRendererParams;

        const checkboxParams = params as CheckboxCellRendererParams;
        this.isChecked = this.params.data[this.params.colDef.field];
        this.disabled = false;

        if (typeof checkboxParams.disabled === 'boolean') {
            this.disabled = checkboxParams.disabled;
        }

        if (typeof checkboxParams.disabled === 'function') {
            this.editableFunc = checkboxParams.disabled;
            this.disabled = this.editableFunc();
        }
    }

    onChange(checked: boolean) {
        this.isChecked = checked;
        this.params.node.setDataValue(this.params.colDef.colId, checked);
    }

    refresh(params: any): boolean {
        if (this.editableFunc) {
            this.disabled = this.editableFunc();
        }
        return true;
    }
}
