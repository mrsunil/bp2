import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { isAfterDate, isDateBeforeControlDate } from '../../../../../shared/validators/date-validators.validator';
import { DocumentDateDialogComponent } from '../document-date-dialog/document-date-dialog.component';
@Component({
    selector: 'atlas-cash-matching-dialog',
    templateUrl: './cash-matching-dialog.component.html',
    styleUrls: ['./cash-matching-dialog.component.scss'],
})
export class CashMatchingDialogComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isDialogClosedValue = new EventEmitter<any>();
    paymentDocDateCtrl = new AtlasFormControl('PaymentDocumentDate');
    isDialogClosed: boolean;
    documentDateDialogClosed: boolean;
    lastMonthClosedForOperation: Date;
    documentDate: string;
    dialogData: {
        title: string,
        text: string,
        okButton: string,
        cancelButton: string;
        value: string;
    };
    paymentDocumentDate: Date;

    constructor(protected formBuilder: FormBuilder,
        public thisDialogRef: MatDialogRef<CashMatchingDialogComponent>,
        protected dialog: MatDialog,
        private preAccountingService: PreaccountingService,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string, okButton: string, cancelButton: string; value: string },
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected companyManager: CompanyManagerService) {
        super(formConfigurationProvider);
        this.dialogData = data;
        this.documentDate = this.dialogData.value;
    }

    ngOnInit() {
        this.setValidators();
        this.bindConfiguration();
        this.paymentDocDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.documentDate = this.dialogData.value;
        this.preAccountingService.getAccountingSetupDetails().subscribe(
            (data) => {
                if (data) {
                    this.lastMonthClosedForOperation = data.lastMonthClosedForOperation;
                }
            });
    }
    onProceedButtonClicked() {
        this.paymentDocumentDate = new Date(this.paymentDocDateCtrl.value);
        if (new Date(new Date(this.lastMonthClosedForOperation).toLocaleDateString()) >
            new Date(this.paymentDocDateCtrl.value)) {
            const paymentDocumentDateDialog = this.dialog.open(DocumentDateDialogComponent, {
                data: {
                    title: 'Payment Document Date Dialog',
                    text: 'Please note that any revaluation journal will be posted on the next open accounting month',
                    okButton: 'Confirm',
                    cancelButton: 'Cancel',
                    value: this.paymentDocumentDate,
                },
            });
            this.subscriptions.push(paymentDocumentDateDialog.afterClosed().subscribe((answer) => {
                this.documentDateDialogClosed = answer ? true : false;
                if (answer && answer['buttonClicked']) {
                    this.thisDialogRef.close({ buttonClicked: true, buttonValue: answer['buttonValue'] });
                    this.isDialogClosed = answer['buttonClicked'];
                }
            }));
        } else {
            this.thisDialogRef.close({ buttonClicked: true, buttonValue: this.paymentDocumentDate });
        }
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close(false);
    }
    setValidators() {
        this.paymentDocDateCtrl.setValidators(
            Validators.compose([Validators.required, isAfterDate(this.companyManager.getCurrentCompanyDate())
                , isDateBeforeControlDate(moment(this.documentDate))]),
        );
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            paymentDocDateCtrl: this.paymentDocDateCtrl,
        });
        return super.getFormGroup();
    }
}
