import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-close-month-warning-dialog',
    templateUrl: './close-month-warning-dialog.component.html',
    styleUrls: ['./close-month-warning-dialog.component.scss'],
})
export class CloseMonthWarningDialogComponent implements OnInit {

    dialogData: {
        title: string,
        text: string,
        okButton: string,
        noButton: string,
    };

    constructor(
        public thisDialogRef: MatDialogRef<CloseMonthWarningDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string, noButton: string, okButton: string; },
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
    }
    onClose() {
        this.thisDialogRef.close(false);
    }
    onCloseConfirm() {
        this.thisDialogRef.close(true);
    }

}
