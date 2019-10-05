import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
    animal: string;
    fname: string;
}
@Component({
    selector: 'atr-ux-components-list',
    templateUrl: './ux-dialog-text.component.html',
    styleUrls: ['./ux-components-list.component.scss'],
})

export class DialogComponent {
    hide = false;
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

}
