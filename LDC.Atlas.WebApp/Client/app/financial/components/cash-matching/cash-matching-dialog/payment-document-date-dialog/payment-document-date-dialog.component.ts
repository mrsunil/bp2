import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { isAfterDate } from '../../../../../shared/validators/date-validators.validator';
import { DocumentDateDialogComponent } from '../document-date-dialog/document-date-dialog.component';

@Component({
    selector: 'atlas-payment-document-date-dialog',
    templateUrl: './payment-document-date-dialog.component.html',
    styleUrls: ['./payment-document-date-dialog.component.scss'],
})
export class PaymentDocumentDateDialogComponent extends BaseFormComponent implements OnInit {
    paymentDocDateCtrl = new AtlasFormControl('PaymentDocumentDate');

    dialogData: {
        title: string,
        txtDocMatched: string,
        txtMatchFlag: string,
        txtPayDocDate: string,
        okButton: string,
        cancelButton: string;
        value1: string;
        value2: Date;
        value3: string;
    };
    matchFlagCode: string;
    paymentDocumentDate: Date;
    newPaymentDocumentDate: Date;
    lastMonthClosedForOperation: Date;

    constructor(protected formBuilder: FormBuilder,
        public thisDialogRef: MatDialogRef<PaymentDocumentDateDialogComponent>,
        protected dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data:
            {
                title: string, txtDocMatched: string, txtMatchFlag: string, txtPayDocDate: string, okButton: string,
                cancelButton: string; value1: string; value2: Date; value3: string
            },
        protected formConfigurationProvider: FormConfigurationProviderService,
        private companyManager: CompanyManagerService,
        private preAccountingService: PreaccountingService) {
        super(formConfigurationProvider);
        this.dialogData = data;
        this.matchFlagCode = this.dialogData.value1;
        this.paymentDocumentDate = this.dialogData.value2;
    }

    ngOnInit() {
        this.matchFlagCode = this.dialogData.value1;
        this.paymentDocumentDate = this.dialogData.value2;
        this.setValidators();
        this.bindConfiguration();
        this.paymentDocDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.preAccountingService.getAccountingSetupDetails().subscribe(
            (data) => {
                if (data) {
                    this.lastMonthClosedForOperation = data.lastMonthClosedForOperation;
                }
            });
    }
    onProceedButtonClicked() {
        this.newPaymentDocumentDate = new Date(new Date(this.paymentDocDateCtrl.value).toDateString());
        if (new Date(new Date(this.lastMonthClosedForOperation).toDateString()) >
            new Date(new Date(this.paymentDocDateCtrl.value).toDateString())) {
            const paymentDocumentDateDialog = this.dialog.open(DocumentDateDialogComponent, {
                data: {
                    title: 'Payment Document Date Dialog',
                    text: 'Please note that any revaluation journal will be posted on the next open accounting month',
                    okButton: 'Confirm',
                    cancelButton: 'Cancel',
                    value: this.newPaymentDocumentDate,
                },
            });
            this.subscriptions.push(paymentDocumentDateDialog.afterClosed().subscribe((answer) => {
                if (answer && answer['buttonClicked']) {
                    this.thisDialogRef.close({ buttonClicked: true, buttonValue: answer['buttonValue'] });

                }
            }));
        } else {
            this.thisDialogRef.close({ buttonClicked: true, buttonValue: this.paymentDocDateCtrl.value });
        }
    }
    onCancelButtonClicked() {
        this.thisDialogRef.close({ buttonClicked: false });
    }
    setValidators() {
        this.paymentDocDateCtrl.setValidators(
            Validators.compose([Validators.required, isAfterDate(this.companyManager.getCurrentCompanyDate())]),
        );
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            paymentDocDateCtrl: this.paymentDocDateCtrl,
        });
        return super.getFormGroup();
    }

}
