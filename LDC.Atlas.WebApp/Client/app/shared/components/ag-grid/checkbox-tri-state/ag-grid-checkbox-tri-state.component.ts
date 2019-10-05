import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { TriStateCheckboxStatus } from './../../../enums/tri-state-checkbox-status.enum';
import { CheckboxTriStateCellRendererParams } from './checkbox-tri-state-cell-renderer-params.interface';

@Component({
    selector: 'atlas-ag-grid-checkbox-tri-state',
    templateUrl: './ag-grid-checkbox-tri-state.component.html',
    styleUrls: ['./ag-grid-checkbox-tri-state.component.scss'],
})
export class AgGridCheckboxTriStateComponent implements AgRendererComponent {
    params: ICellRendererParams;
    checkStatus: TriStateCheckboxStatus;
    isChecked: boolean;
    editableFunc;
    originalCheckStatusField: string;
    TriStateCheckboxStatus = TriStateCheckboxStatus;

    disabled: boolean;
    boolean; protected onCellValueChanged = (params) => { };

    agInit(params: ICellRendererParams | CheckboxTriStateCellRendererParams): void {
        this.params = params as ICellRendererParams;

        const checkboxParams = params as CheckboxTriStateCellRendererParams;
        this.checkStatus = this.params.data[this.params.colDef.field];
        this.originalCheckStatusField = checkboxParams.originalCheckStatusField;
        this.isChecked = this.checkStatus === TriStateCheckboxStatus.All;
        this.disabled = false;

        if (typeof checkboxParams.disabled === 'boolean') {
            this.disabled = checkboxParams.disabled;
        }

        if (typeof checkboxParams.disabled === 'function') {
            this.editableFunc = checkboxParams.disabled;
            this.disabled = this.editableFunc(this.params);
        }

        if (checkboxParams.onCellValueChanged) {
            this.onCellValueChanged = checkboxParams.onCellValueChanged;
        }
    }

    onChange(checked: boolean) {
        // If the value was an intermediate state
        // When i click : Partial => All => None => Partial
        if (this.params.data[this.originalCheckStatusField] === TriStateCheckboxStatus.Partial) {
            switch (this.checkStatus) {
                case TriStateCheckboxStatus.None:
                    this.checkStatus = TriStateCheckboxStatus.Partial;
                    break;
                case TriStateCheckboxStatus.Partial:
                    this.checkStatus = TriStateCheckboxStatus.All;
                    break;
                case TriStateCheckboxStatus.All:
                    this.checkStatus = TriStateCheckboxStatus.None;
                    break;
            }
        } else {
            this.checkStatus = checked ? TriStateCheckboxStatus.All : TriStateCheckboxStatus.None;
        }

        this.params.node.setDataValue(this.params.colDef.colId, this.checkStatus);
        this.onCellValueChanged(this.params);
        this.refresh(this.params);
    }

    refresh(params: any) {
        if (this.editableFunc) {
            this.disabled = this.editableFunc(this.params);
        }
        return true;
    }

}
