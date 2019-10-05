import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-trade-deallocation-dialog-component',
    templateUrl: 'trade-deallocation-dialog-component.component.html',
    styleUrls: ['trade-deallocation-dialog-component.component.scss'],
})
export class TradeDeallocationDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<TradeDeallocationDialogComponent>) { }

    onDiscardButtonClicked() {
        this.dialogRef.close();
    }

    onReinstateButtonClicked() {
        this.dialogRef.close(true);
    }

    onKeepButtonClicked() {
        this.dialogRef.close(false);
    }

}
