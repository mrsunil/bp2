import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ManualImportWarningErrorMsg } from '../../../../shared/entities/manualImport-warning-error-msg.entity';
import { ManualImportReport } from '../../../../shared/entities/manualImportReport.entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
@Component({
    selector: 'atlas-warning-error-msg-dialog',
    templateUrl: './warning-error-msg-dialog.component.html',
    styleUrls: ['./warning-error-msg-dialog.component.scss'],
})
export class WarningErrorMsgDialogComponent extends BaseFormComponent implements OnInit {

    isLoading = true;
    objectKeys = Object.keys;
    dialogData: ManualImportReport;
    goodDataCount: number;
    constructor(public thisDialogRef: MatDialogRef<WarningErrorMsgDialogComponent>,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: ManualImportReport,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
        this.dialogData = data;
    }

    ngOnInit() {
        this.isLoading = false;
        this.goodDataCount = Object.keys(this.dialogData.goodData.lineNumberWithCurrency).length;
        this.getDataFromObjects();
    }

    getDataFromObjects() {

    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close({ toBeImported: false });
    }

    onConfirmButtonClicked() {
        this.thisDialogRef.close({ toBeImported: true });
    }

}
