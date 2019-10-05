import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-document-date-dialog',
    templateUrl: './document-date-dialog.component.html',
    styleUrls: ['./document-date-dialog.component.scss'],
})
export class DocumentDateDialogComponent extends BaseFormComponent implements OnInit {
    dialogData: {
        title: string,
        text: string,
        okButton: string,
        cancelButton: string;
        value: Date;
    };
    paymentDocumentDate: Date;

    constructor(protected formBuilder: FormBuilder,
        public thisDialogRef: MatDialogRef<DocumentDateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string, okButton: string, cancelButton: string; value: Date; },
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
        this.dialogData = data;
        this.paymentDocumentDate = this.dialogData.value;
    }

    ngOnInit() {
        this.paymentDocumentDate = this.dialogData.value;
    }
    onProceedButtonClicked() {
        this.thisDialogRef.close({ buttonClicked: true, buttonValue: this.paymentDocumentDate });
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close(false);
    }

}
