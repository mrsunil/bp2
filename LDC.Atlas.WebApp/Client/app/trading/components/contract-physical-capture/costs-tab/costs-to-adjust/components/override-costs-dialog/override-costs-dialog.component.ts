import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AddOrOverride } from '../../../../../../../shared/enums/add-override.enum';

@Component({
    selector: 'atlas-override-costs-dialog',
    templateUrl: './override-costs-dialog.component.html',
    styleUrls: ['./override-costs-dialog.component.scss'],
})
export class OverrideCostsDialogComponent implements OnInit {

    dialogData: {
        confirmationMessage: string,
    };
    dialogText: string = '';
    constructor(public thisDialogRef: MatDialogRef<OverrideCostsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            confirmationMessage: string,
        }) {
        this.dialogData = data;
        this.dialogText = this.dialogData.confirmationMessage;
    }

    ngOnInit() {
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close();
    }

    onAddCostsButtonClicked() {
        this.thisDialogRef.close(AddOrOverride.Add);
    }

    onOverrideButtonClicked() {
        this.thisDialogRef.close(AddOrOverride.Override);
    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close();
    }
}
