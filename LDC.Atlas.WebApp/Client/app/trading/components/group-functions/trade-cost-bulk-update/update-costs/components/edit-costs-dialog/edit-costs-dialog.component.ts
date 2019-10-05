import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-edit-costs-dialog',
    templateUrl: './edit-costs-dialog.component.html',
    styleUrls: ['./edit-costs-dialog.component.scss'],
})
export class EditCostsDialogComponent implements OnInit {
    chipStringList: string[];

    dialogData: {
        confirmationMessage: string,
        contractReference: string[],

    };
    dialogText: string = '';
    constructor(public thisDialogRef: MatDialogRef<EditCostsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            confirmationMessage: string, contractReference: string[],
        }) {
        this.dialogData = data;
        this.dialogText = this.dialogData.confirmationMessage;
        this.chipStringList = this.dialogData.contractReference;
    }

    ngOnInit() {
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close();
    }

    onYesButtonClicked() {
        this.thisDialogRef.close(true);
    }

    onNoButtonClicked() {
        this.thisDialogRef.close(false);
    }

}
