import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { InvoiceRecord } from '../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { CompanyBankAccounts } from '../../../../shared/entities/company-bankaccounts.entity';

@Component({
    selector: 'atlas-bank-account-dialog',
    templateUrl: './bank-account-dialog.component.html',
    styleUrls: ['./bank-account-dialog.component.scss'],
})

export class BankAccountDialogComponent extends BaseFormComponent implements OnInit {
    bankAccountCtrl = new AtlasFormControl('bankAccountCtrl');
    masterData: MasterData = new MasterData();
    invoiceRecord: InvoiceRecord;
    filteredCompanyBankAccounts: CompanyBankAccounts[];
    bankDetail: InvoiceRecord;
    formGroup: FormGroup;
    dialogData: {
        title: string,
        okButton: string,
        cancelButton: string;
        value: CompanyBankAccounts[];
    };
    bankAccountForm: FormGroup;
    constructor(protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        public thisDialogRef: MatDialogRef<BankAccountDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, okButton: string, cancelButton: string, value: CompanyBankAccounts[] },
        protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
        this.dialogData = data;
    }

    ngOnInit() {
        this.filteredCompanyBankAccounts = this.dialogData.value;
        if (this.filteredCompanyBankAccounts.length > 0) {
            if (this.filteredCompanyBankAccounts.length === 1) {
                this.bankAccountCtrl.patchValue(this.filteredCompanyBankAccounts[0].bankAccountId);
            } else if (this.filteredCompanyBankAccounts.length > 1) {
                this.bankAccountCtrl.patchValue(this.filteredCompanyBankAccounts.filter((company) => company.bankAccountDefault === 1)[0].bankAccountId);               
            }
            this.bankAccountCtrl.setValidators([Validators.required]);
        }
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.formGroup.dirty) {
            $event.returnValue = true;
        }
    }

    onConfirmButtonClicked() {
        if (this.bankAccountCtrl.valid) {
            const nominalAccount = this.bankAccountCtrl.value;
            this.thisDialogRef.close({ isClose: true, selectedValue: nominalAccount });
        } else {
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors..');
        }
    }

    onCancelButtonClicked() {
        this.thisDialogRef.close(false);
    }
}
