import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-delete-matching-dialog',
    templateUrl: './delete-matching-dialog.component.html',
    styleUrls: ['./delete-matching-dialog.component.scss'],
})
export class DeleteMatchingDialogComponent extends BaseFormComponent implements OnInit {
    dialogData: {
        title: string,
        text: string,
        okButton: string,
        cancelButton: string;
        value: string;
    };
    matchFlagCode: string;

    constructor(protected formBuilder: FormBuilder,
        public thisDialogRef: MatDialogRef<DeleteMatchingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string, okButton: string, cancelButton: string; value: string; },
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
        this.dialogData = data;
        this.matchFlagCode = this.dialogData.value;
    }

    ngOnInit() {
        this.matchFlagCode = this.dialogData.value;
    }
    onProceedButtonClicked() {
        this.thisDialogRef.close({ buttonClicked: true, buttonValue: this.matchFlagCode });
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close({ buttonClicked: false });
    }
}
