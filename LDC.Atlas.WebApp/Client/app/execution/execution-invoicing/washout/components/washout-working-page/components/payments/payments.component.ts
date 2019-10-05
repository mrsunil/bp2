import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { invoiceDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { PaymentTerm } from '../../../../../../../shared/entities/payment-term.entity';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
const moment = _moment;

@Component({
    selector: 'atlas-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.scss'],
})

export class WashoutPaymentsComponent extends BaseFormComponent implements OnInit {

    washoutPaymentTermsCtrl = new AtlasFormControl('washoutPaymentTerms');
    washoutDueDateCtrl = new AtlasFormControl('washoutDueDate');
    invoiceDateChanged: Date;
    masterdata: MasterData = new MasterData();
    paymentTermsOption: PaymentTerm[];

    constructor(protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.paymentTermsOption = this.masterdata.paymentTerms;
        this.onChanges();
        this.onInvoiceDueDateSelected();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            washoutPaymentTermsCtrl: this.washoutPaymentTermsCtrl,
            washoutDueDatePickerCtrl: this.washoutDueDateCtrl,
        });
        return super.getFormGroup();
    }

    onInvoiceDueDateSelected() {
        this.washoutDueDateCtrl.clearValidators();
        this.washoutDueDateCtrl.setValidators(
            Validators.compose([invoiceDateValidation(this.washoutDueDateCtrl.value,
                moment(this.invoiceDateChanged)), Validators.required]));
        this.washoutDueDateCtrl.updateValueAndValidity();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const payments = entity;
        payments.paymentTerms = this.washoutPaymentTermsCtrl.value;
        payments.dueDate = this.washoutDueDateCtrl.value;
        return payments;
    }

    getPaymentTermsCreditDays(paymentTerm: string): number {
        if (this.masterdata.paymentTerms) {
            const selectedPaymentTerms: PaymentTerm = this.masterdata.paymentTerms.find(
                (payTerms) => payTerms.paymentTermCode === paymentTerm,
            );
            if (selectedPaymentTerms) {
                return selectedPaymentTerms.creditDays;
            }
        }
    }

    onChanges(): void {
        this.washoutPaymentTermsCtrl.valueChanges.subscribe((input) => {
            this.washoutDueDateCtrl.patchValue(this.companyManager.getCurrentCompanyDate()
                .add('days', this.getPaymentTermsCreditDays(input)));
        });
    }

    setPaymentTerms(paymentTerm: string) {
        this.washoutPaymentTermsCtrl.patchValue(paymentTerm);
    }

    setPaymentFieldsForSummary(model) {
        this.washoutPaymentTermsCtrl.patchValue(model.paymentTerms);
        this.washoutDueDateCtrl.patchValue(model.dueDate);
    }

    setValuesForSummaryFromGrid(summaryRecord: InvoiceSummaryRecord) {
        this.washoutPaymentTermsCtrl.patchValue(summaryRecord.paymentTermsCode);
        this.washoutDueDateCtrl.patchValue(summaryRecord.dueDate);
    }
}
