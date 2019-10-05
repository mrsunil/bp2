import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-button',
    templateUrl: './ag-grid-button.component.html',
    styleUrls: ['./ag-grid-button.component.scss'],
})
export class AgGridButtonComponent implements ICellRendererAngularComp {
    disabled: boolean;
    public params: any;
    display: string;
    shouldDisplayButton: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    agInit(params: any): void {
        this.params = params;
        this.disabled = false;
        this.disabled = this.params.disabled;
        this.display = this.params.data[this.params.colDef.field];
        this.shouldDisplayButton = this.params.shouldDisplayButton || this.display.length > 30;
    }

    refresh(params: any): boolean {
        return false;
    }

    onMessageButtonClicked() {
        if (this.params.data[this.params.colDef.field] && this.params.onButtonClicked) {
            this.params.onButtonClicked(this.params.data[this.params.colDef.field]);
        }
    }

}
