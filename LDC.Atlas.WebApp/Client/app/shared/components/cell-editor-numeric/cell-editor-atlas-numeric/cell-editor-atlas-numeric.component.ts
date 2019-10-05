import { AfterViewInit, Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { AtlasNumber } from '../../../entities/atlas-number.entity';
import { CellEditorNumericComponent } from '../cell-editor-numeric.component';
import { INumericCellEditorParams } from '../INumericCellEditorParams';
@Component({
    selector: 'atlas-cell-editor-atlas-numeric',
    templateUrl: './../cell-editor-numeric.component.html',
    styleUrls: ['./../cell-editor-numeric.component.scss'],
})
export class CellEditorAtlasNumericComponent extends CellEditorNumericComponent implements AfterViewInit, ICellEditorAngularComp {
    originalValue: string;
    value: string;

    constructor() {
        super();
    }

    getValue(): string {
        return this.value && this.value !== 'NaN' ? this.value : '';
    }

    isCancelAfterEnd?(): boolean {
        const originalValue: AtlasNumber = new AtlasNumber(this.originalValue);
        return originalValue.equal(this.value);
    }

    agInit(params: ICellEditorParams | INumericCellEditorParams): void {
        this.params = params as ICellEditorParams;
        const value = this.params.value;
        this.value = new AtlasNumber(value).toString();
        this.originalValue = this.value;

        const numericParams = params as INumericCellEditorParams;
        this.displayMask = numericParams.displayMask;
        this.isRightAligned = numericParams.isRightAligned;
    }
}
