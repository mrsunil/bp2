import { Component, OnInit, Inject } from '@angular/core';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { AccountingImportReport } from '../../../../../shared/entities/accountingImportReport.entity';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-accounting-warning-error-msg-dialog',
    templateUrl: './accounting-warning-error-msg-dialog.component.html',
    styleUrls: ['./accounting-warning-error-msg-dialog.component.scss']
})
export class AccountingWarningErrorMsgDialogComponent extends BaseFormComponent implements OnInit {

    isLoading = true;
    objectKeys = Object.keys;
    dialogData: AccountingImportReport;
    warningDataCount: number;
    goodDataCount: number;
    constructor(public thisDialogRef: MatDialogRef<AccountingWarningErrorMsgDialogComponent>,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        private router: Router,
        private companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: AccountingImportReport,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
        this.dialogData = data;
    }

    ngOnInit() {
        this.isLoading = false;
        this.goodDataCount = Object.keys(this.dialogData.goodData.lineNumber).length;
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
