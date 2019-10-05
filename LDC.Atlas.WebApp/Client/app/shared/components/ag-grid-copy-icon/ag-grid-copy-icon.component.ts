import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'atlas-ag-grid-copy-icon',
    templateUrl: './ag-grid-copy-icon.component.html',
    styleUrls: ['./ag-grid-copy-icon.component.scss']
})
export class AgGridCopyIconComponent implements OnInit {

    copiedContent: string;

    constructor() { }
    agInit(params: any): void {
        this.copiedContent = params.value as string;
    }

    ngOnInit(): void {
    }

    refresh(): boolean {
        return false;
    }

    public onCopyIconClick() {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.copiedContent;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

}
