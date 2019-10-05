import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'atlas-cost-impact-warning-dialog',
    templateUrl: './cost-impact-warning-dialog.component.html',
    styleUrls: ['./cost-impact-warning-dialog.component.scss'],
})
export class CostImpactWarningDialogComponent implements OnInit {

    chipStringList: string[];
    warningListForDiffFields: string;

    dialogData: {
        confirmationMessage: string,
        contractReference: string[],
        warningList: string,

    };
    dialogText: string = '';
    constructor(public thisDialogRef: MatDialogRef<CostImpactWarningDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            confirmationMessage: string, contractReference: string[], warningList: string,
        }) {
        this.dialogData = data;
        this.dialogText = this.dialogData.confirmationMessage;
        this.chipStringList = this.dialogData.contractReference;
        this.warningListForDiffFields = this.dialogData.warningList;
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
