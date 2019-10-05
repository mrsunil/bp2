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
    selector: 'atlas-cost-payments',
    templateUrl: './cost-payments.component.html',
    styleUrls: ['./cost-payments.component.scss'],
})
export class CostPaymentsComponent extends BaseFormComponent implements OnInit {
    costPaymentTermsCtrl = new AtlasFormControl('costPaymentTerms');
    costDueDateCtrl = new AtlasFormControl('costDueDate');
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
            costPaymentTermsCtrl: this.costPaymentTermsCtrl,
            costDueDatePickerCtrl: this.costDueDateCtrl,
        });
        return super.getFormGroup();
    }
    onInvoiceDueDateSelected() {
        this.costDueDateCtrl.clearValidators();
        this.costDueDateCtrl.setValidators(
            Validators.compose([invoiceDateValidation(this.costDueDateCtrl.value, moment(this.invoiceDateChanged)), Validators.required]));
        this.costDueDateCtrl.updateValueAndValidity();
    }
    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const payments = entity;
        payments.paymentTerms = this.costPaymentTermsCtrl.value;
        payments.dueDate = this.costDueDateCtrl.value;
        return payments;
    }

    getPaymentTermsCreditDays(paymentTerm: string): number {
        if (this.masterdata.paymentTerms) {
            const selectedPaymentTerms: PaymentTerm = this.masterdata.paymentTerms.find(
                (payTerms) => payTerms.paymentTermCode === paymentTerm,
            );
            return selectedPaymentTerms.creditDays;
        }
    }
    onChanges(): void {
        this.costPaymentTermsCtrl.valueChanges.subscribe((input) => {
            this.costDueDateCtrl.patchValue(this.companyManager.getCurrentCompanyDate().add('days', this.getPaymentTermsCreditDays(input)));
        });

    }
    setPaymentTerms(paymentTerm: string) {
        this.costPaymentTermsCtrl.patchValue(paymentTerm);
    }
    setPaymentFieldsForSummary(model) {
        this.costPaymentTermsCtrl.patchValue(model.paymentTerms);
        this.costDueDateCtrl.patchValue(model.dueDate);
    }

    setValuesForSummaryFromGrid(summaryRecord: InvoiceSummaryRecord) {
        this.costPaymentTermsCtrl.patchValue(summaryRecord.paymentTermsCode);
        this.costDueDateCtrl.patchValue(summaryRecord.dueDate);
    }

    setinvoiceDateSelected(invoiceDate: Date) {
        this.invoiceDateChanged = invoiceDate;
    }
}
