import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'atr-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
    dialogData: {
        title: string,
        text: string,
        okButton: string,
        cancelButton: string;
    };

    constructor(
        public thisDialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string, okButton: string, cancelButton: string; },
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
    }

    onCloseConfirm() {
        this.thisDialogRef.close(true);
    }

    onCloseCancel() {
        this.thisDialogRef.close(false);
    }
}
