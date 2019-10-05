import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-validation-dialog',
    templateUrl: './validation-dialog.component.html',
    styleUrls: ['./validation-dialog.component.scss'],
})
export class ValidationDialogComponent implements OnInit {

    message: string;
    dialogData: {
        message: string;
    };
    constructor(public thisDialogRef: MatDialogRef<ValidationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }) {
        this.dialogData = data;
    }

    ngOnInit() {
        this.message = this.dialogData.message;
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(false);
    }

    onOkButtonClicked() {
        this.thisDialogRef.close(true);
    }

}
