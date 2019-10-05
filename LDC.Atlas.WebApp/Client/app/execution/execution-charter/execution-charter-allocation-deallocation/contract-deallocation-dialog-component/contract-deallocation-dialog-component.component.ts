import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-contract-deallocation-dialog-component',
    templateUrl: './contract-deallocation-dialog-component.component.html',
    styleUrls: ['./contract-deallocation-dialog-component.component.scss'],
})
export class ContractDeallocationDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ContractDeallocationDialogComponent>) { }

    onCancelButtonClicked() {
        this.dialogRef.close();
    }

    onYesButtonClicked() {
        this.dialogRef.close(true);
    }

    onNoButtonClicked() {
        this.dialogRef.close(false);
    }

}
